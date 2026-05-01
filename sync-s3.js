const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { readdir, readFile, stat } = require('fs/promises');
const path = require('path');
const mysql = require('mysql2/promise');

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';

const getMimeType = (ext) => {
    const map = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.heic': 'image/heic',
        '.heif': 'image/heif',
        '.pdf': 'application/pdf',
    };
    return map[ext.toLowerCase()] || 'application/octet-stream';
};

async function uploadDir(dirPath, basePath = '') {
    const entries = await readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.join(basePath, entry.name).replace(/\\/g, '/'); // ensure posix paths for S3
        
        if (entry.isDirectory()) {
            await uploadDir(fullPath, relativePath);
        } else {
            console.log(`Uploading ${relativePath}...`);
            const fileContent = await readFile(fullPath);
            const ext = path.extname(entry.name);
            const contentType = getMimeType(ext);
            
            // For S3 key, we prepend 'uploads/' if we are uploading from public/uploads
            const s3Key = `uploads/${relativePath}`;
            
            try {
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: BUCKET_NAME,
                        Key: s3Key,
                        Body: fileContent,
                        ContentType: contentType,
                    })
                );
                console.log(`Successfully uploaded ${s3Key}`);
            } catch (err) {
                console.error(`Failed to upload ${s3Key}`, err);
            }
        }
    }
}

async function run() {
    console.log('Starting sync to S3...');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    try {
        await uploadDir(uploadsDir);
        console.log('All files uploaded to S3.');
    } catch (e) {
        console.error('Error reading directory:', e);
    }
    
    // Now update database
    console.log('Updating database...');
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT || '3306'),
        });
        
        const s3BaseUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
        
        // Update gallery_images
        const [galleryResult] = await pool.execute(`
            UPDATE gallery_images 
            SET file_url = CONCAT(?, SUBSTRING(file_url, 2))
            WHERE file_url LIKE '/uploads/%'
        `, [s3BaseUrl]);
        console.log(`Updated ${galleryResult.affectedRows} rows in gallery_images.`);
        
        // Update events
        const [eventsResult] = await pool.execute(`
            UPDATE events 
            SET image_url = CONCAT(?, SUBSTRING(image_url, 2))
            WHERE image_url LIKE '/uploads/%'
        `, [s3BaseUrl]);
        console.log(`Updated ${eventsResult.affectedRows} rows in events.`);
        
        // blogs table - cover_image
        const [blogsResult] = await pool.execute(`
            UPDATE blogs 
            SET cover_image = CONCAT(?, SUBSTRING(cover_image, 2))
            WHERE cover_image LIKE '/uploads/%'
        `, [s3BaseUrl]);
        console.log(`Updated ${blogsResult.affectedRows} rows in blogs cover_image.`);
        
        // blogs content replacement
        const [blogs] = await pool.execute(`SELECT id, content FROM blogs WHERE content LIKE '%/uploads/%'`);
        for (const blog of blogs) {
            const newContent = blog.content.replace(/\/uploads\//g, `${s3BaseUrl}uploads/`);
            await pool.execute(`UPDATE blogs SET content = ? WHERE id = ?`, [newContent, blog.id]);
            console.log(`Updated content for blog ID ${blog.id}`);
        }

        await pool.end();
        console.log('Database update complete.');
    } catch (err) {
        console.error('Database error:', err);
    }
}

run();
