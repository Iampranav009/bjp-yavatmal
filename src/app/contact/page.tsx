"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#F4F6F8]er flex flex-col lg:flex-row pb-16 lg:pb-0 pt-24 lg:pt-0">

            {/* Left Panel - Info */}
            <div className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen relative p-8 md:p-16 flex flex-col justify-center border-r border-slate-300/5">
                <div className="absolute inset-0 bg-[url('/images/sections/contact-bg.jpg')] bg-cover bg-center opacity-20 pointer-events-none mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-tr from-navy-dark via-navy-dark/90 to-transparent pointer-events-none" />

                <div className="relative z-10 max-w-lg">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-saffron uppercase font-bold tracking-[0.2em] text-sm mb-4 block"
                    >
                        GET IN TOUCH
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-['Bebas_Neue'] uppercase text-slate-900 tracking-wide mb-8 leading-[0.9]"
                    >
                        We are here <br /> to <span className="text-saffron">Listen</span>
                    </motion.h1>

                    <div className="space-y-8 mt-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-start gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-saffron/10 border border-saffron/20 flex items-center justify-center shrink-0">
                                <MapPin className="text-saffron" size={20} />
                            </div>
                            <div>
                                <h3 className="text-slate-900 font-['Bebas_Neue'] text-2xl tracking-wide mb-1">Visit Us</h3>
                                <p className="text-slate-600 font-['DM_Sans'] leading-relaxed text-sm">
                                    BJP District Office,<br />
                                    Main Road, Ward No. 4,<br />
                                    Yavatmal, Maharashtra 445001
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-start gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-saffron/10 border border-saffron/20 flex items-center justify-center shrink-0">
                                <Phone className="text-saffron" size={20} />
                            </div>
                            <div>
                                <h3 className="text-slate-900 font-['Bebas_Neue'] text-2xl tracking-wide mb-1">Call Us</h3>
                                <p className="text-slate-600 font-['DM_Sans'] leading-relaxed text-sm">
                                    +91 98765 43210<br />
                                    Mon-Sat: 10:00 AM - 6:00 PM
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-start gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-saffron/10 border border-saffron/20 flex items-center justify-center shrink-0">
                                <Mail className="text-saffron" size={20} />
                            </div>
                            <div>
                                <h3 className="text-slate-900 font-['Bebas_Neue'] text-2xl tracking-wide mb-1">Email Us</h3>
                                <p className="text-slate-600 font-['DM_Sans'] leading-relaxed text-sm">
                                    contact@bjpyavatmal.org<br />
                                    grievance@bjpyavatmal.org
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 min-h-[50vh] p-8 md:p-16 flex flex-col justify-center bg-[#040A14]">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-md w-full mx-auto lg:mx-0"
                >
                    <h2 className="text-3xl font-['Bebas_Neue'] text-slate-900 tracking-widest mb-6 border-b border-slate-200 pb-4">
                        Send a Message
                    </h2>

                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wider text-slate-900/50 font-semibold pl-1">Name</label>
                            <input
                                type="text"
                                placeholder="Ex. Anil Patil"
                                className="w-full bg-white/5 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider text-slate-900/50 font-semibold pl-1">Phone</label>
                                <input
                                    type="tel"
                                    placeholder="+91"
                                    className="w-full bg-white/5 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider text-slate-900/50 font-semibold pl-1">Email (Optional)</label>
                                <input
                                    type="email"
                                    placeholder="name@domain.com"
                                    className="w-full bg-white/5 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wider text-slate-900/50 font-semibold pl-1">Subject</label>
                            <select className="w-full bg-white/5 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all appearance-none">
                                <option value="general" className="bg-[#040A14]">General Inquiry</option>
                                <option value="grievance" className="bg-[#040A14]">Grievance / Complaint</option>
                                <option value="media" className="bg-[#040A14]">Media Inquiry</option>
                                <option value="other" className="bg-[#040A14]">Other</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wider text-slate-900/50 font-semibold pl-1">Message</label>
                            <textarea
                                rows={4}
                                placeholder="How can we help you?"
                                className="w-full bg-white/5 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all resize-none"
                            ></textarea>
                        </div>

                        <button className="w-full bg-saffron hover:bg-saffron-light text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 group transition-all shadow-lg shadow-saffron/20 active:scale-95">
                            <span>Send Message</span>
                            <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </motion.div>
            </div>

        </div>
    );
}
