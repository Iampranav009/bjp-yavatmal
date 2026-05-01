"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Filter, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../lib/LanguageContext";
import GalleryPreviewModal, { type GalleryItem } from "./GalleryPreviewModal";

const MANDAL_OPTIONS = [
    "All Mandals",
    "Pandharkawda",
    "Kharwada",
    "Yavatmal",
    "Vani",
    "Wani",
    "Darwha",
    "Pusad",
    "Umarkhed",
    "Mahagaon",
];

const TEAM_OPTIONS = [
    "All Teams",
    "Core Team",
    "Yuva Morcha",
    "Mahila Morcha",
    "Chemist Front",
    "Student Front",
    "City South",
    "City North",
];

export default function GalleryGrid() {
    const { t } = useLanguage();
    const g = t("gallery");
    const [allImages, setAllImages] = useState<GalleryItem[]>([]);
    const [previewIndex, setPreviewIndex] = useState(-1);

    // Filter state
    const [selectedMandal, setSelectedMandal] = useState("All Mandals");
    const [selectedTeam, setSelectedTeam] = useState("All Teams");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetch("/api/public/gallery?target=media")
            .then((r) => r.json())
            .then((d) => setAllImages(d.data || []))
            .catch(() => {});
    }, []);

    const filteredImages = useMemo(() => {
        return allImages.filter((img) => {
            const matchMandal =
                selectedMandal === "All Mandals" ||
                (img as any).mandal === selectedMandal;
            const matchTeam =
                selectedTeam === "All Teams" ||
                (img as any).team === selectedTeam;
            const matchSearch =
                !searchQuery ||
                (img.post_title || img.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                ((img as any).mandal || "").toLowerCase().includes(searchQuery.toLowerCase());
            return matchMandal && matchTeam && matchSearch;
        });
    }, [allImages, selectedMandal, selectedTeam, searchQuery]);

    const hasActiveFilters =
        selectedMandal !== "All Mandals" ||
        selectedTeam !== "All Teams" ||
        !!searchQuery;

    const clearFilters = () => {
        setSelectedMandal("All Mandals");
        setSelectedTeam("All Teams");
        setSearchQuery("");
    };

    // Use first 6 filtered images for the grid
    const gridImages = filteredImages.slice(0, 6);
    const placeholderSrc = "/images/sections/bjp-crowd.jpg";

    const getImgSrc = (idx: number) => gridImages[idx]?.file_url || placeholderSrc;

    const handleClick = (idx: number) => {
        if (idx < filteredImages.length) {
            setPreviewIndex(idx);
        }
    };

    return (
        <>
            <section className="bg-[#F4F6F8] min-h-screen full-page-section py-24 border-t border-slate-300/5 relative z-20">
                <div className="container mx-auto px-6 lg:px-12 h-full flex flex-col justify-center">
                    <div className="mb-8">
                        <p className="text-saffron uppercase font-bold tracking-widest text-sm mb-4 flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-saffron/20 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-saffron"></span>
                            </span>
                            {g.label}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-oswald uppercase leading-tight text-slate-900">
                                {g.title.replace(g.titleHighlight, "").trim()}{" "}
                                <span className="text-saffron">{g.titleHighlight}</span>
                            </h2>
                            <Link
                                href="/media"
                                className="flex items-center gap-2 text-saffron font-semibold text-sm hover:underline whitespace-nowrap self-end sm:self-auto"
                            >
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="flex flex-wrap gap-3 items-center">
                            {/* Search */}
                            <div className="relative">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search gallery..."
                                    className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron bg-white w-40 sm:w-52"
                                />
                            </div>

                            {/* Filter toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                                    showFilters || hasActiveFilters
                                        ? "bg-saffron/10 border-saffron/30 text-saffron"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-saffron/50"
                                }`}
                            >
                                <Filter size={14} />
                                Filter
                            </button>

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors"
                                >
                                    <X size={12} /> Clear
                                </button>
                            )}

                            {hasActiveFilters && (
                                <span className="text-xs text-slate-400">
                                    {filteredImages.length} of {allImages.length} images
                                </span>
                            )}
                        </div>

                        {/* Filter dropdowns */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-3 p-4 bg-white border border-slate-200 rounded-xl flex flex-wrap gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mandal</label>
                                            <select
                                                value={selectedMandal}
                                                onChange={(e) => setSelectedMandal(e.target.value)}
                                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-saffron/30 bg-white"
                                            >
                                                {MANDAL_OPTIONS.map((m) => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Team / Wing</label>
                                            <select
                                                value={selectedTeam}
                                                onChange={(e) => setSelectedTeam(e.target.value)}
                                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-saffron/30 bg-white"
                                            >
                                                {TEAM_OPTIONS.map((t) => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
                            onClick={() => handleClick(0)}
                        >
                            <Image src={getImgSrc(0)} alt={gridImages[0]?.post_title || g.label} fill className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110 brightness-75" quality={90} placeholder="empty" unoptimized={true} />
                            {gridImages[0]?.post_title && (
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                    <h3 className="text-white text-sm font-bold truncate">{gridImages[0].post_title}</h3>
                                    {(gridImages[0] as any).mandal && (
                                        <span className="text-white/70 text-xs">📍 {(gridImages[0] as any).mandal}</span>
                                    )}
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-[#F4F6F8]/30">
                                <motion.div whileHover={{ scale: 1.1 }} className="w-14 h-14 rounded-full bg-saffron flex items-center justify-center text-white shadow-xl shadow-saffron/40">
                                    <Plus size={28} />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Medium images top right */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: 0.1 }}
                            className="md:col-span-5 md:row-span-1 relative rounded-xl overflow-hidden group cursor-pointer bg-white"
                            onClick={() => handleClick(1)}>
                            <Image src={getImgSrc(1)} alt={gridImages[1]?.post_title || g.label} fill className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110 brightness-75" quality={90} placeholder="empty" unoptimized={true} />
                            {gridImages[1]?.post_title && (
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                                    <h3 className="text-white text-xs font-bold truncate">{gridImages[1].post_title}</h3>
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-[#F4F6F8]/30">
                                <div className="w-12 h-12 rounded-full bg-saffron flex items-center justify-center text-white shadow-xl shadow-saffron/40"><Plus size={24} /></div>
                            </div>
                        </motion.div>

                        {/* Medium images mid right */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: 0.2 }}
                            className="md:col-span-5 md:row-span-1 relative rounded-xl overflow-hidden group cursor-pointer bg-white"
                            onClick={() => handleClick(2)}>
                            <Image src={getImgSrc(2)} alt={gridImages[2]?.post_title || g.label} fill className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110 brightness-75" quality={90} placeholder="empty" unoptimized={true} />
                            {gridImages[2]?.post_title && (
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                                    <h3 className="text-white text-xs font-bold truncate">{gridImages[2].post_title}</h3>
                                </div>
                            )}
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
                                onClick={() => handleClick(idx)}
                            >
                                <Image src={getImgSrc(idx)} alt={gridImages[idx]?.post_title || g.label} fill className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-110 brightness-75" quality={90} placeholder="empty" unoptimized={true} />
                                {gridImages[idx]?.post_title && (
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                                        <h3 className="text-white text-[10px] font-bold truncate">{gridImages[idx].post_title}</h3>
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-[#F4F6F8]/30">
                                    <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center text-white shadow-xl shadow-saffron/40"><Plus size={20} /></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Preview Modal */}
            <GalleryPreviewModal
                items={filteredImages}
                currentIndex={previewIndex}
                isOpen={previewIndex >= 0}
                onClose={() => setPreviewIndex(-1)}
                onIndexChange={setPreviewIndex}
            />
        </>
    );
}
