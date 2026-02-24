import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Image,
    pdf,
    renderToBuffer,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import React from "react";

// Register Noto Sans Devanagari for Marathi text support
Font.register({
    family: "NotoSansDevanagari",
    fonts: [
        {
            src: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosansdevanagari/NotoSansDevanagari%5Bwdth%2Cwght%5D.ttf",
            fontWeight: 400,
        },
    ],
});

Font.register({
    family: "Roboto",
    fonts: [
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 },
    ],
});

const SAFFRON = "#FF6A00";

const styles = StyleSheet.create({
    page: {
        padding: 45,
        fontFamily: "Roboto",
        fontSize: 10,
        color: "#1a1a1a",
        position: "relative",
    },
    watermark: {
        position: "absolute",
        top: "45%",
        left: "15%",
        fontSize: 42,
        color: "#f0f0f0",
        transform: "rotate(-35deg)",
        opacity: 0.3,
        fontWeight: 300,
    },
    // Header
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
        paddingBottom: 10,
        borderBottomWidth: 2.5,
        borderBottomColor: SAFFRON,
    },
    logo: {
        width: 55,
        height: 55,
        marginRight: 14,
    },
    headerTextBlock: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 700,
        color: SAFFRON,
        letterSpacing: 0.8,
        marginBottom: 3,
    },
    headerSubtitle: {
        fontSize: 9,
        color: "#555",
        marginBottom: 2,
    },
    headerDevanagari: {
        fontSize: 10,
        fontFamily: "NotoSansDevanagari",
        color: SAFFRON,
    },
    // Section titles
    sectionTitle: {
        fontSize: 11,
        fontWeight: 700,
        color: "#333",
        marginBottom: 8,
        marginTop: 16,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    // Task info grid
    infoRow: {
        flexDirection: "row",
        marginBottom: 5,
    },
    infoLabel: {
        width: 130,
        fontSize: 9,
        fontWeight: 700,
        color: "#555",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    infoValue: {
        flex: 1,
        fontSize: 10,
        color: "#1a1a1a",
    },
    infoValueMarathi: {
        flex: 1,
        fontSize: 10,
        fontFamily: "NotoSansDevanagari",
        color: "#1a1a1a",
    },
    // Description
    descriptionText: {
        fontSize: 10,
        lineHeight: 1.7,
        color: "#333",
        marginTop: 4,
        marginBottom: 8,
        textAlign: "justify",
    },
    // Priority badge
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 9,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    // Members table
    table: {
        marginTop: 8,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f8f8f8",
        borderBottomWidth: 1.5,
        borderBottomColor: SAFFRON,
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderBottomColor: "#e8e8e8",
        paddingVertical: 5,
        paddingHorizontal: 8,
    },
    tableHeaderCell: {
        fontSize: 8,
        fontWeight: 700,
        color: "#555",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    tableCell: {
        fontSize: 9,
        color: "#333",
    },
    tableCellMarathi: {
        fontSize: 9,
        fontFamily: "NotoSansDevanagari",
        color: "#333",
    },
    colSr: { width: "8%" },
    colName: { width: "28%" },
    colPosition: { width: "24%" },
    colPhone: { width: "20%" },
    colEmail: { width: "20%" },
    // Footer
    footerSection: {
        marginTop: 35,
    },
    signatureLine: {
        width: 200,
        height: 1,
        backgroundColor: "#333",
        marginBottom: 5,
        marginTop: 50,
    },
    signatureLabel: {
        fontSize: 9,
        color: "#555",
        fontWeight: 700,
    },
    footerInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    footerText: {
        fontSize: 8,
        color: "#999",
    },
    footerBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 6,
        backgroundColor: SAFFRON,
    },
});

interface TaskPDFProps {
    task: {
        title: string;
        description: string;
        priority: string;
        start_date: string;
        due_date: string;
        reference_id: string;
        created_at: string;
    };
    targetPositions: string[];
    members: Array<{
        name: string;
        position: string;
        phone: string;
        email: string;
    }>;
}

const getPriorityStyle = (priority: string) => {
    switch (priority) {
        case "urgent":
            return { backgroundColor: "#fde2e2", color: "#c0392b" };
        case "high":
            return { backgroundColor: "#fef3e2", color: "#e67e22" };
        case "medium":
            return { backgroundColor: "#e8f4fd", color: "#2980b9" };
        case "low":
            return { backgroundColor: "#e8f8e8", color: "#27ae60" };
        default:
            return { backgroundColor: "#f0f0f0", color: "#555" };
    }
};

const formatDateSafe = (dateStr: string) => {
    try {
        return format(new Date(dateStr), "dd MMM yyyy");
    } catch {
        return dateStr || "—";
    }
};

