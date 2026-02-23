import * as XLSX from 'xlsx';

export interface MemberRow {
    name: string;
    position: string;
    mobile: string;
    birth_date: string;
    birth_year?: number | null;
    address?: string;
}

/**
 * Parse an Excel/CSV buffer into an array of member objects.
 */
export function parseExcelBuffer(buffer: Buffer): MemberRow[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

    return rawData.map((row) => {
        // Try to find columns by various name patterns
        const name = String(
            row['Name'] || row['name'] || row['Full Name'] || row['FullName'] || ''
        ).trim();
        const position = String(
            row['Position'] || row['position'] || row['Designation'] || row['designation'] || ''
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

        return {
            name,
            position,
            mobile,
            birth_date: birthDate,
            birth_year: birthYear ? Number(birthYear) : null,
            address: address || undefined,
        };
    }).filter((m) => m.name && m.birth_date); // Only include rows with required fields
}

/**
 * Generate an Excel buffer from members data.
 */
export function generateExcelBuffer(
    members: Array<{
        id: number;
        name: string;
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
        'Position': m.position,
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
