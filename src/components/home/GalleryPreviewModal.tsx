"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import ShareButtons from "@/components/shared/ShareButtons";

export interface GalleryItem {
    id: number;
    title: string;
    file_url: string;
    post_title?: string;
    post_description?: string;
    post_link?: string;
    category?: string;
    uploaded_at?: string;
}

interface GalleryPreviewModalProps {
    items: GalleryItem[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onIndexChange: (index: number) => void;
}

export default function GalleryPreviewModal({
    items,
    currentIndex,
    isOpen,
    onClose,
    onIndexChange,
}: GalleryPreviewModalProps) {
    const [imgLoading, setImgLoading] = useState(true);

    const item = items[currentIndex];

    const goNext = useCallback(() => {
        if (currentIndex < items.length - 1) {
            onIndexChange(currentIndex + 1);
            setImgLoading(true);
        }
    }, [currentIndex, items.length, onIndexChange]);

    const goPrev = useCallback(() => {
        if (currentIndex > 0) {
            onIndexChange(currentIndex - 1);
            setImgLoading(true);
        }
    }, [currentIndex, onIndexChange]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose, goNext, goPrev]);

    if (!isOpen || !item) return null;

    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${item.file_url}` : item.file_url;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Left - Image */}
                    <div className="flex-1 relative bg-slate-900 min-h-[300px] md:min-h-[500px] flex items-center justify-center">
                        {imgLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            </div>
                        )}
                        <img
                            src={item.file_url}
                            alt={item.post_title || item.title}
                            className="w-full h-full object-contain max-h-[70vh]"
                            onLoad={() => setImgLoading(false)}
                        />

                        {/* Navigation arrows */}
                        {currentIndex > 0 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-all backdrop-blur-sm"
                            >
                                <ChevronLeft size={22} />
                            </button>
                        )}
                        {currentIndex < items.length - 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); goNext(); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-all backdrop-blur-sm"
                            >
                                <ChevronRight size={22} />
                            </button>
                        )}

                        {/* Image counter */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                            {currentIndex + 1} / {items.length}
                        </div>
                    </div>

                    {/* Right - Info panel */}
                    <div className="w-full md:w-[340px] flex flex-col border-l border-slate-200 bg-white">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center text-white text-xs font-bold">
                                    BJP
                                </div>
                                <div>
                                    <p className="text-slate-900 text-xs font-semibold">BJP Yavatmal</p>
                                    <p className="text-slate-400 text-[10px]">Official</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {(item.post_title || item.title) && (
                                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                    {item.post_title || item.title}
                                </h3>
                            )}

                            {item.post_description && (
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {item.post_description}
                                </p>
                            )}

                            {item.post_link && (
                                <a
                                    href={item.post_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs font-medium text-saffron hover:text-saffron/80 transition-colors"
                                >
                                    <ExternalLink size={12} />
                                    Read More
                                </a>
                            )}

                            {item.category && (
                                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase font-medium">
                                    {item.category}
                                </span>
                            )}
                        </div>

                        {/* Share section */}
                        <div className="p-4 border-t border-slate-200">
                            <ShareButtons
                                url={shareUrl}
                                title={item.post_title || item.title}
                                description={item.post_description}
                                compact={false}
                            />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
