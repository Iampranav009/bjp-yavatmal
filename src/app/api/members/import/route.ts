import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { parseExcelBuffer } from '@/lib/excel';
import { ResultSetHeader } from 'mysql2';

export async function POST(request: Request) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const members = parseExcelBuffer(buffer);

        if (!members.length) {
            return NextResponse.json(
                { error: 'No valid member data found in file' },
                { status: 400 }
            );
        }

        let added = 0;
        let skipped = 0;

        for (const member of members) {
            try {
                await pool.execute<ResultSetHeader>(
                    `INSERT INTO members (name, position, mobile, birth_date, birth_year, address)
           VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        member.name,
                        member.position || null,
                        member.mobile || null,
                        member.birth_date,
                        member.birth_year || null,
                        member.address || null,
                    ]
                );
                added++;
            } catch {
                skipped++;
            }
        }

        return NextResponse.json({
            data: { added, skipped, total: members.length },
            message: `${added} members added, ${skipped} skipped`,
        });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
