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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

        return NextResponse.json({
            message: 'All tables created successfully!',
            tables: ['admin_users', 'members', 'gallery_images'],
        });
    } catch (error) {
        console.error('Setup error:', error);
        return NextResponse.json({ error: 'Setup failed', details: String(error) }, { status: 500 });
    }
}
