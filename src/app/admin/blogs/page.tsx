"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, X, Loader2, MoreVertical, Edit2, Trash2, Eye, EyeOff,
    Upload, ImageIcon, Bold, Italic, Type, Palette, Languages,
    Facebook, Twitter, Instagram, MessageCircle, Link2, ChevronDown
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import toast from "react-hot-toast";

interface BlogPost {
    id: number;
    image_url: string;
    image_position: "left" | "right" | "center";
    image_overlay_text: string;
    title_mr: string;
    title_hi: string;
    title_en: string;
    description_mr: string;
    description_hi: string;
    description_en: string;
    content_mr: string;
    content_hi: string;
    content_en: string;
    social_facebook: string;
    social_twitter: string;
    social_instagram: string;
    social_whatsapp: string;
    show_social_buttons: boolean;
    is_published: boolean;
    is_hidden: boolean;
    slug: string;
    post_type: "article" | "interview";
    category: string;
    author_name_mr: string;
    author_name_hi: string;
    author_name_en: string;
    created_at: string;
}

const CATEGORIES = [
    "Clean India", "Defence", "Economic Policy", "Foreign Affairs", "Good Governance",
    "Government Schemes", "Internal Security", "Legislative Policy", "Miscellaneous",
    "Parliamentary Affairs", "Political Affairs", "Public Policy", "Women Empowerment"
];

type LangKey = "mr" | "hi" | "en";
const LANG_LABELS: Record<LangKey, string> = { mr: "मराठी", hi: "हिंदी", en: "English" };

