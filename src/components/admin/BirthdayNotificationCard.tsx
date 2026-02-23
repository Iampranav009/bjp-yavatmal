"use client";

import { motion } from "framer-motion";
import { Phone, Calendar, FileText } from "lucide-react";
import { getBirthdayColor, type MemberWithDaysLeft } from "@/lib/birthday";
import { format } from "date-fns";

interface BirthdayNotificationCardProps {
    member: MemberWithDaysLeft;
    index: number;
    onGenerateLetter: (member: MemberWithDaysLeft) => void;
}

export default function BirthdayNotificationCard({
    member,
    index,
    onGenerateLetter,
}: BirthdayNotificationCardProps) {
    const colors = getBirthdayColor(member.daysLeft);
    const birthDate = new Date(member.birth_date);
    const displayDate = format(
        new Date(new Date().getFullYear(), birthDate.getMonth(), birthDate.getDate()),
        "dd MMMM"
    );

    const initials = member.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className={`${colors.bg} border ${colors.border} rounded-xl p-5 hover:border-opacity-60 transition-all duration-300`}
        >
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {member.photo_url ? (
                        <img
                            src={member.photo_url}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                        />
                    ) : (
                        <div className={`w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm border-2 border-slate-300`}>
                            {initials}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="text-slate-900 font-semibold text-sm truncate">
                                🎂 {member.name}
                            </h3>
                            {member.position && (
                                <p className="text-slate-500 text-xs mt-0.5 truncate">
                                    {member.position}
                                </p>
                            )}
                        </div>
                        <span
                            className={`${colors.badge} text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${member.daysLeft <= 1 ? "animate-pulse" : ""
                                }`}
                        >
                            {member.daysLeft === 0
                                ? "TODAY!"
                                : `${member.daysLeft} DAY${member.daysLeft > 1 ? "S" : ""}`}
                        </span>
                    </div>

                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2.5 text-xs text-slate-500">
                        {member.mobile && (
                            <span className="flex items-center gap-1">
                                <Phone size={11} />
                                {member.mobile}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {displayDate}
                        </span>
                    </div>

                    {/* Generate Letter button */}
                    <div className="mt-3 flex justify-end">
                        <button
                            onClick={() => onGenerateLetter(member)}
                            className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-saffron/10 border border-saffron/20 text-saffron hover:bg-saffron/20 transition-all"
                        >
                            <FileText size={12} />
                            Generate Letter
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
