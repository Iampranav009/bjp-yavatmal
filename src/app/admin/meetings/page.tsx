"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    X,
    Loader2,
    Calendar,
    Clock,
    Video,
    Users,
    Trash2,
    Download,
    Eye,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { POSITIONS } from "@/lib/positions";

interface Meeting {
    id: number;
    title: string;
    description?: string;
    meeting_date: string;
    meeting_time: string;
    google_meet_link?: string;
    created_by_name?: string;
    participant_count: number;
    target_positions: string[];
    created_at: string;
}

interface Participant {
    id: number;
    name: string;
    position: string;
    mobile: string;
    address?: string;
}

export default function MeetingsPage() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [expandedMeeting, setExpandedMeeting] = useState<number | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [participantsLoading, setParticipantsLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        meeting_date: "",
        meeting_time: "",
        google_meet_link: "",
        target_positions: [] as string[],
    });

    const fetchMeetings = useCallback(async () => {
        try {
            const res = await fetch("/api/meetings");
            const data = await res.json();
            setMeetings(data.data || []);
        } catch {
            toast.error("Failed to load meetings");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMeetings();
    }, [fetchMeetings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.target_positions.length === 0) {
            toast.error("Select at least one target position");
            return;
        }
        setFormLoading(true);

        try {
            const res = await fetch("/api/meetings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to create");
            }

            const data = await res.json();
            toast.success(data.message || "Meeting created!");
            setShowForm(false);
            resetForm();
            fetchMeetings();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to create meeting");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/meetings/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            toast.success("Meeting deleted");
            setDeleteConfirm(null);
            if (expandedMeeting === id) setExpandedMeeting(null);
            fetchMeetings();
        } catch {
            toast.error("Failed to delete meeting");
        }
    };

    const toggleExpand = async (meetingId: number) => {
        if (expandedMeeting === meetingId) {
            setExpandedMeeting(null);
            return;
        }

        setExpandedMeeting(meetingId);
        setParticipantsLoading(true);
        try {
            const res = await fetch(`/api/meetings/${meetingId}`);
            const data = await res.json();
            setParticipants(data.data?.participants || []);
        } catch {
            toast.error("Failed to load participants");
        } finally {
            setParticipantsLoading(false);
        }
    };

    const handleExportParticipants = async (meetingId: number) => {
        try {
            const res = await fetch(`/api/meetings/${meetingId}/export`);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Meeting_Participants_${meetingId}.xlsx`;
            link.click();
            URL.revokeObjectURL(url);
            toast.success("Export downloaded!");
        } catch {
            toast.error("Export failed");
        }
    };

    const togglePosition = (pos: string) => {
        setFormData((prev) => ({
            ...prev,
            target_positions: prev.target_positions.includes(pos)
                ? prev.target_positions.filter((p) => p !== pos)
                : [...prev.target_positions, pos],
        }));
    };

    const selectAllPositions = () => {
        setFormData((prev) => ({
            ...prev,
            target_positions:
                prev.target_positions.length === POSITIONS.length
                    ? []
                    : POSITIONS.map((p) => p.value),
        }));
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            meeting_date: "",
            meeting_time: "",
            google_meet_link: "",
            target_positions: [],
        });
    };

    const formatTime = (time: string) => {
        try {
            const [h, m] = time.split(":");
            const hour = parseInt(h);
            const ampm = hour >= 12 ? "PM" : "AM";
            const h12 = hour % 12 || 12;
            return `${h12}:${m} ${ampm}`;
        } catch {
            return time;
        }
    };

    return (
        <>
            <AdminNavbar title="Meetings" />

            <main className="p-5 lg:p-8 space-y-6">
                {/* Top Bar */}
                <div className="flex items-center justify-between">
                    <p className="text-slate-500 text-sm">
                        {meetings.length} meeting{meetings.length !== 1 ? "s" : ""}
                    </p>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-saffron hover:bg-saffron-light text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        Create Meeting
                    </button>
                </div>

                {/* Meetings List */}
                <div className="space-y-4">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white border border-slate-200 rounded-xl p-6"
                            >
                                <div className="h-6 bg-slate-100 rounded animate-pulse w-1/3 mb-3" />
                                <div className="h-4 bg-slate-100 rounded animate-pulse w-1/4" />
                            </div>
                        ))
                    ) : meetings.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                            <Calendar size={40} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-500 text-sm">No meetings yet</p>
                        </div>
                    ) : (
                        meetings.map((meeting) => (
                            <motion.div
                                key={meeting.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                            >
                                {/* Meeting Header */}
                                <div className="p-5 lg:p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-slate-900 font-semibold text-base truncate">
                                                {meeting.title}
                                            </h3>
                                            {meeting.description && (
                                                <p className="text-slate-500 text-sm mt-1 line-clamp-2">
                                                    {meeting.description}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {format(new Date(meeting.meeting_date), "dd MMM yyyy")}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {formatTime(meeting.meeting_time)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users size={12} />
                                                    {meeting.participant_count} participants
                                                </span>
                                                {meeting.google_meet_link && (
                                                    <a
                                                        href={meeting.google_meet_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                                                    >
                                                        <Video size={12} />
                                                        Google Meet
                                                    </a>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {meeting.target_positions.map((pos) => (
                                                    <span
                                                        key={pos}
                                                        className="inline-flex items-center px-2 py-0.5 rounded-md bg-saffron/10 text-saffron text-[11px] font-medium"
                                                    >
                                                        {pos}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            <button
                                                onClick={() => toggleExpand(meeting.id)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                                title="View participants"
                                            >
                                                {expandedMeeting === meeting.id ? (
                                                    <ChevronUp size={16} />
                                                ) : (
                                                    <Eye size={16} />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleExportParticipants(meeting.id)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                                title="Export participants"
                                            >
                                                <Download size={16} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(meeting.id)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                title="Delete meeting"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Participants */}
                                <AnimatePresence>
                                    {expandedMeeting === meeting.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-slate-200 overflow-hidden"
                                        >
                                            <div className="p-5 lg:p-6">
                                                <h4 className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold mb-3">
                                                    Participants ({participants.length})
                                                </h4>
                                                {participantsLoading ? (
                                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                        <Loader2 size={14} className="animate-spin" />
                                                        Loading...
                                                    </div>
                                                ) : participants.length === 0 ? (
                                                    <p className="text-slate-500 text-sm">No participants</p>
                                                ) : (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-left text-sm">
                                                            <thead>
                                                                <tr className="text-slate-500 text-[10px] uppercase tracking-[0.1em]">
                                                                    <th className="pb-2 pr-4 font-medium">#</th>
                                                                    <th className="pb-2 pr-4 font-medium">Name</th>
                                                                    <th className="pb-2 pr-4 font-medium hidden sm:table-cell">Position</th>
                                                                    <th className="pb-2 pr-4 font-medium hidden md:table-cell">Mobile</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {participants.map((p, i) => (
                                                                    <tr
                                                                        key={p.id}
                                                                        className="border-t border-slate-100"
                                                                    >
                                                                        <td className="py-2.5 pr-4 text-slate-400 text-xs">
                                                                            {i + 1}
                                                                        </td>
                                                                        <td className="py-2.5 pr-4 text-slate-900 font-medium">
                                                                            {p.name}
                                                                        </td>
                                                                        <td className="py-2.5 pr-4 hidden sm:table-cell">
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-saffron/10 text-saffron text-[11px] font-medium">
                                                                                {p.position}
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-2.5 pr-4 text-slate-600 hidden md:table-cell">
                                                                            {p.mobile}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    )}
                </div>
            </main>

            {/* Create Meeting Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <h2 className="text-lg font-bebas text-slate-900 tracking-[0.1em]">
                                    CREATE MEETING
                                </h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                        Meeting Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        rows={2}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5 block">
                                        Target Positions (पद) *
                                    </label>
                                    <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                                        <button
                                            type="button"
                                            onClick={selectAllPositions}
                                            className="text-xs text-saffron hover:text-saffron-light font-medium transition-colors"
                                        >
                                            {formData.target_positions.length === POSITIONS.length
                                                ? "Deselect All"
                                                : "Select All"}
                                        </button>
                                        <div className="flex flex-wrap gap-2">
                                            {POSITIONS.map((p) => {
                                                const selected = formData.target_positions.includes(p.value);
                                                return (
                                                    <button
                                                        type="button"
                                                        key={p.value}
                                                        onClick={() => togglePosition(p.value)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selected
                                                            ? "bg-saffron text-white shadow-sm"
                                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                            }`}
                                                    >
                                                        {p.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                            Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.meeting_date}
                                            onChange={(e) =>
                                                setFormData({ ...formData, meeting_date: e.target.value })
                                            }
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors [color-scheme:light]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                            Time *
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.meeting_time}
                                            onChange={(e) =>
                                                setFormData({ ...formData, meeting_time: e.target.value })
                                            }
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors [color-scheme:light]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                        Google Meet Link
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.google_meet_link}
                                        onChange={(e) =>
                                            setFormData({ ...formData, google_meet_link: e.target.value })
                                        }
                                        placeholder="https://meet.google.com/..."
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-5 py-2.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="px-6 py-2.5 bg-saffron hover:bg-saffron-light text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {formLoading && (
                                            <Loader2 size={14} className="animate-spin" />
                                        )}
                                        Create Meeting
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-center"
                        >
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={22} className="text-red-400" />
                            </div>
                            <h3 className="text-slate-900 font-semibold mb-2">
                                Delete Meeting?
                            </h3>
                            <p className="text-slate-500 text-sm mb-6">
                                This will also remove all associated participants and notifications.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-5 py-2.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="px-5 py-2.5 bg-red-600/15 border border-red-500/30 text-red-400 hover:bg-red-600/25 text-sm font-semibold rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
