import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Public gallery endpoint — no auth required
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const target = searchParams.get('target'); // 'media' or 'video'
        const featured = searchParams.get('featured'); // 'true'

        let query = 'SELECT * FROM gallery_images WHERE 1=1';
        const params: string[] = [];

        if (target) {
            query += ' AND display_target = ?';
            params.push(target);
        }

        if (featured === 'true') {
            query += ' AND is_featured = TRUE';
        }

        query += ' ORDER BY uploaded_at DESC';

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);

        return NextResponse.json({ data: rows }, {
            headers: {
                'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
            },
        });
    } catch (error) {
        console.error('Public gallery GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
