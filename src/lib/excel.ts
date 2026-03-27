import * as XLSX from 'xlsx';
import { isValidPosition, isValidWing, DEFAULT_POSITION, DEFAULT_WING } from '@/lib/positions';

export interface MemberRow {
    name: string;
    wing: string;
    position: string;
    mobile: string;
    birth_date: string;
    birth_year?: number | null;
    address?: string;
}

export interface ParseResult {
    members: MemberRow[];
    errors: Array<{ row: number; reason: string }>;
}

/**
 * Parse an Excel/CSV buffer into an array of member objects.
 * Validates position values against the predefined Marathi list.
 */
export function parseExcelBuffer(buffer: Buffer): ParseResult {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

    const members: MemberRow[] = [];
    const errors: Array<{ row: number; reason: string }> = [];

    rawData.forEach((row, index) => {
        // Try to find columns by various name patterns
        const name = String(
            row['Name'] || row['name'] || row['Full Name'] || row['FullName'] || ''
        ).trim();
        const wing = String(
            row['Wing'] || row['wing'] || row['विभाग'] || ''
        ).trim();
        const position = String(
            row['Position'] || row['position'] || row['पद'] || row['Designation'] || row['designation'] || ''
        ).trim();
        const mobile = String(
            row['Mobile'] || row['mobile'] || row['Phone'] || row['phone'] || row['Contact'] || ''
        ).trim();

        let birthDate = '';
        const rawBD = row['Birth Date'] || row['birth_date'] || row['Birthday'] || row['DOB'] || row['dob'] || '';
        if (rawBD) {
            // Handle Excel date serial numbers
            if (typeof rawBD === 'number') {
                const parsed = XLSX.SSF.parse_date_code(rawBD);
                if (parsed) {
                    birthDate = `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
                }
            } else {
                birthDate = String(rawBD).trim();
            }
        }

        const birthYear = row['Birth Year'] || row['birth_year'] || row['Year'] || null;
        const address = String(row['Address'] || row['address'] || '').trim();

        // Validate required fields
        if (!name || !birthDate) {
            return; // skip rows without required fields
        }

        const finalWing = wing || DEFAULT_WING;
        if (!isValidWing(finalWing)) {
            errors.push({
                row: index + 2,
                reason: `Invalid wing "${wing}".`,
            });
            return;
        }

        const finalPosition = position || DEFAULT_POSITION;
        if (!isValidPosition(finalPosition)) {
            errors.push({
                row: index + 2, // +2 for 1-indexed + header row
                reason: `Invalid position "${position}".`,
            });
            return;
        }

        members.push({
            name,
            wing: finalWing,
            position: finalPosition,
            mobile,
            birth_date: birthDate,
            birth_year: birthYear ? Number(birthYear) : null,
            address: address || undefined,
        });
    });

    return { members, errors };
}

/**
 * Generate an Excel buffer from members data.
 * Position values are always in Marathi.
 */
export function generateExcelBuffer(
    members: Array<{
        id: number;
        name: string;
        wing: string;
        position: string;
        mobile: string;
        birth_date: string;
        birth_year?: number | null;
        address?: string;
        created_at?: string;
    }>
): Buffer {
    const data = members.map((m) => ({
        'ID': m.id,
        'Name': m.name,
        'Wing (विभाग)': m.wing,
        'Position (पद)': m.position,
        'Mobile': m.mobile,
        'Birth Date': m.birth_date,
        'Birth Year': m.birth_year || '',
        'Address': m.address || '',
        'Added Date': m.created_at || '',
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths
    worksheet['!cols'] = [
        { wch: 6 },  // ID
        { wch: 25 }, // Name
        { wch: 25 }, // Wing
        { wch: 25 }, // Position
        { wch: 15 }, // Mobile
        { wch: 12 }, // Birth Date
        { wch: 10 }, // Birth Year
        { wch: 35 }, // Address
        { wch: 20 }, // Added Date
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');
    return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
}
