"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Calendar, FileText, MessageCircle, ChevronDown, Globe } from "lucide-react";
import { getBirthdayColor, type MemberWithDaysLeft } from "@/lib/birthday";
import {
    type WishLanguage,
    LANGUAGE_LABELS,
    LANGUAGE_FLAGS,
    DEFAULT_TEMPLATES,
    renderTemplate,
    getWhatsAppUrl,
} from "@/lib/birthdayTemplates";
import { format } from "date-fns";

interface BirthdayNotificationCardProps {
    member: MemberWithDaysLeft;
    index: number;
    onGenerateLetter: (member: MemberWithDaysLeft, language: WishLanguage) => void;
    templates?: Record<string, string>;
}

const LANGUAGES: WishLanguage[] = ["en", "hi", "mr"];

export default function BirthdayNotificationCard({
    member,
    index,
    onGenerateLetter,
    templates,
}: BirthdayNotificationCardProps) {
    const [selectedLang, setSelectedLang] = useState<WishLanguage>("mr");
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

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

    const handleWhatsApp = () => {
        if (!member.mobile) return;
        const templateText = templates?.[selectedLang] || DEFAULT_TEMPLATES[selectedLang];
        const message = renderTemplate(templateText, member.name, member.position);
        const url = getWhatsAppUrl(member.mobile, message);
        window.open(url, "_blank");
    };

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

                    {/* Action buttons row */}
                    <div className="mt-3 flex items-center justify-end gap-2 flex-wrap">
                        {/* Language selector */}
                        <div className="relative">
                            <button
                                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                onBlur={() => setTimeout(() => setLangDropdownOpen(false), 150)}
                                className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition-all"
                            >
                                <Globe size={12} />
                                <span>{LANGUAGE_FLAGS[selectedLang]} {LANGUAGE_LABELS[selectedLang]}</span>
                                <ChevronDown size={10} className={`transition-transform ${langDropdownOpen ? "rotate-180" : ""}`} />
                            </button>
                            <AnimatePresence>
                                {langDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bottom-full mb-1 left-0 bg-white border border-slate-200 rounded-lg shadow-lg z-30 overflow-hidden min-w-[130px]"
                                    >
                                        {LANGUAGES.map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => {
                                                    setSelectedLang(lang);
                                                    setLangDropdownOpen(false);
                                                }}
                                                className={`flex items-center gap-2 w-full px-3 py-2 text-[11px] font-medium transition-all ${selectedLang === lang
                                                        ? "bg-saffron/10 text-saffron"
                                                        : "text-slate-600 hover:bg-slate-50"
                                                    }`}
                                            >
                                                <span>{LANGUAGE_FLAGS[lang]}</span>
                                                <span>{LANGUAGE_LABELS[lang]}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* WhatsApp button */}
                        {member.mobile && (
                            <button
                                onClick={handleWhatsApp}
                                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 hover:bg-green-500/20 transition-all"
                                title="Send WhatsApp Wish"
                            >
                                <MessageCircle size={12} />
                                WhatsApp
                            </button>
                        )}

                        {/* Generate Letter button */}
                        <button
                            onClick={() => onGenerateLetter(member, selectedLang)}
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
