import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM events ORDER BY event_date DESC, event_time DESC'
        );
        return NextResponse.json({ data: rows });
    } catch (error) {
        console.error('Events GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const {
            title, event_date, event_time, place,
            host, participant_count, mandal, description, image_url
        } = body;

        if (!title || !event_date || !event_time || !place) {
            return NextResponse.json(
                { error: 'Title, date, time, and place are required' },
                { status: 400 }
            );
        }

        if (admin.role !== 'super_admin') {
            const { logAdminAction } = await import('@/lib/admin-actions');
            await logAdminAction(admin.userId, 'CREATE', 'event', null, body);
            return NextResponse.json({ message: 'Action submitted for Super Admin approval' }, { status: 202 });
        }

        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO events 
             (title, event_date, event_time, place, host, participant_count, mandal, description, image_url, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title, event_date, event_time, place,
                host || null, participant_count || null, mandal || null,
                description || null, image_url || null, admin.userId
            ]
        );

        return NextResponse.json({ data: { id: result.insertId }, message: 'Event created' }, { status: 201 });
    } catch (error) {
        console.error('Events POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { id, ...fields } = body;
        if (!id) return NextResponse.json({ error: 'Event ID required' }, { status: 400 });

        const allowed = ['title', 'event_date', 'event_time', 'place', 'host', 'participant_count', 'mandal', 'description', 'image_url'];
        const setClauses: string[] = [];
        const values: (string | number | null)[] = [];

        for (const key of allowed) {
            if (fields[key] !== undefined) {
                setClauses.push(`${key} = ?`);
                values.push(fields[key] ?? null);
            }
        }

        if (setClauses.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        values.push(id);
        await pool.execute<ResultSetHeader>(
            `UPDATE events SET ${setClauses.join(', ')} WHERE id = ?`,
            values
        );

        return NextResponse.json({ message: 'Event updated' });
    } catch (error) {
        console.error('Events PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Event ID required' }, { status: 400 });

        await pool.execute('DELETE FROM events WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Event deleted' });
    } catch (error) {
        console.error('Events DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
