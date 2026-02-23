"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "../shared/SectionHeader";

const galleryImages = [
    { src: "/images/gallery/gallery-1.jpg", alt: "Event photo 1" },
    { src: "/images/gallery/gallery-2.jpg", alt: "Event photo 2" },
    { src: "/images/gallery/gallery-3.jpg", alt: "Event photo 3" },
    { src: "/images/gallery/gallery-4.jpg", alt: "Event photo 4" },
    { src: "/images/gallery/gallery-5.jpg", alt: "Event photo 5" },
    { src: "/images/gallery/gallery-6.jpg", alt: "Event photo 6" },
];

export default function GalleryGrid() {
    return (
        <section className="bg-[#F4F6F8]er min-h-screen full-page-section py-24 border-t border-slate-300/5 relative z-20">
            <div className="container mx-auto px-6 lg:px-12 h-full flex flex-col justify-center">

                <SectionHeader
                    label="Media & Memories"
                    title="Glimpses of Our Journey"
                    highlightWord="Journey"
                    className="mb-8"
                />

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
                        <Image
                            src={galleryImages[0].src}
                            alt={galleryImages[0].alt}
                            fill
                            className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110 brightness-75"
                            quality={90}
                            placeholder="empty"
                        />
                        {/* Hover icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-[#F4F6F8]/30">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="w-14 h-14 rounded-full bg-saffron flex items-center justify-center text-white shadow-xl shadow-saffron/40"
                            >
                                <Plus size={28} />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Medium images top right */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="md:col-span-5 md:row-span-1 relative rounded-xl overflow-hidden group cursor-pointer bg-white"
                    >
                        <Image
                            src={galleryImages[1].src}
                            alt={galleryImages[1].alt}
                            fill
                            className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110 brightness-75"
                            quality={90}
                            placeholder="empty"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-[#F4F6F8]/30">
                            <div className="w-12 h-12 rounded-full bg-saffron flex items-center justify-center text-white shadow-xl shadow-saffron/40">
                                <Plus size={24} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Medium images mid right */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="md:col-span-5 md:row-span-1 relative rounded-xl overflow-hidden group cursor-pointer bg-white"
                    >
                        <Image
                            src={galleryImages[2].src}
                            alt={galleryImages[2].alt}
                            fill
                            className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110 brightness-75"
                            quality={90}
                            placeholder="empty"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-[#F4F6F8]/30">
                            <div className="w-12 h-12 rounded-full bg-saffron flex items-center justify-center text-white shadow-xl shadow-saffron/40">
                                <Plus size={24} />
                            </div>
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
                            <Image
                                src={galleryImages[idx].src}
                                alt={galleryImages[idx].alt}
                                fill
                                className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110 brightness-75"
                                quality={90}
                                placeholder="empty"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-[#F4F6F8]/30">
                                <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center text-white shadow-xl shadow-saffron/40">
                                    <Plus size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}

                </div>

            </div>
        </section>
    );
}
