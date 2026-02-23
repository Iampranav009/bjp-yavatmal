"use client";

import { motion } from "framer-motion";
import { Users, Cake, CalendarDays, ImageIcon } from "lucide-react";

interface StatsData {
    totalMembers: number;
    birthdaysToday: number;
    birthdaysThisWeek: number;
    totalImages: number;
}

export default function DashboardStats({ stats }: { stats: StatsData }) {
    const cards = [
        {
            label: "Total Members",
            value: stats.totalMembers,
            icon: Users,
            color: "text-saffron",
            bg: "bg-saffron/10",
            iconBg: "bg-saffron/15",
        },
        {
            label: "Birthdays Today",
            value: stats.birthdaysToday,
            icon: Cake,
            color: "text-india-green",
            bg: "bg-india-green/10",
            iconBg: "bg-india-green/15",
        },
        {
            label: "This Week (7d)",
            value: stats.birthdaysThisWeek,
            icon: CalendarDays,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            iconBg: "bg-blue-500/15",
        },
        {
            label: "Images Uploaded",
            value: stats.totalImages,
            icon: ImageIcon,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            iconBg: "bg-purple-500/15",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {cards.map((card, i) => (
                <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className={`${card.bg} border border-slate-200 rounded-xl p-5 lg:p-6 hover:border-slate-200 transition-all duration-300 hover:-translate-y-0.5`}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                            <card.icon size={20} className={card.color} />
                        </div>
                    </div>
                    <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-[0.12em] mb-1 font-dm">
                        {card.label}
                    </p>
                    <p className="text-3xl lg:text-4xl font-bebas text-slate-900 tracking-wider">
                        {card.value.toLocaleString()}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}
