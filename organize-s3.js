const { S3Client, CopyObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const mysql = require('mysql2/promise');

async function run() {
    console.log('Organizing existing files in S3 into separate folders...');
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT || '3306'),
        });
        
        const s3Client = new S3Client({
            region: process.env.AWS_REGION || 'ap-south-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            }
        });
        
        const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';
        const s3BaseUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
        
        // 1. Organize gallery images
        const [galleryImages] = await pool.execute(`SELECT id, file_url, category FROM gallery_images WHERE file_url LIKE '%/uploads/%' AND file_url NOT LIKE '%/uploads/gallery/%'`);
        
        for (const img of galleryImages) {
            try {
                // Extract old key
                const oldKey = img.file_url.split('.amazonaws.com/')[1];
                if (!oldKey) continue;
                
                const fileName = oldKey.split('/').pop();
                const newKey = `uploads/gallery/${img.category}/${fileName}`;
                const newUrl = `${s3BaseUrl}${newKey}`;
                
                console.log(`Moving ${oldKey} to ${newKey}`);
                
                // Copy object
                await s3Client.send(new CopyObjectCommand({
                    Bucket: BUCKET_NAME,
                    CopySource: `${BUCKET_NAME}/${oldKey}`,
                    Key: newKey,
                }));
                
                // Delete old object
                await s3Client.send(new DeleteObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: oldKey,
                }));
                
                // Update DB
                await pool.execute(`UPDATE gallery_images SET file_url = ? WHERE id = ?`, [newUrl, img.id]);
            } catch (err) {
                console.error(`Failed to move gallery image ${img.id}:`, err.message);
            }
        }
        
        // 2. Organize event images
        const [events] = await pool.execute(`SELECT id, image_url FROM events WHERE image_url LIKE '%/uploads/%' AND image_url NOT LIKE '%/uploads/events/%'`);
        
        for (const evt of events) {
            try {
                const oldKey = evt.image_url.split('.amazonaws.com/')[1];
                if (!oldKey) continue;
                
                const fileName = oldKey.split('/').pop();
                const newKey = `uploads/events/${fileName}`;
                const newUrl = `${s3BaseUrl}${newKey}`;
                
                console.log(`Moving ${oldKey} to ${newKey}`);
                
                await s3Client.send(new CopyObjectCommand({
                    Bucket: BUCKET_NAME,
                    CopySource: `${BUCKET_NAME}/${oldKey}`,
                    Key: newKey,
                }));
                
                await s3Client.send(new DeleteObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: oldKey,
                }));
                
                await pool.execute(`UPDATE events SET image_url = ? WHERE id = ?`, [newUrl, evt.id]);
            } catch (err) {
                console.error(`Failed to move event image ${evt.id}:`, err.message);
            }
        }

        await pool.end();
        console.log('Finished organizing S3 and database.');
    } catch (err) {
        console.error('Migration error:', err);
    }
}

run();
