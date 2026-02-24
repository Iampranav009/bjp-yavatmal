"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Plus,
    Upload,
    Download,
    MoreVertical,
    Edit,
    Trash2,
    Cake,
    Phone,
    X,
    Loader2,
    Filter,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { getDaysUntilBirthday } from "@/lib/birthday";
import { POSITIONS, DEFAULT_POSITION } from "@/lib/positions";

interface Member {
    id: number;
    name: string;
    position: string;
    mobile: string;
    birth_date: string;
    birth_year?: number | null;
    address?: string;
    photo_url?: string;
    notes?: string;
}

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [search, setSearch] = useState("");
    const [positionFilter, setPositionFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMember, setEditMember] = useState<Member | null>(null);
    const [menuOpen, setMenuOpen] = useState<number | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        position: DEFAULT_POSITION,
        mobile: "",
        birth_date: "",
        birth_year: "",
        address: "",
        notes: "",
    });

    const fetchMembers = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (positionFilter) params.set("position", positionFilter);
            const res = await fetch(`/api/members?${params.toString()}`);
            const data = await res.json();
            setMembers(data.data || []);
        } catch {
            toast.error("Failed to load members");
        } finally {
            setLoading(false);
        }
    }, [search, positionFilter]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const url = editMember
                ? `/api/members/${editMember.id}`
                : "/api/members";
            const method = editMember ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    birth_year: formData.birth_year ? Number(formData.birth_year) : null,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to save");
            }

            toast.success(
                editMember ? "Member updated!" : "Member added!"
            );
            setShowForm(false);
            setEditMember(null);
            resetForm();
            fetchMembers();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save member");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            toast.success("Member deleted");
            setDeleteConfirm(null);
            fetchMembers();
        } catch {
            toast.error("Failed to delete member");
        }
    };

    const handleEdit = (member: Member) => {
        setEditMember(member);
        setFormData({
            name: member.name,
            position: member.position || DEFAULT_POSITION,
            mobile: member.mobile || "",
            birth_date: member.birth_date
                ? format(new Date(member.birth_date), "yyyy-MM-dd")
                : "",
            birth_year: member.birth_year?.toString() || "",
            address: member.address || "",
            notes: member.notes || "",
        });
        setShowForm(true);
        setMenuOpen(null);
    };

    const handleExport = async () => {
        try {
            const res = await fetch("/api/members/export");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `BJP_Yavatmal_Members_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
            link.click();
            URL.revokeObjectURL(url);
            toast.success("Export downloaded!");
        } catch {
            toast.error("Export failed");
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fd = new FormData();
        fd.append("file", file);

        try {
            const res = await fetch("/api/members/import", {
                method: "POST",
                body: fd,
            });
            const data = await res.json();
            if (data.errors && data.errors.length > 0) {
                toast.error(`${data.errors.length} rows rejected (invalid position)`);
            }
            toast.success(data.message || "Import complete");
            fetchMembers();
        } catch {
            toast.error("Import failed");
        }

        e.target.value = "";
    };

    const handleCopyMobile = (mobile: string) => {
        navigator.clipboard.writeText(mobile);
        toast.success("Mobile number copied!");
        setMenuOpen(null);
    };

    const handleGenerateLetter = async (member: Member) => {
        setMenuOpen(null);
        try {
            const { downloadBirthdayPDF } = await import(
                "@/components/admin/BirthdayLetterPDF"
            );
            await downloadBirthdayPDF(member.name, member.position, member.birth_date);
            toast.success("Letter generated!");
        } catch {
            toast.error("Failed to generate letter");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            position: DEFAULT_POSITION,
            mobile: "",
            birth_date: "",
            birth_year: "",
            address: "",
            notes: "",
        });
    };

    const openAddForm = () => {
        setEditMember(null);
        resetForm();
        setShowForm(true);
    };

    return (
        <>
            <AdminNavbar title="Members" />

            <main className="p-5 lg:p-8 space-y-6">
                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex-1 flex items-center gap-2 w-full sm:max-w-xl">
                        <div className="relative flex-1">
                            <Search
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search members..."
                                className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors placeholder:text-slate-900/20"
                            />
                        </div>
                        <div className="relative">
                            <Filter
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                            />
                            <select
                                value={positionFilter}
                                onChange={(e) => setPositionFilter(e.target.value)}
                                className="bg-white border border-slate-200 rounded-lg pl-8 pr-8 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors appearance-none cursor-pointer"
                            >
                                <option value="">सर्व पदे</option>
                                {POSITIONS.map((p) => (
                                    <option key={p.value} value={p.value}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={openAddForm}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-saffron hover:bg-saffron-light text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                            Add Member
                        </button>

                        <label className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-slate-200 text-slate-900 text-sm font-medium rounded-lg transition-colors cursor-pointer">
                            <Upload size={14} />
                            Import
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                className="hidden"
                                onChange={handleImport}
                            />
                        </label>

                        <button
                            onClick={handleExport}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-slate-200 text-slate-900 text-sm font-medium rounded-lg transition-colors"
                        >
                            <Download size={14} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/[0.03] text-slate-500 text-[10px] uppercase tracking-[0.1em]">
                                    <th className="p-4 font-medium w-8">#</th>
                                    <th className="p-4 font-medium">Name</th>
                                    <th className="p-4 font-medium hidden md:table-cell">Position</th>
                                    <th className="p-4 font-medium hidden lg:table-cell">Mobile</th>
                                    <th className="p-4 font-medium hidden sm:table-cell">Birthday</th>
                                    <th className="p-4 font-medium w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="border-t border-slate-200">
                                            <td colSpan={6} className="p-4">
                                                <div className="h-5 bg-white/[0.03] rounded animate-pulse" />
                                            </td>
                                        </tr>
                                    ))
                                ) : members.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="p-10 text-center text-slate-500 text-sm"
                                        >
                                            No members found
                                        </td>
                                    </tr>
                                ) : (
                                    members.map((member, i) => {
                                        const bd = new Date(member.birth_date);
                                        const daysLeft = getDaysUntilBirthday(bd);
                                        const birthdayStr = format(bd, "dd MMM");
                                        const isUpcoming = daysLeft <= 6;

                                        return (
                                            <motion.tr
                                                key={member.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.03 }}
                                                className="border-t border-slate-200 hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="p-4 text-slate-500 text-xs">{i + 1}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-900 text-[10px] font-bold flex-shrink-0">
                                                            {member.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")
                                                                .slice(0, 2)
                                                                .toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-slate-900 text-sm font-medium truncate">
                                                                {member.name}
                                                            </p>
                                                            <p className="text-slate-500 text-xs md:hidden truncate">
                                                                {member.position}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-600 text-sm hidden md:table-cell">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-saffron/10 text-saffron text-xs font-medium">
                                                        {member.position}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-slate-600 text-sm hidden lg:table-cell">
                                                    {member.mobile}
                                                </td>
                                                <td className="p-4 hidden sm:table-cell">
                                                    <span
                                                        className={`text-xs font-medium ${isUpcoming ? "text-saffron" : "text-slate-500"
                                                            }`}
                                                    >
                                                        {birthdayStr}
                                                        {isUpcoming && (
                                                            <span className="ml-1.5 text-[10px] opacity-70">
                                                                ({daysLeft === 0 ? "Today!" : `in ${daysLeft}d`})
                                                            </span>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="p-4 relative">
                                                    <button
                                                        onClick={() =>
                                                            setMenuOpen(menuOpen === member.id ? null : member.id)
                                                        }
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>

                                                    {menuOpen === member.id && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-30"
                                                                onClick={() => setMenuOpen(null)}
                                                            />
                                                            <div className="absolute right-4 top-12 w-44 bg-white border border-slate-200 rounded-xl shadow-2xl z-40 py-1.5 overflow-hidden">
                                                                <button
                                                                    onClick={() => handleEdit(member)}
                                                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-900/70 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                                                >
                                                                    <Edit size={14} /> Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleGenerateLetter(member)}
                                                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-900/70 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                                                >
                                                                    <Cake size={14} /> Generate Letter
                                                                </button>
                                                                {member.mobile && (
                                                                    <button
                                                                        onClick={() => handleCopyMobile(member.mobile)}
                                                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-900/70 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                                                    >
                                                                        <Phone size={14} /> Copy Mobile
                                                                    </button>
                                                                )}
                                                                <div className="my-1 border-t border-slate-200" />
                                                                <button
                                                                    onClick={() => {
                                                                        setMenuOpen(null);
                                                                        setDeleteConfirm(member.id);
                                                                    }}
                                                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                                                >
                                                                    <Trash2 size={14} /> Delete
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => {
                            setShowForm(false);
                            setEditMember(null);
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <h2 className="text-lg font-bebas text-slate-900 tracking-[0.1em]">
                                    {editMember ? "EDIT MEMBER" : "ADD MEMBER"}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditMember(null);
                                    }}
                                    className="text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                            Position (पद) *
                                        </label>
                                        <select
                                            value={formData.position}
                                            onChange={(e) =>
                                                setFormData({ ...formData, position: e.target.value })
                                            }
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors appearance-none cursor-pointer"
                                            required
                                        >
                                            {POSITIONS.map((p) => (
                                                <option key={p.value} value={p.value}>
                                                    {p.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                            Mobile *
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.mobile}
                                            onChange={(e) =>
                                                setFormData({ ...formData, mobile: e.target.value })
                                            }
                                            placeholder="+91"
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                            Birth Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.birth_date}
                                            onChange={(e) =>
                                                setFormData({ ...formData, birth_date: e.target.value })
                                            }
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors [color-scheme:light]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                            Birth Year (optional)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.birth_year}
                                            onChange={(e) =>
                                                setFormData({ ...formData, birth_year: e.target.value })
                                            }
                                            placeholder="1985"
                                            min="1900"
                                            max="2010"
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                            Address
                                        </label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) =>
                                                setFormData({ ...formData, address: e.target.value })
                                            }
                                            rows={2}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors resize-none"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                            Notes
                                        </label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) =>
                                                setFormData({ ...formData, notes: e.target.value })
                                            }
                                            rows={2}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditMember(null);
                                        }}
                                        className="px-5 py-2.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="px-6 py-2.5 bg-saffron hover:bg-saffron-light text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {formLoading && <Loader2 size={14} className="animate-spin" />}
                                        {editMember ? "Update" : "Add Member"}
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
                            <h3 className="text-slate-900 font-semibold mb-2">Delete Member?</h3>
                            <p className="text-slate-500 text-sm mb-6">
                                This action cannot be undone.
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
