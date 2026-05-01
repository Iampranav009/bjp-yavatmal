import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function logAdminAction(adminId: number, actionType: string, entityType: string, entityId: number | null, payload: any) {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO admin_actions (admin_id, action_type, entity_type, entity_id, payload, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [adminId, actionType, entityType, entityId, JSON.stringify(payload)]
    );
    
    // Create a notification for Super Admins
    // We leave admin_id NULL so it goes to all super admins, or we query super admins and insert multiple.
    // For simplicity, admin_id = NULL means it's a global admin notification.
    await pool.execute(
        `INSERT INTO admin_notifications (admin_id, title, message)
         VALUES (NULL, 'Pending Admin Action', ?)`,
        [`Admin (ID: ${adminId}) requested to ${actionType} a ${entityType}.`]
    );
    return result.insertId;
}
