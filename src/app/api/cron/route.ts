import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const secret = request.headers.get('x-cron-secret');
        if (secret !== process.env.CRON_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await pool.execute(
            'DELETE FROM birthday_notifications WHERE birthday_date < DATE_SUB(CURDATE(), INTERVAL 6 DAY)'
        );

        return NextResponse.json({
            success: true,
            message: 'Cleanup completed',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Cron cleanup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
