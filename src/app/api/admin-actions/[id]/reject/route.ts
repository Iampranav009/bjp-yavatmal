import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

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

        // Mark as rejected
        await pool.execute(
            'UPDATE admin_actions SET status = "rejected", reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?',
            [admin.userId, id]
        );

        return NextResponse.json({ message: 'Action rejected successfully' });
    } catch (error) {
        console.error('Reject action error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
