"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function JoinSection() {
    return (
        <section className="relative min-h-[80vh] w-full flex items-center overflow-hidden py-24 z-30 bg-[#ebd7a5]">
            {/* Background Texture/Image Overlay Placeholder */}
            {/* If you have the specific background image with the person, you can add it here */}
            <div
                className="absolute inset-0 w-full h-full pointer-events-none bg-cover bg-center md:bg-[center_left]"
                style={{
                    backgroundImage: 'url("/images/sections/join-journey.jpg")',
                }}
            />
            {/* Gradient overlay to ensure text readability and maintain the golden theme */}
            <div className="absolute inset-0 bg-gradient-to-r md:from-transparent from-[#ebd7a5]/60 via-[#ebd7a5]/80 md:via-[#ebd7a5]/90 to-[#ebd7a5]" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col md:flex-row items-center">

                {/* Left empty space for the person in the background image (if added later) */}
                <div className="hidden md:block md:w-5/12"></div>

                {/* Right content area */}
                <div className="w-full md:w-7/12 flex flex-col justify-center text-left max-w-2xl pl-0 md:pl-8">

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-['Bebas_Neue'] text-[#4a2e1b] uppercase leading-[0.9] tracking-normal mb-2"
                    >
                        JOIN THE JOURNEY
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-[#5a4a3e] font-['DM_Sans'] text-xl md:text-2xl font-light mb-1"
                    >
                        Be the change you want to see.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-2xl md:text-3xl font-bold font-['DM_Sans'] uppercase tracking-wider mb-6 text-[#333]"
                    >
                        JOIN <span className="text-[#ed6622]">BJP</span>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-[#4a4a4a] font-['DM_Sans'] text-base md:text-sm leading-relaxed mb-10 max-w-[90%]"
                    >
                        BJP is devoutly committed to building a strong and developed India which is
                        unimaginable without the trust and the unflinching support of the people of India. Join
                        us and be part of the unprecedented transformation that is changing the lives of all
                        sections of society for better. Together, let&apos;s build &apos;Ek Bharat, Shreshtha Bharat&apos; and
                        witness the rise of New India under the charismatic leadership of PM Shri Narendra
                        Modi.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 w-full"
                    >
                        <Link href="https://membership.bjp.org/en/home/login" target="_blank" rel="noopener noreferrer" className="flex-1">
                            <button className="w-full py-4 px-2 text-sm sm:text-xs md:text-sm font-bold tracking-widest text-slate-900 transition-all shadow-md active:scale-95 bg-[#eb6e24] hover:bg-[#d65f1a] flex justify-center items-center text-center h-full uppercase">
                                JOIN AS<br />VOLUNTEER
                            </button>
                        </Link>

                        <Link href="https://membership.bjp.org/en/home/login" target="_blank" rel="noopener noreferrer" className="flex-1">
                            <button className="w-full py-4 px-2 text-sm sm:text-xs md:text-sm font-bold tracking-widest text-slate-900 transition-all shadow-md active:scale-95 bg-[#4a433a] hover:bg-[#342f28] flex justify-center items-center text-center h-full uppercase">
                                BECOME A<br />MEMBER
                            </button>
                        </Link>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

