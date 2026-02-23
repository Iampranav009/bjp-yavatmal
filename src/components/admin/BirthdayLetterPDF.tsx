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
    addressBlock: {
        marginBottom: 20,
        lineHeight: 1.6,
    },
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
}

function BirthdayLetterDocument({ memberName, position }: LetterProps) {
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
                    <Text style={styles.headerTitle}>BJP YAVATMAL DISTRICT COMMITTEE</Text>
                    <Text style={styles.headerSubtitle}>
                        Bharatiya Janata Party — Yavatmal District
                    </Text>
                </View>

                <View style={styles.divider} />

                {/* Date */}
                <Text style={styles.dateText}>Date: {today}</Text>

                {/* Address */}
                <View style={styles.addressBlock}>
                    <Text>To,</Text>
                    <Text style={styles.boldText}>
                        {honorific} {memberName}
                    </Text>
                    {position && <Text>{position}</Text>}
                    <Text>BJP Yavatmal</Text>
                </View>

                {/* Subject */}
                <Text style={styles.subject}>Subject: Birthday Greetings</Text>

                {/* Body */}
                <Text style={styles.bodyText}>
                    Dear {honorific} {memberName},
                </Text>

                <Text style={styles.bodyText}>
                    On behalf of the BJP Yavatmal District Committee, we extend our
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

                <Text style={styles.greeting}>जय हिंद! जय भारत! जय महाराष्ट्र!</Text>

                {/* Signature */}
                <View style={styles.signatureBlock}>
                    <Text>Yours sincerely,</Text>
                    <View style={styles.signatureLine} />
                    <Text style={styles.boldText}>District President</Text>
                    <Text>BJP Yavatmal District Committee</Text>
                </View>

                {/* Footer */}
                <Text style={styles.footerText}>
                    BJP Yavatmal District Committee | Yavatmal, Maharashtra, India
                </Text>
                <View style={styles.footer} />
            </Page>
        </Document>
    );
}

export async function generateBirthdayPDF(
    memberName: string,
    position: string,
    birthDate: string
): Promise<Blob> {
    const doc = (
        <BirthdayLetterDocument
            memberName={memberName}
            position={position}
            birthDate={birthDate}
        />
    );
    const blob = await pdf(doc).toBlob();
    return blob;
}

export async function downloadBirthdayPDF(
    memberName: string,
    position: string,
    birthDate: string
) {
    const blob = await generateBirthdayPDF(memberName, position, birthDate);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Birthday_Wish_${memberName.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export default BirthdayLetterDocument;
