import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Public gallery endpoint — no auth required
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const target = searchParams.get('target');         // 'media' or 'video'
        const featured = searchParams.get('featured');     // 'true'
        const homepage = searchParams.get('homepage');     // 'true' → homepage section images
        const team = searchParams.get('team');             // e.g. 'Yuva Morcha'
        const mandal = searchParams.get('mandal');         // e.g. 'Pandharkawda'
        const mediaType = searchParams.get('media_type'); // 'press_notes' | 'print_media' | 'electronic_media'

        let query = 'SELECT * FROM gallery_images WHERE 1=1';
        const params: (string | number)[] = [];

        if (homepage === 'true') {
            query += ' AND show_on_homepage = 1';
        } else {
            if (target) {
                query += ' AND display_target = ?';
                params.push(target);
            }
            if (featured === 'true') {
                query += ' AND is_featured = TRUE';
            }
            if (team) {
                query += ' AND team = ?';
                params.push(team);
            }
            if (mandal) {
                query += ' AND mandal = ?';
                params.push(mandal);
            }
            if (mediaType) {
                query += ' AND media_type = ?';
                params.push(mediaType);
            }
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
