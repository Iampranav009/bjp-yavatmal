"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload, ImageIcon, Trash2, Copy, X, Loader2, MoreVertical,
    Star, ExternalLink, Edit2, Check, ChevronLeft, ChevronRight, Plus
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import toast from "react-hot-toast";

interface GalleryImage {
    id: number;
    title: string;
    file_name: string;
    file_url: string;
    category: string;
    post_title: string;
    post_description: string;
    post_link: string;
    display_target: "media" | "video" | "homepage";
    is_featured: boolean;
    batch_id?: string;
    uploaded_at: string;
    show_on_homepage: boolean;
    homepage_text_title: string;
    homepage_text_description: string;
    homepage_text_position: "left" | "center" | "right";
    homepage_text_color: string;
    homepage_text_bold: boolean;
}

// Represents a file selected for upload with its preview and featured status
interface SelectedFileItem {
    id: string; // unique key for React
    file: File;
    previewUrl: string;
    isFeatured: boolean;
}

const CATEGORIES = ["general", "hero", "events", "leaders", "development", "youth"];

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [menuOpen, setMenuOpen] = useState<number | null>(null);
    const [filterCat, setFilterCat] = useState("all");

    // Upload form state
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadCat, setUploadCat] = useState("general");
    const [uploadPostTitle, setUploadPostTitle] = useState("");
    const [uploadPostDesc, setUploadPostDesc] = useState("");
    const [uploadPostLink, setUploadPostLink] = useState("");
    const [uploadDisplayTarget, setUploadDisplayTarget] = useState<"media" | "video" | "homepage">("media");
    const [selectedFileItems, setSelectedFileItems] = useState<SelectedFileItem[]>([]);
    const [sliderIndex, setSliderIndex] = useState(0);
    const fileRef = useRef<HTMLInputElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    // Homepage overlay fields
    const [uploadShowOnHomepage, setUploadShowOnHomepage] = useState(true);
    const [uploadHpTitle, setUploadHpTitle] = useState("");
    const [uploadHpDesc, setUploadHpDesc] = useState("");
    const [uploadHpPosition, setUploadHpPosition] = useState<"left"|"center"|"right">("left");
    const [uploadHpColor, setUploadHpColor] = useState("white");
    const [uploadHpBold, setUploadHpBold] = useState(false);

    // Edit modal state
    const [editItem, setEditItem] = useState<GalleryImage | null>(null);
    const [editSaving, setEditSaving] = useState(false);

    const fetchImages = useCallback(async () => {
        try {
            const res = await fetch("/api/gallery");
            const data = await res.json();
            setImages(data.data || []);
        } catch { /* silent */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchImages(); }, [fetchImages]);

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            selectedFileItems.forEach(item => URL.revokeObjectURL(item.previewUrl));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resetUploadForm = () => {
        selectedFileItems.forEach(item => URL.revokeObjectURL(item.previewUrl));
        setUploadTitle("");
        setUploadCat("general");
        setUploadPostTitle("");
        setUploadPostDesc("");
        setUploadPostLink("");
        setUploadDisplayTarget("media");
        setSelectedFileItems([]);
        setSliderIndex(0);
        setUploadShowOnHomepage(true);
        setUploadHpTitle("");
        setUploadHpDesc("");
        setUploadHpPosition("left");
        setUploadHpColor("white");
        setUploadHpBold(false);
    };

    const handleFilesSelected = (files: FileList | null) => {
        if (!files) return;
        const newItems: SelectedFileItem[] = Array.from(files).map((file, idx) => ({
            id: `${Date.now()}-${idx}-${file.name}`,
            file,
            previewUrl: URL.createObjectURL(file),
            isFeatured: false,
        }));

        setSelectedFileItems(prev => {
            const merged = [...prev, ...newItems];
            // If no featured yet, make the first one featured
            if (!merged.some(i => i.isFeatured) && merged.length > 0) {
                merged[0].isFeatured = true;
            }
            return merged;
        });
    };

    const handleRemoveFile = (id: string) => {
        setSelectedFileItems(prev => {
            const updated = prev.filter(i => i.id !== id);
            const removedItem = prev.find(i => i.id === id);
            if (removedItem) URL.revokeObjectURL(removedItem.previewUrl);

            // If removed the featured one, make first remaining featured
            if (removedItem?.isFeatured && updated.length > 0) {
                updated[0].isFeatured = true;
            }
            return updated;
        });
        // Adjust slider index if needed
        setSliderIndex(prev => Math.min(prev, Math.max(0, selectedFileItems.length - 2)));
    };

    const handleSetFeatured = (id: string) => {
        setSelectedFileItems(prev =>
            prev.map(item => ({
                ...item,
                isFeatured: item.id === id,
            }))
        );
    };

    const handleUpload = async () => {
        if (!selectedFileItems.length) return;
        setUploading(true);
        let success = 0;
        const batchId = `batch_${Date.now()}`;
        const isHomepage = uploadDisplayTarget === "homepage";
        for (const item of selectedFileItems) {
            const fd = new FormData();
            fd.append("file", item.file);
            fd.append("title", uploadTitle || item.file.name);
            fd.append("category", uploadCat);
            fd.append("post_title", uploadPostTitle);
            fd.append("post_description", uploadPostDesc);
            fd.append("post_link", uploadPostLink);
            fd.append("display_target", isHomepage ? "media" : uploadDisplayTarget);
            fd.append("is_featured", String(item.isFeatured));
            fd.append("batch_id", batchId);
            fd.append("show_on_homepage", String(isHomepage ? uploadShowOnHomepage : false));
            fd.append("homepage_text_title", uploadHpTitle);
            fd.append("homepage_text_description", uploadHpDesc);
            fd.append("homepage_text_position", uploadHpPosition);
            fd.append("homepage_text_color", uploadHpColor);
            fd.append("homepage_text_bold", String(uploadHpBold));
            try {
                const res = await fetch("/api/gallery/upload", { method: "POST", body: fd });
                if (res.ok) {
                    success++;
                } else {
                    const data = await res.json().catch(() => ({}));
                    toast.error(`Upload failed for ${item.file.name}: ${data.error || 'Server error'}`);
                }
            } catch (err) {
                toast.error(`Network error uploading ${item.file.name}`);
            }
        }
        if (success > 0) {
            toast.success(`${success} image(s) uploaded`);
        }
        setShowUpload(false);
        resetUploadForm();
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

    const handleToggleFeatured = async (img: GalleryImage) => {
        try {
            await fetch("/api/gallery", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: img.id, is_featured: !img.is_featured }),
            });
            toast.success(img.is_featured ? "Removed from featured" : "Added to featured");
            setMenuOpen(null);
            fetchImages();
        } catch { toast.error("Failed to update"); }
    };

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(window.location.origin + url);
        toast.success("URL copied!");
        setMenuOpen(null);
    };

    const handleEditSave = async () => {
        if (!editItem) return;
        setEditSaving(true);
        try {
            await fetch("/api/gallery", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editItem.id,
                    title: editItem.title,
                    post_title: editItem.post_title,
                    post_description: editItem.post_description,
                    post_link: editItem.post_link,
                    display_target: editItem.display_target === "homepage" ? "media" : editItem.display_target,
                    is_featured: editItem.is_featured,
                    category: editItem.category,
                    show_on_homepage: editItem.show_on_homepage,
                    homepage_text_title: editItem.homepage_text_title,
                    homepage_text_description: editItem.homepage_text_description,
                    homepage_text_position: editItem.homepage_text_position,
                    homepage_text_color: editItem.homepage_text_color,
                    homepage_text_bold: editItem.homepage_text_bold,
                }),
            });
            toast.success("Item updated!");
            setEditItem(null);
            fetchImages();
        } catch { toast.error("Failed to update"); }
        finally { setEditSaving(false); }
    };

    const filtered = filterCat === "all" ? images : images.filter(i => i.category === filterCat);
    const featuredItem = selectedFileItems.find(i => i.isFeatured);

    // Group images for rendering
    const displayGroups = (() => {
        const groups: { [key: string]: GalleryImage[] } = {};
        const standalone: GalleryImage[] = [];
        filtered.forEach(img => {
            if (img.batch_id) {
                if (!groups[img.batch_id]) groups[img.batch_id] = [];
                groups[img.batch_id].push(img);
            } else {
                standalone.push(img);
            }
        });
        const groupedArray = Object.values(groups).map((group) => {
            // Sort so featured comes first, else by ID
            return group.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        });
        return [...groupedArray.map(g => ({ type: 'group' as const, items: g })), ...standalone.map(s => ({ type: 'single' as const, item: s }))];
    })();

    // Individual gallery image active indices for carousels
    const [carouselIndices, setCarouselIndices] = useState<{ [key: string]: number }>({});
    const nextCarouselImage = (batchId: string, max: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setCarouselIndices(prev => ({ ...prev, [batchId]: Math.min((prev[batchId] || 0) + 1, max - 1) }));
    };
    const prevCarouselImage = (batchId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setCarouselIndices(prev => ({ ...prev, [batchId]: Math.max((prev[batchId] || 0) - 1, 0) }));
    };

    // Slider navigation
    const sliderPrev = () => setSliderIndex(prev => Math.max(0, prev - 1));
    const sliderNext = () => setSliderIndex(prev => Math.min(selectedFileItems.length - 1, prev + 1));

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
                ) : displayGroups.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {displayGroups.map((groupObj, i) => {
                            if (groupObj.type === "group") {
                                const group = groupObj.items;
                                const batchId = group[0].batch_id!;
                                const currentIndex = carouselIndices[batchId] || 0;
                                const currentImg = group[currentIndex];
                                
                                return (
                                    <motion.div key={batchId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all">
                                        <div className="aspect-square relative flex items-center justify-center bg-black">
                                            <AnimatePresence mode="wait">
                                                <motion.img key={currentImg.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} src={currentImg.file_url} alt={currentImg.title} className="w-full h-full object-cover" />
                                            </AnimatePresence>
                                            
                                            {/* Arrows */}
                                            {currentIndex > 0 && (
                                                <button onClick={(e) => prevCarouselImage(batchId, e)}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm z-10 transition-colors">
                                                    <ChevronLeft size={14} />
                                                </button>
                                            )}
                                            {currentIndex < group.length - 1 && (
                                                <button onClick={(e) => nextCarouselImage(batchId, group.length, e)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm z-10 transition-colors">
                                                    <ChevronRight size={14} />
                                                </button>
                                            )}
                                            
                                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
                                                {group.map((_, idx) => (
                                                    <div key={idx} className={`w-1.5 h-1.5 rounded-full shadow ${idx === currentIndex ? 'bg-white' : 'bg-white/40'}`} />
                                                ))}
                                            </div>

                                            {currentImg.is_featured && (
                                                <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 shadow-md z-10">
                                                    <Star size={10} className="fill-white" /> Featured
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-0.5 rounded-full text-[9px] font-medium backdrop-blur-sm z-10">
                                                {currentImg.display_target === "video" ? "Video" : "Media"}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-slate-900 text-xs font-medium truncate">{currentImg.post_title || currentImg.title}</p>
                                            {currentImg.post_description && (
                                                <p className="text-slate-500 text-[10px] mt-0.5 truncate">{currentImg.post_description}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-1.5">
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{currentImg.category}</span>
                                                <div className="relative">
                                                    <button onClick={() => setMenuOpen(menuOpen === currentImg.id ? null : currentImg.id)}
                                                        className="text-slate-500 hover:text-slate-900 transition-colors">
                                                        <MoreVertical size={14} />
                                                    </button>
                                                    {menuOpen === currentImg.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(null)} />
                                                            <div className="absolute right-0 bottom-6 w-44 bg-white border border-slate-200 rounded-xl shadow-2xl z-40 py-1">
                                                                <button onClick={() => { setEditItem(currentImg); setMenuOpen(null); }}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"><Edit2 size={12} /> Edit Details</button>
                                                                <button onClick={() => handleToggleFeatured(currentImg)}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-600 hover:bg-amber-50">
                                                                    <Star size={12} className={currentImg.is_featured ? "fill-amber-500" : ""} />
                                                                    {currentImg.is_featured ? "Remove Featured" : "Mark Featured"}
                                                                </button>
                                                                <button onClick={() => handleDelete(currentImg.id)}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-50"><Trash2 size={12} /> Delete Image</button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            } else {
                                const img = groupObj.item;
                                return (
                                    <motion.div key={img.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all">
                                        <div className="aspect-square relative">
                                            <img src={img.file_url} alt={img.title} className="w-full h-full object-cover" />
                                            {img.is_featured && (
                                                <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 shadow-md">
                                                    <Star size={10} className="fill-white" /> Featured
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-0.5 rounded-full text-[9px] font-medium backdrop-blur-sm">
                                                {img.display_target === "video" ? "Video" : "Media"}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-slate-900 text-xs font-medium truncate">{img.post_title || img.title}</p>
                                            {img.post_description && (
                                                <p className="text-slate-500 text-[10px] mt-0.5 truncate">{img.post_description}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-1.5">
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{img.category}</span>
                                                <div className="relative">
                                                    <button onClick={() => setMenuOpen(menuOpen === img.id ? null : img.id)}
                                                        className="text-slate-500 hover:text-slate-900 transition-colors">
                                                        <MoreVertical size={14} />
                                                    </button>
                                                    {menuOpen === img.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(null)} />
                                                            <div className="absolute right-0 bottom-6 w-44 bg-white border border-slate-200 rounded-xl shadow-2xl z-40 py-1">
                                                                <button onClick={() => { setEditItem(img); setMenuOpen(null); }}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"><Edit2 size={12} /> Edit Details</button>
                                                                <button onClick={() => handleToggleFeatured(img)}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-600 hover:bg-amber-50">
                                                                    <Star size={12} className={img.is_featured ? "fill-amber-500" : ""} />
                                                                    {img.is_featured ? "Remove Featured" : "Mark Featured"}
                                                                </button>
                                                                {img.post_link && (
                                                                    <a href={img.post_link} target="_blank" rel="noopener noreferrer"
                                                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-blue-600 hover:bg-blue-50">
                                                                        <ExternalLink size={12} /> Open Link
                                                                    </a>
                                                                )}
                                                                <button onClick={() => handleCopyUrl(img.file_url)}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"><Copy size={12} /> Copy URL</button>
                                                                <button onClick={() => handleDelete(img.id)}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-50"><Trash2 size={12} /> Delete</button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            }
                        })}

                    </div>
                ) : (
                    <div className="bg-white/[0.02] border border-slate-200 rounded-xl p-12 text-center">
                        <ImageIcon className="text-slate-900/10 mx-auto mb-3" size={40} />
                        <p className="text-slate-500 text-sm">No images uploaded yet</p>
                    </div>
                )}
            </main>

            {/* ========== UPLOAD MODAL ========== */}
            <AnimatePresence>
                {showUpload && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => { setShowUpload(false); resetUploadForm(); }}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}>

                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-slate-200 flex-shrink-0">
                                <div>
                                    <h2 className="font-bebas text-slate-900 tracking-[0.1em] text-lg">UPLOAD MEDIA</h2>
                                    {selectedFileItems.length > 0 && (
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                            {selectedFileItems.length} image(s) selected
                                            {featuredItem && <> · <span className="text-amber-600 font-medium">1 featured</span></>}
                                        </p>
                                    )}
                                </div>
                                <button onClick={() => { setShowUpload(false); resetUploadForm(); }} className="text-slate-500 hover:text-slate-900"><X size={18} /></button>
                            </div>

                            <div className="p-5 space-y-4 overflow-y-auto flex-1">

                                {/* ===== IMAGE SLIDESHOW / SELECTOR ===== */}
                                {selectedFileItems.length === 0 ? (
                                    /* Empty state: file picker */
                                    <div onClick={() => fileRef.current?.click()}
                                        className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-saffron/40 transition-colors group">
                                        <Upload className="text-slate-300 group-hover:text-saffron/50 mx-auto mb-2 transition-colors" size={32} />
                                        <p className="text-slate-600 text-sm font-medium">Click to select images</p>
                                        <p className="text-slate-400 text-xs mt-1">JPG, PNG, WebP — Max 5MB each</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {/* Main slideshow display */}
                                        <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-[16/10]">
                                            {/* Current slide image */}
                                            <AnimatePresence mode="wait">
                                                <motion.img
                                                    key={selectedFileItems[sliderIndex]?.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.25 }}
                                                    src={selectedFileItems[sliderIndex]?.previewUrl}
                                                    alt=""
                                                    className="w-full h-full object-contain"
                                                />
                                            </AnimatePresence>

                                            {/* Featured badge on main image */}
                                            {selectedFileItems[sliderIndex]?.isFeatured && (
                                                <div className="absolute top-3 left-3 bg-amber-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                                                    <Star size={12} className="fill-white" /> Default Preview
                                                </div>
                                            )}

                                            {/* Remove current image button */}
                                            <button
                                                onClick={() => handleRemoveFile(selectedFileItems[sliderIndex]?.id)}
                                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition-colors shadow-lg backdrop-blur-sm"
                                                title="Remove this image"
                                            >
                                                <X size={16} />
                                            </button>

                                            {/* Set as Featured button */}
                                            <button
                                                onClick={() => handleSetFeatured(selectedFileItems[sliderIndex]?.id)}
                                                className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-sm ${
                                                    selectedFileItems[sliderIndex]?.isFeatured
                                                        ? "bg-amber-500 text-white"
                                                        : "bg-white/80 text-slate-700 hover:bg-amber-100 hover:text-amber-700"
                                                }`}
                                                title="Set as featured/preview image"
                                            >
                                                <Star size={12} className={selectedFileItems[sliderIndex]?.isFeatured ? "fill-white" : ""} />
                                                {selectedFileItems[sliderIndex]?.isFeatured ? "Featured ✓" : "Set as Featured"}
                                            </button>

                                            {/* Navigation arrows */}
                                            {sliderIndex > 0 && (
                                                <button onClick={sliderPrev}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all backdrop-blur-sm">
                                                    <ChevronLeft size={20} />
                                                </button>
                                            )}
                                            {sliderIndex < selectedFileItems.length - 1 && (
                                                <button onClick={sliderNext}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all backdrop-blur-sm">
                                                    <ChevronRight size={20} />
                                                </button>
                                            )}

                                            {/* Counter */}
                                            <div className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm font-medium">
                                                {sliderIndex + 1} / {selectedFileItems.length}
                                            </div>
                                        </div>

                                        {/* Thumbnail strip */}
                                        <div className="flex items-center gap-2">
                                            <div ref={sliderRef} className="flex-1 flex gap-2 overflow-x-auto py-1 scrollbar-thin">
                                                {selectedFileItems.map((item, idx) => (
                                                    <div
                                                        key={item.id}
                                                        className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all group/thumb ${
                                                            sliderIndex === idx
                                                                ? "border-saffron shadow-md shadow-saffron/20 scale-105"
                                                                : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                                                        }`}
                                                        onClick={() => setSliderIndex(idx)}
                                                    >
                                                        <img src={item.previewUrl} alt="" className="w-full h-full object-cover" />

                                                        {/* Featured indicator on thumbnail */}
                                                        {item.isFeatured && (
                                                            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center shadow">
                                                                <Star size={8} className="fill-white text-white" />
                                                            </div>
                                                        )}

                                                        {/* Remove button on thumbnail */}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleRemoveFile(item.id); }}
                                                            className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow text-[10px]"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Add more button */}
                                                <div
                                                    onClick={() => fileRef.current?.click()}
                                                    className="shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-slate-200 hover:border-saffron/30 flex items-center justify-center cursor-pointer transition-colors"
                                                >
                                                    <Plus size={18} className="text-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" multiple className="hidden"
                                    onChange={(e) => { handleFilesSelected(e.target.files); e.target.value = ""; }} />

                                {/* Image Title */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Image Title</label>
                                    <input type="text" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)}
                                        placeholder="Short image label"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" />
                                </div>

                                {/* Post Title */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Post Title</label>
                                    <input type="text" value={uploadPostTitle} onChange={(e) => setUploadPostTitle(e.target.value)}
                                        placeholder="Headline for this post"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" />
                                </div>

                                {/* Post Description */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Post Description</label>
                                    <textarea value={uploadPostDesc} onChange={(e) => setUploadPostDesc(e.target.value)}
                                        placeholder="Detailed description of this post..."
                                        rows={3}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron resize-none" />
                                </div>

                                {/* Post Link */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Post Link</label>
                                    <input type="url" value={uploadPostLink} onChange={(e) => setUploadPostLink(e.target.value)}
                                        placeholder="https://example.com/article"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" />
                                </div>

                                {/* Category + Display Target row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                                        <select value={uploadCat} onChange={(e) => setUploadCat(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron [color-scheme:light]">
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Display On</label>
                                        <select value={uploadDisplayTarget} onChange={(e) => setUploadDisplayTarget(e.target.value as "media" | "video" | "homepage")}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron [color-scheme:light]">
                                            <option value="media">Media Page</option>
                                            <option value="video">Video Page</option>
                                            <option value="homepage">Image Preview Section</option>
                                        </select>
                                    </div>
                                </div>

                                {/* ===== HOMEPAGE CONTROLS ===== */}
                                {uploadDisplayTarget === "homepage" && (
                                    <div className="border border-orange-200 bg-orange-50 rounded-xl p-4 space-y-4">
                                        <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">Homepage Image Preview Settings</p>

                                        {/* Visibility toggle */}
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-xs font-semibold text-slate-700">{uploadShowOnHomepage ? "Visible on Landing Page" : "Hidden from Landing Page"}</span>
                                            <div onClick={() => setUploadShowOnHomepage(p => !p)}
                                                className={`w-11 h-6 rounded-full relative transition-colors ${uploadShowOnHomepage ? "bg-green-500" : "bg-slate-300"}`}>
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${uploadShowOnHomepage ? "translate-x-6" : "translate-x-1"}`} />
                                            </div>
                                        </label>

                                        {/* Overlay Title */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">Overlay Title <span className="text-slate-400 font-normal">(optional)</span></label>
                                            <input type="text" value={uploadHpTitle} onChange={(e) => setUploadHpTitle(e.target.value)}
                                                placeholder="e.g. Our Work in Action"
                                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-orange-400" />
                                        </div>

                                        {/* Overlay Description + Bold toggle */}
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="text-xs font-semibold text-slate-700">Overlay Description <span className="text-slate-400 font-normal">(optional)</span></label>
                                                <button type="button" onClick={() => setUploadHpBold(p => !p)}
                                                    className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${uploadHpBold ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}>
                                                    B
                                                </button>
                                            </div>
                                            <textarea value={uploadHpDesc} onChange={(e) => setUploadHpDesc(e.target.value)}
                                                placeholder="Short description shown over the image..."
                                                rows={2}
                                                className={`w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-orange-400 resize-none ${uploadHpBold ? "font-bold" : ""}`} />
                                        </div>

                                        {/* Position */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-2">Text Position</label>
                                            <div className="flex gap-2">
                                                {(["left", "center", "right"] as const).map(pos => (
                                                    <button key={pos} type="button" onClick={() => setUploadHpPosition(pos)}
                                                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-colors ${
                                                            uploadHpPosition === pos
                                                                ? "bg-orange-500 text-white border-orange-500"
                                                                : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"
                                                        }`}>{pos}</button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Text Color */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-2">Text Color</label>
                                            <div className="flex gap-2 flex-wrap">
                                                {[
                                                    { value: "white", bg: "bg-white", border: "border-slate-300", label: "White" },
                                                    { value: "black", bg: "bg-black", border: "border-black", label: "Black" },
                                                    { value: "blue", bg: "bg-blue-600", border: "border-blue-600", label: "Blue" },
                                                    { value: "green", bg: "bg-green-600", border: "border-green-600", label: "Green" },
                                                    { value: "orange", bg: "bg-orange-500", border: "border-orange-500", label: "Orange" },
                                                ].map(c => (
                                                    <button key={c.value} type="button" onClick={() => setUploadHpColor(c.value)}
                                                        title={c.label}
                                                        className={`w-8 h-8 rounded-full ${c.bg} border-2 transition-transform ${uploadHpColor === c.value ? `${c.border} scale-110 ring-2 ring-orange-400 ring-offset-1` : "border-slate-200 hover:scale-105"}`} />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Live Preview */}
                                        {(uploadHpTitle || uploadHpDesc) && selectedFileItems.length > 0 && (
                                            <div className="relative rounded-lg overflow-hidden bg-slate-800 aspect-[16/7]">
                                                <img src={selectedFileItems[sliderIndex]?.previewUrl} alt="" className="w-full h-full object-cover opacity-80" />
                                                <div className={`absolute inset-0 flex flex-col justify-end p-4 ${
                                                    uploadHpPosition === "center" ? "items-center text-center" :
                                                    uploadHpPosition === "right" ? "items-end text-right" : "items-start text-left"
                                                }`}>
                                                    {uploadHpTitle && (
                                                        <p className={`text-sm shadow-sm ${uploadHpBold ? "font-bold" : "font-semibold"}`}
                                                            style={{ color: uploadHpColor === "white" ? "#fff" : uploadHpColor === "black" ? "#000" : uploadHpColor === "blue" ? "#2563eb" : uploadHpColor === "green" ? "#16a34a" : "#f97316" }}>
                                                            {uploadHpTitle}
                                                        </p>
                                                    )}
                                                    {uploadHpDesc && (
                                                        <p className={`text-xs mt-0.5 ${uploadHpBold ? "font-bold" : ""}`}
                                                            style={{ color: uploadHpColor === "white" ? "rgba(255,255,255,0.85)" : uploadHpColor === "black" ? "rgba(0,0,0,0.7)" : uploadHpColor === "blue" ? "#2563eb" : uploadHpColor === "green" ? "#16a34a" : "#f97316" }}>
                                                            {uploadHpDesc}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Featured info box */}
                                {featuredItem && (
                                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-amber-300 shrink-0">
                                            <img src={featuredItem.previewUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                                                <Star size={12} className="text-amber-500 fill-amber-500" />
                                                Featured Image Selected
                                            </p>
                                            <p className="text-[10px] text-amber-600/70 mt-0.5">
                                                This image will be the preview/thumbnail on Gallery &amp; Media pages
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Upload button */}
                                <button onClick={handleUpload} disabled={!selectedFileItems.length || uploading}
                                    className="w-full bg-saffron hover:bg-saffron-light text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                                    {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading {selectedFileItems.length} image(s)...</> : `Upload ${selectedFileItems.length || ""} Image${selectedFileItems.length !== 1 ? "s" : ""}`}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ========== EDIT MODAL ========== */}
            <AnimatePresence>
                {editItem && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setEditItem(null)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between p-5 border-b border-slate-200 flex-shrink-0">
                                <h2 className="font-bebas text-slate-900 tracking-[0.1em]">EDIT DETAILS</h2>
                                <button onClick={() => setEditItem(null)} className="text-slate-500 hover:text-slate-900"><X size={18} /></button>
                            </div>
                            <div className="p-5 space-y-4 overflow-y-auto flex-1">
                                <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-100">
                                    <img src={editItem.file_url} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Image Title</label>
                                    <input type="text" value={editItem.title}
                                        onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Post Title</label>
                                    <input type="text" value={editItem.post_title || ""}
                                        onChange={(e) => setEditItem({ ...editItem, post_title: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Post Description</label>
                                    <textarea value={editItem.post_description || ""}
                                        onChange={(e) => setEditItem({ ...editItem, post_description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron resize-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Post Link</label>
                                    <input type="url" value={editItem.post_link || ""}
                                        onChange={(e) => setEditItem({ ...editItem, post_link: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                                        <select value={editItem.category}
                                            onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron [color-scheme:light]">
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Display On</label>
                                        <select value={editItem.show_on_homepage ? "homepage" : editItem.display_target}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setEditItem({ ...editItem, display_target: val === "homepage" ? "media" : val as "media" | "video", show_on_homepage: val === "homepage" });
                                            }}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron [color-scheme:light]">
                                            <option value="media">Media Page</option>
                                            <option value="video">Video Page</option>
                                            <option value="homepage">Image Preview Section</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Homepage overlay controls in edit modal */}
                                {editItem.show_on_homepage && (
                                    <div className="border border-orange-200 bg-orange-50 rounded-xl p-4 space-y-4">
                                        <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">Homepage Image Preview Settings</p>
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-xs font-semibold text-slate-700">{editItem.show_on_homepage ? "Visible on Landing Page" : "Hidden from Landing Page"}</span>
                                            <div onClick={() => setEditItem({ ...editItem, show_on_homepage: !editItem.show_on_homepage })}
                                                className={`w-11 h-6 rounded-full relative transition-colors ${editItem.show_on_homepage ? "bg-green-500" : "bg-slate-300"}`}>
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${editItem.show_on_homepage ? "translate-x-6" : "translate-x-1"}`} />
                                            </div>
                                        </label>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">Overlay Title</label>
                                            <input type="text" value={editItem.homepage_text_title || ""}
                                                onChange={(e) => setEditItem({ ...editItem, homepage_text_title: e.target.value })}
                                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-orange-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="text-xs font-semibold text-slate-700">Overlay Description</label>
                                                <button type="button" onClick={() => setEditItem({ ...editItem, homepage_text_bold: !editItem.homepage_text_bold })}
                                                    className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${editItem.homepage_text_bold ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}>B</button>
                                            </div>
                                            <textarea value={editItem.homepage_text_description || ""}
                                                onChange={(e) => setEditItem({ ...editItem, homepage_text_description: e.target.value })}
                                                rows={2}
                                                className={`w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-orange-400 resize-none ${editItem.homepage_text_bold ? "font-bold" : ""}`} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-2">Text Position</label>
                                            <div className="flex gap-2">
                                                {(["left", "center", "right"] as const).map(pos => (
                                                    <button key={pos} type="button" onClick={() => setEditItem({ ...editItem, homepage_text_position: pos })}
                                                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-colors ${editItem.homepage_text_position === pos ? "bg-orange-500 text-white border-orange-500" : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"}`}>{pos}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-2">Text Color</label>
                                            <div className="flex gap-2 flex-wrap">
                                                {[
                                                    { value: "white", bg: "bg-white", border: "border-slate-300" },
                                                    { value: "black", bg: "bg-black", border: "border-black" },
                                                    { value: "blue", bg: "bg-blue-600", border: "border-blue-600" },
                                                    { value: "green", bg: "bg-green-600", border: "border-green-600" },
                                                    { value: "orange", bg: "bg-orange-500", border: "border-orange-500" },
                                                ].map(c => (
                                                    <button key={c.value} type="button" onClick={() => setEditItem({ ...editItem, homepage_text_color: c.value })}
                                                        className={`w-8 h-8 rounded-full ${c.bg} border-2 transition-transform ${editItem.homepage_text_color === c.value ? `${c.border} scale-110 ring-2 ring-orange-400 ring-offset-1` : "border-slate-200 hover:scale-105"}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <label className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-amber-100 transition-colors">
                                    <div className={`w-10 h-5 rounded-full transition-colors relative ${editItem.is_featured ? 'bg-amber-500' : 'bg-slate-300'}`}
                                        onClick={() => setEditItem({ ...editItem, is_featured: !editItem.is_featured })}>
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${editItem.is_featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                                            <Star size={14} className={editItem.is_featured ? "text-amber-500 fill-amber-500" : "text-slate-400"} />
                                            Feature in Achievements
                                        </p>
                                    </div>
                                </label>
                            </div>
                            <div className="p-5 border-t border-slate-200 flex-shrink-0 flex justify-end gap-2">
                                <button onClick={() => setEditItem(null)}
                                    className="px-4 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                                <button onClick={handleEditSave} disabled={editSaving}
                                    className="flex items-center gap-1.5 px-5 py-2 bg-saffron hover:bg-saffron-light text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
                                    {editSaving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Check size={14} /> Save Changes</>}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
