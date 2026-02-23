import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';
import { getUpcomingBirthdays } from '@/lib/birthday';

export async function GET() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM members WHERE birth_date IS NOT NULL'
        );

        const members = rows.map((r) => ({
            id: r.id,
            name: r.name,
            position: r.position || '',
            mobile: r.mobile || '',
            birth_date: r.birth_date,
            birth_year: r.birth_year,
            photo_url: r.photo_url,
            address: r.address,
            notes: r.notes,
        }));

        const upcoming = getUpcomingBirthdays(members, 6);

        return NextResponse.json({ data: upcoming });
    } catch (error) {
        console.error('Birthdays GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
