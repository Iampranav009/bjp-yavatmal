import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Public events endpoint — no auth required
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const mandal = searchParams.get('mandal');
        const upcoming = searchParams.get('upcoming'); // 'true' = future events only

        let query = 'SELECT * FROM events WHERE 1=1';
        const params: (string | number)[] = [];

        if (mandal) {
            query += ' AND mandal = ?';
            params.push(mandal);
        }
        if (upcoming === 'true') {
            query += ' AND event_date >= CURDATE()';
        }

        query += ' ORDER BY event_date ASC, event_time ASC';

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);
        return NextResponse.json({ data: rows });
    } catch (error) {
        console.error('Public events GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
