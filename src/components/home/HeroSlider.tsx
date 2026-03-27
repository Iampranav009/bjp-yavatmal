"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import SocialBar from "../shared/SocialBar";
import { useLanguage } from "../../lib/LanguageContext";

export default function HeroSlider() {
    const [activeSlide, setActiveSlide] = useState(0);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const imageRefs = useRef<(HTMLImageElement | HTMLDivElement | null)[]>([]);
    const autoPlayRef = useRef<NodeJS.Timeout>(null);
    const { t } = useLanguage();
    const hero = t("hero");
    const slides = hero.slides.map((s, i) => ({
        id: i + 1,
        image: `/images/hero/hero-1.jpg`,
        mobileImage: `/images/hero/hero-1-mobile.jpg`,
        slogan: s.slogan,
        subtext: s.subtext,
    }));

    useEffect(() => {
        gsap.set(slideRefs.current, { opacity: 0 });
        gsap.set(slideRefs.current[0], { opacity: 1 });
        gsap.set(imageRefs.current[0], { scale: 1 });
        startAutoPlay();
        return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
    }, []);

    const goToSlide = (index: number) => {
        if (index === activeSlide) return;
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        const prevSlide = activeSlide;
        setActiveSlide(index);
        const tl = gsap.timeline();
        tl.to(slideRefs.current[prevSlide], { opacity: 0, duration: 1.2, ease: "power2.inOut", zIndex: 10 }, 0);
        gsap.set(imageRefs.current[index], { scale: 1.05 });
        gsap.set(slideRefs.current[index], { zIndex: 20 });
        tl.to(slideRefs.current[index], { opacity: 1, duration: 1.2, ease: "power2.inOut" }, 0);
        tl.to(imageRefs.current[index], { scale: 1, duration: 6, ease: "power1.out" }, 0);
        startAutoPlay();
    };

    const startAutoPlay = () => {
        autoPlayRef.current = setInterval(() => {
            setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
    };

    return (
        <section className="relative w-full h-screen overflow-hidden flex-shrink-0 full-page-section">
            {/* Background Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    ref={(el) => { slideRefs.current[index] = el; }}
                    className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                >
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <div ref={(el) => { imageRefs.current[index] = el; }} className="w-full h-full absolute inset-0">
                            <Image
                                src={slide.image}
                                alt={slide.slogan}
                                fill
                                className="object-cover object-top hidden md:block"
                                quality={90}
                                priority={index === 0}
                                placeholder="empty"
                            />
                            <Image
                                src={slide.mobileImage}
                                alt={slide.slogan}
                                fill
                                className="object-cover object-top block md:hidden"
                                quality={90}
                                priority={index === 0}
                                placeholder="empty"
                            />
                        </div>
                    </div>
                </div>
            ))}

            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-black/20 z-30 pointer-events-none" />
            <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-black/50 to-transparent z-30 pointer-events-none" />

            {/* Content */}
            <div className="relative z-40 h-full container mx-auto px-6 lg:px-12 flex flex-col justify-center items-center text-center">
                <div className="max-w-4xl flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex justify-center items-center gap-3 mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-saffron" />
                        <span className="text-white/90 uppercase tracking-widest text-sm font-['DM_Sans'] font-semibold drop-shadow-md">
                            {hero.district}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-saffron" />
                    </motion.div>

                    <div className="w-full flex justify-center my-4 min-h-[160px] md:min-h-[200px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSlide}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, staggerChildren: 0.1 }}
                                className="flex flex-col justify-center items-center w-full px-2"
                            >
                                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-['Tiro_Devanagari_Hindi'] font-bold text-white leading-tight mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] max-w-4xl mx-auto">
                                    {slides[activeSlide].slogan}
                                </h1>
                                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-['Tiro_Devanagari_Hindi'] text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-2xl mx-auto">
                                    {slides[activeSlide].subtext}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex flex-wrap justify-center items-center gap-4 mt-8"
                    >
                        <button className="bg-saffron hover:bg-saffron-light text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-xl shadow-saffron/20 hover:-translate-y-1">
                            {hero.joinJourney}
                        </button>
                        <button className="bg-transparent border border-slate-300 text-white hover:bg-white/10 px-8 py-3.5 rounded-full font-bold transition-all hover:-translate-y-1">
                            {hero.ourWork}
                        </button>
                    </motion.div>
                </div>

                {/* Slide Counter */}
                <div className="absolute bottom-10 left-6 lg:left-12 flex items-baseline gap-2 font-['Bebas_Neue'] tracking-wider z-40">
                    <span className="text-4xl text-saffron">0{activeSlide + 1}</span>
                    <span className="text-xl text-white/40">/ 0{slides.length}</span>
                </div>
            </div>

            {/* Slide Navigation Dots */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40 md:right-12">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className="group py-2 px-1 flex justify-center items-center"
                    >
                        <motion.div
                            layout
                            className={`rounded-full transition-colors duration-300 ${activeSlide === index
                                    ? "w-2 h-8 bg-saffron"
                                    : "w-2 h-2 bg-white/30 group-hover:bg-white/60"
                                }`}
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}
