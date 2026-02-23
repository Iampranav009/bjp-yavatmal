import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function DELETE() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await pool.execute(
            'DELETE FROM birthday_notifications WHERE birthday_date < DATE_SUB(CURDATE(), INTERVAL 6 DAY)'
        );

        return NextResponse.json({
            message: 'Cleanup completed',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Birthday cleanup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
