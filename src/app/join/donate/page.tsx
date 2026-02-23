"use client";

import { motion } from "framer-motion";
import AnimatedText from "../../../components/shared/AnimatedText";

export default function DonatePage() {
    return (
        <div className="pt-24 pb-16 min-h-screen bg-[#F4F6F8] text-center flex flex-col items-center justify-center relative overlow-hidden">
            <div className="absolute inset-0 bg-[#060E1A]/90 pointer-events-none" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-2xl px-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 rounded-full bg-gold/20 mx-auto flex items-center justify-center mb-8 border border-gold/30"
                >
                    <span className="text-4xl text-slate-900">💛</span>
                </motion.div>

                <AnimatedText
                    text="Support Our Vision"
                    className="text-5xl md:text-7xl font-['Bebas_Neue'] text-gold uppercase tracking-widest mb-6"
                />

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-600 font-['DM_Sans'] text-lg mb-10"
                >
                    Every contribution strengthens our mission to build a self-reliant and modern Yavatmal. Donations are eligible for tax deductions under section 80GGC.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 border border-slate-200 rounded-xl p-8 backdrop-blur-md max-w-md mx-auto relative overflow-hidden group"
                >
                    <h3 className="text-xl font-['Bebas_Neue'] text-slate-900 tracking-widest mb-6">Select Amount</h3>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {['₹500', '₹1000', '₹5000'].map(amt => (
                            <button key={amt} className="py-3 bg-[#040A14] border border-slate-200 rounded-lg text-slate-900 font-bold hover:bg-gold/10 hover:border-gold/50 hover:text-gold transition-all">
                                {amt}
                            </button>
                        ))}
                    </div>

                    <div className="relative mb-8">
                        <span className="absolute left-4 top-3.5 text-slate-900/50 font-bold">₹</span>
                        <input type="number" placeholder="Custom Amount" className="w-full bg-[#040A14] border border-slate-200 rounded-lg pl-8 pr-4 py-3 text-slate-900 focus:outline-none focus:border-gold transition-all" />
                    </div>

                    <button className="w-full bg-gold hover:bg-[#E5B020] text-navy-darker font-bold py-3.5 rounded-lg transition-all shadow-lg active:scale-[0.98]">
                        Proceed to Pay
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
