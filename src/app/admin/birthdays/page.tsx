"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Cake, Calendar, PartyPopper } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import BirthdayNotificationCard from "@/components/admin/BirthdayNotificationCard";
import WishTemplateModal from "@/components/admin/WishTemplateModal";
import { MemberWithDaysLeft, type MemberBirthday, getMembersByMonth } from "@/lib/birthday";
import { type WishLanguage, DEFAULT_TEMPLATES } from "@/lib/birthdayTemplates";
import toast from "react-hot-toast";
import { format } from "date-fns";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

export default function BirthdaysPage() {
    const [tab, setTab] = useState<"upcoming" | "today" | "all">("upcoming");
    const [upcoming, setUpcoming] = useState<MemberWithDaysLeft[]>([]);
    const [allMembers, setAllMembers] = useState<MemberBirthday[]>([]);
    const [loading, setLoading] = useState(true);
    const [templateModalOpen, setTemplateModalOpen] = useState(false);
    const [templates, setTemplates] = useState<Record<string, string>>({
        en: DEFAULT_TEMPLATES.en,
        hi: DEFAULT_TEMPLATES.hi,
        mr: DEFAULT_TEMPLATES.mr,
    });

    const fetchData = useCallback(async () => {
        try {
            const [bdRes, memRes] = await Promise.all([
                fetch("/api/birthdays"), fetch("/api/members"),
            ]);
            const bdData = await bdRes.json();
            const memData = await memRes.json();
            setUpcoming(bdData.data || []);
            setAllMembers(memData.data || []);
        } catch { toast.error("Failed to load data"); }
        finally { setLoading(false); }
    }, []);

    const fetchTemplates = useCallback(async () => {
        try {
            const res = await fetch("/api/birthday-templates");
            const data = await res.json();
            if (data.data) {
                const newTemplates: Record<string, string> = { ...DEFAULT_TEMPLATES };
                for (const t of data.data) {
                    newTemplates[t.language] = t.template_text;
                }
                setTemplates(newTemplates);
            }
        } catch {
            // Use defaults silently
        }
    }, []);

    useEffect(() => { fetchData(); fetchTemplates(); }, [fetchData, fetchTemplates]);

    const handleGenerateLetter = async (member: MemberWithDaysLeft, _language?: WishLanguage) => {
        try {
            const { downloadBirthdayPDF } = await import("@/components/admin/BirthdayLetterPDF");
            await downloadBirthdayPDF(member.name, member.position, member.birth_date);
            toast.success(`Letter generated for ${member.name}`);
        } catch { toast.error("Failed to generate letter"); }
    };

    const todayBirthdays = upcoming.filter((m) => m.daysLeft === 0);
    const upcomingOnly = upcoming.filter((m) => m.daysLeft > 0);

    const tabs = [
        { id: "upcoming" as const, label: "Upcoming (6d)", count: upcomingOnly.length },
        { id: "today" as const, label: "Today", count: todayBirthdays.length },
        { id: "all" as const, label: "All by Month", count: null },
    ];

    return (
        <>
            <AdminNavbar
                title="Birthdays"
                notificationCount={upcoming.length}
                showWishTemplateButton={true}
                onWishTemplateClick={() => setTemplateModalOpen(true)}
            />
            <main className="p-5 lg:p-8 space-y-6">
                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1.5 w-fit">
                    {tabs.map((t) => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-saffron/15 text-saffron" : "text-slate-500 hover:text-slate-700"
                                }`}>
                            {t.label}
                            {t.count !== null && t.count > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === t.id ? "bg-saffron/20 text-saffron" : "bg-slate-200 text-slate-500"
                                    }`}>{t.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-slate-100 border border-slate-200 rounded-xl p-5 animate-pulse h-28" />
                        ))}
                    </div>
                ) : (
                    <>
                        {tab === "upcoming" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {upcomingOnly.length > 0 ? (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {upcomingOnly.map((m, i) => (
                                            <BirthdayNotificationCard
                                                key={m.id}
                                                member={m}
                                                index={i}
                                                onGenerateLetter={handleGenerateLetter}
                                                templates={templates}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
                                        <Calendar className="text-slate-300 mx-auto mb-3" size={40} />
                                        <p className="text-slate-500 text-sm">No upcoming birthdays in the next 6 days</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {tab === "today" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {todayBirthdays.length > 0 ? (
                                    <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-saffron/5 to-transparent p-6">
                                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                            {[...Array(20)].map((_, i) => (
                                                <div key={i} className="absolute w-1.5 h-1.5 rounded-full animate-bounce"
                                                    style={{
                                                        left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                                                        backgroundColor: ['#FF6A00', '#138808', '#FFD700', '#FF4500', '#00CED1'][i % 5],
                                                        animationDelay: `${Math.random() * 2}s`, animationDuration: `${1.5 + Math.random() * 2}s`, opacity: 0.6
                                                    }} />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 mb-5">
                                            <PartyPopper className="text-amber-400" size={22} />
                                            <h2 className="text-xl font-bebas text-amber-400 tracking-[0.12em]">TODAY&apos;S BIRTHDAYS</h2>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            {todayBirthdays.map((m, i) => (
                                                <BirthdayNotificationCard
                                                    key={m.id}
                                                    member={m}
                                                    index={i}
                                                    onGenerateLetter={handleGenerateLetter}
                                                    templates={templates}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
                                        <Cake className="text-slate-300 mx-auto mb-3" size={40} />
                                        <p className="text-slate-500 text-sm">No birthdays today</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {tab === "all" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                {MONTHS.map((month, idx) => {
                                    const monthMembers = getMembersByMonth(allMembers, idx + 1);
                                    if (!monthMembers.length) return null;
                                    return (
                                        <div key={month} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                                <h3 className="font-bebas text-slate-900 tracking-[0.1em]">{month.toUpperCase()}</h3>
                                                <span className="text-slate-500 text-xs">{monthMembers.length}</span>
                                            </div>
                                            <div className="divide-y divide-slate-100">
                                                {monthMembers.map((m) => (
                                                    <div key={m.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-[10px] font-bold flex-shrink-0">
                                                                {m.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-slate-900 text-sm font-medium truncate">{m.name}</p>
                                                                <p className="text-slate-500 text-xs truncate">{m.position}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-slate-500 text-xs">{format(new Date(m.birth_date), "dd MMM")}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </>
                )}
                <div className="h-4" />
            </main>

            {/* Wish Template Modal */}
            <WishTemplateModal
                isOpen={templateModalOpen}
                onClose={() => setTemplateModalOpen(false)}
                onSaved={() => fetchTemplates()}
            />
        </>
    );
}
