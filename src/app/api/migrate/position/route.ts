import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { DEFAULT_POSITION } from '@/lib/positions';
import { ResultSetHeader } from 'mysql2';

export async function POST() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Migrate empty/null positions to default
        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE members SET position = ? WHERE position IS NULL OR position = ''`,
            [DEFAULT_POSITION]
        );

        // Add index on position column (ignore if already exists)
        try {
            await pool.execute(`ALTER TABLE members ADD INDEX idx_position (position)`);
        } catch {
            // Index may already exist — safe to ignore
        }

        return NextResponse.json({
            message: `Migration complete. ${result.affectedRows} members updated to default position "${DEFAULT_POSITION}".`,
            updated: result.affectedRows,
        });
    } catch (error) {
        console.error('Position migration error:', error);
        return NextResponse.json({ error: 'Migration failed', details: String(error) }, { status: 500 });
    }
}
