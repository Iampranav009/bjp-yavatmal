"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "../../lib/LanguageContext";

export default function JoinSection() {
    const { t } = useLanguage();
    const j = t("join");

    return (
        <section className="relative min-h-[80vh] w-full flex items-center overflow-hidden py-24 z-30 bg-[#ebd7a5]">
            <div
                className="absolute inset-0 w-full h-full pointer-events-none bg-cover bg-center md:bg-[center_left]"
                style={{ backgroundImage: 'url("/images/sections/join-journey.jpg")' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r md:from-transparent from-[#ebd7a5]/60 via-[#ebd7a5]/80 md:via-[#ebd7a5]/90 to-[#ebd7a5]" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col md:flex-row items-center">

                <div className="hidden md:block md:w-5/12"></div>

                <div className="w-full md:w-7/12 flex flex-col justify-center text-left max-w-2xl pl-0 md:pl-8">

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-['Bebas_Neue'] text-[#4a2e1b] uppercase leading-[0.9] tracking-normal mb-2"
                    >
                        {j.heading}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-[#5a4a3e] font-['DM_Sans'] text-xl md:text-2xl font-light mb-1"
                    >
                        {j.subheading}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-2xl md:text-3xl font-bold font-['DM_Sans'] uppercase tracking-wider mb-6 text-[#333]"
                    >
                        {j.joinBjp1} <span className="text-[#ed6622]">{j.joinBjpHighlight}</span>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-[#4a4a4a] font-['DM_Sans'] text-base md:text-sm leading-relaxed mb-10 max-w-[90%]"
                    >
                        {j.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 w-full"
                    >
                        <Link href="https://membership.bjp.org/en/home/login" target="_blank" rel="noopener noreferrer" className="flex-1">
                            <button className="w-full py-4 px-2 text-sm sm:text-xs md:text-sm font-bold tracking-widest text-slate-900 transition-all shadow-md active:scale-95 bg-[#eb6e24] hover:bg-[#d65f1a] flex justify-center items-center text-center h-full uppercase whitespace-pre-line">
                                {j.joinVolunteer}
                            </button>
                        </Link>

                        <Link href="https://membership.bjp.org/en/home/login" target="_blank" rel="noopener noreferrer" className="flex-1">
                            <button className="w-full py-4 px-2 text-sm sm:text-xs md:text-sm font-bold tracking-widest text-slate-900 transition-all shadow-md active:scale-95 bg-[#4a433a] hover:bg-[#342f28] flex justify-center items-center text-center h-full uppercase whitespace-pre-line">
                                {j.becomeMember}
                            </button>
                        </Link>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
