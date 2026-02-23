import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(request: Request) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const sort = searchParams.get('sort') || 'name';

        let query = 'SELECT * FROM members';
        const params: string[] = [];

        if (search) {
            query += ' WHERE name LIKE ? OR position LIKE ? OR mobile LIKE ?';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        const allowedSorts: Record<string, string> = {
            name: 'name ASC',
            position: 'position ASC',
            birth_date: 'birth_date ASC',
            created_at: 'created_at DESC',
        };
        query += ` ORDER BY ${allowedSorts[sort] || 'name ASC'}`;

        const [rows] = await pool.execute<RowDataPacket[]>(query, params);
        return NextResponse.json({ data: rows });
    } catch (error) {
        console.error('Members GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, position, mobile, birth_date, birth_year, address, photo_url, notes } = body;

        if (!name || !birth_date) {
            return NextResponse.json(
                { error: 'Name and birth date are required' },
                { status: 400 }
            );
        }

        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO members (name, position, mobile, birth_date, birth_year, address, photo_url, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, position || null, mobile || null, birth_date, birth_year || null, address || null, photo_url || null, notes || null]
        );

        return NextResponse.json({
            data: { id: result.insertId },
            message: 'Member created successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Members POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
