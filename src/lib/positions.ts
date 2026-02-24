/**
 * Centralized Position Configuration
 * All position values are in Marathi and must NEVER be translated.
 * This file is the single source of truth for position labels.
 */

export interface Position {
    value: string;
    label: string;
}

/**
 * Fixed list of positions in Marathi.
 * Order matters — displayed in this order in dropdowns.
 */
export const POSITIONS: Position[] = [
    { value: 'कोर टीम', label: 'कोर टीम' },
    { value: 'युवा मोर्चा', label: 'युवा मोर्चा' },
    { value: 'महिला मोर्चा', label: 'महिला मोर्चा' },
    { value: 'केमिस्ट आघाडी', label: 'केमिस्ट आघाडी' },
    { value: 'विद्यार्थी आघाडी', label: 'विद्यार्थी आघाडी' },
    { value: 'शहर दक्षिण', label: 'शहर दक्षिण' },
    { value: 'शहर उत्तर', label: 'शहर उत्तर' },
    { value: 'सदस्य', label: 'सदस्य' },
];

/** Flat array of valid position strings for validation */
export const POSITION_VALUES: string[] = POSITIONS.map((p) => p.value);

/** Default position assigned to members without one */
export const DEFAULT_POSITION = 'सदस्य';

/**
 * Validate whether a given string is a valid position.
 */
export function isValidPosition(val: string): boolean {
    return POSITION_VALUES.includes(val);
}

/**
 * Map from Marathi DB value → translation key in translations.ts positions section.
 * Usage: translations[lang].positions[POSITION_TRANSLATION_KEYS['कोर टीम']] → translated label
 */
export const POSITION_TRANSLATION_KEYS: Record<string, string> = {
    'कोर टीम': 'coreTeam',
    'युवा मोर्चा': 'yuvaMorcha',
    'महिला मोर्चा': 'mahilaMorcha',
    'केमिस्ट आघाडी': 'chemistFront',
    'विद्यार्थी आघाडी': 'studentFront',
    'शहर दक्षिण': 'citySouth',
    'शहर उत्तर': 'cityNorth',
    'सदस्य': 'member',
};

