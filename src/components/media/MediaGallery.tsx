"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import GalleryPreviewModal, { type GalleryItem } from "@/components/home/GalleryPreviewModal";
import ShareButtons from "@/components/shared/ShareButtons";
import { useLanguage } from "@/lib/LanguageContext";

export default function MediaGallery() {
    const { t } = useLanguage();
    const g = t("gallery");
    const [images, setImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewIndex, setPreviewIndex] = useState(-1);
    const [sliderIndices, setSliderIndices] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        fetch("/api/public/gallery?target=media")
            .then((r) => r.json())
            .then((d) => {
                setImages(d.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const displayItems = (() => {
        const results: any[] = [];
        const seenBatches = new Set();
        images.forEach(img => {
            if (img.batch_id) {
                if (!seenBatches.has(img.batch_id)) {
                    seenBatches.add(img.batch_id);
                    const group = images.filter(i => i.batch_id === img.batch_id);
                    results.push({ type: 'group', items: group, key: img.batch_id });
                }
            } else {
                results.push({ type: 'single', item: img, key: img.id });
            }
        });
        return results;
    })();

    const nextSlide = (e: React.MouseEvent, batchId: string, max: number) => {
        e.stopPropagation();
        setSliderIndices(prev => ({ ...prev, [batchId]: Math.min((prev[batchId] || 0) + 1, max - 1) }));
    };
    const prevSlide = (e: React.MouseEvent, batchId: string) => {
        e.stopPropagation();
        setSliderIndices(prev => ({ ...prev, [batchId]: Math.max((prev[batchId] || 0) - 1, 0) }));
    };

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
                {displayItems.map((groupObj, idx) => {
                    const isEven = idx % 2 === 0;
                    const isGroup = groupObj.type === "group";
                    const firstImg = isGroup ? groupObj.items[0] : groupObj.item;
                    const batchId = groupObj.key;
                    const currentImgIndex = isGroup ? (sliderIndices[batchId] || 0) : 0;
                    const currentImg = isGroup ? groupObj.items[currentImgIndex] : groupObj.item;
                    
                    return (
                        <motion.div 
                            key={batchId}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className={`flex flex-col gap-8 lg:gap-16 lg:items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                        >
                            {/* Image side */}
                            <div className="w-full lg:w-[55%] relative group">
                                <div
                                    className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black cursor-pointer shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1 flex items-center justify-center"
                                    onClick={() => {
                                        const globalIndex = images.findIndex(i => i.id === currentImg.id);
                                        setPreviewIndex(globalIndex);
                                    }}
                                >
                                    <img
                                        src={currentImg.file_url}
                                        alt={currentImg.post_title || currentImg.title || ""}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                    
                                    {isGroup && groupObj.items.length > 1 && (
                                        <>
                                            {currentImgIndex > 0 && (
                                                <button onClick={(e) => prevSlide(e, batchId)}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm z-10 transition-colors">
                                                    <ChevronLeft size={20} />
                                                </button>
                                            )}
                                            {currentImgIndex < groupObj.items.length - 1 && (
                                                <button onClick={(e) => nextSlide(e, batchId, groupObj.items.length)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm z-10 transition-colors">
                                                    <ChevronRight size={20} />
                                                </button>
                                            )}
                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                                                {groupObj.items.map((_: any, i: number) => (
                                                    <div key={i} className={`w-2 h-2 rounded-full shadow transition-all ${i === currentImgIndex ? 'bg-white scale-110' : 'bg-white/40'}`} />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Text side */}
                            <div className="w-full lg:w-[45%] flex flex-col justify-center space-y-6">
                                <div className="space-y-4">
                                    {firstImg.category && (
                                        <span className="inline-block text-[10px] px-3 py-1 rounded-full bg-saffron/10 text-saffron font-bold uppercase tracking-wider">
                                            {firstImg.category}
                                        </span>
                                    )}

                                    <h2 className="text-3xl lg:text-4xl xl:text-5xl font-['Bebas_Neue'] text-slate-900 leading-tight tracking-wide">
                                        {firstImg.post_title || firstImg.title || g.label}
                                    </h2>

                                    {firstImg.post_description && (
                                        <p className="text-slate-600 text-[15px] leading-relaxed whitespace-pre-wrap">
                                            {firstImg.post_description}
                                        </p>
                                    )}

                                    {firstImg.post_link && (
                                        <a
                                            href={firstImg.post_link}
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
                                        url={getShareUrl(firstImg)}
                                        title={firstImg.post_title || firstImg.title}
                                        description={firstImg.post_description}
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
