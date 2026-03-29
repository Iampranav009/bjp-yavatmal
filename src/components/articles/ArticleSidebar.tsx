"use client";

import { useState, useEffect } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import toast from "react-hot-toast";

interface SidebarItem {
    id: number;
    item_type: "announcement" | "banner" | "youtube" | "links";
    title: string | null;
    image_url: string | null;
    video_url: string | null;
    content: string | null;
    target_link: string | null;
}

function extractYouTubeId(url: string) {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
}

export default function ArticleSidebar() {
    const { t } = useLanguage();
    const b = t("blogPage");
    
    const [items, setItems] = useState<SidebarItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Subscribe state
    const [email, setEmail] = useState("");
    const [subscribing, setSubscribing] = useState(false);

    useEffect(() => {
        fetch("/api/public/sidebar")
            .then(res => res.json())
            .then(data => setItems(data.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        
        setSubscribing(true);
        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Subscribed successfully!");
                setEmail("");
            } else {
                toast.error(data.error || "Subscription failed");
            }
        } catch {
            toast.error("Network error");
        }
        setSubscribing(false);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 h-48 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <aside className="sticky top-28 space-y-5">
            {/* Subscription Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 overflow-hidden shadow-sm relative">
                <h3 className="font-bebas text-xl text-slate-900 tracking-wider mb-1.5 relative z-10">{b.subscribeBox || "SUBSCRIBE TO ARTICLES"}</h3>
                <p className="text-slate-500 text-xs mb-4 relative z-10">Get the latest updates directly in your inbox.</p>
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5 relative z-10">
                    <input 
                        type="text" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder={b.emailPlaceholder || "Email ID or Phone No"}
                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white focus:text-slate-900 transition-colors border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none placeholder:text-slate-400"
                    />
                    <button 
                        type="submit" 
                        disabled={subscribing || !email}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-wide text-xs py-2 flex justify-center items-center gap-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {subscribing ? <Loader2 size={14} className="animate-spin" /> : <>{b.subscribeBtn || "Go"} <ArrowRight size={14} /></>}
                    </button>
                </form>
            </div>

            {/* Dynamic Items */}
            {items.map(item => {
                // ANNOUNCEMENT
                if (item.item_type === "announcement") {
                    const Content = (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 hover:border-saffron/30 transition-colors shadow-sm">
                            {item.title && <h4 className="font-bold text-slate-900 text-xs mb-1.5">{item.title}</h4>}
                            <p className="text-slate-600 text-xs whitespace-pre-wrap leading-relaxed">{item.content}</p>
                        </div>
                    );
                    return item.target_link ? (
                        <a key={item.id} href={item.target_link} target="_blank" rel="noopener noreferrer" className="block transform hover:-translate-y-1 transition-transform">
                            {Content}
                        </a>
                    ) : (
                        <div key={item.id}>{Content}</div>
                    );
                }

                // BANNER
                if (item.item_type === "banner" && item.image_url) {
                    const Banner = (
                        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group relative shadow-sm">
                            {item.title && (
                                <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/60 to-transparent p-3 pt-2 z-10">
                                    <h4 className="font-bold text-white text-xs line-clamp-2 drop-shadow-md">{item.title}</h4>
                                </div>
                            )}
                            <img src={item.image_url} alt={item.title || "Banner"} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                    );
                    return item.target_link ? (
                        <a key={item.id} href={item.target_link} target="_blank" rel="noopener noreferrer" className="block transform hover:-translate-y-1 transition-transform shadow-sm hover:shadow-md rounded-xl">
                            {Banner}
                        </a>
                    ) : (
                        <div key={item.id} className="shadow-sm">{Banner}</div>
                    );
                }

                // YOUTUBE
                if (item.item_type === "youtube" && item.video_url) {
                    const videoId = extractYouTubeId(item.video_url);
                    if (!videoId) return null;
                    // Determine if it looks like a shorts link based on URL
                    const isShorts = item.video_url.includes("shorts/");
                    return (
                        <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                            {item.title && <div className="p-3.5 border-b border-slate-100"><h4 className="font-bold text-slate-900 text-xs">{item.title}</h4></div>}
                            <div className={`relative w-full ${isShorts ? 'aspect-[9/16]' : 'aspect-video'} bg-black`}>
                                <iframe 
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title={item.title || "YouTube Video"}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    );
                }

                return null;
            })}
        </aside>
    );
}
