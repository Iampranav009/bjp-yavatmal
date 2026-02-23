"use client";

import { motion } from "framer-motion";
import AnimatedText from "../../../components/shared/AnimatedText";

export default function MemberPage() {
    return (
        <div className="pt-24 pb-16 min-h-screen bg-[#F4F6F8] text-center flex flex-col items-center justify-center relative overlow-hidden">
            <div className="absolute inset-0 bg-[url('/images/sections/about-bg.jpg')] bg-cover bg-center opacity-10 blur-sm pointer-events-none mix-blend-luminosity" />
            <div className="absolute inset-0 bg-[#060E1A]/80 pointer-events-none" />

            <div className="relative z-10 max-w-2xl px-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 rounded-full bg-india-green/20 mx-auto flex items-center justify-center mb-8 border border-india-green/30"
                >
                    <span className="text-4xl text-slate-900">🏛️</span>
                </motion.div>

                <AnimatedText
                    text="Become a Member"
                    className="text-5xl md:text-7xl font-['Bebas_Neue'] uppercase text-slate-900 tracking-widest mb-6"
                />

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-600 font-['DM_Sans'] text-lg mb-10"
                >
                    Join the world&apos;s largest political party. Your primary membership registration portal for BJP Yavatmal will be available here soon.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 border border-slate-200 rounded-xl p-8 backdrop-blur-md inline-block text-left relative overflow-hidden group hover:border-india-green/50 transition-colors"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-india-green/10 blur-[50px] rounded-full" />
                    <h3 className="text-xl font-['Bebas_Neue'] text-slate-900 tracking-widest mb-2">Primary Membership Drive 2024</h3>
                    <p className="text-slate-900/50 text-sm mb-6 max-w-sm">
                        Give a missed call to our toll-free number to register instantly via WhatsApp.
                    </p>
                    <div className="bg-[#040A14] border border-slate-200 rounded-lg px-6 py-4 flex items-center justify-center gap-4">
                        <span className="text-2xl">📞</span>
                        <span className="text-3xl font-bold font-['Bebas_Neue'] tracking-widest text-india-green">1800 2090 920</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
