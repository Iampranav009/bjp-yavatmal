import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Get meeting details
        const [meetings] = await pool.execute<RowDataPacket[]>(
            `SELECT m.*, au.name as created_by_name
             FROM meetings m
             LEFT JOIN admin_users au ON m.created_by = au.id
             WHERE m.id = ?`,
            [id]
        );

        if (!meetings.length) {
            return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
        }

        // Get target positions
        const [positions] = await pool.execute<RowDataPacket[]>(
            'SELECT position FROM meeting_target_positions WHERE meeting_id = ?',
            [id]
        );

        // Get participants with member details
        const [participants] = await pool.execute<RowDataPacket[]>(
            `SELECT m.id, m.name, m.position, m.mobile, m.address
             FROM meeting_participants mp
             JOIN members m ON mp.member_id = m.id
             WHERE mp.meeting_id = ?
             ORDER BY m.name ASC`,
            [id]
        );

        return NextResponse.json({
            data: {
                ...meetings[0],
                target_positions: positions.map((p) => p.position),
                participants,
            },
        });
    } catch (error) {
        console.error('Meeting GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM meetings WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        console.error('Meeting DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
