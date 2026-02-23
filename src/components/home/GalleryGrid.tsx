"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../lib/LanguageContext";

const galleryImages = [
    { src: "/images/gallery/gallery-1.jpg" },
    { src: "/images/gallery/gallery-2.jpg" },
    { src: "/images/gallery/gallery-3.jpg" },
    { src: "/images/gallery/gallery-4.jpg" },
    { src: "/images/gallery/gallery-5.jpg" },
    { src: "/images/gallery/gallery-6.jpg" },
];

export default function GalleryGrid() {
    const { t } = useLanguage();
    const g = t("gallery");

    return (
        <section className="bg-[#F4F6F8]er min-h-screen full-page-section py-24 border-t border-slate-300/5 relative z-20">
            <div className="container mx-auto px-6 lg:px-12 h-full flex flex-col justify-center">

                <div className="mb-8">
                    <p className="text-saffron uppercase font-bold tracking-widest text-sm mb-4 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-saffron/20 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-saffron"></span>
                        </span>
                        {g.label}
                    </p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-['Bebas_Neue'] uppercase leading-tight text-slate-900">
                        {g.title.replace(g.titleHighlight, "").trim()}{" "}
                        <span className="text-saffron">{g.titleHighlight}</span>
                    </h2>
                </div>

                {/* Asymmetric Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[200px] md:auto-rows-[250px]">

                    {/* Large featured image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5 }}
                        className="md:col-span-7 md:row-span-2 relative rounded-xl overflow-hidden group cursor-pointer bg-white"
                    >
                        <Image src={galleryImages[0].src} alt={g.label} fill className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110 brightness-75" quality={90} placeholder="empty" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-[#F4F6F8]/30">
                            <motion.div whileHover={{ scale: 1.1 }} className="w-14 h-14 rounded-full bg-saffron flex items-center justify-center text-white shadow-xl shadow-saffron/40">
                                <Plus size={28} />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Medium images top right */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: 0.1 }} className="md:col-span-5 md:row-span-1 relative rounded-xl overflow-hidden group cursor-pointer bg-white">
                        <Image src={galleryImages[1].src} alt={g.label} fill className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110 brightness-75" quality={90} placeholder="empty" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-[#F4F6F8]/30">
                            <div className="w-12 h-12 rounded-full bg-saffron flex items-center justify-center text-white shadow-xl shadow-saffron/40"><Plus size={24} /></div>
                        </div>
                    </motion.div>

                    {/* Medium images mid right */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: 0.2 }} className="md:col-span-5 md:row-span-1 relative rounded-xl overflow-hidden group cursor-pointer bg-white">
                        <Image src={galleryImages[2].src} alt={g.label} fill className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110 brightness-75" quality={90} placeholder="empty" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-[#F4F6F8]/30">
                            <div className="w-12 h-12 rounded-full bg-saffron flex items-center justify-center text-white shadow-xl shadow-saffron/40"><Plus size={24} /></div>
                        </div>
                    </motion.div>

                    {/* Small images bottom row */}
                    {[3, 4, 5].map((idx, i) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: 0.1 * i }}
                            className="md:col-span-4 md:row-span-1 relative rounded-xl overflow-hidden group cursor-pointer bg-white hidden md:block"
                        >
                            <Image src={galleryImages[idx].src} alt={g.label} fill className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110 brightness-75" quality={90} placeholder="empty" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-[#F4F6F8]/30">
                                <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center text-white shadow-xl shadow-saffron/40"><Plus size={20} /></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
