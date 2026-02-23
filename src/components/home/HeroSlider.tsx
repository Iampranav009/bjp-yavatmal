"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import SocialBar from "../shared/SocialBar";

const slides = [
    {
        id: 1,
        image: "/images/hero/img-1.png",
        slogan: "एक भारत श्रेष्ठ भारत",
        subtext: "Building a stronger, self-reliant Yavatmal district.",
    },
    {
        id: 2,
        image: "/images/hero/img-2.png",
        slogan: "सबका साथ सबका विकास",
        subtext: "Ensuring holistic development reaching every corner of the district.",
    },
    {
        id: 3,
        image: "/images/hero/img-3.png",
        slogan: "आत्मनिर्भर यवतमाळ",
        subtext: "Empowering youth, women, and farmers for a brighter future.",
    },
    {
        id: 4,
        image: "/images/hero/img-4.png",
        slogan: "वंदे मातरम",
        subtext: "Committed to the nation, dedicated to Yavatmal.",
    },
];

export default function HeroSlider() {
    const [activeSlide, setActiveSlide] = useState(0);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
    const autoPlayRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        // Initial GSAP setup
        gsap.set(slideRefs.current, { opacity: 0 });
        gsap.set(slideRefs.current[0], { opacity: 1 });
        gsap.set(imageRefs.current[0], { scale: 1 });

        startAutoPlay();

        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, []);

    const goToSlide = (index: number) => {
        if (index === activeSlide) return;

        if (autoPlayRef.current) clearInterval(autoPlayRef.current);

        const prevSlide = activeSlide;
        setActiveSlide(index);

        // GSAP Transition
        const tl = gsap.timeline();

        // Zoom out the old image slightly and fade it out
        tl.to(slideRefs.current[prevSlide], {
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut",
            zIndex: 10
        }, 0);

        // Zoom in the new image slightly and fade it in
        gsap.set(imageRefs.current[index], { scale: 1.05 });
        gsap.set(slideRefs.current[index], { zIndex: 20 });

        tl.to(slideRefs.current[index], {
            opacity: 1,
            duration: 1.2,
            ease: "power2.inOut"
        }, 0);

        tl.to(imageRefs.current[index], {
            scale: 1,
            duration: 6,
            ease: "power1.out"
        }, 0);

        startAutoPlay();
    };

    const startAutoPlay = () => {
        autoPlayRef.current = setInterval(() => {
            setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
    };

    useEffect(() => {
        // Watch for automatic state changes to trigger GSAP
        if (activeSlide !== 0 || slideRefs.current[0]?.style.opacity === "1") {
            // Avoid re-triggering on first load
        }
    }, [activeSlide]);

    return (
        <section className="relative w-full h-screen overflow-hidden flex-shrink-0 full-page-section">
            {/* Background Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    ref={(el) => { slideRefs.current[index] = el }}
                    className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                >
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <Image
                            ref={(el) => { imageRefs.current[index] = el }}
                            src={slide.image}
                            alt={slide.slogan}
                            fill
                            className="object-cover object-top"
                            quality={90}
                            priority={index === 0}
                            placeholder="empty"
                        />
                    </div>
                </div>
            ))}

            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy-dark/90 via-navy-dark/40 to-transparent z-30 pointer-events-none" />
            <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-[#060E1A] to-transparent z-30 pointer-events-none" />

            {/* Content */}
            <div className="relative z-40 h-full container mx-auto px-6 lg:px-12 flex flex-col justify-end pb-24 lg:pb-32">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-saffron" />
                        <span className="text-white/80 uppercase tracking-widest text-sm font-['DM_Sans'] font-semibold">
                            Yavatmal District · Maharashtra
                        </span>
                    </motion.div>

                    <div className="h-32 md:h-40 xl:h-48 relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSlide}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, staggerChildren: 0.1 }}
                                className="absolute inset-0 flex flex-col justify-center"
                            >
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-['Bebas_Neue'] text-white leading-[0.9] tracking-wide mb-4 drop-shadow-lg">
                                    {slides[activeSlide].slogan}
                                </h1>
                                <p className="text-lg md:text-xl lg:text-2xl font-['Tiro_Devanagari_Hindi'] text-white/90 drop-shadow-md">
                                    {slides[activeSlide].subtext}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex flex-wrap items-center gap-4 mt-8"
                    >
                        <button className="bg-saffron hover:bg-saffron-light text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-xl shadow-saffron/20 hover:-translate-y-1">
                            Join the Journey
                        </button>
                        <button className="bg-transparent border border-slate-300 text-white hover:bg-white/10 px-8 py-3.5 rounded-full font-bold transition-all hover:-translate-y-1">
                            Our Work
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
