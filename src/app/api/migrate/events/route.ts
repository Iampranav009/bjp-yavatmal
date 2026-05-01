import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

/**
 * POST /api/migrate/events
 * Creates the `events` table if it doesn't exist.
 * Restricted to admin users.
 */
export async function POST() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                event_date DATE NOT NULL,
                event_time TIME NOT NULL,
                place VARCHAR(255) NOT NULL,
                host VARCHAR(255),
                participant_count INT,
                mandal VARCHAR(100),
                description TEXT,
                image_url TEXT,
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_event_date (event_date),
                INDEX idx_mandal (mandal)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        // Upgrade column if it exists as VARCHAR(500)
        try {
            await pool.execute('ALTER TABLE events MODIFY image_url TEXT');
        } catch (e) {
            console.log('Alter table ignored if it fails or already changed');
        }

        return NextResponse.json({ message: 'Events table created/verified successfully' });
    } catch (error) {
        console.error('Events migration error:', error);
        return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
    }
}
