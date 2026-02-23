import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { generateExcelBuffer } from '@/lib/excel';
import { RowDataPacket } from 'mysql2';
import { format } from 'date-fns';

export async function GET() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM members ORDER BY name ASC'
        );

        const buffer = generateExcelBuffer(
            rows.map((r) => ({
                id: r.id,
                name: r.name,
                position: r.position || '',
                mobile: r.mobile || '',
                birth_date: r.birth_date ? format(new Date(r.birth_date), 'yyyy-MM-dd') : '',
                birth_year: r.birth_year,
                address: r.address || '',
                created_at: r.created_at ? format(new Date(r.created_at), 'yyyy-MM-dd') : '',
            }))
        );

        const dateStr = format(new Date(), 'yyyy-MM-dd');
        return new NextResponse(new Uint8Array(buffer), {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="BJP_Yavatmal_Members_${dateStr}.xlsx"`,
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
