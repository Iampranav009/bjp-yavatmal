export type WishLanguage = 'en' | 'hi' | 'mr';

export interface BirthdayTemplate {
    id?: number;
    language: WishLanguage;
    template_text: string;
    updated_at?: string;
}

export const LANGUAGE_LABELS: Record<WishLanguage, string> = {
    en: 'English',
    hi: 'हिन्दी',
    mr: 'मराठी',
};

export const LANGUAGE_FLAGS: Record<WishLanguage, string> = {
    en: '🇬🇧',
    hi: '🇮🇳',
    mr: '🇮🇳',
};

/**
 * Default birthday wish templates for each language.
 * Uses {{name}} and {{position}} as placeholders.
 */
export const DEFAULT_TEMPLATES: Record<WishLanguage, string> = {
    en: `🎂 *Happy Birthday, {{name}}!* 🎉

On behalf of *BJP Yavatmal District Committee*, we extend our warmest birthday wishes to you!

🪷 As *{{position}}*, your dedication and service to the people of Yavatmal is truly commendable.

May this special day bring you abundant joy, good health, and continued success in serving the nation.

🇮🇳 *Jai Hind! Jai Bharat!*

With warm regards,
*BJP Yavatmal District Committee*`,

    hi: `🎂 *जन्मदिन की हार्दिक शुभकामनाएँ, {{name}} जी!* 🎉

*भारतीय जनता पार्टी, यवतमाळ जिला समिति* की ओर से आपको जन्मदिन की बहुत-बहुत बधाई!

🪷 *{{position}}* के रूप में आपकी सेवा और समर्पण सराहनीय है।

ईश्वर से प्रार्थना है कि यह विशेष दिन आपके जीवन में ढेर सारी खुशियाँ, अच्छा स्वास्थ्य और सफलता लाए।

🇮🇳 *जय हिंद! जय भारत!*

सादर,
*भाजपा यवतमाळ जिला समिति*`,

    mr: `🎂 *वाढदिवसाच्या हार्दिक शुभेच्छा, {{name}}!* 🎉

*भारतीय जनता पार्टी, यवतमाळ जिल्हा समिती* तर्फे आपल्याला वाढदिवसाच्या मनःपूर्वक शुभेच्छा!

🪷 *{{position}}* म्हणून आपली सेवा आणि समर्पण खरोखरच कौतुकास्पद आहे।

या विशेष दिवशी तुम्हाला भरपूर आनंद, उत्तम आरोग्य आणि राष्ट्रसेवेत सतत यश मिळो अशी प्रार्थना!

🇮🇳 *जय हिंद! जय भारत! जय महाराष्ट्र!*

सप्रेम,
*भाजपा यवतमाळ जिल्हा समिती*`,
};

/**
 * Replace placeholders in template text with actual values.
 */
export function renderTemplate(
    template: string,
    name: string,
    position: string
): string {
    return template
        .replace(/\{\{name\}\}/g, name)
        .replace(/\{\{position\}\}/g, position || 'Member');
}

/**
 * Generate a WhatsApp URL with the given phone number and message.
 */
export function getWhatsAppUrl(phone: string, message: string): string {
    // Clean phone number - remove spaces, dashes, etc.
    let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

    // Add country code if not present
    if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('91')) {
        cleanPhone = '91' + cleanPhone;
    }
    if (cleanPhone.startsWith('+')) {
        cleanPhone = cleanPhone.substring(1);
    }

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
