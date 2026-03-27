/**
 * Centralized Position and Wing Configuration
 */

export interface DropdownOption {
    value: string;
    label: string;
}

export const WINGS: DropdownOption[] = [
    { value: 'कोर टीम', label: 'कोर टीम' },
    { value: 'युवा मोर्चा', label: 'युवा मोर्चा' },
    { value: 'महिला मोर्चा', label: 'महिला मोर्चा' },
    { value: 'केमिस्ट आघाडी', label: 'केमिस्ट आघाडी' },
    { value: 'विद्यार्थी आघाडी', label: 'विद्यार्थी आघाडी' },
    { value: 'शहर दक्षिण', label: 'शहर दक्षिण' },
    { value: 'शहर उत्तर', label: 'शहर उत्तर' },
    { value: 'सदस्य', label: 'सदस्य' },
    { value: 'मंडळ', label: 'मंडळ' },
    { value: 'गल्ली प्रमुख', label: 'गल्ली प्रमुख' },
];

export const POSITIONS: DropdownOption[] = [
    { value: 'जिल्हा अध्यक्ष', label: 'जिल्हा अध्यक्ष' },
    { value: 'जिल्हा महामंत्री', label: 'जिल्हा महामंत्री' },
    { value: 'जिल्हा उपाध्यक्ष', label: 'जिल्हा उपाध्यक्ष' },
    { value: 'जिल्हा सचिव', label: 'जिल्हा सचिव' },
    { value: 'जिल्हा सदस्य', label: 'जिल्हा सदस्य' },
    { value: 'शहर अध्यक्ष', label: 'शहर अध्यक्ष' },
    { value: 'शहर महामंत्री', label: 'शहर महामंत्री' },
    { value: 'शहर उपाध्यक्ष', label: 'शहर उपाध्यक्ष' },
    { value: 'शहर सचिव', label: 'शहर सचिव' },
    { value: 'शहर सदस्य', label: 'शहर सदस्य' },
    { value: 'मंडळ अध्यक्ष', label: 'मंडळ अध्यक्ष' },
    { value: 'मंडळ महामंत्री', label: 'मंडळ महामंत्री' },
    { value: 'मंडळ उपाध्यक्ष', label: 'मंडळ उपाध्यक्ष' },
    { value: 'मंडळ सचिव', label: 'मंडळ सचिव' },
    { value: 'मंडळ सदस्य', label: 'मंडळ सदस्य' },
    { value: 'अध्यक्ष', label: 'अध्यक्ष' },
    { value: 'महामंत्री', label: 'महामंत्री' },
    { value: 'उपाध्यक्ष', label: 'उपाध्यक्ष' },
    { value: 'सचिव', label: 'सचिव' },
    { value: 'सदस्य', label: 'सदस्य' },
];

export const WING_VALUES: string[] = WINGS.map((w) => w.value);
export const POSITION_VALUES: string[] = POSITIONS.map((p) => p.value);

export const DEFAULT_WING = 'सदस्य';
export const DEFAULT_POSITION = 'सदस्य';

export function isValidWing(val: string): boolean {
    return WING_VALUES.includes(val);
}

export function isValidPosition(val: string): boolean {
    return POSITION_VALUES.includes(val);
}
