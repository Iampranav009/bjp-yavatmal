import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// GET: List all admin users (Super Admin only)
export async function GET() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin || admin.role !== 'super_admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, name, email, role, created_at FROM admin_users ORDER BY created_at DESC'
        );

        return NextResponse.json({ data: rows });
    } catch (error) {
        console.error('Get admin users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST: Create a new admin user (Super Admin only)
export async function POST(request: Request) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin || admin.role !== 'super_admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { name, email, password, role } = await request.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Validate role
        if (!['admin', 'super_admin'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        // Check email uniqueness
        const [existing] = await pool.execute<RowDataPacket[]>(
            'SELECT id FROM admin_users WHERE email = ?',
            [email]
        );
        if ((existing as RowDataPacket[]).length > 0) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
        }

        const passwordHash = await hashPassword(password);

        const [result] = await pool.execute(
            'INSERT INTO admin_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, passwordHash, role]
        ) as [{ insertId: number }, unknown];

        return NextResponse.json({
            data: { id: result.insertId, name, email, role },
            message: 'Admin user created successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Create admin user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
