"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { LEADERS } from "./[slug]/page";

export default function LeadersPage() {
    const leaderList = Object.values(LEADERS);

    return (
        <div className="pt-20 min-h-screen bg-[#F4F6F8]">
            {/* Hero */}
            <section className="py-12 lg:py-16 border-b border-slate-200 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <p className="text-saffron uppercase font-bold tracking-widest text-sm mb-4 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-saffron/20 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-saffron"></span>
                        </span>
                        BJP Yavatmal
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-oswald uppercase leading-tight text-slate-900">
                        Our <span className="text-saffron">Leaders</span>
                    </h1>
                    <p className="text-slate-600 text-sm md:text-base mt-4 max-w-xl leading-relaxed">
                        Meet the dedicated leaders of BJP Yavatmal working for the development of the district.
                    </p>
                </div>
            </section>

            {/* Leaders Grid */}
            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {leaderList.map((leader, i) => (
                            <motion.div
                                key={leader.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    href={`/leaders/${leader.slug}`}
                                    className="block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-saffron/40 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="relative h-48 bg-slate-100">
                                        <Image
                                            src={leader.photo}
                                            alt={leader.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => { (e.target as HTMLImageElement).src = "/images/logos/bjp-logo.png"; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-3 left-3">
                                            <span className="text-[10px] px-2.5 py-1 rounded-full bg-saffron text-white font-bold uppercase tracking-wider">
                                                {leader.role}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h2 className="font-oswald text-lg text-slate-900 uppercase tracking-wide mb-0.5">
                                            {leader.name}
                                        </h2>
                                        <p className="text-saffron text-sm font-medium mb-3">{leader.nameMarathi}</p>
                                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{leader.bio}</p>
                                        <div className="flex items-center gap-1 text-saffron text-xs font-semibold mt-3 group-hover:underline">
                                            View Profile <ExternalLink size={11} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                        {/* Placeholder cards for MLAs/MPs (can be populated) */}
                        {["MLA — Yavatmal", "MLA — Pusad", "MP — Yavatmal"].map((role, i) => (
                            <motion.div
                                key={role}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (leaderList.length + i) * 0.1 }}
                            >
                                <div className="block bg-white rounded-2xl border border-dashed border-slate-300 overflow-hidden p-6 text-center">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto mb-3 flex items-center justify-center text-slate-300 text-3xl">
                                        🪷
                                    </div>
                                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                                        {role}
                                    </span>
                                    <p className="text-slate-400 text-xs mt-3">Profile coming soon</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
