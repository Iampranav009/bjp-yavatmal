"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import GalleryPreviewModal, { type GalleryItem } from "@/components/home/GalleryPreviewModal";
import ShareButtons from "@/components/shared/ShareButtons";
import { useLanguage } from "@/lib/LanguageContext";

export default function MediaGallery() {
    const { t } = useLanguage();
    const g = t("gallery");
    const [images, setImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewIndex, setPreviewIndex] = useState(-1);

    useEffect(() => {
        fetch("/api/public/gallery?target=media")
            .then((r) => r.json())
            .then((d) => {
                setImages(d.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const getShareUrl = (img: GalleryItem) => {
        return typeof window !== "undefined" ? `${window.location.origin}${img.file_url}` : "";
    };

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
            <div className="space-y-16 lg:space-y-24 py-8">
                {images.map((img, idx) => {
                    const isEven = idx % 2 === 0;
                    
                    return (
                        <motion.div 
                            key={img.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className={`flex flex-col gap-8 lg:gap-16 lg:items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                        >
                            {/* Image side */}
                            <div className="w-full lg:w-[55%] relative group">
                                <div
                                    className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1"
                                    onClick={() => setPreviewIndex(idx)}
                                >
                                    <img
                                        src={img.file_url}
                                        alt={img.post_title || img.title || ""}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                </div>
                            </div>

                            {/* Text side */}
                            <div className="w-full lg:w-[45%] flex flex-col justify-center space-y-6">
                                <div className="space-y-4">
                                    {img.category && (
                                        <span className="inline-block text-[10px] px-3 py-1 rounded-full bg-saffron/10 text-saffron font-bold uppercase tracking-wider">
                                            {img.category}
                                        </span>
                                    )}

                                    <h2 className="text-3xl lg:text-4xl xl:text-5xl font-['Bebas_Neue'] text-slate-900 leading-tight tracking-wide">
                                        {img.post_title || img.title || g.label}
                                    </h2>

                                    {img.post_description && (
                                        <p className="text-slate-600 text-[15px] leading-relaxed whitespace-pre-wrap">
                                            {img.post_description}
                                        </p>
                                    )}

                                    {img.post_link && (
                                        <a
                                            href={img.post_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-saffron font-semibold text-sm hover:text-saffron-light transition-colors mt-2"
                                        >
                                            Read Full Article →
                                        </a>
                                    )}
                                </div>

                                {/* Share buttons */}
                                <div className="pt-4 border-t border-slate-200">
                                    <ShareButtons
                                        url={getShareUrl(img)}
                                        title={img.post_title || img.title}
                                        description={img.post_description}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Fullscreen modal */}
            <GalleryPreviewModal
                items={images}
                currentIndex={previewIndex === -1 ? 0 : previewIndex}
                isOpen={previewIndex !== -1}
                onClose={() => setPreviewIndex(-1)}
                onIndexChange={setPreviewIndex}
            />
        </>
    );
}
