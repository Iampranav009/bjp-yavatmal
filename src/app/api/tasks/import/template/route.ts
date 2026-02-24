import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import * as XLSX from 'xlsx';

export async function GET() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Create a template workbook with headers and sample data
        const templateData = [
            {
                'Task Title': 'Example Task Title',
                'Task Description': 'Description of the task',
                'Assigned Committee': 'कोर टीम',
                'Priority': 'medium',
                'Start Date': '2026-03-01',
                'Due Date': '2026-03-15',
            },
        ];

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(templateData);

        worksheet['!cols'] = [
            { wch: 30 },  // Task Title
            { wch: 40 },  // Task Description
            { wch: 25 },  // Committee
            { wch: 12 },  // Priority
            { wch: 15 },  // Start Date
            { wch: 15 },  // Due Date
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
        const buffer = Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'csv' }));

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="BGP_Task_Import_Template.csv"',
            },
        });
    } catch (error) {
        console.error('Template error:', error);
        return NextResponse.json({ error: 'Failed to generate template' }, { status: 500 });
    }
}
