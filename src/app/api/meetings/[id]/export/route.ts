import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';
import * as XLSX from 'xlsx';

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

        // Get meeting title
        const [meetings] = await pool.execute<RowDataPacket[]>(
            'SELECT title, meeting_date FROM meetings WHERE id = ?',
            [id]
        );

        if (!meetings.length) {
            return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
        }

        // Get participants
        const [participants] = await pool.execute<RowDataPacket[]>(
            `SELECT m.name, m.position, m.mobile, m.address
             FROM meeting_participants mp
             JOIN members m ON mp.member_id = m.id
             WHERE mp.meeting_id = ?
             ORDER BY m.name ASC`,
            [id]
        );

        const data = participants.map((p, i) => ({
            '#': i + 1,
            'Name': p.name,
            'Position (पद)': p.position,
            'Mobile': p.mobile || '',
            'Address': p.address || '',
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        worksheet['!cols'] = [
            { wch: 5 },  // #
            { wch: 25 }, // Name
            { wch: 25 }, // Position
            { wch: 15 }, // Mobile
            { wch: 35 }, // Address
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');
        const buffer = Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));

        const meetingTitle = meetings[0].title.replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, '').replace(/\s+/g, '_');
        return new NextResponse(new Uint8Array(buffer), {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="Meeting_${meetingTitle}_Participants.xlsx"`,
            },
        });
    } catch (error) {
        console.error('Meeting export error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
