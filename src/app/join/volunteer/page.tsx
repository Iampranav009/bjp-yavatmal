"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function VolunteerPage() {
    return (
        <div className="min-h-screen bg-[#F4F6F8]er flex flex-col lg:flex-row pb-16 lg:pb-0 pt-24 lg:pt-0">

            {/* Left Panel - Image */}
            <div className="hidden lg:block w-[45%] h-screen sticky top-0 border-r border-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/sections/volunteer-bg.jpg')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-darker via-navy-darker/60 to-transparent" />
                <div className="absolute inset-0 bg-saffron/10 mix-blend-overlay" />

                <div className="absolute bottom-16 left-12 right-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="w-16 h-16 rounded-full bg-saffron/20 backdrop-blur-md flex items-center justify-center mb-6">
                            <span className="text-3xl">🤝</span>
                        </div>
                        <h2 className="text-5xl font-['Bebas_Neue'] text-slate-900 tracking-wide mb-4 uppercase">
                            Be the Change <br /> You wish to see
                        </h2>
                        <p className="text-slate-700 font-['DM_Sans'] text-lg">
                            Join thousands of dedicated karyakartas across Yavatmal district working tirelessly for the nation. Your skills, passion, and time can shape the future of our society from the grassroots.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-[55%] min-h-screen flex items-center justify-center p-6 md:p-12 lg:p-20">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-2xl bg-[#060E1A] p-8 md:p-12 rounded-2xl border border-slate-300/5 shadow-2xl"
                >
                    <div className="mb-10 text-center lg:text-left">
                        <span className="text-saffron uppercase font-bold tracking-[0.2em] text-sm mb-2 block">
                            REGISTRATION DESK
                        </span>
                        <h1 className="text-5xl md:text-6xl font-['Bebas_Neue'] uppercase text-slate-900 tracking-widest mb-4">
                            Join the <span className="text-saffron">BJP Seva</span>
                        </h1>
                        <p className="text-slate-900/50 font-['DM_Sans'] text-sm">
                            Fill out this form to register yourself as an active volunteer for BJP Yavatmal. Our IT cell team will contact you shortly.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider text-slate-900/50 font-semibold pl-1">Full Name *</label>
                                <input type="text" className="w-full bg-white/5 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:border-saffron transition-all" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider text-slate-900/50 font-semibold pl-1">Mobile Number *</label>
                                <div className="flex">
                                    <span className="bg-white/10 border-y border-l border-slate-200 rounded-l-lg px-4 py-3 text-slate-900/50 flex items-center">+91</span>
                                    <input type="tel" className="w-full bg-white/5 border border-slate-200 rounded-r-lg px-4 py-3 text-slate-900 focus:border-saffron transition-all" required />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider text-slate-900/50 font-semibold pl-1">Age</label>
                                <input type="number" min="18" max="100" className="w-full bg-white/5 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:border-saffron transition-all" />
                            </div>
                            <div className="space-y-1 col-span-2">
                                <label className="text-xs uppercase tracking-wider text-slate-900/50 font-semibold pl-1">Email Address</label>
                                <input type="email" className="w-full bg-white/5 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:border-saffron transition-all" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wider text-slate-900/50 font-semibold pl-1">Tehsil (Taluka) *</label>
                            <select className="w-full bg-white/5 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:border-saffron transition-all appearance-none" required>
                                <option value="" disabled selected className="text-black">Select Your Tehsil</option>
                                <option value="yavatmal" className="bg-[#060E1A]">Yavatmal</option>
                                <option value="pusad" className="bg-[#060E1A]">Pusad</option>
                                <option value="darwha" className="bg-[#060E1A]">Darwha</option>
                                <option value="digras" className="bg-[#060E1A]">Digras</option>
                                <option value="ani" className="bg-[#060E1A]">Arni</option>
                                <option value="ner" className="bg-[#060E1A]">Ner</option>
                                <option value="umar" className="bg-[#060E1A]">Umarkhed</option>
                                <option value="wani" className="bg-[#060E1A]">Wani</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wider text-slate-900/50 font-semibold pl-1">Village / Ward / Area *</label>
                            <input type="text" className="w-full bg-white/5 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:border-saffron transition-all" required />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wider text-slate-900/50 font-semibold pl-1">Areas of Interest (Select multiple)</label>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                {['Social Media / IT', 'Youth Mobilization', 'Door-to-Door Campaigns', 'Event Management', 'Women Empowerment', 'Farmer Welfare'].map((interest) => (
                                    <label key={interest} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input type="checkbox" className="peer w-5 h-5 opacity-0 absolute cursor-pointer" />
                                            <div className="w-5 h-5 rounded border border-slate-300 bg-white/5 peer-checked:bg-saffron peer-checked:border-saffron transition-colors"></div>
                                            <svg className="w-3 h-3 text-slate-900 absolute hidden peer-checked:block pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className="text-sm text-slate-900/70 group-hover:text-slate-900 transition-colors select-none">{interest}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-200">
                            <button
                                type="submit"
                                className="w-full bg-saffron hover:bg-saffron-light text-white font-['Bebas_Neue'] tracking-widest text-2xl py-4 rounded-xl flex items-center justify-center gap-3 group transition-all shadow-xl shadow-saffron/20 active:scale-95"
                            >
                                <span>Submit & Join the Army</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-center text-slate-500 text-xs mt-4">
                                By submitting this form, you agree to receive communications from BJP Yavatmal.
                            </p>
                        </div>

                    </form>
                </motion.div>
            </div>

        </div>
    );
}