// BJP logo as base64 data URL — we'll use a placeholder for server-side
const BJP_LOGO_URL = "/images/logos/bjp-logo.png";

export function TaskPDFDocument({ task, targetPositions, members }: TaskPDFProps) {
    const priorityStyle = getPriorityStyle(task.priority);
    const today = format(new Date(), "dd MMMM yyyy");

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Watermark */}
                <Text style={styles.watermark}>Generated by BGP Smart System</Text>

                {/* Header */}
                <View style={styles.headerContainer}>
                    <Image style={styles.logo} src={BJP_LOGO_URL} />
                    <View style={styles.headerTextBlock}>
                        <Text style={styles.headerTitle}>
                            BGP Smart Web-Based Task Assignment System
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Official Task Document — Yavatmal District Committee
                        </Text>
                        <Text style={styles.headerDevanagari}>
                            भारतीय जनता पार्टी — यवतमाळ जिल्हा कार्यकारिणी
                        </Text>
                    </View>
                </View>

                {/* Task Information Section */}
                <Text style={styles.sectionTitle}>Task Information</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Reference ID:</Text>
                    <Text style={styles.infoValue}>{task.reference_id}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Task Title:</Text>
                    <Text style={[styles.infoValue, { fontWeight: 700, fontSize: 11 }]}>{task.title}</Text>
                </View>

                {task.description && (
                    <>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Description:</Text>
                        </View>
                        <Text style={styles.descriptionText}>{task.description}</Text>
                    </>
                )}

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Priority:</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text
                            style={[
                                styles.priorityBadge,
                                { backgroundColor: priorityStyle.backgroundColor, color: priorityStyle.color },
                            ]}
                        >
                            {task.priority}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Assigned Committee:</Text>
                    <Text style={styles.infoValueMarathi}>
                        {targetPositions.join(", ")}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Start Date:</Text>
                    <Text style={styles.infoValue}>{formatDateSafe(task.start_date)}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Due Date:</Text>
                    <Text style={styles.infoValue}>{formatDateSafe(task.due_date)}</Text>
                </View>

                {/* Assigned Members Section */}
                {members.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>
                            Assigned Members ({members.length})
                        </Text>

                        <View style={styles.table}>
                            {/* Table Header */}
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderCell, styles.colSr]}>Sr.</Text>
                                <Text style={[styles.tableHeaderCell, styles.colName]}>Name</Text>
                                <Text style={[styles.tableHeaderCell, styles.colPosition]}>Position</Text>
                                <Text style={[styles.tableHeaderCell, styles.colPhone]}>Phone</Text>
                                <Text style={[styles.tableHeaderCell, styles.colEmail]}>Email</Text>
                            </View>

                            {/* Table Rows */}
                            {members.map((m, i) => (
                                <View key={i} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, styles.colSr]}>{i + 1}</Text>
                                    <Text style={[styles.tableCell, styles.colName]}>{m.name}</Text>
                                    <Text style={[styles.tableCellMarathi, styles.colPosition]}>{m.position}</Text>
                                    <Text style={[styles.tableCell, styles.colPhone]}>{m.phone || "—"}</Text>
                                    <Text style={[styles.tableCell, styles.colEmail]}>{m.email || "—"}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {/* Footer / Signature Section */}
                <View style={styles.footerSection}>
                    <Text style={{ fontSize: 9, color: "#555" }}>Authorized Signature:</Text>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureLabel}>District President</Text>
                    <Text style={{ fontSize: 8, color: "#777" }}>
                        BJP Yavatmal District Committee
                    </Text>
                </View>

                <View style={styles.footerInfo}>
                    <Text style={styles.footerText}>Date of Issue: {today}</Text>
                    <Text style={styles.footerText}>Ref: {task.reference_id}</Text>
                    <Text style={styles.footerText}>
                        Generated by BGP Smart System
                    </Text>
                </View>

                <View style={styles.footerBar} />
            </Page>
        </Document>
    );
}

export interface TaskPDFInput {
    task: {
        title: string;
        description: string;
        priority: string;
        start_date: string;
        due_date: string;
        reference_id: string;
        created_at: string;
    };
    targetPositions: string[];
    members: Array<{
        name: string;
        position: string;
        phone: string;
        email: string;
    }>;
}

/**
 * Server-side: render PDF to Buffer
 */
export async function renderTaskPDFToBuffer(input: TaskPDFInput): Promise<Buffer> {
    const element = React.createElement(TaskPDFDocument, input);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return renderToBuffer(element as any);
}

/**
 * Client-side: generate PDF blob for download
 */
export async function generateTaskPDFBlob(input: TaskPDFInput): Promise<Blob> {
    const element = React.createElement(TaskPDFDocument, input);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return pdf(element as any).toBlob();
}

export default TaskPDFDocument;
