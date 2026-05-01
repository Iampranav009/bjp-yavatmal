const mysql = require('mysql2/promise');

async function run() {
    console.log('Updating database for blog_posts...');
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT || '3306'),
        });
        
        const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';
        const s3BaseUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
        
        // Update blog_posts image_url
        const [blogsResult] = await pool.execute(`
            UPDATE blog_posts 
            SET image_url = CONCAT(?, SUBSTRING(image_url, 2))
            WHERE image_url LIKE '/uploads/%'
        `, [s3BaseUrl]);
        console.log(`Updated ${blogsResult.affectedRows} rows in blog_posts image_url.`);
        
        // Update blog_posts content (mr, hi, en)
        const [blogs] = await pool.execute(`
            SELECT id, content_mr, content_hi, content_en 
            FROM blog_posts 
            WHERE content_mr LIKE '%/uploads/%' 
               OR content_hi LIKE '%/uploads/%' 
               OR content_en LIKE '%/uploads/%'
        `);
        
        for (const blog of blogs) {
            let updated = false;
            let c_mr = blog.content_mr;
            let c_hi = blog.content_hi;
            let c_en = blog.content_en;

            if (c_mr && c_mr.includes('/uploads/')) {
                c_mr = c_mr.replace(/\/uploads\//g, `${s3BaseUrl}uploads/`);
                updated = true;
            }
            if (c_hi && c_hi.includes('/uploads/')) {
                c_hi = c_hi.replace(/\/uploads\//g, `${s3BaseUrl}uploads/`);
                updated = true;
            }
            if (c_en && c_en.includes('/uploads/')) {
                c_en = c_en.replace(/\/uploads\//g, `${s3BaseUrl}uploads/`);
                updated = true;
            }

            if (updated) {
                await pool.execute(
                    `UPDATE blog_posts SET content_mr = ?, content_hi = ?, content_en = ? WHERE id = ?`,
                    [c_mr, c_hi, c_en, blog.id]
                );
                console.log(`Updated content for blog post ID ${blog.id}`);
            }
        }

        await pool.end();
        console.log('Database update complete.');
    } catch (err) {
        console.error('Database error:', err);
    }
}

run();
