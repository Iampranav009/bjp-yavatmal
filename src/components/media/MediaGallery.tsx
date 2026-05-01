"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, ChevronLeft, ChevronRight, Search, Filter, X } from "lucide-react";
import GalleryPreviewModal, { type GalleryItem } from "@/components/home/GalleryPreviewModal";
import ShareButtons from "@/components/shared/ShareButtons";
import { useLanguage } from "@/lib/LanguageContext";

const MEDIA_SECTIONS = [
    { key: "all", label: "All Media", labelMr: "सर्व मीडिया", emoji: "🗂️" },
    { key: "press_notes", label: "Press Notes / Blog", labelMr: "प्रेस नोट्स / ब्लॉग", emoji: "📰" },
    { key: "print_media", label: "Print Media", labelMr: "मुद्रित माध्यम", emoji: "📄" },
    { key: "electronic_media", label: "Electronic Media", labelMr: "इलेक्ट्रॉनिक माध्यम", emoji: "📺" },
];

const MANDAL_OPTIONS = [
    "सर्व मंडळे",
    "Pandharkawda",
    "Kharwada",
    "Yavatmal",
    "Vani",
    "Wani",
    "Darwha",
    "Pusad",
    "Umarkhed",
    "Mahagaon",
    "Kalamb",
    "Arni",
    "Digras",
    "Ralegaon",
    "Maregaon",
    "Zari Jamni",
    "Ghatanji",
    "Ner",
];

const TEAM_OPTIONS = [
    "सर्व टीम",
    "Core Team",
    "Yuva Morcha",
    "Mahila Morcha",
    "Chemist Front",
    "Student Front",
    "City South",
    "City North",
    "District Committee",
];

