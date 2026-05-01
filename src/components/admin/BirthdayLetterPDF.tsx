"use client";

import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    pdf,
    Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Register a basic font for the PDF
Font.register({
    family: "Roboto",
    fonts: [
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 },
    ],
});

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: "Roboto",
        fontSize: 12,
        color: "#1a1a1a",
    },
    header: {
        textAlign: "center",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 700,
        color: "#FF6A00",
        marginBottom: 4,
        letterSpacing: 1,
    },
    headerSubtitle: {
        fontSize: 11,
        color: "#555",
        marginBottom: 2,
    },
    devanagariTitle: {
        fontSize: 14,
        color: "#FF6A00",
        marginBottom: 6,
    },
    divider: {
        width: "100%",
        height: 2,
        backgroundColor: "#FF6A00",
        marginVertical: 15,
    },
    thinDivider: {
        width: "100%",
        height: 1,
        backgroundColor: "#e0e0e0",
        marginVertical: 12,
    },
    dateText: {
        fontSize: 11,
        color: "#666",
        marginBottom: 20,
        textAlign: "right",
    },
    // ── Envelope-ready address block ──────────────────────────────
    envelopeAddressBox: {
        marginBottom: 24,
        padding: 12,
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 4,
        backgroundColor: "#f9fafb",
    },
    envelopeLabel: {
        fontSize: 8,
        color: "#9ca3af",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 6,
    },
    envelopeTo: {
        fontSize: 11,
        color: "#6b7280",
        marginBottom: 4,
    },
    envelopeName: {
        fontSize: 13,
        fontWeight: 700,
        color: "#111827",
        marginBottom: 3,
    },
    envelopePosition: {
        fontSize: 11,
        color: "#374151",
        marginBottom: 2,
    },
    envelopeOrg: {
        fontSize: 11,
        color: "#374151",
    },
    // ──────────────────────────────────────────────────────────────
    bodyText: {
        fontSize: 12,
        lineHeight: 1.8,
        marginBottom: 10,
        textAlign: "justify",
    },
    boldText: {
        fontWeight: 700,
    },
    subject: {
        fontSize: 12,
        fontWeight: 700,
        marginBottom: 15,
        textDecoration: "underline",
    },
    greeting: {
        fontSize: 13,
        color: "#FF6A00",
        fontWeight: 700,
        marginVertical: 12,
        textAlign: "center",
    },
    signatureBlock: {
        marginTop: 40,
    },
    signatureLine: {
        width: 200,
        height: 1,
        backgroundColor: "#333",
        marginBottom: 5,
        marginTop: 30,
    },
    signerName: {
        fontSize: 13,
        fontWeight: 700,
        color: "#111827",
        marginBottom: 2,
    },
    signerTitle: {
        fontSize: 11,
        color: "#374151",
        marginBottom: 1,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 8,
        backgroundColor: "#FF6A00",
    },
    footerText: {
        position: "absolute",
        bottom: 15,
        left: 50,
        right: 50,
        textAlign: "center",
        fontSize: 8,
        color: "#999",
    },
});

interface LetterProps {
    memberName: string;
    position: string;
    birthDate: string;
    memberAddress?: string;
}

