import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM gallery_images ORDER BY uploaded_at DESC'
        );

        return NextResponse.json({ data: rows });
    } catch (error) {
        console.error('Gallery GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
        }

        await pool.execute('DELETE FROM gallery_images WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Gallery DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT — update gallery item metadata (featured toggle, post info)
export async function PUT(request: NextRequest) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, post_title, post_description, post_link, display_target, is_featured, title, category } = body;

        if (!id) {
            return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
        }

        const fields: string[] = [];
        const values: (string | number | boolean)[] = [];

        if (title !== undefined) { fields.push('title = ?'); values.push(title); }
        if (category !== undefined) { fields.push('category = ?'); values.push(category); }
        if (post_title !== undefined) { fields.push('post_title = ?'); values.push(post_title); }
        if (post_description !== undefined) { fields.push('post_description = ?'); values.push(post_description); }
        if (post_link !== undefined) { fields.push('post_link = ?'); values.push(post_link); }
        if (display_target !== undefined) { fields.push('display_target = ?'); values.push(display_target); }
        if (is_featured !== undefined) { fields.push('is_featured = ?'); values.push(is_featured ? 1 : 0); }

        if (fields.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        values.push(id);

        await pool.execute<ResultSetHeader>(
            `UPDATE gallery_images SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return NextResponse.json({ message: 'Gallery item updated successfully' });
    } catch (error) {
        console.error('Gallery PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
