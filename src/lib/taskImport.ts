import * as XLSX from 'xlsx';
import { isValidPosition } from '@/lib/positions';

export interface TaskRow {
    title: string;
    description: string;
    committee: string; // Marathi committee name
    priority: string;
    start_date: string;
    due_date: string;
}

export interface TaskParseResult {
    tasks: TaskRow[];
    errors: Array<{ row: number; reason: string }>;
}

/**
 * Parse an Excel/CSV buffer into task rows.
 * Validates committee names, dates, and required fields.
 */
export function parseTaskImportBuffer(buffer: Buffer): TaskParseResult {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

    const tasks: TaskRow[] = [];
    const errors: Array<{ row: number; reason: string }> = [];
    const seen = new Set<string>();

    rawData.forEach((row, index) => {
        const rowNum = index + 2; // +2 for 1-indexed + header row

        const title = String(
            row['Task Title'] || row['Title'] || row['title'] || ''
        ).trim();
        const description = String(
            row['Task Description'] || row['Description'] || row['description'] || ''
        ).trim();
        const committee = String(
            row['Assigned Committee'] || row['Committee'] || row['committee'] || row['समिती'] || ''
        ).trim();
        const priority = String(
            row['Priority'] || row['priority'] || ''
        ).trim().toLowerCase();

        // Parse dates (handle Excel serial and string formats)
        let startDate = '';
        let dueDate = '';

        const rawSD = row['Start Date'] || row['start_date'] || '';
        if (rawSD) {
            if (typeof rawSD === 'number') {
                const parsed = XLSX.SSF.parse_date_code(rawSD);
                if (parsed) {
                    startDate = `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
                }
            } else {
                startDate = String(rawSD).trim();
            }
        }

        const rawDD = row['Due Date'] || row['due_date'] || '';
        if (rawDD) {
            if (typeof rawDD === 'number') {
                const parsed = XLSX.SSF.parse_date_code(rawDD);
                if (parsed) {
                    dueDate = `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
                }
            } else {
                dueDate = String(rawDD).trim();
            }
        }

        // Validate required fields
        if (!title) {
            errors.push({ row: rowNum, reason: 'Task Title is required.' });
            return;
        }

        if (!committee) {
            errors.push({ row: rowNum, reason: 'Assigned Committee is required.' });
            return;
        }

        if (!startDate) {
            errors.push({ row: rowNum, reason: 'Start Date is required.' });
            return;
        }

        if (!dueDate) {
            errors.push({ row: rowNum, reason: 'Due Date is required.' });
            return;
        }

        // Validate committee name
        if (!isValidPosition(committee)) {
            errors.push({
                row: rowNum,
                reason: `Invalid committee "${committee}". Must be one of the predefined Marathi committee names.`,
            });
            return;
        }

        // Validate date format (should be YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(startDate)) {
            errors.push({ row: rowNum, reason: `Invalid Start Date format "${startDate}". Use YYYY-MM-DD.` });
            return;
        }
        if (!dateRegex.test(dueDate)) {
            errors.push({ row: rowNum, reason: `Invalid Due Date format "${dueDate}". Use YYYY-MM-DD.` });
            return;
        }

        // Duplicate detection
        const dupeKey = `${title.toLowerCase()}|${dueDate}`;
        if (seen.has(dupeKey)) {
            errors.push({ row: rowNum, reason: `Duplicate task: "${title}" with due date ${dueDate}.` });
            return;
        }
        seen.add(dupeKey);

        // Validate priority
        const validPriority = ['low', 'medium', 'high', 'urgent'].includes(priority) ? priority : 'medium';

        tasks.push({
            title,
            description,
            committee,
            priority: validPriority,
            start_date: startDate,
            due_date: dueDate,
        });
    });

    return { tasks, errors };
}
