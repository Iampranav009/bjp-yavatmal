"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "../../lib/LanguageContext";

export default function AchievementsSlider() {
    const { t } = useLanguage();
    const a = t("achievements");
    const items = a.items;

    // Duplicate for seamless infinite scroll
    const duplicated = [...items, ...items];

    return (
        <section className="py-24 bg-[#F4F6F8] relative overflow-hidden border-t border-slate-300/5">
            <div className="container mx-auto px-6 lg:px-12 relative z-10 mb-12">
                <p className="text-saffron uppercase font-bold tracking-widest text-sm mb-4 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-saffron/20 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron"></span>
                    </span>
                    {a.label}
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-['Bebas_Neue'] uppercase leading-tight text-slate-900">
                    {a.title.replace(a.titleHighlight, "").trim()}{" "}
                    <span className="text-saffron">{a.titleHighlight}</span>
                </h2>
            </div>

            {/* mask-image ensures the edges gently fade out */}
            <div className="w-full relative group [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <div className="flex w-max animate-scrollLeft hover:[animation-play-state:paused]">
                    {duplicated.map((item, idx) => (
                        <div key={idx} className="pr-6 shrink-0">
                            <motion.div
                                whileHover={{ y: -6, borderColor: "rgba(255,106,0,0.4)" }}
                                className="w-[300px] sm:w-[320px] shrink-0 bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xl transition-all duration-300 group-hover:duration-200 h-full"
                            >
                                <div className="w-full h-[200px] relative overflow-hidden">
                                    <Image
                                        src={[
                                            "/images/gallery/gallery-1.jpg",
                                            "/images/gallery/gallery-2.jpg",
                                            "/images/gallery/gallery-3.jpg",
                                            "/images/hero/img-2.jpg",
                                            "/images/hero/img-3.jpg",
                                            "/images/hero/img-4.jpg",
                                        ][idx % items.length]}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
                                        quality={90}
                                        placeholder="empty"
                                    />
                                </div>
                                <div className="p-6">
                                    <span className="text-saffron text-xs font-bold uppercase tracking-wider mb-2 block">
                                        {item.date}
                                    </span>
                                    <h3 className="text-2xl font-['Bebas_Neue'] text-slate-900 tracking-wide mb-3 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-900/70 text-sm font-['DM_Sans'] leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