// Free translation using MyMemory API (no key required)
async function translateText(text: string, from: string, to: string): Promise<string> {
    if (!text || !text.trim()) return "";
    // Strip HTML for plain-text translation, translate, then return
    const plainText = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (!plainText) return "";
    try {
        const langMap: Record<string, string> = { mr: "mr", hi: "hi", en: "en" };
        const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(plainText.substring(0, 500))}&langpair=${langMap[from]}|${langMap[to]}`
        );
        const data = await res.json();
        if (data.responseData?.translatedText) {
            const translated = data.responseData.translatedText;
            // If the original was HTML (content), wrap in <p> tags
            if (text.includes("<")) {
                return `<p>${translated}</p>`;
            }
            return translated;
        }
        return text;
    } catch {
        return text;
    }
}

function generateSlug(text: string): string {
    if (!text) return "article-" + Date.now();
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export default function AdminBlogsPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState<number | null>(null);
    const [showEditor, setShowEditor] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [saving, setSaving] = useState(false);
    const [translating, setTranslating] = useState(false);

    // Editor form state
    const [imageUrl, setImageUrl] = useState("");
    const [imagePosition, setImagePosition] = useState<"left" | "right" | "center">("center");
    const [imageOverlay, setImageOverlay] = useState("");
    const [activeLang, setActiveLang] = useState<LangKey>("mr");
    const [titles, setTitles] = useState<Record<LangKey, string>>({ mr: "", hi: "", en: "" });
    const [descriptions, setDescriptions] = useState<Record<LangKey, string>>({ mr: "", hi: "", en: "" });
    const [contents, setContents] = useState<Record<LangKey, string>>({ mr: "", hi: "", en: "" });
    const [authors, setAuthors] = useState<Record<LangKey, string>>({ mr: "", hi: "", en: "" });
    const [slug, setSlug] = useState("");
    const [postType, setPostType] = useState<"article" | "interview">("article");
    const [category, setCategory] = useState("Miscellaneous");
    const [socialFb, setSocialFb] = useState("");
    const [socialTw, setSocialTw] = useState("");
    const [socialIg, setSocialIg] = useState("");
    const [socialWa, setSocialWa] = useState("");
    const [showSocial, setShowSocial] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fileRef = useRef<HTMLInputElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);

    const fetchPosts = useCallback(async () => {
        try {
            const res = await fetch("/api/blogs");
            const data = await res.json();
            setPosts(data.data || []);
        } catch { /* silent */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    const resetForm = () => {
        setImageUrl("");
        setImagePosition("center");
        setImageOverlay("");
        setTitles({ mr: "", hi: "", en: "" });
        setDescriptions({ mr: "", hi: "", en: "" });
        setContents({ mr: "", hi: "", en: "" });
        setAuthors({ mr: "", hi: "", en: "" });
        setSlug("");
        setPostType("article");
        setCategory("Miscellaneous");
        setSocialFb("");
        setSocialTw("");
        setSocialIg("");
        setSocialWa("");
        setShowSocial(false);
        setActiveLang("mr");
        setEditingPost(null);
    };

    const openNew = () => {
        resetForm();
        setShowEditor(true);
    };

    const openEdit = (post: BlogPost) => {
        setEditingPost(post);
        setImageUrl(post.image_url || "");
        setImagePosition(post.image_position || "center");
        setImageOverlay(post.image_overlay_text || "");
        setTitles({ mr: post.title_mr || "", hi: post.title_hi || "", en: post.title_en || "" });
        setDescriptions({ mr: post.description_mr || "", hi: post.description_hi || "", en: post.description_en || "" });
        setContents({ mr: post.content_mr || "", hi: post.content_hi || "", en: post.content_en || "" });
        setAuthors({ mr: post.author_name_mr || "", hi: post.author_name_hi || "", en: post.author_name_en || "" });
        setSlug(post.slug || "");
        setPostType(post.post_type || "article");
        setCategory(post.category || "Miscellaneous");
        setSocialFb(post.social_facebook || "");
        setSocialTw(post.social_twitter || "");
        setSocialIg(post.social_instagram || "");
        setSocialWa(post.social_whatsapp || "");
        setShowSocial(post.show_social_buttons || false);
        setActiveLang("mr");
        setShowEditor(true);
        setMenuOpen(null);
    };

    const handleImageUpload = async (files: FileList | null) => {
        if (!files || !files[0]) return;
        setUploading(true);
        const fd = new FormData();
        fd.append("file", files[0]);
        try {
            const res = await fetch("/api/blogs/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (res.ok && data.data?.file_url) {
                setImageUrl(data.data.file_url);
                toast.success("Image uploaded!");
            } else {
                toast.error(data.error || "Upload failed");
            }
        } catch {
            toast.error("Network error");
        }
        setUploading(false);
    };

    // Sync contentEditable changes
    const handleEditorInput = () => {
        if (editorRef.current) {
            setContents(prev => ({ ...prev, [activeLang]: editorRef.current!.innerHTML }));
        }
    };

    // Set editor HTML when switching tabs
    useEffect(() => {
        if (editorRef.current && showEditor) {
            editorRef.current.innerHTML = contents[activeLang] || "";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeLang, showEditor]);

    const execCmd = (cmd: string, val?: string) => {
        editorRef.current?.focus();
        document.execCommand(cmd, false, val);
        handleEditorInput();
    };

    const handleTranslate = async () => {
        // Determine source language (use whichever has content)
        let sourceLang: LangKey = "mr";
        if (titles.mr) sourceLang = "mr";
        else if (titles.hi) sourceLang = "hi";
        else if (titles.en) sourceLang = "en";

        if (!titles[sourceLang]) {
            toast.error("Please write at least the title in one language first");
            return;
        }

        setTranslating(true);
        const targetLangs = (["mr", "hi", "en"] as LangKey[]).filter(l => l !== sourceLang);

        try {
            const newTitles = { ...titles };
            const newDescs = { ...descriptions };
            const newContents = { ...contents };

            // Sync current editor content
            if (editorRef.current) {
                newContents[activeLang] = editorRef.current.innerHTML;
            }

            for (const target of targetLangs) {
                if (!newTitles[target] || newTitles[target] === titles[sourceLang]) {
                    newTitles[target] = await translateText(newTitles[sourceLang], sourceLang, target);
                }
                if (newDescs[sourceLang] && (!newDescs[target] || newDescs[target] === newDescs[sourceLang])) {
                    newDescs[target] = await translateText(newDescs[sourceLang], sourceLang, target);
                }
                if (newContents[sourceLang] && (!newContents[target] || newContents[target] === newContents[sourceLang])) {
                    newContents[target] = await translateText(newContents[sourceLang], sourceLang, target);
                }
            }

            setTitles(newTitles);
            setDescriptions(newDescs);
            setContents(newContents);
            toast.success("Translation complete! Review each language tab.");
        } catch {
            toast.error("Translation failed");
        }
        setTranslating(false);
    };

    const handleSave = async () => {
        // Sync editor content
        if (editorRef.current) {
            contents[activeLang] = editorRef.current.innerHTML;
        }

        if (!titles.mr && !titles.hi && !titles.en) {
            toast.error("Please add a title in at least one language");
            return;
        }

        setSaving(true);
        const payload = {
            ...(editingPost ? { id: editingPost.id } : {}),
            image_url: imageUrl || null,
            image_position: imagePosition,
            image_overlay_text: imageOverlay || null,
            title_mr: titles.mr || titles.hi || titles.en,
            title_hi: titles.hi || null,
            title_en: titles.en || null,
            description_mr: descriptions.mr || null,
            description_hi: descriptions.hi || null,
            description_en: descriptions.en || null,
            content_mr: contents.mr || null,
            content_hi: contents.hi || null,
            content_en: contents.en || null,
            slug: slug || generateSlug(titles.en || titles.mr),
            post_type: postType,
            category: category,
            author_name_mr: authors.mr || null,
            author_name_hi: authors.hi || null,
            author_name_en: authors.en || null,
            social_facebook: socialFb || null,
            social_twitter: socialTw || null,
            social_instagram: socialIg || null,
            social_whatsapp: socialWa || null,
            show_social_buttons: showSocial,
            is_published: true,
        };

        try {
            const res = await fetch("/api/blogs", {
                method: editingPost ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                toast.success(editingPost ? "Blog post updated!" : "Blog post published!");
                setShowEditor(false);
                resetForm();
                fetchPosts();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to save");
            }
        } catch {
            toast.error("Network error");
        }
        setSaving(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this blog post permanently?")) return;
        try {
            await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
            toast.success("Blog post deleted");
            setMenuOpen(null);
            fetchPosts();
        } catch { toast.error("Failed to delete"); }
    };

    const handleToggleHidden = async (post: BlogPost) => {
        try {
            await fetch("/api/blogs", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: post.id, is_hidden: !post.is_hidden }),
            });
            toast.success(post.is_hidden ? "Blog post is now visible" : "Blog post hidden");
            setMenuOpen(null);
            fetchPosts();
        } catch { toast.error("Failed to update"); }
    };

    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const TEXT_COLORS = ["#000000", "#FF6A00", "#138808", "#2563eb", "#dc2626", "#7c3aed", "#0d9488", "#ca8a04"];

    return (
        <>
            <AdminNavbar title="Blog Posts" />
            <main className="p-5 lg:p-8 space-y-6">
                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bebas text-slate-900 tracking-[0.1em]">MANAGE BLOG POSTS</h2>
                        <p className="text-xs text-slate-500 mt-0.5">{posts.length} post(s) total</p>
                    </div>
                    <button onClick={openNew}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-saffron hover:bg-saffron-light text-white text-sm font-semibold rounded-lg transition-colors">
                        <Plus size={16} /> New Post
                    </button>
                </div>

                {/* Posts Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-xl h-64 animate-pulse" />
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {posts.map((post, i) => (
                            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className={`group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all ${post.is_hidden ? "opacity-60" : ""}`}>
                                {/* Image */}
                                <div className="aspect-[16/10] relative bg-slate-100">
                                    {post.image_url ? (
                                        <img src={post.image_url} alt={post.title_mr} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="text-slate-300" size={40} />
                                        </div>
                                    )}
                                    {post.image_overlay_text && (
                                        <div className="absolute inset-0 bg-black/30 flex items-end p-3">
                                            <p className="text-white text-xs font-medium">{post.image_overlay_text}</p>
                                        </div>
                                    )}
                                    {/* Status badges */}
                                    <div className="absolute top-2 left-2 flex gap-1.5">
                                        {post.is_hidden && (
                                            <span className="bg-red-500/90 text-white px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1">
                                                <EyeOff size={10} /> Hidden
                                            </span>
                                        )}
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${post.image_position === "left" ? "bg-blue-500/90 text-white" : post.image_position === "right" ? "bg-purple-500/90 text-white" : "bg-green-500/90 text-white"}`}>
                                            Img: {post.image_position}
                                        </span>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="text-slate-900 text-sm font-semibold line-clamp-2 mb-1.5">{post.title_mr || post.title_en || post.title_hi}</h3>
                                    <p className="text-slate-500 text-xs line-clamp-2 mb-3">{post.description_mr || post.description_en || post.description_hi || "No description"}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {post.title_mr && <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 font-semibold">MR</span>}
                                            {post.title_hi && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold">HI</span>}
                                            {post.title_en && <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-50 text-green-600 font-semibold">EN</span>}
                                        </div>
                                        <div className="relative">
                                            <button onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)}
                                                className="text-slate-500 hover:text-slate-900 transition-colors p-1">
                                                <MoreVertical size={16} />
                                            </button>
                                            {menuOpen === post.id && (
                                                <>
                                                    <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(null)} />
                                                    <div className="absolute right-0 bottom-8 w-44 bg-white border border-slate-200 rounded-xl shadow-2xl z-40 py-1">
                                                        <button onClick={() => openEdit(post)}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">
                                                            <Edit2 size={12} /> Edit Post
                                                        </button>
                                                        <button onClick={() => handleToggleHidden(post)}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-600 hover:bg-amber-50">
                                                            {post.is_hidden ? <Eye size={12} /> : <EyeOff size={12} />}
                                                            {post.is_hidden ? "Show Post" : "Hide Post"}
                                                        </button>
                                                        <button onClick={() => handleDelete(post.id)}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50">
                                                            <Trash2 size={12} /> Delete Post
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                        <ImageIcon className="text-slate-900/10 mx-auto mb-3" size={40} />
                        <p className="text-slate-500 text-sm">No blog posts yet</p>
                        <button onClick={openNew} className="mt-3 text-saffron text-sm font-semibold hover:underline">
                            Create your first post →
                        </button>
                    </div>
                )}
            </main>

            {/* ========== CREATE/EDIT MODAL ========== */}
            <AnimatePresence>
                {showEditor && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => { setShowEditor(false); resetForm(); }}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}>

                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-slate-200 flex-shrink-0">
                                <div>
                                    <h2 className="font-bebas text-slate-900 tracking-[0.1em] text-lg">
                                        {editingPost ? "EDIT BLOG POST" : "CREATE BLOG POST"}
                                    </h2>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Fill in all details and publish</p>
                                </div>
                                <button onClick={() => { setShowEditor(false); resetForm(); }} className="text-slate-500 hover:text-slate-900">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-5 border-b border-slate-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">SEO Slug</label>
                                        <div className="flex items-center">
                                            <span className="bg-slate-100 border border-slate-200 border-r-0 rounded-l-lg px-3 py-2 text-xs text-slate-500 whitespace-nowrap">/articles/</span>
                                            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))}
                                                placeholder="my-article-title" className="flex-1 bg-white border border-slate-200 rounded-r-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-saffron" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Type</label>
                                            <select value={postType} onChange={(e) => setPostType(e.target.value as any)}
                                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-saffron">
                                                <option value="article">Article</option>
                                                <option value="interview">Interview</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                                            <select value={category} onChange={(e) => setCategory(e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-saffron">
                                                {CATEGORIES.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 space-y-5 overflow-y-auto flex-1">

                                {/* ===== IMAGE UPLOAD + POSITION ===== */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Post Image</label>
                                        {imageUrl ? (
                                            <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-[16/10]">
                                                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                                                {imageOverlay && (
                                                    <div className="absolute inset-0 bg-black/30 flex items-end p-3">
                                                        <p className="text-white text-xs font-medium">{imageOverlay}</p>
                                                    </div>
                                                )}
                                                <button onClick={() => setImageUrl("")}
                                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center shadow-lg">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div onClick={() => fileRef.current?.click()}
                                                className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-saffron/40 transition-colors group aspect-[16/10] flex flex-col items-center justify-center">
                                                {uploading ? (
                                                    <Loader2 className="text-saffron animate-spin mb-2" size={28} />
                                                ) : (
                                                    <Upload className="text-slate-300 group-hover:text-saffron/50 mb-2 transition-colors" size={28} />
                                                )}
                                                <p className="text-slate-600 text-xs font-medium">Click to upload an image</p>
                                                <p className="text-slate-400 text-[10px] mt-1">JPG, PNG, WebP — Max 5MB</p>
                                            </div>
                                        )}
                                        <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.heic,.heif" className="hidden"
                                            onChange={(e) => { handleImageUpload(e.target.files); e.target.value = ""; }} />
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Image Position on Card</label>
                                            <div className="flex gap-2">
                                                {(["left", "center", "right"] as const).map(pos => (
                                                    <button key={pos} type="button" onClick={() => setImagePosition(pos)}
                                                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border capitalize transition-colors ${imagePosition === pos
                                                            ? "bg-saffron text-white border-saffron"
                                                            : "bg-white text-slate-600 border-slate-200 hover:border-saffron/30"
                                                            }`}>{pos}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">Image Overlay Text <span className="text-slate-400 font-normal">(optional)</span></label>
                                            <input type="text" value={imageOverlay} onChange={(e) => setImageOverlay(e.target.value)}
                                                placeholder="Text shown on top of the image..."
                                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" />
                                        </div>
                                    </div>
                                </div>

                                {/* ===== LANGUAGE TABS ===== */}
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4">
                                        <div className="flex">
                                            {(["mr", "hi", "en"] as LangKey[]).map(lang => (
                                                <button key={lang} onClick={() => setActiveLang(lang)}
                                                    className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${activeLang === lang
                                                        ? "border-saffron text-saffron"
                                                        : "border-transparent text-slate-500 hover:text-slate-700"
                                                        }`}>
                                                    {LANG_LABELS[lang]}
                                                    {titles[lang] && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />}
                                                </button>
                                            ))}
                                        </div>
                                        <button onClick={handleTranslate} disabled={translating}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold rounded-lg transition-colors disabled:opacity-50">
                                            {translating ? <Loader2 size={12} className="animate-spin" /> : <Languages size={12} />}
                                            {translating ? "Translating..." : "Translate All"}
                                        </button>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        {/* Title */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">Title ({LANG_LABELS[activeLang]})</label>
                                            <input type="text" value={titles[activeLang]}
                                                onChange={(e) => {
                                                    setTitles(prev => ({ ...prev, [activeLang]: e.target.value }));
                                                    // Auto-generate slug globally if english or marathi title typed and slug is empty
                                                    if (!slug && (activeLang === 'en' || activeLang === 'mr')) {
                                                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/gu, '-').replace(/(^-|-$)+/g, ''));
                                                    }
                                                }}
                                                placeholder={`Blog post title in ${LANG_LABELS[activeLang]}...`}
                                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" />
                                        </div>
                                        {/* Author */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">Author Name ({LANG_LABELS[activeLang]})</label>
                                            <input type="text" value={authors[activeLang]}
                                                onChange={(e) => setAuthors(prev => ({ ...prev, [activeLang]: e.target.value }))}
                                                placeholder={`e.g. by Shri Amit Shah`}
                                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-saffron" />
                                        </div>
                                        {/* Description */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description ({LANG_LABELS[activeLang]})</label>
                                            <textarea value={descriptions[activeLang]}
                                                onChange={(e) => setDescriptions(prev => ({ ...prev, [activeLang]: e.target.value }))}
                                                placeholder={`Brief summary for the post card...`}
                                                rows={2}
                                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron resize-none" />
                                        </div>
                                        {/* Rich Text Editor */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Content ({LANG_LABELS[activeLang]})</label>
                                            {/* Toolbar */}
                                            <div className="flex items-center gap-1 p-2 bg-slate-50 border border-slate-200 border-b-0 rounded-t-lg flex-wrap">
                                                <button type="button" onClick={() => execCmd("bold")} title="Bold"
                                                    className="w-8 h-8 rounded flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors">
                                                    <Bold size={14} />
                                                </button>
                                                <button type="button" onClick={() => execCmd("italic")} title="Italic"
                                                    className="w-8 h-8 rounded flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors">
                                                    <Italic size={14} />
                                                </button>
                                                <div className="w-px h-5 bg-slate-200 mx-1" />
                                                <button type="button" onClick={() => execCmd("formatBlock", "<h2>")} title="Heading"
                                                    className="w-8 h-8 rounded flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold">
                                                    H
                                                </button>
                                                <button type="button" onClick={() => execCmd("formatBlock", "<p>")} title="Paragraph"
                                                    className="w-8 h-8 rounded flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors">
                                                    <Type size={14} />
                                                </button>
                                                <button type="button" onClick={() => execCmd("insertUnorderedList")} title="Bullet List"
                                                    className="w-8 h-8 rounded flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold">
                                                    •≡
                                                </button>
                                                <div className="w-px h-5 bg-slate-200 mx-1" />
                                                {/* Color picker */}
                                                <div className="relative">
                                                    <button type="button" onClick={() => setColorPickerOpen(!colorPickerOpen)} title="Text Color"
                                                        className="w-8 h-8 rounded flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors">
                                                        <Palette size={14} />
                                                    </button>
                                                    {colorPickerOpen && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setColorPickerOpen(false)} />
                                                            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl p-2 z-20 flex gap-1 flex-wrap w-[140px]">
                                                                {TEXT_COLORS.map(c => (
                                                                    <button key={c} type="button"
                                                                        onClick={() => { execCmd("foreColor", c); setColorPickerOpen(false); }}
                                                                        className="w-6 h-6 rounded-full border border-slate-200 hover:scale-110 transition-transform"
                                                                        style={{ backgroundColor: c }} />
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                {/* Font size */}
                                                <select
                                                    onChange={(e) => execCmd("fontSize", e.target.value)}
                                                    className="text-[11px] bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none [color-scheme:light]"
                                                    defaultValue="3">
                                                    <option value="1">Small</option>
                                                    <option value="3">Normal</option>
                                                    <option value="5">Large</option>
                                                    <option value="7">Huge</option>
                                                </select>
                                            </div>
                                            {/* Editor area */}
                                            <div ref={editorRef}
                                                contentEditable
                                                suppressContentEditableWarning
                                                onInput={handleEditorInput}
                                                className="min-h-[180px] max-h-[300px] overflow-y-auto bg-white border border-slate-200 rounded-b-lg px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-saffron prose prose-sm max-w-none"
                                                style={{ lineHeight: 1.7 }} />
                                        </div>
                                    </div>
                                </div>

                                {/* ===== SOCIAL MEDIA LINKS ===== */}
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <button type="button" onClick={() => setShowSocial(!showSocial)}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                                        <span className="flex items-center gap-2"><Link2 size={14} /> Social Media Links</span>
                                        <ChevronDown size={14} className={`transition-transform ${showSocial ? "rotate-180" : ""}`} />
                                    </button>
                                    {showSocial && (
                                        <div className="p-4 space-y-3 border-t border-slate-200">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="flex items-center gap-2">
                                                    <Facebook size={14} className="text-blue-600 shrink-0" />
                                                    <input type="url" value={socialFb} onChange={(e) => setSocialFb(e.target.value)}
                                                        placeholder="Facebook URL" className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-saffron" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Twitter size={14} className="text-sky-500 shrink-0" />
                                                    <input type="url" value={socialTw} onChange={(e) => setSocialTw(e.target.value)}
                                                        placeholder="Twitter/X URL" className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-saffron" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Instagram size={14} className="text-pink-600 shrink-0" />
                                                    <input type="url" value={socialIg} onChange={(e) => setSocialIg(e.target.value)}
                                                        placeholder="Instagram URL" className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-saffron" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MessageCircle size={14} className="text-green-600 shrink-0" />
                                                    <input type="url" value={socialWa} onChange={(e) => setSocialWa(e.target.value)}
                                                        placeholder="WhatsApp URL" className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-saffron" />
                                                </div>
                                            </div>
                                            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                                                <input type="checkbox" checked={showSocial} onChange={(e) => setShowSocial(e.target.checked)}
                                                    className="rounded border-slate-300 text-saffron focus:ring-saffron" />
                                                Show social media buttons on the post
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* Publish Button */}
                                <button onClick={handleSave} disabled={saving}
                                    className="w-full bg-saffron hover:bg-saffron-light text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                                    {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editingPost ? "Update Post" : "Publish Post"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
