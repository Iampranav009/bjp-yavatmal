import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const [tasks] = await pool.execute<RowDataPacket[]>(
            `SELECT t.*, a.name as created_by_name
             FROM tasks t
             LEFT JOIN admin_users a ON t.created_by = a.id
             WHERE t.id = ?`,
            [id]
        );

        if (tasks.length === 0) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const task = tasks[0];

        // Fetch target positions
        const [positions] = await pool.execute<RowDataPacket[]>(
            'SELECT position FROM task_target_positions WHERE task_id = ?',
            [id]
        );
        task.target_positions = positions.map((p: RowDataPacket) => p.position);

        // Fetch assigned members with details
        const [members] = await pool.execute<RowDataPacket[]>(
            `SELECT m.id, m.name, m.position, m.mobile, m.address
             FROM task_members tm
             JOIN members m ON tm.member_id = m.id
             WHERE tm.task_id = ?
             ORDER BY m.name ASC`,
            [id]
        );
        task.assigned_members = members;

        return NextResponse.json({ data: task });
    } catch (error) {
        console.error('Task GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { title, description, priority, start_date, due_date, status } = body;

        const validPriority = ['low', 'medium', 'high', 'urgent'].includes(priority) ? priority : undefined;
        const validStatus = ['pending', 'in_progress', 'completed'].includes(status) ? status : undefined;

        const updates: string[] = [];
        const values: (string | null)[] = [];

        if (title) { updates.push('title = ?'); values.push(title); }
        if (description !== undefined) { updates.push('description = ?'); values.push(description || null); }
        if (validPriority) { updates.push('priority = ?'); values.push(validPriority); }
        if (start_date) { updates.push('start_date = ?'); values.push(start_date); }
        if (due_date) { updates.push('due_date = ?'); values.push(due_date); }
        if (validStatus) { updates.push('status = ?'); values.push(validStatus); }

        if (updates.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        values.push(id);
        await pool.execute<ResultSetHeader>(
            `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        return NextResponse.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Task PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM tasks WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Task DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
