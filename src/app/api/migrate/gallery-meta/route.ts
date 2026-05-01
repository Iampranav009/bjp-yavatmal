import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

/**
 * POST /api/migrate/gallery-meta
 * Adds team, mandal, media_type columns to gallery_images if they don't exist.
 */
export async function POST() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const alterStatements = [
            `ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS team VARCHAR(100) DEFAULT NULL`,
            `ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS mandal VARCHAR(100) DEFAULT NULL`,
            `ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS media_type VARCHAR(50) DEFAULT NULL COMMENT 'press_notes, print_media, electronic_media'`,
        ];

        for (const sql of alterStatements) {
            try {
                await pool.execute(sql);
            } catch {
                // Column may already exist; ignore
            }
        }

        return NextResponse.json({ message: 'Gallery metadata columns added/verified' });
    } catch (error) {
        console.error('Gallery meta migration error:', error);
        return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
    }
}
