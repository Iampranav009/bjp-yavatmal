import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, name, email, role, created_at FROM admin_users WHERE id = ?',
            [admin.userId]
        );

        if (!rows.length) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ data: rows[0] });
    } catch (error) {
        console.error('Auth me error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
