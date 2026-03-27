import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { ResultSetHeader } from 'mysql2';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

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
        const postTitle = (formData.get('post_title') as string) || '';
        const postDescription = (formData.get('post_description') as string) || '';
        const postLink = (formData.get('post_link') as string) || '';
        const displayTarget = (formData.get('display_target') as string) || 'media';
        const isFeatured = formData.get('is_featured') === 'true';
        const batchId = (formData.get('batch_id') as string) || null;

        // Homepage image preview fields
        const showOnHomepage = formData.get('show_on_homepage') === 'true';
        const homepageTextTitle = (formData.get('homepage_text_title') as string) || '';
        const homepageTextDescription = (formData.get('homepage_text_description') as string) || '';
        const homepageTextPosition = (formData.get('homepage_text_position') as string) || 'left';
        const homepageTextColor = (formData.get('homepage_text_color') as string) || 'white';
        const homepageTextBold = formData.get('homepage_text_bold') === 'true';

        if (!file) {
            console.error('Upload 400: No file provided');
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type — check MIME type OR extension as fallback
        const ext = path.extname(file.name).toLowerCase();
        const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
        const typeOk = ALLOWED_TYPES.includes(file.type) || allowedExts.includes(ext);
        if (!typeOk) {
            console.error(`Upload 400: Invalid type — mime="${file.type}" ext="${ext}" name="${file.name}"`);
            return NextResponse.json(
                { error: `Only JPG, PNG, and WebP files are allowed (got: ${file.type || ext})` },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            console.error(`Upload 400: File too large — size=${file.size}`);
            return NextResponse.json(
                { error: 'File size must not exceed 5MB' },
                { status: 400 }
            );
        }

        // Ensure upload directory exists
        await mkdir(UPLOAD_DIR, { recursive: true });

        // Generate unique filename
        const baseName = sanitizeFilename(path.basename(file.name, ext));
        const uniqueName = `${baseName}_${Date.now()}${ext}`;
        const filePath = path.join(UPLOAD_DIR, uniqueName);

        // Write file
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/${uniqueName}`;

        // Save to database with new fields
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO gallery_images (title, file_name, file_url, category, post_title, post_description, post_link, display_target, is_featured, batch_id, show_on_homepage, homepage_text_title, homepage_text_description, homepage_text_position, homepage_text_color, homepage_text_bold)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title || uniqueName, uniqueName, fileUrl, category, postTitle, postDescription, postLink, displayTarget, isFeatured ? 1 : 0, batchId, showOnHomepage ? 1 : 0, homepageTextTitle, homepageTextDescription, homepageTextPosition, homepageTextColor, homepageTextBold ? 1 : 0]
        );

        return NextResponse.json({
            data: {
                id: result.insertId,
                title: title || uniqueName,
                file_name: uniqueName,
                file_url: fileUrl,
                category,
                post_title: postTitle,
                post_description: postDescription,
                post_link: postLink,
                display_target: displayTarget,
                is_featured: isFeatured,
                batch_id: batchId,
                show_on_homepage: showOnHomepage,
                homepage_text_title: homepageTextTitle,
                homepage_text_description: homepageTextDescription,
                homepage_text_position: homepageTextPosition,
                homepage_text_color: homepageTextColor,
                homepage_text_bold: homepageTextBold,
            },
            message: 'Image uploaded successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Gallery upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
