import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'blogs');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

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

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const ext = path.extname(file.name).toLowerCase();
        const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'];
        const typeOk = ALLOWED_TYPES.includes(file.type) || allowedExts.includes(ext);
        if (!typeOk) {
            return NextResponse.json(
                { error: `Only JPG, PNG, WebP, and HEIC files are allowed (got: ${file.type || ext})` },
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
        const baseName = sanitizeFilename(path.basename(file.name, ext));
        const uniqueName = `blog_${baseName}_${Date.now()}${ext}`;
        const filePath = path.join(UPLOAD_DIR, uniqueName);

        // Write file
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/blogs/${uniqueName}`;

        return NextResponse.json({
            data: { file_url: fileUrl, file_name: uniqueName },
            message: 'Image uploaded successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Blog image upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
