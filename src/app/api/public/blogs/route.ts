import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Public blog endpoint — no auth required
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const slug = searchParams.get('slug');
        
        // Single Post Fetch by ID or Slug
        if (id || slug) {
            let query = 'SELECT * FROM blog_posts WHERE is_published = 1 AND is_hidden = 0';
            const params: any[] = [];
            
            if (slug) {
                query += ' AND slug = ?';
                params.push(slug);
            } else {
                query += ' AND id = ?';
                params.push(id);
            }

            const [rows] = await pool.execute<RowDataPacket[]>(query, params);

            if (!rows.length) {
                return NextResponse.json({ error: 'Article not found' }, { status: 404 });
            }

            return NextResponse.json({ data: rows[0] }, {
                headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
            });
        }

        // List Fetch with Filters
        const category = searchParams.get('category');
        const type = searchParams.get('type');
        const search = searchParams.get('search');
        const limitStr = searchParams.get('limit');
        const offsetStr = searchParams.get('offset');

        let query = `
            SELECT id, slug, post_type, category, author_name_mr, author_name_hi, author_name_en, 
            image_url, image_position, image_overlay_text, 
            title_mr, title_hi, title_en, 
            description_mr, description_hi, description_en, 
            social_facebook, social_twitter, social_instagram, social_whatsapp, show_social_buttons, 
            created_at 
            FROM blog_posts 
            WHERE is_published = 1 AND is_hidden = 0
        `;
        const params: any[] = [];

        if (category && category !== 'All Categories') {
            query += ' AND category = ?';
            params.push(category);
        }

        if (type && type !== 'All Types') {
            const dbType = type === 'Article' ? 'article' : (type === 'Interview' ? 'interview' : type);
            if (['article', 'interview'].includes(dbType.toLowerCase())) {
                query += ' AND post_type = ?';
                params.push(dbType.toLowerCase());
            }
        }

        if (search) {
            query += ' AND (title_mr LIKE ? OR title_hi LIKE ? OR title_en LIKE ? OR description_mr LIKE ?)';
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }

        query += ' ORDER BY created_at DESC';

        // Pagination
        const limit = limitStr ? parseInt(limitStr, 10) : 20;
        const offset = offsetStr ? parseInt(offsetStr, 10) : 0;
        query += ' LIMIT ? OFFSET ?';
        // pool.execute with LIMIT/OFFSET params can be tricky with types in mysql2, but adding passing as string or forcing cast is okay. Actually, execute() handles numbers correctly.
        params.push(limit.toString(), offset.toString());

        const [rows] = await pool.query<RowDataPacket[]>(query, params.map(p => Number.isNaN(Number(p)) ? p : Number(p)));

        return NextResponse.json({ data: rows }, {
            headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
        });
    } catch (error) {
        console.error('Public blogs GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
