import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { generateTemplateExcelBuffer } from '@/lib/excel';

export async function GET() {
    try {
        const admin = await getAdminFromRequest();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const buffer = generateTemplateExcelBuffer();

        return new NextResponse(new Uint8Array(buffer), {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="Members_Import_Template.xlsx"',
            },
        });
    } catch (error) {
        console.error('Template export error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
