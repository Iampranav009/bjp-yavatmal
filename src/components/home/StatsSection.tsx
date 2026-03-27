"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCountUp } from "../../hooks/useCountUp";
import { useLanguage } from "../../lib/LanguageContext";

const StatItem = ({ label, value, suffix = "", prefix = "" }: { label: string; value: number; suffix?: string; prefix?: string }) => {
    const { count, ref } = useCountUp(value, 0, 2500);
    return (
        <div className="flex flex-col">
            <span ref={ref} className="text-5xl md:text-6xl font-['Bebas_Neue'] bg-clip-text text-transparent bg-gradient-to-r from-saffron to-orange-600 drop-shadow-sm">
                {prefix}{count}{suffix}
            </span>
            <span className="text-slate-600 font-['DM_Sans'] text-sm uppercase tracking-wider font-semibold mt-1">
                {label}
            </span>
        </div>
    );
};

export default function StatsSection() {
    const { t } = useLanguage();
    const s = t("stats");

    return (
        <section className="bg-slate-50 min-h-screen full-page-section flex items-center relative overflow-hidden py-24">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-white to-transparent pointer-events-none z-0" />
            <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vh] bg-saffron/10 blur-[100px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vh] bg-india-green/10 blur-[80px] rounded-full pointer-events-none z-0" />

            <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center z-10">

                {/* Left Column - Stats */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
                    className="flex flex-col relative z-10"
                >
                    <motion.h2
                        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                        className="text-5xl md:text-6xl xl:text-7xl font-['Bebas_Neue'] uppercase leading-[0.9] text-slate-800 mb-6"
                    >
                        {s.headingLine1} <br /> <span className="text-saffron">{s.headingHighlight}</span>
                    </motion.h2>

                    <motion.p
                        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                        className="text-slate-600 font-['DM_Sans'] text-lg mb-12 max-w-lg leading-relaxed"
                    >
                        {s.description}
                    </motion.p>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
                            <StatItem value={16} suffix="+" label={s.yearsOfService} />
                        </motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
                            <StatItem value={5} suffix="L+" label={s.beneficiaries} />
                        </motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
                            <StatItem value={800} prefix="₹" suffix="Cr" label={s.developmentFunds} />
                        </motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
                            <StatItem value={300} suffix="+" label={s.projectsCompleted} />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right Column - Map Image */}
                <motion.div
                    initial={{ opacity: 0, x: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex justify-center items-center w-full relative z-10"
                >
                    <div className="relative w-full max-w-[550px] aspect-square md:aspect-[4/3] lg:aspect-square group">
                        <Image
                            src="/images/sections/yavatmal-map.png"
                            alt="Yavatmal District Map"
                            fill
                            className="object-contain transition-transform duration-700 ease-in-out group-hover:scale-105 drop-shadow-xl"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            unoptimized={true}
                        />
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