export default function MediaGallery() {
    const { t } = useLanguage();
    const g = t("gallery");

    const [allImages, setAllImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewIndex, setPreviewIndex] = useState(-1);
    const [sliderIndices, setSliderIndices] = useState<{ [key: string]: number }>({});

    // Filter state
    const [activeSection, setActiveSection] = useState("all");
    const [selectedMandal, setSelectedMandal] = useState("सर्व मंडळे");
    const [selectedTeam, setSelectedTeam] = useState("सर्व टीम");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetch("/api/public/gallery?target=media")
            .then((r) => r.json())
            .then((d) => {
                setAllImages(d.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Filtered images based on active section + team + mandal + search
    const filteredImages = useMemo(() => {
        return allImages.filter((img) => {
            const matchSection =
                activeSection === "all" ||
                (img as any).media_type === activeSection ||
                // Fallback: use category field if media_type not set
                (activeSection !== "all" && (img.category || "").toLowerCase().replace(/\s+/g, "_") === activeSection);

            const matchMandal =
                selectedMandal === "सर्व मंडळे" ||
                (img as any).mandal === selectedMandal;

            const matchTeam =
                selectedTeam === "सर्व टीम" ||
                (img as any).team === selectedTeam;

            const matchSearch =
                !searchQuery ||
                (img.post_title || img.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (img.post_description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                ((img as any).mandal || "").toLowerCase().includes(searchQuery.toLowerCase());

            return matchSection && matchMandal && matchTeam && matchSearch;
        });
    }, [allImages, activeSection, selectedMandal, selectedTeam, searchQuery]);

    const displayItems = useMemo(() => {
        const results: any[] = [];
        const seenBatches = new Set();
        filteredImages.forEach((img) => {
            if (img.batch_id) {
                if (!seenBatches.has(img.batch_id)) {
                    seenBatches.add(img.batch_id);
                    const group = filteredImages.filter((i) => i.batch_id === img.batch_id);
                    results.push({ type: "group", items: group, key: img.batch_id });
                }
            } else {
                results.push({ type: "single", item: img, key: img.id });
            }
        });
        return results;
    }, [filteredImages]);

    const nextSlide = (e: React.MouseEvent, batchId: string, max: number) => {
        e.stopPropagation();
        setSliderIndices((prev) => ({ ...prev, [batchId]: Math.min((prev[batchId] || 0) + 1, max - 1) }));
    };
    const prevSlide = (e: React.MouseEvent, batchId: string) => {
        e.stopPropagation();
        setSliderIndices((prev) => ({ ...prev, [batchId]: Math.max((prev[batchId] || 0) - 1, 0) }));
    };

    const getShareUrl = (img: GalleryItem) =>
        typeof window !== "undefined" ? `${window.location.origin}${img.file_url}` : "";

    const hasActiveFilters =
        activeSection !== "all" ||
        selectedMandal !== "सर्व मंडळे" ||
        selectedTeam !== "सर्व टीम" ||
        !!searchQuery;

    const clearFilters = () => {
        setActiveSection("all");
        setSelectedMandal("सर्व मंडळे");
        setSelectedTeam("सर्व टीम");
        setSearchQuery("");
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-saffron/30 border-t-saffron rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            {/* ── Section Tabs ────────────────────────────────────────────── */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-2 mb-6">
                    {MEDIA_SECTIONS.map((section) => (
                        <button
                            key={section.key}
                            onClick={() => setActiveSection(section.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                                activeSection === section.key
                                    ? "bg-saffron text-white shadow-md shadow-saffron/30"
                                    : "bg-white text-slate-600 border border-slate-200 hover:border-saffron/50 hover:text-saffron"
                            }`}
                        >
                            <span>{section.emoji}</span>
                            <span>{section.label}</span>
                        </button>
                    ))}
                </div>

                {/* ── Search & Filter Bar ───────────────────────────── */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by title, mandal..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron bg-white"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Filter toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                            showFilters || (selectedMandal !== "सर्व मंडळे" || selectedTeam !== "सर्व टीम")
                                ? "bg-saffron/10 border-saffron/30 text-saffron"
                                : "bg-white border-slate-200 text-slate-600 hover:border-saffron/50"
                        }`}
                    >
                        <Filter size={15} />
                        Filters
                        {(selectedMandal !== "सर्व मंडळे" || selectedTeam !== "सर्व टीम") && (
                            <span className="w-4 h-4 rounded-full bg-saffron text-white text-[10px] flex items-center justify-center">
                                {(selectedMandal !== "सर्व मंडळे" ? 1 : 0) + (selectedTeam !== "सर्व टीम" ? 1 : 0)}
                            </span>
                        )}
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors"
                        >
                            <X size={14} />
                            Clear
                        </button>
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
                            <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Mandal filter */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        मंडळ (Mandal)
                                    </label>
                                    <select
                                        value={selectedMandal}
                                        onChange={(e) => setSelectedMandal(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron bg-white"
                                    >
                                        {MANDAL_OPTIONS.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Team filter */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Team / Wing
                                    </label>
                                    <select
                                        value={selectedTeam}
                                        onChange={(e) => setSelectedTeam(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron bg-white"
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

                {/* Active filter pills */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {activeSection !== "all" && (
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-saffron/10 text-saffron text-xs font-semibold">
                                {MEDIA_SECTIONS.find((s) => s.key === activeSection)?.label}
                                <button onClick={() => setActiveSection("all")}><X size={11} /></button>
                            </span>
                        )}
                        {selectedMandal !== "सर्व मंडळे" && (
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                📍 {selectedMandal}
                                <button onClick={() => setSelectedMandal("सर्व मंडळे")}><X size={11} /></button>
                            </span>
                        )}
                        {selectedTeam !== "सर्व टीम" && (
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                                👥 {selectedTeam}
                                <button onClick={() => setSelectedTeam("सर्व टीम")}><X size={11} /></button>
                            </span>
                        )}
                        {searchQuery && (
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                🔍 &ldquo;{searchQuery}&rdquo;
                                <button onClick={() => setSearchQuery("")}><X size={11} /></button>
                            </span>
                        )}
                        <span className="text-xs text-slate-500 self-center">
                            {filteredImages.length} result{filteredImages.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Results ──────────────────────────────────────────────────── */}
            {filteredImages.length === 0 ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center text-center px-6">
                    <ImageIcon className="text-slate-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-500 mb-2">No Media Found</h3>
                    <p className="text-sm text-slate-400">
                        {hasActiveFilters
                            ? "No media matches your current filters. Try clearing some filters."
                            : "Media content will appear here once uploaded from the admin panel."}
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="mt-4 px-5 py-2 bg-saffron text-white rounded-full text-sm font-semibold hover:bg-saffron/90 transition-colors"
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-16 lg:space-y-24 py-4">
                    {displayItems.map((groupObj, idx) => {
                        const isEven = idx % 2 === 0;
                        const isGroup = groupObj.type === "group";
                        const firstImg = isGroup ? groupObj.items[0] : groupObj.item;
                        const batchId = groupObj.key;
                        const currentImgIndex = isGroup ? (sliderIndices[batchId] || 0) : 0;
                        const currentImg = isGroup ? groupObj.items[currentImgIndex] : groupObj.item;

                        return (
                            <motion.div
                                key={batchId}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6 }}
                                className={`flex flex-col gap-8 lg:gap-16 lg:items-center ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                            >
                                {/* Image side */}
                                <div className="w-full lg:w-[55%] relative group">
                                    <div
                                        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black cursor-pointer shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1 flex items-center justify-center"
                                        onClick={() => {
                                            const globalIndex = filteredImages.findIndex((i) => i.id === currentImg.id);
                                            setPreviewIndex(globalIndex);
                                        }}
                                    >
                                        <img
                                            src={currentImg.file_url}
                                            alt={currentImg.post_title || currentImg.title || ""}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                                        {isGroup && groupObj.items.length > 1 && (
                                            <>
                                                {currentImgIndex > 0 && (
                                                    <button
                                                        onClick={(e) => prevSlide(e, batchId)}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm z-10 transition-colors"
                                                    >
                                                        <ChevronLeft size={20} />
                                                    </button>
                                                )}
                                                {currentImgIndex < groupObj.items.length - 1 && (
                                                    <button
                                                        onClick={(e) => nextSlide(e, batchId, groupObj.items.length)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm z-10 transition-colors"
                                                    >
                                                        <ChevronRight size={20} />
                                                    </button>
                                                )}
                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                                                    {groupObj.items.map((_: any, i: number) => (
                                                        <div
                                                            key={i}
                                                            className={`w-2 h-2 rounded-full shadow transition-all ${i === currentImgIndex ? "bg-white scale-110" : "bg-white/40"}`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Text side */}
                                <div className="w-full lg:w-[45%] flex flex-col justify-center space-y-6">
                                    <div className="space-y-4">
                                        {/* Media type + category badges */}
                                        <div className="flex flex-wrap gap-2">
                                            {(firstImg as any).media_type && (
                                                <span className="inline-block text-[10px] px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold uppercase tracking-wider">
                                                    {MEDIA_SECTIONS.find((s) => s.key === (firstImg as any).media_type)?.label || (firstImg as any).media_type}
                                                </span>
                                            )}
                                            {firstImg.category && (
                                                <span className="inline-block text-[10px] px-3 py-1 rounded-full bg-saffron/10 text-saffron font-bold uppercase tracking-wider">
                                                    {firstImg.category}
                                                </span>
                                            )}
                                            {(firstImg as any).mandal && (
                                                <span className="inline-block text-[10px] px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold uppercase tracking-wider">
                                                    📍 {(firstImg as any).mandal}
                                                </span>
                                            )}
                                            {(firstImg as any).team && (
                                                <span className="inline-block text-[10px] px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold uppercase tracking-wider">
                                                    👥 {(firstImg as any).team}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-oswald text-slate-900 leading-tight tracking-wide">
                                            {firstImg.post_title || firstImg.title || g.label}
                                        </h2>

                                        {firstImg.post_description && (
                                            <p className="text-slate-600 text-[15px] leading-relaxed whitespace-pre-wrap">
                                                {firstImg.post_description}
                                            </p>
                                        )}

                                        {firstImg.post_link && (
                                            <a
                                                href={firstImg.post_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-saffron font-semibold text-sm hover:text-saffron-light transition-colors mt-2"
                                            >
                                                Read Full Article →
                                            </a>
                                        )}
                                    </div>

                                    {/* Share buttons */}
                                    <div className="pt-4 border-t border-slate-200">
                                        <ShareButtons
                                            url={getShareUrl(firstImg)}
                                            title={firstImg.post_title || firstImg.title}
                                            description={firstImg.post_description}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Fullscreen modal */}
            <GalleryPreviewModal
                items={filteredImages}
                currentIndex={previewIndex === -1 ? 0 : previewIndex}
                isOpen={previewIndex !== -1}
                onClose={() => setPreviewIndex(-1)}
                onIndexChange={setPreviewIndex}
            />
        </>
    );
}
