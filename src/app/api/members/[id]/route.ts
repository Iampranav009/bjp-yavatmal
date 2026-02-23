import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM members WHERE id = ?',
            [id]
        );

        if (!rows.length) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        return NextResponse.json({ data: rows[0] });
    } catch (error) {
        console.error('Member GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { name, position, mobile, birth_date, birth_year, address, photo_url, notes } = body;

        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE members SET name = ?, position = ?, mobile = ?, birth_date = ?,
       birth_year = ?, address = ?, photo_url = ?, notes = ?
       WHERE id = ?`,
            [name, position || null, mobile || null, birth_date, birth_year || null, address || null, photo_url || null, notes || null, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Member updated successfully' });
    } catch (error) {
        console.error('Member PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM members WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error('Member DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
