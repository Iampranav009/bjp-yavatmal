"use client";

import { X, Copy, Check, Facebook, Twitter } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../lib/LanguageContext";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("");
    const { t } = useLanguage();
    const nav = t("navbar");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentUrl(window.location.href);
        }
    }, [isOpen]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const shareOnWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(currentUrl)}`, "_blank");
    };

    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, "_blank");
    };

    const shareOnTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`, "_blank");
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6">
                            <div className="flex flex-col items-center gap-3 mb-6 mt-2">
                                <div className="relative w-16 h-16">
                                    <Image
                                        src="/images/logos/bjp-logo.png"
                                        alt="BJP Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-['Tiro_Devanagari_Hindi'] text-xl text-saffron leading-none font-bold mb-1">
                                        {nav.logoLine1}
                                    </h3>
                                    <p className="font-['Tiro_Devanagari_Hindi'] text-sm text-slate-800 leading-none">
                                        {nav.logoLine2 || "Yavatmal"}
                                    </p>
                                </div>
                            </div>

                            <p className="text-center text-sm text-slate-600 mb-5 font-medium">
                                Share this page on social media
                            </p>

                            <div className="flex justify-center gap-4 mb-6">
                                <button
                                    onClick={shareOnWhatsApp}
                                    className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
                                    title="Share on WhatsApp"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={shareOnFacebook}
                                    className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                                    title="Share on Facebook"
                                >
                                    <Facebook size={24} />
                                </button>
                                <button
                                    onClick={shareOnTwitter}
                                    className="w-12 h-12 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center hover:bg-slate-800 hover:text-white transition-colors"
                                    title="Share on X / Twitter"
                                >
                                    <Twitter size={24} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                                <div className="flex-1 overflow-hidden px-1">
                                    <p className="text-xs text-slate-600 truncate select-all">
                                        {currentUrl}
                                    </p>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-saffron hover:border-saffron rounded shadow-sm text-xs font-semibold transition-colors"
                                >
                                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
