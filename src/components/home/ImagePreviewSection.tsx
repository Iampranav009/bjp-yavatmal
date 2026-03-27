"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HomepageImage {
    id: number;
    file_url: string;
    title: string;
    batch_id?: string;
    homepage_text_title?: string;
    homepage_text_description?: string;
    homepage_text_position?: "left" | "center" | "right";
    homepage_text_color?: string;
    homepage_text_bold?: boolean;
    show_on_homepage: boolean;
}

const COLOR_MAP: Record<string, string> = {
    white: "#ffffff",
    black: "#000000",
    blue: "#2563eb",
    green: "#16a34a",
    orange: "#f97316",
};

function TextOverlay({ image }: { image: HomepageImage }) {
    const title = image.homepage_text_title;
    const desc = image.homepage_text_description;
    if (!title && !desc) return null;

    const pos = image.homepage_text_position || "left";
    const color = COLOR_MAP[image.homepage_text_color || "white"] ?? "#ffffff";
    const bold = image.homepage_text_bold;

    const posClass =
        pos === "center"
            ? "items-center text-center"
            : pos === "right"
            ? "items-end text-right"
            : "items-start text-left";

    return (
        <div
            className={`absolute inset-0 flex flex-col justify-end pb-10 px-8 md:px-16 lg:px-24 ${posClass}`}
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }}
        >
            {title && (
                <motion.h2
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`text-2xl md:text-4xl lg:text-5xl leading-tight drop-shadow-lg max-w-2xl ${bold ? "font-extrabold" : "font-bold"}`}
                    style={{ color }}
                >
                    {title}
                </motion.h2>
            )}
            {desc && (
                <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`mt-2 text-sm md:text-base leading-relaxed drop-shadow max-w-xl ${bold ? "font-bold" : "font-medium"}`}
                    style={{ color: image.homepage_text_color === "white" ? "rgba(255,255,255,0.85)" : color }}
                >
                    {desc}
                </motion.p>
            )}
        </div>
    );
}

export default function ImagePreviewSection() {
    const [images, setImages] = useState<HomepageImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchImages = useCallback(async () => {
        try {
            const res = await fetch("/api/public/gallery?homepage=true");
            const data = await res.json();
            const rows: HomepageImage[] = (data.data || []).filter(
                (img: HomepageImage) => img.show_on_homepage
            );
            setImages(rows);
        } catch {
            /* silent */
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    // Auto-advance slideshow
    const startInterval = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % Math.max(images.length, 1));
        }, 5000);
    }, [images.length]);

    useEffect(() => {
        if (images.length > 1) {
            startInterval();
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [images.length, startInterval]);

    const goTo = (idx: number) => {
        setCurrent(idx);
        startInterval();
    };
    const prev = () => goTo((current - 1 + images.length) % images.length);
    const next = () => goTo((current + 1) % images.length);

    // Don't render anything if no images or still loading
    if (loading || images.length === 0) return null;

    const isSlideshow = images.length > 1;

    return (
        <section className="relative w-full overflow-hidden" style={{ height: "min(70vh, 600px)" }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src={images[current].file_url}
                        alt={images[current].title}
                        className="w-full h-full object-cover"
                    />
                    <TextOverlay image={images[current]} />
                </motion.div>
            </AnimatePresence>

            {/* Navigation — only for slideshow */}
            {isSlideshow && (
                <>
                    {/* Prev button */}
                    <button
                        onClick={prev}
                        aria-label="Previous image"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    {/* Next button */}
                    <button
                        onClick={next}
                        aria-label="Next image"
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                    >
                        <ChevronRight size={22} />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goTo(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`rounded-full transition-all duration-300 ${
                                    idx === current
                                        ? "w-6 h-2.5 bg-white"
                                        : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
