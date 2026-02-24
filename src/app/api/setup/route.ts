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

        return NextResponse.json({
            message: 'All tables created successfully!',
            tables: ['admin_users', 'members', 'gallery_images', 'meetings', 'meeting_target_positions', 'meeting_participants', 'notifications', 'tasks', 'task_target_positions', 'task_members'],
        });
    } catch (error) {
        console.error('Setup error:', error);
        return NextResponse.json({ error: 'Setup failed', details: String(error) }, { status: 500 });
    }
}
