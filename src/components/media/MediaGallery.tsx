"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import GalleryPreviewModal, { type GalleryItem } from "@/components/home/GalleryPreviewModal";
import ShareButtons from "@/components/shared/ShareButtons";
import { useLanguage } from "@/lib/LanguageContext";

export default function MediaGallery() {
    const { t } = useLanguage();
    const g = t("gallery");
    const [images, setImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [previewOpen, setPreviewOpen] = useState(false);

    useEffect(() => {
        fetch("/api/public/gallery?target=media")
            .then((r) => r.json())
            .then((d) => {
                setImages(d.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const currentImage = images[selectedIndex];

    const goNext = () => {
        if (selectedIndex < images.length - 1) setSelectedIndex(selectedIndex + 1);
    };

    const goPrev = () => {
        if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
    };

    const shareUrl = typeof window !== "undefined" && currentImage
        ? `${window.location.origin}${currentImage.file_url}`
        : "";

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-saffron/30 border-t-saffron rounded-full animate-spin" />
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
                <ImageIcon className="text-slate-300 mb-4" size={48} />
                <h3 className="text-xl font-bold text-slate-500 mb-2">No Media Yet</h3>
                <p className="text-sm text-slate-400">Media content will appear here once uploaded from the admin panel.</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-8">
                {/* Main Display - Left image + Right info */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
                    {/* Left - Image with navigation */}
                    <div className="lg:col-span-3 relative group">
                        <div
                            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-xl"
                            onClick={() => setPreviewOpen(true)}
                        >
                            <motion.img
                                key={currentImage?.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                                src={currentImage?.file_url}
                                alt={currentImage?.post_title || currentImage?.title || ""}
                                className="w-full h-full object-cover"
                            />

                            {/* Gradient overlay for title */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-saffron bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                    {selectedIndex + 1} / {images.length}
                                </span>
                            </div>
                        </div>

                        {/* Navigation arrows */}
                        {selectedIndex > 0 && (
                            <button
                                onClick={goPrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft size={22} />
                            </button>
                        )}
                        {selectedIndex < images.length - 1 && (
                            <button
                                onClick={goNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight size={22} />
                            </button>
                        )}
                    </div>

                    {/* Right - Title, description, share */}
                    <div className="lg:col-span-2 flex flex-col justify-center space-y-6">
                        <motion.div
                            key={currentImage?.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            {currentImage?.category && (
                                <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-saffron/10 text-saffron font-bold uppercase tracking-wider">
                                    {currentImage.category}
                                </span>
                            )}

                            <h2 className="text-3xl lg:text-4xl font-['Bebas_Neue'] text-slate-900 leading-tight tracking-wide">
                                {currentImage?.post_title || currentImage?.title || g.label}
                            </h2>

                            {currentImage?.post_description && (
                                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                    {currentImage.post_description}
                                </p>
                            )}

                            {currentImage?.post_link && (
                                <a
                                    href={currentImage.post_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-saffron font-semibold text-sm hover:text-saffron/80 transition-colors"
                                >
                                    Read Full Article →
                                </a>
                            )}
                        </motion.div>

                        {/* Share buttons */}
                        {currentImage && (
                            <ShareButtons
                                url={shareUrl}
                                title={currentImage.post_title || currentImage.title}
                                description={currentImage.post_description}
                            />
                        )}
                    </div>
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {images.map((img, idx) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.02, duration: 0.3 }}
                            onClick={() => setSelectedIndex(idx)}
                            className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedIndex === idx
                                    ? "border-saffron shadow-lg shadow-saffron/20 scale-105"
                                    : "border-transparent hover:border-slate-300 opacity-70 hover:opacity-100"
                                }`}
                        >
                            <img src={img.file_url} alt={img.title} className="w-full h-full object-cover" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Fullscreen modal */}
            <GalleryPreviewModal
                items={images}
                currentIndex={selectedIndex}
                isOpen={previewOpen}
                onClose={() => setPreviewOpen(false)}
                onIndexChange={setSelectedIndex}
            />
        </>
    );
}
