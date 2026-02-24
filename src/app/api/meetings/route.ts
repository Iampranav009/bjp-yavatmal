import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { isValidPosition } from '@/lib/positions';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all meetings with their target positions
        const [meetings] = await pool.execute<RowDataPacket[]>(
            `SELECT m.*, au.name as created_by_name,
                (SELECT COUNT(*) FROM meeting_participants mp WHERE mp.meeting_id = m.id) as participant_count
             FROM meetings m
             LEFT JOIN admin_users au ON m.created_by = au.id
             ORDER BY m.meeting_date DESC, m.meeting_time DESC`
        );

        // Get target positions for each meeting
        const meetingsWithPositions = await Promise.all(
            meetings.map(async (meeting) => {
                const [positions] = await pool.execute<RowDataPacket[]>(
                    'SELECT position FROM meeting_target_positions WHERE meeting_id = ?',
                    [meeting.id]
                );
                return {
                    ...meeting,
                    target_positions: positions.map((p) => p.position),
                };
            })
        );

        return NextResponse.json({ data: meetingsWithPositions });
    } catch (error) {
        console.error('Meetings GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, target_positions, meeting_date, meeting_time, google_meet_link } = body;

        // Validation
        if (!title || !meeting_date || !meeting_time) {
            return NextResponse.json(
                { error: 'Title, date, and time are required' },
                { status: 400 }
            );
        }

        if (!target_positions || !Array.isArray(target_positions) || target_positions.length === 0) {
            return NextResponse.json(
                { error: 'At least one target position is required' },
                { status: 400 }
            );
        }

        // Validate all positions
        for (const pos of target_positions) {
            if (!isValidPosition(pos)) {
                return NextResponse.json(
                    { error: `Invalid position "${pos}"` },
                    { status: 400 }
                );
            }
        }

        // 1. Insert meeting
        const [meetingResult] = await pool.execute<ResultSetHeader>(
            `INSERT INTO meetings (title, description, meeting_date, meeting_time, google_meet_link, created_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, description || null, meeting_date, meeting_time, google_meet_link || null, admin.userId]
        );
        const meetingId = meetingResult.insertId;

        // 2. Insert target positions
        for (const pos of target_positions) {
            await pool.execute(
                'INSERT INTO meeting_target_positions (meeting_id, position) VALUES (?, ?)',
                [meetingId, pos]
            );
        }

        // 3. Fetch all members matching the target positions
        const placeholders = target_positions.map(() => '?').join(',');
        const [matchingMembers] = await pool.execute<RowDataPacket[]>(
            `SELECT id, name, position, mobile FROM members WHERE position IN (${placeholders})`,
            target_positions
        );

        // 4. Insert meeting participants
        for (const member of matchingMembers) {
            try {
                await pool.execute(
                    'INSERT INTO meeting_participants (meeting_id, member_id) VALUES (?, ?)',
                    [meetingId, member.id]
                );
            } catch {
                // Skip duplicates
            }
        }

        // 5. Create notifications for each participant
        let meetLinkText = '';
        if (google_meet_link) {
            meetLinkText = `\nGoogle Meet: ${google_meet_link}`;
        }
        const notificationMessage = `Meeting: ${title}\nDate: ${meeting_date}\nTime: ${meeting_time}${meetLinkText}`;

        for (const member of matchingMembers) {
            await pool.execute(
                `INSERT INTO notifications (member_id, meeting_id, title, message)
                 VALUES (?, ?, ?, ?)`,
                [member.id, meetingId, `Meeting: ${title}`, notificationMessage]
            );
        }

        return NextResponse.json({
            data: {
                meeting_id: meetingId,
                participant_count: matchingMembers.length,
                participants: matchingMembers,
            },
            message: `Meeting created with ${matchingMembers.length} participants.`,
        }, { status: 201 });
    } catch (error) {
        console.error('Meetings POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
