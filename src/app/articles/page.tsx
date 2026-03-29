"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, Facebook, Instagram, MessageCircle, Search, Filter, Bookmark, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import ArticleSidebar from "@/components/articles/ArticleSidebar";
import { useBookmarks } from "@/lib/useBookmarks";

interface BlogPost {
    id: number;
    slug: string;
    post_type: "article" | "interview";
    category: string;
    image_url: string;
    image_position: "left" | "right" | "center";
    image_overlay_text: string;
    title_mr: string;
    title_hi: string;
    title_en: string;
    description_mr: string;
    description_hi: string;
    description_en: string;
    social_facebook: string;
    social_twitter: string;
    social_instagram: string;
    social_whatsapp: string;
    show_social_buttons: boolean;
    created_at: string;
}

type LangKey = "mr" | "hi" | "en";

function getLocalizedField(post: BlogPost, field: string, lang: LangKey): string {
    const key = `${field}_${lang}` as keyof BlogPost;
    const fallbackMr = `${field}_mr` as keyof BlogPost;
    const fallbackEn = `${field}_en` as keyof BlogPost;
    const fallbackHi = `${field}_hi` as keyof BlogPost;
    return (post[key] as string) || (post[fallbackMr] as string) || (post[fallbackEn] as string) || (post[fallbackHi] as string) || "";
}

function formatDate(dateStr: string, lang: LangKey): string {
    const date = new Date(dateStr);
    const localeMap: Record<LangKey, string> = { mr: "mr-IN", hi: "hi-IN", en: "en-IN" };
    return date.toLocaleDateString(localeMap[lang], { day: "numeric", month: "long", year: "numeric" });
}

