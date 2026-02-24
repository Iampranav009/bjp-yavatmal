import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(request: Request) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const memberId = searchParams.get('member_id');

        let query = `SELECT n.*, m.title as meeting_title
                      FROM notifications n
                      LEFT JOIN meetings m ON n.meeting_id = m.id`;
        const params: string[] = [];

        if (memberId) {
            query += ' WHERE n.member_id = ?';
            params.push(memberId);
        }

        query += ' ORDER BY n.created_at DESC LIMIT 100';

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);
        return NextResponse.json({ data: rows });
    } catch (error) {
        console.error('Notifications GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { notification_ids } = body;

        if (!notification_ids || !Array.isArray(notification_ids) || notification_ids.length === 0) {
            return NextResponse.json({ error: 'notification_ids required' }, { status: 400 });
        }

        const placeholders = notification_ids.map(() => '?').join(',');
        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE notifications SET is_read = TRUE WHERE id IN (${placeholders})`,
            notification_ids
        );

        return NextResponse.json({
            message: `${result.affectedRows} notifications marked as read`,
        });
    } catch (error) {
        console.error('Notifications PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
