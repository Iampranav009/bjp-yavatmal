import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM article_sidebar WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC'
        );

        return NextResponse.json({ data: rows }, {
            headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' }
        });
    } catch (error) {
        console.error('Public Sidebar GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
