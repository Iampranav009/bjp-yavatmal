import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { isValidPosition, isValidWing } from '@/lib/positions';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { format } from 'date-fns';

export async function GET() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [tasks] = await pool.execute<RowDataPacket[]>(`
            SELECT t.*,
                   a.name as created_by_name,
                   (SELECT COUNT(*) FROM task_members tm WHERE tm.task_id = t.id) as member_count
            FROM tasks t
            LEFT JOIN admin_users a ON t.created_by = a.id
            ORDER BY t.created_at DESC
        `);

        // Fetch target positions for each task
        for (const task of tasks) {
            const [positions] = await pool.execute<RowDataPacket[]>(
                'SELECT position FROM task_target_positions WHERE task_id = ?',
                [task.id]
            );
            task.target_positions = positions.map((p: RowDataPacket) => p.position);
        }

        return NextResponse.json({ data: tasks });
    } catch (error) {
        console.error('Tasks GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, priority, start_date, due_date, target_positions } = body;

        if (!title || !start_date || !due_date) {
            return NextResponse.json(
                { error: 'Title, start date, and due date are required' },
                { status: 400 }
            );
        }

        if (!target_positions || !Array.isArray(target_positions) || target_positions.length === 0) {
            return NextResponse.json(
                { error: 'At least one target committee is required' },
                { status: 400 }
            );
        }

        // Validate all positions as wings (committees) or specific positions
        for (const pos of target_positions) {
            if (!isValidWing(pos) && !isValidPosition(pos)) {
                return NextResponse.json(
                    { error: `Invalid target "${pos}".` },
                    { status: 400 }
                );
            }
        }

        // Generate reference ID: BGP-TASK-YYYYMMDD-XXX
        const dateStr = format(new Date(), 'yyyyMMdd');
        const [countRows] = await pool.execute<RowDataPacket[]>(
            `SELECT COUNT(*) as cnt FROM tasks WHERE DATE(created_at) = CURDATE()`
        );
        const seq = String((countRows[0]?.cnt || 0) + 1).padStart(3, '0');
        const referenceId = `BGP-TASK-${dateStr}-${seq}`;

        const validPriority = ['low', 'medium', 'high', 'urgent'].includes(priority) ? priority : 'medium';

        // Insert task
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO tasks (title, description, priority, start_date, due_date, reference_id, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, description || null, validPriority, start_date, due_date, referenceId, admin.userId]
        );
        const taskId = result.insertId;

        // Insert target positions
        for (const pos of target_positions) {
            await pool.execute(
                'INSERT INTO task_target_positions (task_id, position) VALUES (?, ?)',
                [taskId, pos]
            );
        }

        // Auto-assign members matching target positions (wings or positions)
        const posPlaceholders = target_positions.map(() => '?').join(',');
        const queryParams = [...target_positions, ...target_positions];
        const [matchingMembers] = await pool.execute<RowDataPacket[]>(
            `SELECT id FROM members WHERE wing IN (${posPlaceholders}) OR position IN (${posPlaceholders})`,
            queryParams
        );

        let assignedCount = 0;
        for (const member of matchingMembers) {
            try {
                await pool.execute(
                    'INSERT INTO task_members (task_id, member_id) VALUES (?, ?)',
                    [taskId, member.id]
                );
                assignedCount++;

                // Create notification
                await pool.execute(
                    `INSERT INTO notifications (member_id, task_id, title, message)
                     VALUES (?, ?, ?, ?)`,
                    [
                        member.id,
                        taskId,
                        `New Task Assigned: ${title}`,
                        `You have been assigned a new task "${title}" with priority ${validPriority}. Due date: ${due_date}.`
                    ]
                );
            } catch {
                // Skip duplicate assignments
            }
        }

        return NextResponse.json({
            data: { id: taskId, reference_id: referenceId, assigned_members: assignedCount },
            message: `Task created! ${assignedCount} members assigned.`,
        }, { status: 201 });
    } catch (error) {
        console.error('Tasks POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
