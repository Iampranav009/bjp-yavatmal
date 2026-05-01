import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';

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

        if (!BUCKET_NAME || !process.env.AWS_ACCESS_KEY_ID) {
            return NextResponse.json({ error: 'AWS S3 is not configured. Please add AWS credentials to .env' }, { status: 500 });
        }

        // Generate unique filename
        const baseName = sanitizeFilename(path.basename(file.name, ext));
        const uniqueName = `uploads/blogs/blog_${baseName}_${Date.now()}${ext}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: uniqueName,
                Body: buffer,
                ContentType: file.type,
            })
        );

        const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${uniqueName}`;

        return NextResponse.json({
            data: { file_url: fileUrl, file_name: uniqueName },
            message: 'Image uploaded successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Blog image upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
