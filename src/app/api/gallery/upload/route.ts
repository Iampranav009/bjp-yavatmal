import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { ResultSetHeader } from 'mysql2';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function sanitizeFilename(filename: string): string {
    return filename
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_{2,}/g, '_')
        .toLowerCase();
}

export async function POST(request: Request) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const title = (formData.get('title') as string) || '';
        const category = (formData.get('category') as string) || 'general';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Only JPG, PNG, and WebP files are allowed' },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'File size must not exceed 5MB' },
                { status: 400 }
            );
        }

        // Ensure upload directory exists
        await mkdir(UPLOAD_DIR, { recursive: true });

        // Generate unique filename
        const ext = path.extname(file.name);
        const baseName = sanitizeFilename(path.basename(file.name, ext));
        const uniqueName = `${baseName}_${Date.now()}${ext}`;
        const filePath = path.join(UPLOAD_DIR, uniqueName);

        // Write file
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/${uniqueName}`;

        // Save to database
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO gallery_images (title, file_name, file_url, category)
       VALUES (?, ?, ?, ?)`,
            [title || uniqueName, uniqueName, fileUrl, category]
        );

        return NextResponse.json({
            data: {
                id: result.insertId,
                title: title || uniqueName,
                file_name: uniqueName,
                file_url: fileUrl,
                category,
            },
            message: 'Image uploaded successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Gallery upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
