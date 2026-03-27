import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { DEFAULT_TEMPLATES, type WishLanguage } from '@/lib/birthdayTemplates';

// GET – fetch all templates
export async function GET() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Ensure table exists
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS birthday_templates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                language VARCHAR(5) NOT NULL UNIQUE,
                template_text TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM birthday_templates ORDER BY language ASC'
        );

        // Build a map of saved templates
        const templates: Record<string, { id: number; language: string; template_text: string; updated_at: string }> = {};
        for (const row of rows) {
            templates[row.language] = {
                id: row.id,
                language: row.language,
                template_text: row.template_text,
                updated_at: row.updated_at,
            };
        }

        // Merge with defaults for any missing languages
        const languages: WishLanguage[] = ['en', 'hi', 'mr'];
        const result = languages.map((lang) => {
            if (templates[lang]) {
                return templates[lang];
            }
            return {
                id: null,
                language: lang,
                template_text: DEFAULT_TEMPLATES[lang],
                updated_at: null,
            };
        });

        return NextResponse.json({ data: result });
    } catch (error) {
        console.error('Birthday templates GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST – save / update a template
export async function POST(request: NextRequest) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { language, template_text } = body;

        if (!language || !template_text) {
            return NextResponse.json({ error: 'Language and template_text are required' }, { status: 400 });
        }

        const validLanguages: WishLanguage[] = ['en', 'hi', 'mr'];
        if (!validLanguages.includes(language)) {
            return NextResponse.json({ error: 'Invalid language. Must be en, hi, or mr.' }, { status: 400 });
        }

        // Ensure table exists
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS birthday_templates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                language VARCHAR(5) NOT NULL UNIQUE,
                template_text TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Upsert
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO birthday_templates (language, template_text)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE template_text = VALUES(template_text), updated_at = CURRENT_TIMESTAMP`,
            [language, template_text]
        );

        return NextResponse.json({
            message: 'Template saved successfully',
            data: { id: result.insertId, language, template_text },
        });
    } catch (error) {
        console.error('Birthday templates POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
