import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { parseTaskImportBuffer } from '@/lib/taskImport';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { format } from 'date-fns';

export async function POST(request: Request) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const { tasks, errors } = parseTaskImportBuffer(buffer);

        if (!tasks.length && !errors.length) {
            return NextResponse.json(
                { error: 'No valid task data found in file' },
                { status: 400 }
            );
        }

        let added = 0;
        let skipped = 0;

        // Check for existing duplicates in DB
        for (const task of tasks) {
            try {
                const [existing] = await pool.execute<RowDataPacket[]>(
                    'SELECT id FROM tasks WHERE LOWER(title) = LOWER(?) AND due_date = ?',
                    [task.title, task.due_date]
                );

                if (existing.length > 0) {
                    errors.push({
                        row: 0,
                        reason: `Task "${task.title}" with due date ${task.due_date} already exists in database.`,
                    });
                    skipped++;
                    continue;
                }

                // Generate reference ID
                const dateStr = format(new Date(), 'yyyyMMdd');
                const [countRows] = await pool.execute<RowDataPacket[]>(
                    `SELECT COUNT(*) as cnt FROM tasks WHERE DATE(created_at) = CURDATE()`
                );
                const seq = String((countRows[0]?.cnt || 0) + 1).padStart(3, '0');
                const referenceId = `BGP-TASK-${dateStr}-${seq}`;

                // Insert task
                const [result] = await pool.execute<ResultSetHeader>(
                    `INSERT INTO tasks (title, description, priority, start_date, due_date, reference_id, created_by)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [task.title, task.description || null, task.priority, task.start_date, task.due_date, referenceId, admin.userId]
                );
                const taskId = result.insertId;

                // Insert target position
                await pool.execute(
                    'INSERT INTO task_target_positions (task_id, position) VALUES (?, ?)',
                    [taskId, task.committee]
                );

                // Auto-assign members
                const [members] = await pool.execute<RowDataPacket[]>(
                    'SELECT id FROM members WHERE position = ?',
                    [task.committee]
                );

                for (const member of members) {
                    try {
                        await pool.execute(
                            'INSERT INTO task_members (task_id, member_id) VALUES (?, ?)',
                            [taskId, member.id]
                        );
                        // Notification
                        await pool.execute(
                            `INSERT INTO notifications (member_id, task_id, title, message)
                             VALUES (?, ?, ?, ?)`,
                            [
                                member.id,
                                taskId,
                                `New Task Assigned: ${task.title}`,
                                `You have been assigned task "${task.title}" (${task.priority} priority). Due: ${task.due_date}.`
                            ]
                        );
                    } catch {
                        // Skip duplicate
                    }
                }

                added++;
            } catch {
                skipped++;
            }
        }

        return NextResponse.json({
            data: { added, skipped, rejected: errors.length, total: tasks.length + errors.length },
            errors: errors.length > 0 ? errors : undefined,
            message: `${added} tasks imported, ${skipped} skipped, ${errors.length} rejected.`,
        });
    } catch (error) {
        console.error('Task import error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
