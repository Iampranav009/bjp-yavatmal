import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        // Create admin_users table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS admin_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Insert demo user used for login bypass to satisfy foreign key constraints
        await pool.execute(`
            INSERT IGNORE INTO admin_users (id, name, email, password_hash, role)
            VALUES (999, 'Demo Admin', 'demo@bjpyavatmal.in', 'demo_hash', 'admin')
        `);

        // Create members table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS members (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                position VARCHAR(255),
                mobile VARCHAR(20),
                birth_date DATE,
                birth_year INT,
                address TEXT,
                photo_url VARCHAR(500),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_position (position)
            )
        `);

        // Create gallery_images table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS gallery_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255),
                file_name VARCHAR(255) NOT NULL,
                file_url VARCHAR(500) NOT NULL,
                category VARCHAR(100) DEFAULT 'general',
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create meetings table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS meetings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                meeting_date DATE NOT NULL,
                meeting_time TIME NOT NULL,
                google_meet_link VARCHAR(500),
                created_by INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES admin_users(id)
            )
        `);

        // Create meeting_target_positions table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS meeting_target_positions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                meeting_id INT NOT NULL,
                position VARCHAR(100) NOT NULL,
                FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
            )
        `);

        // Create meeting_participants table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS meeting_participants (
                id INT AUTO_INCREMENT PRIMARY KEY,
                meeting_id INT NOT NULL,
                member_id INT NOT NULL,
                FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
                FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
                UNIQUE KEY unique_meeting_member (meeting_id, member_id)
            )
        `);

        // Create notifications table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                member_id INT NOT NULL,
                meeting_id INT,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
                FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE SET NULL
            )
        `);

        // Create tasks table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                description TEXT,
                priority ENUM('low','medium','high','urgent') DEFAULT 'medium',
                start_date DATE NOT NULL,
                due_date DATE NOT NULL,
                reference_id VARCHAR(50) UNIQUE,
                pdf_file_name VARCHAR(500),
                pdf_generated_at TIMESTAMP NULL,
                status ENUM('pending','in_progress','completed') DEFAULT 'pending',
                created_by INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES admin_users(id)
            )
        `);

        // Create task_target_positions table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS task_target_positions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                task_id INT NOT NULL,
                position VARCHAR(100) NOT NULL,
                FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
            )
        `);

        // Create task_members table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS task_members (
                id INT AUTO_INCREMENT PRIMARY KEY,
                task_id INT NOT NULL,
                member_id INT NOT NULL,
                FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
                FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
                UNIQUE KEY unique_task_member (task_id, member_id)
            )
        `);

        // Add task_id column to notifications if not exists
        try {
            await pool.execute(`ALTER TABLE notifications ADD COLUMN task_id INT NULL, ADD FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL`);
        } catch {
            // Column may already exist
        }

        // Create birthday_templates table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS birthday_templates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                language VARCHAR(5) NOT NULL UNIQUE,
                template_text TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Extend gallery_images table with new columns
        const galleryAlters = [
            `ALTER TABLE gallery_images ADD COLUMN post_title VARCHAR(500) NULL`,
            `ALTER TABLE gallery_images ADD COLUMN post_description TEXT NULL`,
            `ALTER TABLE gallery_images ADD COLUMN post_link VARCHAR(500) NULL`,
            `ALTER TABLE gallery_images ADD COLUMN display_target ENUM('media','video') DEFAULT 'media'`,
            `ALTER TABLE gallery_images ADD COLUMN is_featured BOOLEAN DEFAULT FALSE`,
            `ALTER TABLE gallery_images ADD COLUMN batch_id VARCHAR(100) NULL`,
            `ALTER TABLE gallery_images ADD COLUMN show_on_homepage BOOLEAN DEFAULT FALSE`,
            `ALTER TABLE gallery_images ADD COLUMN homepage_text_title VARCHAR(255) NULL`,
            `ALTER TABLE gallery_images ADD COLUMN homepage_text_description TEXT NULL`,
            `ALTER TABLE gallery_images ADD COLUMN homepage_text_position VARCHAR(20) DEFAULT 'left'`,
            `ALTER TABLE gallery_images ADD COLUMN homepage_text_color VARCHAR(20) DEFAULT 'white'`,
            `ALTER TABLE gallery_images ADD COLUMN homepage_text_bold BOOLEAN DEFAULT FALSE`,
        ];
        for (const sql of galleryAlters) {
            try { await pool.execute(sql); } catch { /* column may already exist */ }
        }

        // Create blog_posts table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS blog_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                image_url VARCHAR(500),
                image_position ENUM('left','right','center') DEFAULT 'center',
                image_overlay_text VARCHAR(500),
                title_mr VARCHAR(500) NOT NULL,
                title_hi VARCHAR(500),
                title_en VARCHAR(500),
                description_mr TEXT,
                description_hi TEXT,
                description_en TEXT,
                content_mr LONGTEXT,
                content_hi LONGTEXT,
                content_en LONGTEXT,
                social_facebook VARCHAR(500),
                social_twitter VARCHAR(500),
                social_instagram VARCHAR(500),
                social_whatsapp VARCHAR(500),
                show_social_buttons BOOLEAN DEFAULT FALSE,
                is_published BOOLEAN DEFAULT TRUE,
                is_hidden BOOLEAN DEFAULT FALSE,
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES admin_users(id)
            )
        `);

        // Alter existing blog_posts table
        const blogAlters = [
            `ALTER TABLE blog_posts ADD COLUMN slug VARCHAR(500) UNIQUE NULL`,
            `ALTER TABLE blog_posts ADD COLUMN post_type ENUM('article', 'interview') DEFAULT 'article'`,
            `ALTER TABLE blog_posts ADD COLUMN category VARCHAR(100) NULL`,
            `ALTER TABLE blog_posts ADD COLUMN author_name_mr VARCHAR(255) NULL`,
            `ALTER TABLE blog_posts ADD COLUMN author_name_hi VARCHAR(255) NULL`,
            `ALTER TABLE blog_posts ADD COLUMN author_name_en VARCHAR(255) NULL`,
        ];
        for (const sql of blogAlters) {
            try { await pool.execute(sql); } catch { /* column may already exist */ }
        }

        // Create article_sidebar table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS article_sidebar (
                id INT AUTO_INCREMENT PRIMARY KEY,
                item_type ENUM('image_banner', 'text_block', 'youtube_embed', 'subscribe_widget') NOT NULL,
                title VARCHAR(255),
                image_url VARCHAR(500),
                video_url VARCHAR(500),
                content TEXT,
                target_link VARCHAR(500),
                display_order INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create subscribers table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS subscribers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        return NextResponse.json({
            message: 'All tables created successfully!',
            tables: ['admin_users', 'members', 'gallery_images', 'meetings', 'meeting_target_positions', 'meeting_participants', 'notifications', 'tasks', 'task_target_positions', 'task_members', 'birthday_templates', 'blog_posts', 'article_sidebar', 'subscribers'],
        });
    } catch (error) {
        console.error('Setup error:', error);
        return NextResponse.json({ error: 'Setup failed', details: String(error) }, { status: 500 });
    }
}