function BirthdayLetterDocument({ memberName, position, memberAddress }: LetterProps) {
    const today = format(new Date(), "dd MMMM yyyy");
    const honorific = "Shri/Smt.";

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.devanagariTitle}>
                        भारतीय जनता पार्टी — यवतमाळ जिल्हा
                    </Text>
                    <Text style={styles.headerTitle}>BJP YAVATMAL DISTRICT</Text>
                    <Text style={styles.headerSubtitle}>
                        Bharatiya Janata Party — Yavatmal District
                    </Text>
                </View>

                <View style={styles.divider} />

                {/* Date */}
                <Text style={styles.dateText}>Date: {today}</Text>

                {/* Envelope-Ready Address Block */}
                <View style={styles.envelopeAddressBox}>
                    <Text style={styles.envelopeLabel}>Recipient Address (for Envelope)</Text>
                    <Text style={styles.envelopeTo}>To,</Text>
                    <Text style={styles.envelopeName}>
                        {honorific} {memberName}
                    </Text>
                    {position && <Text style={styles.envelopePosition}>{position}</Text>}
                    {memberAddress ? (
                        <Text style={styles.envelopeOrg}>{memberAddress}</Text>
                    ) : (
                        <Text style={styles.envelopeOrg}>BJP Yavatmal</Text>
                    )}
                </View>

                {/* Subject */}
                <Text style={styles.subject}>Subject: Birthday Greetings</Text>

                {/* Body */}
                <Text style={styles.bodyText}>
                    Dear {honorific} {memberName},
                </Text>

                <Text style={styles.bodyText}>
                    On behalf of the BJP Yavatmal District, we extend our
                    warmest and most heartfelt birthday greetings to you on this special
                    occasion. Your dedication, tireless service, and unwavering commitment
                    to the people of Yavatmal is truly commendable and inspires us all.
                </Text>

                <Text style={styles.greeting}>
                    आपल्या वाढदिवसाच्या हार्दिक शुभेच्छा!
                </Text>

                <Text style={styles.bodyText}>
                    May this birthday bring you abundant joy, excellent health, and
                    continued success in your noble service to the nation and the
                    people of Yavatmal district. We are grateful for your invaluable
                    contributions to our party and the community.
                </Text>

                <Text style={styles.greeting}>जय भारत! जय महाराष्ट्र!</Text>

                {/* Signature */}
                <View style={styles.signatureBlock}>
                    <Text>Yours sincerely,</Text>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signerName}>Advocate Praful Singh Chauhan</Text>
                    <Text style={styles.signerTitle}>Jilladhyaksha, BJP Yavatmal</Text>
                </View>

                {/* Footer */}
                <Text style={styles.footerText}>
                    BJP Yavatmal District | Yavatmal, Maharashtra, India
                </Text>
                <View style={styles.footer} />
            </Page>
        </Document>
    );
}

export async function generateBirthdayPDF(
    memberName: string,
    position: string,
    birthDate: string,
    memberAddress?: string
): Promise<Blob> {
    const doc = (
        <BirthdayLetterDocument
            memberName={memberName}
            position={position}
            birthDate={birthDate}
            memberAddress={memberAddress}
        />
    );
    const blob = await pdf(doc).toBlob();
    return blob;
}

export async function downloadBirthdayPDF(
    memberName: string,
    position: string,
    birthDate: string,
    memberAddress?: string
) {
    const blob = await generateBirthdayPDF(memberName, position, birthDate, memberAddress);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Birthday_Wish_${memberName.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Share generated PDF via WhatsApp Web
 * Note: WhatsApp Web does not support direct file attachment via URL scheme.
 * This opens a WhatsApp chat with a message. For actual file sharing,
 * users should download and send manually, or use WhatsApp Business API.
 */
export async function shareLetterViaWhatsApp(
    memberName: string,
    position: string,
    birthDate: string,
    phone: string,
    customMessage?: string,
    memberAddress?: string
) {
    // Download the PDF first
    await downloadBirthdayPDF(memberName, position, birthDate, memberAddress);

    // Then open WhatsApp with a message
    const message = customMessage ||
        `🎂 *Happy Birthday, ${memberName}!*\n\nPlease find the attached birthday greeting letter from BJP Yavatmal District.\n\n— Advocate Praful Singh Chauhan\nJilladhyaksha, BJP Yavatmal\n\n🪷 जय भारत! जय महाराष्ट्र!`;

    let cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    if (!cleanPhone.startsWith("+") && !cleanPhone.startsWith("91")) {
        cleanPhone = "91" + cleanPhone;
    }
    if (cleanPhone.startsWith("+")) {
        cleanPhone = cleanPhone.substring(1);
    }

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMsg}`, "_blank");
}

export default BirthdayLetterDocument;
