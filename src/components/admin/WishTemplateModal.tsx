"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, RotateCcw, Eye, EyeOff, Info } from "lucide-react";
import {
    type WishLanguage,
    LANGUAGE_LABELS,
    LANGUAGE_FLAGS,
    DEFAULT_TEMPLATES,
    renderTemplate,
} from "@/lib/birthdayTemplates";
import toast from "react-hot-toast";

interface WishTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
}

const LANGUAGES: WishLanguage[] = ["en", "hi", "mr"];

export default function WishTemplateModal({ isOpen, onClose, onSaved }: WishTemplateModalProps) {
    const [activeLang, setActiveLang] = useState<WishLanguage>("en");
    const [templates, setTemplates] = useState<Record<string, string>>({
        en: DEFAULT_TEMPLATES.en,
        hi: DEFAULT_TEMPLATES.hi,
        mr: DEFAULT_TEMPLATES.mr,
    });
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchTemplates = useCallback(async () => {
        setLoading(true);
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
            toast.error("Failed to load templates");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchTemplates();
        }
    }, [isOpen, fetchTemplates]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/birthday-templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language: activeLang,
                    template_text: templates[activeLang],
                }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`${LANGUAGE_LABELS[activeLang]} template saved!`);
                onSaved();
            } else {
                toast.error(data.error || "Failed to save template");
            }
        } catch {
            toast.error("Failed to save template");
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setTemplates((prev) => ({
            ...prev,
            [activeLang]: DEFAULT_TEMPLATES[activeLang],
        }));
        toast.success("Reset to default template");
    };

    const previewText = renderTemplate(templates[activeLang], "प्रकाश शर्मा", "जिल्हा उपाध्यक्ष");

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-saffron/5 to-transparent">
                        <div>
                            <h2 className="text-lg font-bebas text-slate-900 tracking-[0.1em]">
                                BIRTHDAY WISH TEMPLATE
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Customize birthday messages for WhatsApp & letters
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-all"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Language tabs */}
                    <div className="px-6 pt-4 flex gap-1 bg-slate-50 border-b border-slate-200">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setActiveLang(lang)}
                                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all border-b-2 ${activeLang === lang
                                        ? "bg-white text-saffron border-saffron shadow-sm"
                                        : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-white/50"
                                    }`}
                            >
                                <span className="text-base">{LANGUAGE_FLAGS[lang]}</span>
                                {LANGUAGE_LABELS[lang]}
                            </button>
                        ))}
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        {/* Placeholder info */}
                        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-blue-700 leading-relaxed">
                                <p className="font-medium mb-1">Available Placeholders:</p>
                                <p>
                                    <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-800 font-mono">{"{{name}}"}</code> — Member&apos;s name &nbsp;|&nbsp;
                                    <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-800 font-mono">{"{{position}}"}</code> — Member&apos;s position
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
                        ) : (
                            <>
                                {/* Editor */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Template Message ({LANGUAGE_LABELS[activeLang]})
                                    </label>
                                    <textarea
                                        value={templates[activeLang]}
                                        onChange={(e) =>
                                            setTemplates((prev) => ({
                                                ...prev,
                                                [activeLang]: e.target.value,
                                            }))
                                        }
                                        rows={10}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-saffron/30 focus:border-saffron outline-none resize-none transition-all font-mono leading-relaxed"
                                        placeholder="Type your birthday wish template here..."
                                    />
                                </div>

                                {/* Preview toggle */}
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-all"
                                >
                                    {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
                                    {showPreview ? "Hide Preview" : "Show Preview"}
                                </button>

                                <AnimatePresence>
                                    {showPreview && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-2">
                                                    WhatsApp Preview
                                                </p>
                                                <div className="bg-white border border-green-100 rounded-lg p-3 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed shadow-sm">
                                                    {previewText}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-all"
                        >
                            <RotateCcw size={12} />
                            Reset to Default
                        </button>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold bg-saffron text-white hover:bg-saffron/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <Save size={13} />
                                {saving ? "Saving..." : "Save Template"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
