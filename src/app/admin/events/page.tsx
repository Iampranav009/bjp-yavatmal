"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Plus, Pencil, Trash2, X, Save, Calendar, Clock, MapPin, Users } from "lucide-react";
import toast from "react-hot-toast";
import AdminNavbar from "@/components/admin/AdminNavbar";

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

const EMPTY_FORM = {
    title: "",
    event_date: "",
    event_time: "",
    place: "",
    host: "",
    participant_count: "",
    mandal: "",
    description: "",
    image_url: "",
};

const MANDAL_OPTIONS = [
    "", "Pandharkawda", "Kharwada", "Yavatmal", "Vani", "Wani",
    "Darwha", "Pusad", "Umarkhed", "Mahagaon", "Kalamb",
    "Arni", "Digras", "Ralegaon", "Maregaon", "Zari Jamni",
    "Ghatanji", "Ner",
];

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

function formatTime(t: string) {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hours = parseInt(h, 10);
    return `${hours % 12 || 12}:${m} ${hours >= 12 ? "PM" : "AM"}`;
}

export default function AdminEventsPage() {
    const pathname = usePathname() || "";
    const isPanel = pathname.startsWith("/admin/a");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editEvent, setEditEvent] = useState<Event | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const r = await fetch("/api/events");
            const d = await r.json();
            setEvents(d.data || []);
        } catch {
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const openCreate = () => {
        setEditEvent(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const openEdit = (ev: Event) => {
        setEditEvent(ev);
        setForm({
            title: ev.title,
            event_date: ev.event_date?.slice(0, 10) || "",
            event_time: ev.event_time || "",
            place: ev.place || "",
            host: ev.host || "",
            participant_count: ev.participant_count?.toString() || "",
            mandal: ev.mandal || "",
            description: ev.description || "",
            image_url: ev.image_url || "",
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.title || !form.event_date || !form.event_time || !form.place) {
            toast.error("Title, date, time, and place are required");
            return;
        }
        setSaving(true);
        try {
            const body = {
                ...form,
                participant_count: form.participant_count ? parseInt(form.participant_count) : null,
                ...(editEvent ? { id: editEvent.id } : {}),
            };
            const r = await fetch("/api/events", {
                method: editEvent ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!r.ok) {
                const d = await r.json();
                throw new Error(d.error || "Failed to save");
            }
            toast.success(editEvent ? "Event updated!" : "Event created!");
            setShowModal(false);
            fetchEvents();
        } catch (err: any) {
            toast.error(err.message || "Failed to save event");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const r = await fetch(`/api/events?id=${id}`, { method: "DELETE" });
            if (!r.ok) throw new Error("Delete failed");
            toast.success("Event deleted");
            setDeleteId(null);
            fetchEvents();
        } catch {
            toast.error("Failed to delete event");
        }
    };

    const field = (key: keyof typeof form, value: string) =>
        setForm((f) => ({ ...f, [key]: value }));

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploadingImage(true);
        const files = Array.from(e.target.files);
        const uploadedUrls: string[] = [];

        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
            try {
                const res = await fetch("/api/upload", { method: "POST", body: formData });
                if (res.ok) {
                    const data = await res.json();
                    uploadedUrls.push(data.url);
                } else {
                    toast.error(`Failed to upload ${file.name}`);
                }
            } catch (err) {
                toast.error(`Network error uploading ${file.name}`);
            }
        }
        
        if (uploadedUrls.length > 0) {
            const currentUrls = form.image_url ? form.image_url.split(',').filter(Boolean) : [];
            const newUrls = [...currentUrls, ...uploadedUrls].join(',');
            field("image_url", newUrls);
            toast.success(`${uploadedUrls.length} image(s) uploaded`);
        }
        setUploadingImage(false);
        // Reset the input so the same files can be selected again if needed
        e.target.value = '';
    };

    const removeImage = (indexToRemove: number) => {
        const urls = form.image_url.split(',').filter(Boolean);
        urls.splice(indexToRemove, 1);
        field("image_url", urls.join(','));
    };

    return (
        <>
            <AdminNavbar title="Event Posts" />
            <div className="p-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-oswald text-slate-900 tracking-wide">EVENT POSTS</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage BJP Yavatmal events and programs</p>
                    </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-saffron text-white rounded-xl font-semibold text-sm hover:bg-saffron/90 shadow-md shadow-saffron/30 transition-all"
                >
                    <Plus size={18} />
                    Add Event
                </button>
            </div>


            {/* Events Table */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-3 border-saffron/30 border-t-saffron rounded-full animate-spin" />
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    <Calendar size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="font-semibold">No events yet. Add your first event!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {events.map((ev) => (
                        <motion.div
                            key={ev.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-saffron/30 transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-oswald text-lg text-slate-900 uppercase tracking-wide mb-2">
                                        {ev.title}
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5 text-sm text-slate-600">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar size={13} className="text-saffron" />
                                            {formatDate(ev.event_date)}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={13} className="text-saffron" />
                                            {formatTime(ev.event_time)}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin size={13} className="text-saffron" />
                                            {ev.place}
                                        </span>
                                        {ev.host && (
                                            <span className="flex items-center gap-1.5">
                                                <span className="text-saffron">🪷</span>
                                                {ev.host}
                                            </span>
                                        )}
                                        {ev.participant_count && (
                                            <span className="flex items-center gap-1.5">
                                                <Users size={13} className="text-saffron" />
                                                {ev.participant_count.toLocaleString("en-IN")} participants
                                            </span>
                                        )}
                                        {ev.mandal && (
                                            <span className="flex items-center gap-1.5">
                                                <span className="text-green-600 font-bold text-[10px] bg-green-100 px-2 py-0.5 rounded-full">
                                                    📍 {ev.mandal}
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => openEdit(ev)}
                                        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-saffron hover:border-saffron/50 transition-all"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    {!isPanel && (
                                        <button
                                            onClick={() => setDeleteId(ev.id)}
                                            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 transition-all"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                                <h2 className="font-oswald text-xl text-slate-900 tracking-wider">
                                    {editEvent ? "EDIT EVENT" : "ADD NEW EVENT"}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Title *</label>
                                    <input value={form.title} onChange={(e) => field("title", e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron"
                                        placeholder="Event title" />
                                </div>

                                {/* Date & Time */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Date *</label>
                                        <input type="date" value={form.event_date} onChange={(e) => field("event_date", e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Time *</label>
                                        <input type="time" value={form.event_time} onChange={(e) => field("event_time", e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron" />
                                    </div>
                                </div>

                                {/* Place */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Place / Venue *</label>
                                    <input value={form.place} onChange={(e) => field("place", e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron"
                                        placeholder="Event location" />
                                </div>

                                {/* Host & Count */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Host / आयोजक</label>
                                        <input value={form.host} onChange={(e) => field("host", e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron"
                                            placeholder="Organizer name" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">संख्या / Participant Count</label>
                                        <input type="number" value={form.participant_count} onChange={(e) => field("participant_count", e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron"
                                            placeholder="Expected attendees" />
                                    </div>
                                </div>

                                {/* Mandal */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mandal</label>
                                    <select value={form.mandal} onChange={(e) => field("mandal", e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron">
                                        {MANDAL_OPTIONS.map((m) => (
                                            <option key={m} value={m}>{m || "Select Mandal"}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Description</label>
                                    <textarea value={form.description} onChange={(e) => field("description", e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron resize-none"
                                        placeholder="Event details..." />
                                </div>

                                {/* Image URL / Upload */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Images (optional)</label>
                                    
                                    <div className="mb-3 space-y-2">
                                        <div className="flex gap-2">
                                            <input type="text" value={form.image_url} onChange={(e) => field("image_url", e.target.value)}
                                                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron"
                                                placeholder="Enter URLs separated by commas, or upload files" />
                                            <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${uploadingImage ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}>
                                                {uploadingImage ? "Uploading..." : "Upload Files"}
                                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploadingImage} />
                                            </label>
                                        </div>
                                    </div>

                                    {form.image_url && (
                                        <div className="flex gap-3 overflow-x-auto py-2">
                                            {form.image_url.split(',').filter(Boolean).map((url, idx) => (
                                                <div key={idx} className="relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group">
                                                    <img src={url.trim()} alt="" className="w-full h-full object-cover" />
                                                    <button onClick={() => removeImage(idx)} type="button"
                                                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
                                <button onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-all">
                                    Cancel
                                </button>
                                <button onClick={handleSave} disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold bg-saffron text-white hover:bg-saffron/90 disabled:opacity-50 shadow-sm transition-all">
                                    <Save size={15} />
                                    {saving ? "Saving..." : editEvent ? "Update Event" : "Create Event"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {deleteId !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center"
                        >
                            <Trash2 size={32} className="text-red-400 mx-auto mb-3" />
                            <h3 className="font-oswald text-lg text-slate-900 mb-2">Delete Event?</h3>
                            <p className="text-sm text-slate-500 mb-5">This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteId(null)}
                                    className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all">
                                    Cancel
                                </button>
                                <button onClick={() => handleDelete(deleteId!)}
                                    className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all">
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
        </>
    );
}
