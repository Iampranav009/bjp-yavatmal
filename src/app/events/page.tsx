"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, Clock, MapPin, Users, Filter, Search, X, ChevronDown, ChevronLeft, ChevronRight, Copy
} from "lucide-react";
import ShareButtons from "@/components/shared/ShareButtons";
import GalleryPreviewModal, { GalleryItem } from "@/components/home/GalleryPreviewModal";

interface Event {
    id: number;
    title: string;
    event_date: string;
    event_time: string;
    place: string;
    host: string | null;
    participant_count: number | null;
    mandal: string | null;
    description: string | null;
    image_url: string | null;
}

const MANDAL_OPTIONS = [
    "All Mandals",
    "Pandharkawda", "Kharwada", "Yavatmal", "Vani", "Wani",
    "Darwha", "Pusad", "Umarkhed", "Mahagaon", "Kalamb",
    "Arni", "Digras", "Ralegaon", "Maregaon", "Zari Jamni",
    "Ghatanji", "Ner",
];

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

function formatTime(timeStr: string) {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const hours = parseInt(h, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
}

function isPast(dateStr: string) {
    return new Date(dateStr) < new Date();
}

function EventCard({ event, index, openModal }: { event: Event, index: number, openModal: (images: string[], title: string, description: string) => void }) {
    const images = event.image_url ? event.image_url.split(',').filter(Boolean).map(s => s.trim()) : [];
    const past = isPast(event.event_date);
    const [imgIndex, setImgIndex] = useState(0);

    // Auto-slide every 2 seconds
    useEffect(() => {
        if (images.length > 1) {
            const timer = setInterval(() => {
                setImgIndex(prev => (prev + 1) % images.length);
            }, 2000);
            return () => clearInterval(timer);
        }
    }, [images.length]);

    const isEven = index % 2 === 0;

    const eventUrl = typeof window !== 'undefined' ? `${window.location.origin}/events?id=${event.id}` : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${isEven ? "" : "lg:flex-row-reverse"}`}
        >
            {/* Image Side */}
            <div className="w-full lg:w-1/2 relative group">
                <div 
                    className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 shadow-xl cursor-pointer"
                    onClick={() => {
                        if (images.length > 0) openModal(images, event.title, event.description || '');
                    }}
                >
                    {images.length > 0 ? (
                        <>
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={imgIndex}
                                    initial={{ opacity: 0.5, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0.5, scale: 0.95 }}
                                    transition={{ duration: 0.4 }}
                                    src={images[imgIndex]}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </AnimatePresence>
                            {/* Slide Indicators */}
                            {images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                                    {images.map((_, i) => (
                                        <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === imgIndex ? "bg-white scale-125" : "bg-white/50"}`} />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                            <Calendar size={48} className="mb-2 opacity-50" />
                            <span className="text-sm font-medium">No Image</span>
                        </div>
                    )}

                    {past && (
                        <div className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                            Completed
                        </div>
                    )}
                </div>
            </div>

            {/* Text Side */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-5">
                <div>
                    {event.mandal && (
                        <span className="inline-block text-[11px] px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold uppercase tracking-wider mb-3 shadow-sm">
                            📍 {event.mandal}
                        </span>
                    )}
                    <h2 className="text-3xl lg:text-4xl font-oswald text-slate-900 leading-tight uppercase tracking-wide mb-4">
                        {event.title}
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2.5 text-slate-600 bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm">
                            <Calendar size={18} className="text-saffron flex-shrink-0" />
                            <span className="font-medium text-sm">{formatDate(event.event_date)}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-600 bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm">
                            <Clock size={18} className="text-saffron flex-shrink-0" />
                            <span className="font-medium text-sm">{formatTime(event.event_time)}</span>
                        </div>
                        <div className="col-span-2 flex items-start gap-2.5 text-slate-600 bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm">
                            <MapPin size={18} className="text-saffron flex-shrink-0 mt-0.5" />
                            <span className="font-medium text-sm leading-snug">{event.place}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                        {event.host && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="text-saffron flex-shrink-0">🪷</span>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Host</span>
                                    <span className="font-medium">{event.host}</span>
                                </div>
                            </div>
                        )}
                        {event.participant_count && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Users size={16} className="text-saffron flex-shrink-0" />
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Count</span>
                                    <span className="font-bold text-saffron">{event.participant_count.toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {event.description && (
                        <p className="text-slate-600 text-[15px] leading-relaxed mb-6 whitespace-pre-wrap">
                            {event.description}
                        </p>
                    )}

                    {/* Share & Copy */}
                    <div className="pt-5 border-t border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Share Event</p>
                        <ShareButtons 
                            url={eventUrl}
                            title={event.title}
                            description={event.description || ''}
                            compact={false}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMandal, setSelectedMandal] = useState("All Mandals");
    const [searchQuery, setSearchQuery] = useState("");
    const [showUpcoming, setShowUpcoming] = useState<"all" | "upcoming" | "past">("upcoming");

    // Modal state
    const [modalItems, setModalItems] = useState<GalleryItem[]>([]);
    const [modalIndex, setModalIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetch("/api/public/events")
            .then((r) => r.json())
            .then((d) => {
                setEvents(d.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredEvents = useMemo(() => {
        return events.filter((ev) => {
            const matchMandal = selectedMandal === "All Mandals" || ev.mandal === selectedMandal;
            const matchSearch =
                !searchQuery ||
                ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (ev.place || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (ev.host || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (ev.mandal || "").toLowerCase().includes(searchQuery.toLowerCase());
            const matchTime =
                showUpcoming === "all" ||
                (showUpcoming === "upcoming" && !isPast(ev.event_date)) ||
                (showUpcoming === "past" && isPast(ev.event_date));
            return matchMandal && matchSearch && matchTime;
        });
    }, [events, selectedMandal, searchQuery, showUpcoming]);

    const openModal = (images: string[], title: string, description: string) => {
        const items = images.map((url, i) => ({
            id: i,
            title: title,
            file_url: url,
            post_title: title,
            post_description: description
        }));
        setModalItems(items);
        setModalIndex(0);
        setModalOpen(true);
    };

    return (
        <div className="pt-20 min-h-screen bg-[#F4F6F8]">
            {/* Hero Banner */}
            <section className="py-12 lg:py-16 border-b border-slate-200 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <p className="text-saffron uppercase font-bold tracking-widest text-sm mb-4 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-saffron/20 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-saffron"></span>
                        </span>
                        BJP Yavatmal
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-oswald uppercase leading-tight text-slate-900">
                        Events &amp; <span className="text-saffron">Programs</span>
                    </h1>
                    <p className="text-slate-600 text-sm md:text-base mt-4 max-w-xl leading-relaxed">
                        Stay updated with BJP Yavatmal&apos;s events, rallies, and programs across all mandals.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="sticky top-20 z-30 bg-white border-b border-slate-200 shadow-sm">
                <div className="container mx-auto px-6 lg:px-12 py-4">
                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Time filter tabs */}
                        <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                            {(["upcoming", "all", "past"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setShowUpcoming(tab)}
                                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-all ${
                                        showUpcoming === tab
                                            ? "bg-saffron text-white"
                                            : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    {tab === "upcoming" ? "Upcoming" : tab === "past" ? "Past" : "All"}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search events..."
                                className="pl-8 pr-8 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron bg-white w-48"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <X size={13} />
                                </button>
                            )}
                        </div>

                        {/* Mandal dropdown */}
                        <div className="relative">
                            <select
                                value={selectedMandal}
                                onChange={(e) => setSelectedMandal(e.target.value)}
                                className="pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-saffron/30 bg-white appearance-none cursor-pointer"
                            >
                                {MANDAL_OPTIONS.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        <span className="text-xs text-slate-400 ml-auto">
                            {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>
            </section>

            {/* Events List */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-6 lg:px-12">
                    {loading ? (
                        <div className="flex justify-center py-24">
                            <div className="w-10 h-10 border-3 border-saffron/30 border-t-saffron rounded-full animate-spin" />
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <Calendar className="text-slate-300 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-slate-500 mb-2">No Events Found</h3>
                            <p className="text-sm text-slate-400">
                                {showUpcoming === "upcoming"
                                    ? "No upcoming events at the moment. Check back soon!"
                                    : "No events match your search."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-20 lg:space-y-32">
                            {filteredEvents.map((event, idx) => (
                                <EventCard key={event.id} event={event} index={idx} openModal={openModal} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Fullscreen modal */}
            <GalleryPreviewModal
                items={modalItems}
                currentIndex={modalIndex}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onIndexChange={setModalIndex}
            />
        </div>
    );
}
