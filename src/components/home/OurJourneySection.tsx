"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface OurJourneySectionProps {
    label: string;
    title: string;
    description: string;
    readMore: string;
}

export default function OurJourneySection({
    label,
    title,
    description,
    readMore,
}: OurJourneySectionProps) {
    return (
        <section
            id="our-journey"
            className="relative w-full min-h-screen flex items-center overflow-hidden"
        >
            {/* Full-bleed background image */}
            <Image
                src="/images/sections/our-journey.jpg"
                alt="Our Journey"
                fill
                className="object-cover object-center"
                quality={90}
                priority={false}
                unoptimized={true}
            />

            {/* Dark gradient overlay – stronger on left, fades to right */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />

            {/* Text content overlaid on the left */}
            <motion.div
                initial={{ x: -60, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-start text-left px-10 py-20 sm:px-16 lg:px-24 xl:px-32 max-w-2xl"
            >
                <span className="text-saffron uppercase font-bold tracking-[0.2em] text-sm mb-4">
                    {label}
                </span>
                <h2 className="text-6xl xl:text-7xl font-['Bebas_Neue'] uppercase leading-[0.9] mb-8 text-white">
                    {title}
                </h2>
                <p className="text-white/80 font-['DM_Sans'] text-base xl:text-lg mb-10 leading-relaxed">
                    {description}
                </p>
                <a
                    href="/about"
                    className="inline-flex items-center gap-2 bg-saffron text-white hover:bg-saffron/90 px-8 py-3 rounded-full font-bold transition-all w-fit shadow-lg shadow-saffron/30"
                >
                    {readMore} <span>→</span>
                </a>
            </motion.div>
        </section>
    );
}
