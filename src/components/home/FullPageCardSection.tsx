"use client";

import { useEffect, useRef, ReactNode } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface FullPageCardSectionProps {
    id?: string;
    bgImage: string;
    label: string;
    title: string;
    children: ReactNode;
    imageOnLeft?: boolean;
}

export default function FullPageCardSection({
    id,
    bgImage,
    label,
    title,
    children,
    imageOnLeft = true,
}: FullPageCardSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Removed ScrollTrigger pinning to prevent overlapping with next sections.
        // GSAP is still imported and available if other animations are added.
    }, []);

    return (
        <section
            id={id}
            ref={sectionRef}
            className="relative full-page-section min-h-screen w-full flex overflow-hidden z-20"
        >
            {/* Layout for Desktop */}
            <div className="hidden lg:flex w-full h-screen">
                {imageOnLeft ? (
                    <>
                        <motion.div
                            initial={{ x: "-60%", opacity: 0 }}
                            whileInView={{ x: "0%", opacity: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="w-[60%] h-full relative bg-slate-200"
                        >
                            <Image
                                src={bgImage}
                                alt={title}
                                fill
                                className="object-cover"
                                quality={90}
                                placeholder="empty"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ x: "60%", opacity: 0 }}
                            whileInView={{ x: "0%", opacity: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="w-[40%] h-full bg-[#F4F6F8] flex flex-col justify-center p-16 xl:p-24 relative"
                        >
                            {/* Optional glowing accent */}
                            <div className="absolute top-0 right-0 w-full h-1/2 bg-saffron/5 blur-[120px] rounded-full pointer-events-none" />

                            <div className="relative z-10 w-full flex flex-col items-start text-left">
                                <span className="text-saffron uppercase font-bold tracking-[0.2em] text-sm mb-4">
                                    {label}
                                </span>
                                <h2 className="text-6xl xl:text-7xl font-['Bebas_Neue'] uppercase leading-[0.9] mb-8">
                                    {title}
                                </h2>
                                {children}
                            </div>
                        </motion.div>
                    </>
                ) : (
                    <>
                        <motion.div
                            initial={{ x: "-60%", opacity: 0 }}
                            whileInView={{ x: "0%", opacity: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="w-[40%] h-full bg-[#F4F6F8] flex flex-col justify-center p-16 xl:p-24 relative"
                        >
                            <div className="absolute top-0 right-0 w-full h-1/2 bg-saffron/5 blur-[120px] rounded-full pointer-events-none" />

                            <div className="relative z-10 w-full flex flex-col items-start text-left">
                                <span className="text-saffron uppercase font-bold tracking-[0.2em] text-sm mb-4">
                                    {label}
                                </span>
                                <h2 className="text-6xl xl:text-7xl font-['Bebas_Neue'] uppercase leading-[0.9] mb-8">
                                    {title}
                                </h2>
                                {children}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ x: "60%", opacity: 0 }}
                            whileInView={{ x: "0%", opacity: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="w-[60%] h-full relative"
                        >
                            <Image
                                src={bgImage}
                                alt={title}
                                fill
                                className="object-cover"
                                quality={90}
                                placeholder="empty"
                            />
                        </motion.div>
                    </>
                )}
            </div>

            {/* Layout for Mobile/Tablet */}
            <div className="flex lg:hidden flex-col w-full h-screen relative">
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        src={bgImage}
                        alt={title}
                        fill
                        className="object-cover"
                        quality={90}
                        placeholder="empty"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/80 to-navy-dark/20" />
                </div>

                <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-12 pb-24">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-saffron uppercase font-bold tracking-[0.2em] text-sm mb-4 block">
                            {label}
                        </span>
                        <h2 className="text-5xl sm:text-6xl font-['Bebas_Neue'] uppercase leading-[0.9] mb-6">
                            {title}
                        </h2>
                        {children}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
