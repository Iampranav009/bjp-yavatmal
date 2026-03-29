import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET — list all blog posts (admin)
export async function GET() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM blog_posts ORDER BY created_at DESC'
        );

        return NextResponse.json({ data: rows });
    } catch (error) {
        console.error('Blogs GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST — create a new blog post
export async function POST(request: NextRequest) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            image_url, image_position, image_overlay_text,
            title_mr, title_hi, title_en,
            description_mr, description_hi, description_en,
            content_mr, content_hi, content_en,
            social_facebook, social_twitter, social_instagram, social_whatsapp,
            show_social_buttons, is_published,
            slug, post_type, category, author_name_mr, author_name_hi, author_name_en
        } = body;

        if (!title_mr) {
            return NextResponse.json({ error: 'Title (Marathi) is required' }, { status: 400 });
        }

        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO blog_posts (
                image_url, image_position, image_overlay_text,
                title_mr, title_hi, title_en,
                description_mr, description_hi, description_en,
                content_mr, content_hi, content_en,
                social_facebook, social_twitter, social_instagram, social_whatsapp,
                show_social_buttons, is_published, created_by,
                slug, post_type, category, author_name_mr, author_name_hi, author_name_en
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                image_url || null, image_position || 'center', image_overlay_text || null,
                title_mr, title_hi || null, title_en || null,
                description_mr || null, description_hi || null, description_en || null,
                content_mr || null, content_hi || null, content_en || null,
                social_facebook || null, social_twitter || null, social_instagram || null, social_whatsapp || null,
                show_social_buttons ? 1 : 0, is_published !== false ? 1 : 0, admin.userId,
                slug || null, post_type || 'article', category || null, author_name_mr || null, author_name_hi || null, author_name_en || null
            ]
        );

        return NextResponse.json({
            data: { id: result.insertId },
            message: 'Blog post created successfully',
        }, { status: 201 });
    } catch (error: any) {
        console.error('Blogs POST error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'Slug must be unique.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT — update a blog post
export async function PUT(request: NextRequest) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Blog post ID required' }, { status: 400 });
        }

        const allowedFields = [
            'image_url', 'image_position', 'image_overlay_text',
            'title_mr', 'title_hi', 'title_en',
            'description_mr', 'description_hi', 'description_en',
            'content_mr', 'content_hi', 'content_en',
            'social_facebook', 'social_twitter', 'social_instagram', 'social_whatsapp',
            'show_social_buttons', 'is_published', 'is_hidden',
            'slug', 'post_type', 'category', 'author_name_mr', 'author_name_hi', 'author_name_en'
        ];

        const fields: string[] = [];
        const values: (string | number | null)[] = [];

        for (const key of allowedFields) {
            if (updates[key] !== undefined) {
                fields.push(`${key} = ?`);
                if (key === 'show_social_buttons' || key === 'is_published' || key === 'is_hidden') {
                    values.push(updates[key] ? 1 : 0);
                } else {
                    values.push(updates[key]);
                }
            }
        }

        if (fields.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        values.push(id);

        await pool.execute<ResultSetHeader>(
            `UPDATE blog_posts SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return NextResponse.json({ message: 'Blog post updated successfully' });
    } catch (error: any) {
        console.error('Blogs PUT error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'Slug must be unique.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE — delete a blog post
export async function DELETE(request: Request) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Blog post ID required' }, { status: 400 });
        }

        await pool.execute('DELETE FROM blog_posts WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Blogs DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
