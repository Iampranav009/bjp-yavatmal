import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS admin_actions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                admin_id INT NOT NULL,
                action_type VARCHAR(50) NOT NULL,
                entity_type VARCHAR(100) NOT NULL,
                entity_id INT NULL,
                payload JSON,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                reviewed_by INT NULL,
                reviewed_at TIMESTAMP NULL,
                FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE,
                FOREIGN KEY (reviewed_by) REFERENCES admin_users(id) ON DELETE SET NULL
            )
        `);
        
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS admin_notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                admin_id INT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
            )
        `);
        return NextResponse.json({ message: 'Tables created' });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
