import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin || admin.role !== 'super_admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM admin_notifications ORDER BY created_at DESC LIMIT 50'
        );

        return NextResponse.json({ data: rows });
    } catch (error) {
        console.error('Get admin notifications error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
