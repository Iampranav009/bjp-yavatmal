import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const { id } = params;

        const admin = await getAdminFromRequest();
        if (!admin || admin.role !== 'super_admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const [actions] = await pool.execute<RowDataPacket[]>('SELECT * FROM admin_actions WHERE id = ?', [id]);
        if (actions.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const action = actions[0];
        if (action.status !== 'pending') return NextResponse.json({ error: 'Action is not pending' }, { status: 400 });

        const payload = typeof action.payload === 'string' ? JSON.parse(action.payload) : action.payload;

        // Execute action based on entity type
        if (action.entity_type === 'member') {
            if (action.action_type === 'CREATE') {
                await pool.execute<ResultSetHeader>(
                    `INSERT INTO members (name, wing, position, mobile, birth_date, birth_year, address, photo_url, notes)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [payload.name, payload.wing, payload.position, payload.mobile || null, payload.birth_date, payload.birth_year || null, payload.address || null, payload.photo_url || null, payload.notes || null]
                );
            } else if (action.action_type === 'UPDATE') {
                const updates = [];
                const values = [];
                for (const [key, val] of Object.entries(payload)) {
                    updates.push(`${key} = ?`);
                    values.push(val);
                }
                if (updates.length > 0) {
                    values.push(action.entity_id);
                    await pool.execute(
                        `UPDATE members SET ${updates.join(', ')} WHERE id = ?`,
                        values
                    );
                }
            } else if (action.action_type === 'DELETE') {
                 await pool.execute(`DELETE FROM members WHERE id = ?`, [action.entity_id]);
            }
        } else if (action.entity_type === 'event' && action.action_type === 'CREATE') {
            await pool.execute<ResultSetHeader>(
                `INSERT INTO events 
                 (title, event_date, event_time, place, host, participant_count, mandal, description, image_url, created_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    payload.title, payload.event_date, payload.event_time, payload.place,
                    payload.host || null, payload.participant_count || null, payload.mandal || null,
                    payload.description || null, payload.image_url || null, admin.userId
                ]
            );
        } else if (action.entity_type === 'task' && action.action_type === 'CREATE') {
            const [result] = await pool.execute<ResultSetHeader>(
                `INSERT INTO tasks (title, description, priority, start_date, due_date, reference_id, created_by)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [payload.title, payload.description || null, payload.validPriority, payload.start_date, payload.due_date, payload.referenceId, admin.userId]
            );
            
            const taskId = result.insertId;
            // Also insert target positions if they are provided
            if (payload.target_positions && Array.isArray(payload.target_positions)) {
                 for (const pos of payload.target_positions) {
                     await pool.execute(
                         'INSERT INTO task_target_positions (task_id, position) VALUES (?, ?)',
                         [taskId, pos]
                     );
                 }
            }
        }
        
        // Mark as approved
        await pool.execute(
            'UPDATE admin_actions SET status = "approved", reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?',
            [admin.userId, id]
        );

        return NextResponse.json({ message: 'Action approved successfully' });
    } catch (error) {
        console.error('Approve action error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
