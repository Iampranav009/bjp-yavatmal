"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import SocialBar from "../shared/SocialBar";

const slides = [
    {
        id: 1,
        image: "/images/leaders/img-5.png",
        title: "Prime Minister",
        name: "Shri Narendra Modi",
        link: "#",
    },
    {
        id: 2,
        image: "/images/leaders/img-6.png",
        title: "Chief Minister",
        name: "Shri Yogi Adityanath",
        link: "#",
    },
];

export default function LeaderSlider() {
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
                            alt={slide.name}
                            fill
                            className="object-cover object-center"
                            quality={100}
                            priority={index === 0}
                            placeholder="empty"
                        />
                    </div>
                </div>
            ))}

            {/* Gradient Overlay for Text Readability - adjusting based on image if needed */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 z-30 pointer-events-none" />

            {/* Content Container aligned to right half */}
            <div className="relative z-40 h-full container mx-auto px-6 lg:px-12 flex items-center justify-end">
                <div className="w-full md:w-1/2 flex justify-center md:justify-end xl:pr-20">
                    <div className="relative w-full flex flex-col items-center md:items-start text-center md:text-left">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSlide}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.6 }}
                                className="flex flex-col items-center md:items-start"
                            >
                                <h2 className="text-5xl md:text-7xl lg:text-8xl font-['Bebas_Neue'] text-[#542512] leading-[0.9] tracking-wide drop-shadow-sm mb-1">
                                    {slides[activeSlide].title}
                                </h2>
                                <h3 className="text-4xl md:text-5xl lg:text-6xl font-['Bebas_Neue'] text-[#542512] leading-[0.9] tracking-wide mb-6">
                                    {slides[activeSlide].name}
                                </h3>
                                <a
                                    href={slides[activeSlide].link}
                                    className="bg-[#E97621] hover:bg-[#D5681A] text-white px-8 py-3 rounded text-base font-semibold transition-all inline-block shadow-lg"
                                >
                                    Read More
                                </a>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Slide Navigation Dots mostly imitating the original slider */}
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
                                ? "w-2.5 h-2.5 bg-[#E97621]"
                                : "w-2.5 h-2.5 bg-black/20 group-hover:bg-black/40"
                                }`}
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}
