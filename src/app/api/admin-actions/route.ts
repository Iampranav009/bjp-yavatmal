import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin || admin.role !== 'super_admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const adminId = searchParams.get('admin_id');
        const status = searchParams.get('status'); // 'pending', 'approved', 'rejected'

        let query = `
            SELECT a.*, u.name as admin_name, u.email as admin_email
            FROM admin_actions a
            JOIN admin_users u ON a.admin_id = u.id
        `;
        const params: any[] = [];
        const conditions: string[] = [];

        if (adminId) {
            conditions.push('a.admin_id = ?');
            params.push(adminId);
        }
        if (status) {
            conditions.push('a.status = ?');
            params.push(status);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY a.created_at DESC';

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);
        return NextResponse.json({ data: rows });
    } catch (error) {
        console.error('Get admin actions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
