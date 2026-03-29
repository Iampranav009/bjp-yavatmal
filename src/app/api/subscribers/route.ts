import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM subscribers ORDER BY created_at DESC'
        );

        return NextResponse.json({ data: rows });
    } catch (error) {
        console.error('Subscribers GET error:', error);
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
            return NextResponse.json({ error: 'Subscriber ID required' }, { status: 400 });
        }

        await pool.execute('DELETE FROM subscribers WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Subscriber deleted successfully' });
    } catch (error) {
        console.error('Subscribers DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
