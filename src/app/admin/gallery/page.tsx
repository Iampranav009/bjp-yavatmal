"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImageIcon, Trash2, Copy, X, Loader2, MoreVertical } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import toast from "react-hot-toast";

interface GalleryImage {
    id: number;
    title: string;
    file_name: string;
    file_url: string;
    category: string;
    uploaded_at: string;
}

const CATEGORIES = ["general", "hero", "events", "leaders", "development", "youth"];

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [menuOpen, setMenuOpen] = useState<number | null>(null);
    const [filterCat, setFilterCat] = useState("all");
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadCat, setUploadCat] = useState("general");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    const fetchImages = useCallback(async () => {
        try {
            const res = await fetch("/api/gallery");
            const data = await res.json();
            setImages(data.data || []);
        } catch { /* silent */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchImages(); }, [fetchImages]);

    const handleUpload = async () => {
        if (!selectedFiles.length) return;
        setUploading(true);
        let success = 0;
        for (const file of selectedFiles) {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("title", uploadTitle || file.name);
            fd.append("category", uploadCat);
            try {
                const res = await fetch("/api/gallery/upload", { method: "POST", body: fd });
                if (res.ok) success++;
            } catch { /* skip */ }
        }
        toast.success(`${success} image(s) uploaded`);
        setShowUpload(false);
        setSelectedFiles([]);
        setUploadTitle("");
        setUploading(false);
        fetchImages();
    };

    const handleDelete = async (id: number) => {
        try {
            await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
            toast.success("Image deleted");
            setMenuOpen(null);
            fetchImages();
        } catch { toast.error("Failed to delete"); }
    };

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(window.location.origin + url);
        toast.success("URL copied!");
        setMenuOpen(null);
    };

    const filtered = filterCat === "all" ? images : images.filter(i => i.category === filterCat);

    return (
        <>
            <AdminNavbar title="Gallery" />
            <main className="p-5 lg:p-8 space-y-6">
                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h2 className="text-lg font-bebas text-slate-900 tracking-[0.1em]">GALLERY IMAGES</h2>
                    <div className="flex items-center gap-3">
                        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-saffron [color-scheme:light]">
                            <option value="all">All Categories</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                        </select>
                        <button onClick={() => setShowUpload(true)}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-saffron hover:bg-saffron-light text-white text-sm font-semibold rounded-lg transition-colors">
                            <Upload size={16} /> Upload
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-square bg-white/[0.02] border border-slate-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtered.map((img, i) => (
                            <motion.div key={img.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-200 transition-all">
                                <div className="aspect-square relative">
                                    <img src={img.file_url} alt={img.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-3">
                                    <p className="text-slate-900 text-xs font-medium truncate">{img.title}</p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500 uppercase">{img.category}</span>
                                        <div className="relative">
                                            <button onClick={() => setMenuOpen(menuOpen === img.id ? null : img.id)}
                                                className="text-slate-500 hover:text-slate-900 transition-colors">
                                                <MoreVertical size={14} />
                                            </button>
                                            {menuOpen === img.id && (
                                                <>
                                                    <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(null)} />
                                                    <div className="absolute right-0 bottom-6 w-36 bg-white border border-slate-200 rounded-xl shadow-2xl z-40 py-1">
                                                        <button onClick={() => handleCopyUrl(img.file_url)}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-900/70 hover:bg-slate-50"><Copy size={12} /> Copy URL</button>
                                                        <button onClick={() => handleDelete(img.id)}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"><Trash2 size={12} /> Delete</button>
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
                    <div className="bg-white/[0.02] border border-slate-200 rounded-xl p-12 text-center">
                        <ImageIcon className="text-slate-900/10 mx-auto mb-3" size={40} />
                        <p className="text-slate-500 text-sm">No images uploaded yet</p>
                    </div>
                )}
            </main>

            {/* Upload Modal */}
            <AnimatePresence>
                {showUpload && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => { setShowUpload(false); setSelectedFiles([]); }}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between p-5 border-b border-slate-200">
                                <h2 className="font-bebas text-slate-900 tracking-[0.1em]">UPLOAD IMAGES</h2>
                                <button onClick={() => { setShowUpload(false); setSelectedFiles([]); }} className="text-slate-500 hover:text-slate-900"><X size={18} /></button>
                            </div>
                            <div className="p-5 space-y-4">
                                <div onClick={() => fileRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-saffron/30 transition-colors">
                                    <Upload className="text-slate-900/20 mx-auto mb-2" size={32} />
                                    <p className="text-slate-500 text-sm">{selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : "Click to select images"}</p>
                                    <p className="text-slate-900/20 text-xs mt-1">JPG, PNG, WebP — Max 5MB</p>
                                    <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" multiple className="hidden"
                                        onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))} />
                                </div>
                                <input type="text" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)}
                                    placeholder="Image title (optional)"
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" />
                                <select value={uploadCat} onChange={(e) => setUploadCat(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron [color-scheme:light]">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                </select>
                                <button onClick={handleUpload} disabled={!selectedFiles.length || uploading}
                                    className="w-full bg-saffron hover:bg-saffron-light text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                    {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : "Upload All"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
