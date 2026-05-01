import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// DELETE: Remove an admin user (Super Admin only)
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin || admin.role !== 'super_admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        const userId = parseInt(id);

        // Prevent self-deletion
        if (userId === admin.userId) {
            return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
        }

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, role FROM admin_users WHERE id = ?',
            [userId]
        );

        if (!(rows as RowDataPacket[]).length) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const targetUser = rows[0];

        // Prevent deletion of any super admin
        if (targetUser.role === 'super_admin') {
            return NextResponse.json({ error: 'Super Admin is permanent and cannot be deleted' }, { status: 403 });
        }

        await pool.execute('DELETE FROM admin_users WHERE id = ?', [userId]);

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete admin user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH: Update an admin user (Super Admin only)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin || admin.role !== 'super_admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        const userId = parseInt(id);
        const { name, email, password, role } = await request.json();

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, role FROM admin_users WHERE id = ?',
            [userId]
        );

        if (!(rows as RowDataPacket[]).length) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const targetUser = rows[0];

        // Prevent changing a super admin's role
        if (targetUser.role === 'super_admin' && role && role !== 'super_admin') {
            return NextResponse.json({ error: 'Cannot downgrade a permanent Super Admin' }, { status: 403 });
        }

        if (role && !['admin', 'super_admin'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        // Build update query dynamically
        const updates: string[] = [];
        const values: (string | number)[] = [];

        if (name) { updates.push('name = ?'); values.push(name); }
        if (email) { updates.push('email = ?'); values.push(email); }
        if (role) { updates.push('role = ?'); values.push(role); }
        if (password) {
            const passwordHash = await hashPassword(password);
            updates.push('password_hash = ?');
            values.push(passwordHash);
        }

        if (!updates.length) {
            return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
        }

        values.push(userId);
        await pool.execute(
            `UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        return NextResponse.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Update admin user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
