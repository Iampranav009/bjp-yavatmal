import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET /api/migrate/homepage-gallery
// Adds homepage image preview columns to gallery_images table (idempotent)
export async function GET() {
    const alterations = [
        `ALTER TABLE gallery_images ADD COLUMN show_on_homepage TINYINT(1) NOT NULL DEFAULT 0`,
        `ALTER TABLE gallery_images ADD COLUMN homepage_text_title VARCHAR(255) NULL`,
        `ALTER TABLE gallery_images ADD COLUMN homepage_text_description TEXT NULL`,
        `ALTER TABLE gallery_images ADD COLUMN homepage_text_position ENUM('left','center','right') NOT NULL DEFAULT 'left'`,
        `ALTER TABLE gallery_images ADD COLUMN homepage_text_color VARCHAR(20) NOT NULL DEFAULT 'white'`,
        `ALTER TABLE gallery_images ADD COLUMN homepage_text_bold TINYINT(1) NOT NULL DEFAULT 0`,
    ];

    const results: string[] = [];

    for (const sql of alterations) {
        try {
            await pool.execute(sql);
            const col = sql.match(/ADD COLUMN (\w+)/)?.[1] ?? 'unknown';
            results.push(`✅ Added column: ${col}`);
        } catch (err: unknown) {
            const msg = (err as { message?: string })?.message ?? String(err);
            if (msg.includes('Duplicate column name') || msg.includes('already exists')) {
                const col = sql.match(/ADD COLUMN (\w+)/)?.[1] ?? 'unknown';
                results.push(`⏭️ Already exists: ${col}`);
            } else {
                results.push(`❌ Error: ${msg}`);
            }
        }
    }

    return NextResponse.json({ results });
}