export default function ArticlesPage() {
    const { lang, t } = useLanguage();
    const b = t("blogPage");
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [category, setCategory] = useState("All Categories");
    const [type, setType] = useState("All Types");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    
    // Pagination
    const limit = 6;
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Bookmarks
    const { toggleBookmark, isBookmarked, isLoaded } = useBookmarks();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchPosts = useCallback(async (reset: boolean = false) => {
        const currentOffset = reset ? 0 : offset;
        if (reset) {
            setLoading(true);
            setHasMore(true);
        } else {
            setLoadingMore(true);
        }

        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: currentOffset.toString(),
            category: category,
            type: type,
            search: debouncedSearch
        });

        try {
            const res = await fetch(`/api/public/blogs?${params.toString()}`);
            const data = await res.json();
            const newPosts = data.data || [];
            
            if (reset) {
                setPosts(newPosts);
                setOffset(newPosts.length);
            } else {
                setPosts(prev => [...prev, ...newPosts]);
                setOffset(prev => prev + newPosts.length);
            }
            
            if (newPosts.length < limit) {
                setHasMore(false);
            }
        } catch {
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [category, type, debouncedSearch, offset, limit]);

    // Refetch on filter change
    useEffect(() => {
        fetchPosts(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, type, debouncedSearch]);

    return (
        <div className="pt-20 min-h-screen bg-[#F4F6F8]">
            {/* Hero Banner & Filters */}
            <section className="py-6 lg:py-8 border-b border-slate-200 bg-white shadow-sm font-sans z-10 relative">
                <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                    <div className="w-full lg:flex-1">
                        <p className="text-saffron uppercase font-bold tracking-widest text-xs mb-2 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-saffron/20 flex items-center justify-center">
                                <span className="w-1 h-1 rounded-full bg-saffron"></span>
                            </span>
                            {b.label}
                        </p>
                        <h1 className="text-3xl md:text-3xl lg:text-4xl font-['Bebas_Neue'] uppercase leading-tight text-slate-900">
                            {b.title.replace(b.titleHighlight, "").trim()}{" "}
                            <span className="text-saffron">{b.titleHighlight}</span>
                        </h1>
                        <p className="text-slate-500 text-xs md:text-sm mt-1 max-w-xl leading-relaxed">
                            {b.description}
                        </p>
                    </div>

                    {/* FILTER BAR INLINE */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto shrink-0">
                        <div className="relative flex-1 sm:w-56">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={b.searchPlaceholder || "Search..."}
                                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-saffron focus:bg-white transition-colors"
                            />
                        </div>
                        <div className="relative">
                            <select 
                                value={category} 
                                onChange={e => setCategory(e.target.value)}
                                className="w-full sm:w-36 appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-saffron"
                            >
                                <option value="All Categories">{b.filterCategory || "All Categories"}</option>
                                <option value="Clean India">Clean India</option>
                                <option value="Defence">Defence</option>
                                <option value="Economic Policy">Economic Policy</option>
                                <option value="Foreign Affairs">Foreign Affairs</option>
                                <option value="Good Governance">Good Governance</option>
                                <option value="Government Schemes">Government Schemes</option>
                                <option value="Internal Security">Internal Security</option>
                                <option value="Legislative Policy">Legislative Policy</option>
                                <option value="Miscellaneous">Miscellaneous</option>
                                <option value="Parliamentary Affairs">Parliamentary Affairs</option>
                                <option value="Political Affairs">Political Affairs</option>
                                <option value="Public Policy">Public Policy</option>
                                <option value="Women Empowerment">Women Empowerment</option>
                            </select>
                            <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative">
                            <select 
                                value={type} 
                                onChange={e => setType(e.target.value)}
                                className="w-full sm:w-28 appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-saffron"
                            >
                                <option value="All Types">{b.filterType || "All Types"}</option>
                                <option value="Article">{b.typeArticle || "Article"}</option>
                                <option value="Interview">{b.typeInterview || "Interview"}</option>
                            </select>
                            <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Layout Split */}
            <section className="py-8 lg:py-10 relative">
                <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* LEFT COLUMN: 75% */}
                    <div className="w-full lg:w-[75%] 2xl:w-[78%] space-y-6">

                        {/* GRID */}
                        {loading && offset === 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200 shadow-sm" />
                                ))}
                            </div>
                        ) : posts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
                                <AnimatePresence mode="popLayout">
                                    {posts.map((post) => {
                                        const title = getLocalizedField(post, "title", lang);
                                        const desc = getLocalizedField(post, "description", lang);
                                        const isInterview = post.post_type === "interview";
                                        
                                        return (
                                            <motion.article
                                                key={`post-${post.id}`}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-white rounded-2xl flex flex-col overflow-hidden border border-slate-200 hover:border-saffron/40 hover:shadow-xl transition-all duration-300 group shadow-sm"
                                            >
                                                {/* Image */}
                                                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 shrink-0">
                                                    {post.image_url ? (
                                                        <img src={post.image_url} alt={title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-saffron/5 to-india-green/5 flex items-center justify-center">
                                                            <span className="text-6xl opacity-10">📰</span>
                                                        </div>
                                                    )}
                                                    {/* Bookmark Overlay Button */}
                                                    {isLoaded && (
                                                        <button 
                                                            onClick={(e) => { e.preventDefault(); toggleBookmark(post.slug || post.id); }}
                                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 flex items-center justify-center transition-colors z-20 group/btn"
                                                            title={isBookmarked(post.slug || post.id) ? "Remove Bookmark" : "Save Article"}
                                                        >
                                                            <Bookmark 
                                                                size={16} 
                                                                className={isBookmarked(post.slug || post.id) ? "text-saffron fill-saffron" : "text-white group-hover/btn:text-saffron transition-colors"} 
                                                            />
                                                        </button>
                                                    )}
                                                    {post.image_overlay_text && (
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                                                            <p className="text-white text-sm font-semibold drop-shadow-md">{post.image_overlay_text}</p>
                                                        </div>
                                                    )}
                                                    {/* Category & Type Badges */}
                                                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                                        {isInterview ? (
                                                            <span className="bg-indigo-600/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm">
                                                                {b.typeInterview || "Interview"}
                                                            </span>
                                                        ) : (
                                                            <span className="bg-saffron/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm">
                                                                {b.typeArticle || "Article"}
                                                            </span>
                                                        )}
                                                        {post.category && post.category !== "Miscellaneous" && (
                                                            <span className="bg-white/95 backdrop-blur-sm text-slate-800 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm">
                                                                {post.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Content */}
                                                <div className="p-5 lg:p-6 flex flex-col flex-1">
                                                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-3 font-medium">
                                                        <Calendar size={12} className="text-saffron" />
                                                        <span>{formatDate(post.created_at, lang)}</span>
                                                    </div>
                                                    <h2 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-saffron transition-colors">
                                                        {title}
                                                    </h2>
                                                    {desc && (
                                                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">{desc}</p>
                                                    )}
                                                    <div className="flex items-center justify-between mt-auto">
                                                        <Link href={`/articles/${post.slug || post.id}`}
                                                            className="inline-flex items-center gap-2 text-saffron font-bold text-sm hover:gap-3 transition-all">
                                                            {b.readMore} <ArrowRight size={14} />
                                                        </Link>
                                                        {post.show_social_buttons && (
                                                            <div className="flex gap-1.5">
                                                                {post.social_facebook && (
                                                                    <a href={post.social_facebook} target="_blank" rel="noopener noreferrer"
                                                                        className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-500 hover:text-white transition-colors">
                                                                        <Facebook size={12} />
                                                                    </a>
                                                                )}
                                                                {post.social_instagram && (
                                                                    <a href={post.social_instagram} target="_blank" rel="noopener noreferrer"
                                                                        className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-pink-500 hover:text-white transition-colors">
                                                                        <Instagram size={12} />
                                                                    </a>
                                                                )}
                                                                {post.social_whatsapp && (
                                                                    <a href={post.social_whatsapp} target="_blank" rel="noopener noreferrer"
                                                                        className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-green-500 hover:text-white transition-colors">
                                                                        <MessageCircle size={12} />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.article>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
                                <span className="text-6xl mb-4 block opacity-20">📰</span>
                                <p className="text-slate-500 text-lg font-medium">{b.noPosts}</p>
                            </div>
                        )}

                        {/* Load More */}
                        {posts.length > 0 && (
                            <div className="flex justify-center mt-8 pt-4">
                                {hasMore ? (
                                    <button 
                                        onClick={() => fetchPosts()}
                                        disabled={loadingMore}
                                        className="bg-white border-2 border-slate-200 text-slate-700 hover:border-saffron hover:text-saffron px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {loadingMore ? <Loader2 size={16} className="animate-spin" /> : "Load More Articles"}
                                    </button>
                                ) : (
                                    <div className="text-slate-400 text-sm font-medium flex-1 text-center py-4 border-t border-slate-200">
                                        — {b.noMore || "No More Articles"} —
                                    </div>
                                )}
                            </div>
                        )}
                        
                    </div>

                    {/* RIGHT COLUMN: 25% */}
                    <div className="w-full lg:w-[25%] 2xl:w-[22%]">
                        <ArticleSidebar />
                    </div>

                </div>
            </section>
        </div>
    );
}
