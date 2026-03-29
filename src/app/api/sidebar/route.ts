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
            'SELECT * FROM article_sidebar ORDER BY display_order ASC, created_at DESC'
        );

        return NextResponse.json({ data: rows });
    } catch (error) {
        console.error('Sidebar GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { item_type, title, image_url, video_url, content, target_link, display_order, is_active } = body;

        if (!item_type) {
            return NextResponse.json({ error: 'Item type is required' }, { status: 400 });
        }

        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO article_sidebar (
                item_type, title, image_url, video_url, content, target_link, display_order, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                item_type, 
                title || null, 
                image_url || null, 
                video_url || null, 
                content || null, 
                target_link || null,
                display_order || 0,
                is_active !== false ? 1 : 0
            ]
        );

        return NextResponse.json({ id: result.insertId, message: 'Sidebar item created' }, { status: 201 });
    } catch (error) {
        console.error('Sidebar POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const allowedFields = ['item_type', 'title', 'image_url', 'video_url', 'content', 'target_link', 'display_order', 'is_active'];
        const fields: string[] = [];
        const values: (string | number | null)[] = [];

        for (const key of allowedFields) {
            if (updates[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(key === 'is_active' ? (updates[key] ? 1 : 0) : updates[key]);
            }
        }

        if (fields.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        values.push(id);
        
        await pool.execute<ResultSetHeader>(
            `UPDATE article_sidebar SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return NextResponse.json({ message: 'Sidebar item updated' });
    } catch (error) {
        console.error('Sidebar PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        await pool.execute('DELETE FROM article_sidebar WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Item deleted' });
    } catch (error) {
        console.error('Sidebar DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
