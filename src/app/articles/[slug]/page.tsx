"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Facebook, Instagram, MessageCircle, Share2, Loader2, Link2, Bookmark } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import toast from "react-hot-toast";
import ArticleSidebar from "@/components/articles/ArticleSidebar";
import { useBookmarks } from "@/lib/useBookmarks";

interface BlogPost {
    id: number;
    slug: string;
    post_type: "article" | "interview";
    category: string;
    author_name_mr: string;
    author_name_hi: string;
    author_name_en: string;
    image_url: string;
    image_position: "left" | "right" | "center";
    image_overlay_text: string;
    title_mr: string;
    title_hi: string;
    title_en: string;
    content_mr: string;
    content_hi: string;
    content_en: string;
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

export default function ArticleDetailPage() {
    const { slug } = useParams() as { slug: string };
    const router = useRouter();
    const { lang, t } = useLanguage();
    const b = t("blogPage");
    
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Bookmarks
    const { toggleBookmark, isBookmarked, isLoaded } = useBookmarks();

    useEffect(() => {
        if (!slug) return;
        
        fetch(`/api/public/blogs?slug=${encodeURIComponent(slug)}`)
            .then(res => res.json())
            .then(data => {
                if (data.data) {
                    setPost(data.data);
                } else {
                    setPost(null);
                }
            })
            .catch(() => setPost(null))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="pt-20 min-h-screen bg-[#F4F6F8] flex items-center justify-center">
                <Loader2 className="animate-spin text-saffron" size={48} />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="pt-20 min-h-screen bg-[#F4F6F8] flex flex-col items-center justify-center">
                <span className="text-8xl opacity-10 mb-6">📰</span>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{b.notFound || "Article not found"}</h1>
                <p className="text-slate-500 mb-6">The article you are looking for does not exist or has been removed.</p>
                <button onClick={() => router.push("/articles")} className="bg-saffron text-white px-6 py-3 rounded-lg font-semibold hover:bg-saffron-light transition-colors flex items-center gap-2">
                    <ArrowLeft size={16} /> {b.backToBlog || "Back to Articles"}
                </button>
            </div>
        );
    }

    const title = getLocalizedField(post, "title", lang);
    const content = getLocalizedField(post, "content", lang);
    const authorName = getLocalizedField(post, "author_name", lang);
    const isInterview = post.post_type === "interview";

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="pt-20 min-h-screen bg-[#F4F6F8]">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 lg:px-12 py-8 lg:py-12">
                    <button onClick={() => router.push("/articles")} 
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-saffron transition-colors font-medium text-sm mb-6">
                        <ArrowLeft size={16} /> {b.backToBlog || "Back to Articles"}
                    </button>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isInterview ? 'bg-indigo-100 text-indigo-700' : 'bg-saffron/10 text-saffron'}`}>
                            {isInterview ? (b.typeInterview || "Interview") : (b.typeArticle || "Article")}
                        </span>
                        {post.category && post.category !== "Miscellaneous" && (
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {post.category}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
                        {title}
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-slate-500">
                            {authorName && (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-400">
                                        {authorName.charAt(0)}
                                    </div>
                                    <span className="font-semibold text-slate-900">{authorName}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <span>{formatDate(post.created_at, lang)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isLoaded && (
                                <button 
                                    onClick={() => toggleBookmark(post.slug || post.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs transition-colors mr-1 sm:mr-3 ${isBookmarked(post.slug || post.id) ? 'bg-saffron text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <Bookmark size={14} className={isBookmarked(post.slug || post.id) ? "fill-white" : ""} />
                                    <span className="hidden sm:inline">{isBookmarked(post.slug || post.id) ? "Saved" : "Save"}</span>
                                </button>
                            )}
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mr-1 sm:mr-2 hidden sm:inline">{b.share || "Share"}:</span>
                            <button onClick={copyLink} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors">
                                <Link2 size={14} />
                            </button>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors">
                                <Facebook size={14} />
                            </a>
                            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-sky-50 text-sky-500 hover:bg-sky-100 flex items-center justify-center transition-colors">
                                <span><svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.094H5.078z"></path></svg></span>
                            </a>
                            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors">
                                <MessageCircle size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content & Sidebar Layout */}
            <section className="py-8 lg:py-10 relative">
                <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    
                    {/* LEFT COLUMN: 75% */}
                    <div className="w-full lg:w-[75%] 2xl:w-[78%]">
                        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            {post.image_url && (
                                <div className="relative w-full aspect-[16/9] lg:aspect-[2/1] bg-slate-100">
                                    <img src={post.image_url} alt={title} className="w-full h-full object-cover" />
                                    {post.image_overlay_text && (
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-6 pt-12">
                                            <p className="text-white text-lg font-semibold">{post.image_overlay_text}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="p-6 md:p-10 lg:p-12">
                                <div 
                                    className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-saffron prose-img:rounded-xl"
                                    dangerouslySetInnerHTML={{ __html: content }}
                                />

                                {/* Social Links if provided */}
                                {post.show_social_buttons && (post.social_facebook || post.social_instagram || post.social_twitter || post.social_whatsapp) && (
                                    <div className="mt-12 pt-8 border-t border-slate-200">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4">{b.followUs || "Follow Us"}</h3>
                                        <div className="flex gap-3">
                                            {post.social_facebook && (
                                                <a href={post.social_facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 text-blue-600 hover:bg-blue-50 font-medium text-sm transition-colors border border-slate-200">
                                                    <Facebook size={16} /> Facebook
                                                </a>
                                            )}
                                            {post.social_instagram && (
                                                <a href={post.social_instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 text-pink-600 hover:bg-pink-50 font-medium text-sm transition-colors border border-slate-200">
                                                    <Instagram size={16} /> Instagram
                                                </a>
                                            )}
                                            {post.social_twitter && (
                                                <a href={post.social_twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 text-sky-500 hover:bg-sky-50 font-medium text-sm transition-colors border border-slate-200">
                                                    <span><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.094H5.078z"></path></svg></span> Twitter
                                                </a>
                                            )}
                                            {post.social_whatsapp && (
                                                <a href={post.social_whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 text-green-600 hover:bg-green-50 font-medium text-sm transition-colors border border-slate-200">
                                                    <MessageCircle size={16} /> WhatsApp
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </article>
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
