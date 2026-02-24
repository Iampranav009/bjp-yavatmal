import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Fetch task details
        const [tasks] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM tasks WHERE id = ?',
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
        const targetPositions = positions.map((p: RowDataPacket) => p.position);

        // Fetch assigned members
        const [members] = await pool.execute<RowDataPacket[]>(
            `SELECT m.name, m.position, m.mobile, m.address
             FROM task_members tm
             JOIN members m ON tm.member_id = m.id
             WHERE tm.task_id = ?
             ORDER BY m.name ASC`,
            [id]
        );

        // Generate PDF using server-side rendering
        const { renderTaskPDFToBuffer } = await import('@/components/admin/TaskPDF');

        const pdfBuffer = await renderTaskPDFToBuffer({
            task: {
                title: task.title,
                description: task.description || '',
                priority: task.priority,
                start_date: task.start_date,
                due_date: task.due_date,
                reference_id: task.reference_id,
                created_at: task.created_at,
            },
            targetPositions,
            members: members.map((m: RowDataPacket) => ({
                name: m.name,
                position: m.position,
                phone: m.mobile || '',
                email: '',
            })),
        });

        // Update task record with PDF info
        const pdfFileName = `Task_${task.reference_id}.pdf`;
        await pool.execute<ResultSetHeader>(
            'UPDATE tasks SET pdf_file_name = ?, pdf_generated_at = NOW() WHERE id = ?',
            [pdfFileName, id]
        );

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${pdfFileName}"`,
            },
        });
    } catch (error) {
        console.error('Task PDF export error:', error);
        return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
    }
}
