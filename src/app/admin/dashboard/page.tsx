"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Bell, PartyPopper } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import DashboardStats from "@/components/admin/DashboardStats";
import BirthdayNotificationCard from "@/components/admin/BirthdayNotificationCard";
import { type MemberWithDaysLeft } from "@/lib/birthday";
import toast from "react-hot-toast";

export default function DashboardPage() {
    const [upcoming, setUpcoming] = useState<MemberWithDaysLeft[]>([]);
    const [stats, setStats] = useState({
        totalMembers: 0,
        birthdaysToday: 0,
        birthdaysThisWeek: 0,
        totalImages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [pdfLoading, setPdfLoading] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const [birthdayRes, membersRes, galleryRes] = await Promise.all([
                fetch("/api/birthdays"),
                fetch("/api/members"),
                fetch("/api/gallery"),
            ]);

            const birthdayData = await birthdayRes.json();
            const membersData = await membersRes.json();
            const galleryData = await galleryRes.json();

            const upcomingList: MemberWithDaysLeft[] = birthdayData.data || [];
            setUpcoming(upcomingList);

            setStats({
                totalMembers: membersData.data?.length || 0,
                birthdaysToday: upcomingList.filter((m) => m.daysLeft === 0).length,
                birthdaysThisWeek: upcomingList.length,
                totalImages: galleryData.data?.length || 0,
            });
        } catch {
            // Silently fail — data will show as 0
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Poll every 60s
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleGenerateLetter = async (member: MemberWithDaysLeft) => {
        setPdfLoading(member.id);
        try {
            const { downloadBirthdayPDF } = await import(
                "@/components/admin/BirthdayLetterPDF"
            );
            await downloadBirthdayPDF(member.name, member.position, member.birth_date);
            toast.success(`Letter generated for ${member.name}`);
        } catch {
            toast.error("Failed to generate letter");
        } finally {
            setPdfLoading(null);
        }
    };

    const todayBirthdays = upcoming.filter((m) => m.daysLeft === 0);
    const upcomingBirthdays = upcoming.filter((m) => m.daysLeft > 0);

    return (
        <>
            <AdminNavbar
                title="Dashboard"
                notificationCount={upcoming.length}
            />

            <main className="p-5 lg:p-8 space-y-8">
                {/* Stats */}
                <DashboardStats stats={stats} />

                {/* Today's Birthdays */}
                {todayBirthdays.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-saffron/5 to-transparent p-6">
                            {/* Confetti dots */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                {[...Array(20)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-1.5 h-1.5 rounded-full animate-bounce"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                            backgroundColor: ['#FF6A00', '#138808', '#FFD700', '#FF4500', '#00CED1'][i % 5],
                                            animationDelay: `${Math.random() * 2}s`,
                                            animationDuration: `${1.5 + Math.random() * 2}s`,
                                            opacity: 0.6,
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center gap-2 mb-5">
                                <PartyPopper className="text-amber-400" size={22} />
                                <h2 className="text-xl font-bebas text-amber-400 tracking-[0.12em]">
                                    TODAY&apos;S BIRTHDAYS
                                </h2>
                                <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {todayBirthdays.length}
                                </span>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {todayBirthdays.map((member, i) => (
                                    <BirthdayNotificationCard
                                        key={member.id}
                                        member={member}
                                        index={i}
                                        onGenerateLetter={handleGenerateLetter}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* Upcoming Birthdays */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center gap-2 mb-5">
                        <Bell className="text-saffron" size={20} />
                        <h2 className="text-xl font-bebas text-slate-900 tracking-[0.12em]">
                            UPCOMING BIRTHDAYS
                        </h2>
                        {upcomingBirthdays.length > 0 && (
                            <span className="bg-saffron/20 text-saffron text-xs font-bold px-2 py-0.5 rounded-full">
                                {upcomingBirthdays.length}
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-slate-100 border border-slate-200 rounded-xl p-5 animate-pulse h-28"
                                />
                            ))}
                        </div>
                    ) : upcomingBirthdays.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {upcomingBirthdays.map((member, i) => (
                                <BirthdayNotificationCard
                                    key={member.id}
                                    member={member}
                                    index={i}
                                    onGenerateLetter={handleGenerateLetter}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-10 text-center">
                            <p className="text-slate-500 text-sm">
                                No upcoming birthdays in the next 6 days
                            </p>
                        </div>
                    )}
                </motion.section>

                {/* Spacer for mobile bottom nav */}
                <div className="h-4" />
            </main>
        </>
    );
}
