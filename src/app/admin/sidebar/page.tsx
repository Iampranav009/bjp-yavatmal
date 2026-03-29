"use client";

import { useState, useEffect, useRef } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { Plus, X, Loader2, ArrowUp, ArrowDown, Trash2, Edit2, PlayCircle, Eye, EyeOff, Layout } from "lucide-react";
import toast from "react-hot-toast";

interface SidebarItem {
    id: number;
    item_type: "announcement" | "banner" | "youtube" | "links";
    title: string | null;
    image_url: string | null;
    video_url: string | null;
    content: string | null;
    target_link: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

export default function AdminSidebarPage() {
    const [items, setItems] = useState<SidebarItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<SidebarItem | null>(null);
    const [saving, setSaving] = useState(false);

    // Form states
    const [itemType, setItemType] = useState<SidebarItem['item_type']>("announcement");
    const [title, setTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [content, setContent] = useState("");
    const [targetLink, setTargetLink] = useState("");
    const [isActive, setIsActive] = useState(true);

    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const fetchItems = async () => {
        try {
            const res = await fetch("/api/sidebar");
            const data = await res.json();
            setItems(data.data || []);
        } catch {
            toast.error("Failed to load sidebar config");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const resetForm = () => {
        setItemType("announcement");
        setTitle("");
        setImageUrl("");
        setVideoUrl("");
        setContent("");
        setTargetLink("");
        setIsActive(true);
        setEditingItem(null);
    };

    const openNew = () => {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (item: SidebarItem) => {
        setEditingItem(item);
        setItemType(item.item_type);
        setTitle(item.title || "");
        setImageUrl(item.image_url || "");
        setVideoUrl(item.video_url || "");
        setContent(item.content || "");
        setTargetLink(item.target_link || "");
        setIsActive(item.is_active);
        setShowModal(true);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        setUploading(true);
        const fd = new FormData();
        fd.append("file", e.target.files[0]);
        try {
            const res = await fetch("/api/blogs/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (res.ok && data.data?.file_url) {
                setImageUrl(data.data.file_url);
                toast.success("Image uploaded!");
            } else {
                toast.error("Failed to upload image");
            }
        } catch {
            toast.error("Network error");
        }
        setUploading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            id: editingItem?.id,
            item_type: itemType,
            title: title || null,
            image_url: imageUrl || null,
            video_url: videoUrl || null,
            content: content || null,
            target_link: targetLink || null,
            is_active: isActive,
            display_order: editingItem ? editingItem.display_order : items.length,
        };

        try {
            const res = await fetch("/api/sidebar", {
                method: editingItem ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                toast.success(editingItem ? "Sidebar updated" : "Sidebar item added");
                setShowModal(false);
                fetchItems();
            } else {
                toast.error("Failed to save");
            }
        } catch {
            toast.error("Error saving");
        }
        setSaving(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this sidebar item?")) return;
        try {
            await fetch(`/api/sidebar?id=${id}`, { method: 'DELETE' });
            toast.success("Deleted");
            fetchItems();
        } catch {
            toast.error("Error deleting");
        }
    };

    const handleMove = async (index: number, dir: 'up' | 'down') => {
        if (dir === 'up' && index === 0) return;
        if (dir === 'down' && index === items.length - 1) return;

        const updated = [...items];
        const swapIdx = dir === 'up' ? index - 1 : index + 1;
        
        // Swap
        [updated[index], updated[swapIdx]] = [updated[swapIdx], updated[index]];
        
        // Update display_order based on new array index
        const updates = updated.map((item, i) => ({
            id: item.id,
            display_order: i
        }));

        setItems(updated.map((t, i) => ({ ...t, display_order: i }))); // Optimistic UI

        try {
            await Promise.all(updates.map(u => 
                fetch("/api/sidebar", {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ id: u.id, display_order: u.display_order })
                })
            ));
        } catch {
            toast.error("Failed to reorder");
            fetchItems(); // Revert on failure
        }
    };

    const toggleActive = async (item: SidebarItem) => {
        try {
            await fetch("/api/sidebar", {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id: item.id, is_active: !item.is_active })
            });
            fetchItems();
        } catch {
            toast.error("Failed to update status");
        }
    };

    return (
        <>
            <AdminNavbar title="Sidebar Config" />
            <main className="p-5 lg:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bebas text-slate-900 tracking-[0.1em]">ARTICLE RIGHT SIDEBAR</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Control the widgets in the Articles sidebar</p>
                    </div>
                    <button onClick={openNew}
                        className="flex items-center gap-1.5 px-4 py-2 bg-saffron text-white text-sm font-semibold rounded-lg hover:bg-saffron-light transition-colors">
                        <Plus size={16} /> Add Widget
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {loading ? (
                        [...Array(4)].map((_, i) => <div key={i} className="h-40 bg-white border border-slate-200 rounded-xl animate-pulse" />)
                    ) : items.length > 0 ? (
                        items.map((item, idx) => (
                            <div key={item.id} className={`bg-white border text-center ${item.is_active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'} rounded-xl p-4 flex flex-col`}>
                                <div className="flex items-center justify-between mb-3 text-slate-500">
                                    <div className="flex gap-1">
                                        <button onClick={() => handleMove(idx, 'up')} disabled={idx === 0} className="hover:text-slate-900 hover:bg-slate-100 p-1 rounded disabled:opacity-30"><ArrowUp size={16} /></button>
                                        <button onClick={() => handleMove(idx, 'down')} disabled={idx === items.length - 1} className="hover:text-slate-900 hover:bg-slate-100 p-1 rounded disabled:opacity-30"><ArrowDown size={16} /></button>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                        {item.item_type}
                                    </span>
                                </div>
                                
                                <div className="flex-1 flex flex-col items-center justify-center py-2 h-24">
                                    {item.item_type === 'youtube' && <PlayCircle className="text-red-500 mb-2" size={32} />}
                                    {item.item_type === 'banner' && item.image_url && <img src={item.image_url} alt="Banner" className="max-h-16 w-auto object-cover rounded shadow-sm mb-2" />}
                                    {item.item_type === 'banner' && !item.image_url && <Layout className="text-slate-300 mb-2" size={32} />}
                                    {item.item_type === 'announcement' && <p className="text-xs line-clamp-3 text-slate-600 mb-2">{item.content}</p>}
                                    {item.title && <p className="font-semibold text-sm text-slate-800 line-clamp-1">{item.title}</p>}
                                </div>

                                <div className="border-t border-slate-100 mt-2 pt-2 flex items-center justify-between">
                                    <button onClick={() => toggleActive(item)} className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-semibold ${item.is_active ? 'text-green-600 hover:bg-green-50' : 'text-slate-500 hover:bg-slate-100'}`}>
                                        {item.is_active ? <Eye size={14} /> : <EyeOff size={14} />} {item.is_active ? 'Active' : 'Hidden'}
                                    </button>
                                    <div className="flex gap-1">
                                        <button onClick={() => openEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center text-slate-500 bg-white border border-slate-200 rounded-xl">
                            <Layout size={48} className="mx-auto mb-4 text-slate-300" />
                            <p>No sidebar widgets added yet.</p>
                        </div>
                    )}
                </div>
            </main>

            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-slate-200">
                            <h2 className="font-bebas text-slate-900 tracking-[0.1em] text-lg">
                                {editingItem ? "EDIT WIDGET" : "NEW WIDGET"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-900"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Widget Type</label>
                                <select value={itemType} onChange={(e) => setItemType(e.target.value as any)}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:border-saffron focus:outline-none">
                                    <option value="announcement">Announcement / Text Block</option>
                                    <option value="banner">Image Banner</option>
                                    <option value="youtube">YouTube Embed (Shorts/Video)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Title (Optional)</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Breaking News"
                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:border-saffron focus:outline-none" />
                            </div>

                            {itemType === 'announcement' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Content text</label>
                                    <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} placeholder="Short text content..."
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:border-saffron focus:outline-none resize-none" />
                                </div>
                            )}

                            {itemType === 'banner' && (
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-slate-700">Upload Image Banner</label>
                                    <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleUpload} />
                                    {imageUrl ? (
                                        <div className="relative">
                                            <img src={imageUrl} alt="Banner Preview" className="w-full h-32 object-cover rounded-lg border border-slate-200" />
                                            <button type="button" onClick={() => setImageUrl("")} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg"><X size={14}/></button>
                                        </div>
                                    ) : (
                                        <div onClick={() => !uploading && fileRef.current?.click()} className="h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col space-y-2 items-center justify-center cursor-pointer hover:border-saffron hover:bg-slate-50 transition-colors">
                                            {uploading ? <Loader2 size={24} className="text-saffron animate-spin" /> : <Plus size={24} className="text-slate-400" />}
                                        </div>
                                    )}
                                </div>
                            )}

                            {itemType === 'youtube' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">YouTube Video/Shorts URL</label>
                                    <input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/..."
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:border-saffron focus:outline-none" />
                                    <p className="text-[10px] text-slate-500 mt-1">Make sure you paste the full view link. The system will convert it into an embed URL.</p>
                                </div>
                            )}

                            {(itemType === 'banner' || itemType === 'announcement') && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Link URL (Optional)</label>
                                    <input type="url" value={targetLink} onChange={e => setTargetLink(e.target.value)} placeholder="Where should this redirect on click?"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:border-saffron focus:outline-none" />
                                </div>
                            )}

                            <label className="flex items-center gap-2 text-sm text-slate-700 font-semibold pt-2 border-t border-slate-100 cursor-pointer">
                                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded text-saffron focus:ring-saffron border-slate-300" />
                                Widget is Active
                            </label>

                            <button type="submit" disabled={saving || uploading || (!imageUrl && itemType === 'banner') || (!videoUrl && itemType === 'youtube') || (!content && itemType === 'announcement')} 
                                className="w-full py-3 bg-saffron hover:bg-saffron-light text-white font-semibold rounded-lg text-sm transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-50">
                                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Widget"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
