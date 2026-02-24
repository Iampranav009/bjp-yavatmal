"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    X,
    Loader2,
    FileDown,
    Upload,
    Download,
    Trash2,
    Eye,
    ChevronDown,
    ChevronUp,
    ClipboardList,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { POSITIONS } from "@/lib/positions";

interface Task {
    id: number;
    title: string;
    description?: string;
    priority: string;
    start_date: string;
    due_date: string;
    reference_id: string;
    status: string;
    pdf_file_name?: string;
    pdf_generated_at?: string;
    created_by_name?: string;
    member_count: number;
    target_positions: string[];
    created_at: string;
}

interface TaskMember {
    id: number;
    name: string;
    position: string;
    mobile: string;
    address?: string;
}

interface ImportResult {
    added: number;
    skipped: number;
    rejected: number;
    total: number;
}

interface ImportError {
    row: number;
    reason: string;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [expandedTask, setExpandedTask] = useState<number | null>(null);
    const [members, setMembers] = useState<TaskMember[]>([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [exportLoading, setExportLoading] = useState<number | null>(null);
    const [showImportResult, setShowImportResult] = useState(false);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const [importErrors, setImportErrors] = useState<ImportError[]>([]);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
        start_date: "",
        due_date: "",
        target_positions: [] as string[],
    });

    const fetchTasks = useCallback(async () => {
        try {
            const res = await fetch("/api/tasks");
            const data = await res.json();
            setTasks(data.data || []);
        } catch {
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.target_positions.length === 0) {
            toast.error("Select at least one target committee");
            return;
        }
        setFormLoading(true);

        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to create");
            }

            const data = await res.json();
            toast.success(data.message || "Task created!");
            setShowForm(false);
            resetForm();
            fetchTasks();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to create task");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            toast.success("Task deleted");
            setDeleteConfirm(null);
            if (expandedTask === id) setExpandedTask(null);
            fetchTasks();
        } catch {
            toast.error("Failed to delete task");
        }
    };

    const handleExportPDF = async (taskId: number) => {
        setExportLoading(taskId);
        try {
            const res = await fetch(`/api/tasks/${taskId}/export-pdf`, {
                method: "POST",
            });

            if (!res.ok) throw new Error("PDF generation failed");

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            const disposition = res.headers.get("Content-Disposition");
            const fileNameMatch = disposition?.match(/filename="(.+)"/);
            link.download = fileNameMatch ? fileNameMatch[1] : `Task_Export.pdf`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success("PDF exported successfully!");
            fetchTasks(); // Refresh to show pdf_generated_at
        } catch {
            toast.error("Failed to export PDF");
        } finally {
            setExportLoading(null);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fd = new FormData();
        fd.append("file", file);

        try {
            const res = await fetch("/api/tasks/import", {
                method: "POST",
                body: fd,
            });
            const data = await res.json();

            if (data.data) {
                setImportResult(data.data);
                setImportErrors(data.errors || []);
                setShowImportResult(true);
            }

            if (data.data?.added > 0) {
                toast.success(`${data.data.added} tasks imported!`);
                fetchTasks();
            } else if (data.error) {
                toast.error(data.error);
            }
        } catch {
            toast.error("Import failed");
        }

        e.target.value = "";
    };

    const handleDownloadTemplate = async () => {
        try {
            const res = await fetch("/api/tasks/import/template");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "BGP_Task_Import_Template.csv";
            link.click();
            URL.revokeObjectURL(url);
            toast.success("Template downloaded!");
        } catch {
            toast.error("Failed to download template");
        }
    };

    const toggleExpand = async (taskId: number) => {
        if (expandedTask === taskId) {
            setExpandedTask(null);
            return;
        }

        setExpandedTask(taskId);
        setMembersLoading(true);
        try {
            const res = await fetch(`/api/tasks/${taskId}`);
            const data = await res.json();
            setMembers(data.data?.assigned_members || []);
        } catch {
            toast.error("Failed to load task details");
        } finally {
            setMembersLoading(false);
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
            priority: "medium",
            start_date: "",
            due_date: "",
            target_positions: [],
        });
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case "urgent": return "bg-red-100 text-red-700";
            case "high": return "bg-orange-100 text-orange-700";
            case "medium": return "bg-blue-100 text-blue-700";
            case "low": return "bg-green-100 text-green-700";
            default: return "bg-slate-100 text-slate-600";
        }
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case "completed": return "bg-green-100 text-green-700";
            case "in_progress": return "bg-blue-100 text-blue-700";
            case "pending": return "bg-yellow-100 text-yellow-700";
            default: return "bg-slate-100 text-slate-600";
        }
    };

    return (
        <>
            <AdminNavbar title="Assign Tasks" />

            <main className="p-5 lg:p-8 space-y-6">
                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-slate-500 text-sm">
                        {tasks.length} task{tasks.length !== 1 ? "s" : ""}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={() => {
                                resetForm();
                                setShowForm(true);
                            }}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-saffron hover:bg-saffron-light text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                            Assign Task
                        </button>

                        <label className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-lg transition-colors cursor-pointer">
                            <Upload size={14} />
                            Import Tasks
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                className="hidden"
                                onChange={handleImport}
                            />
                        </label>

                        <button
                            onClick={handleDownloadTemplate}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-lg transition-colors"
                        >
                            <Download size={14} />
                            Template
                        </button>
                    </div>
                </div>

                {/* Tasks List */}
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
                    ) : tasks.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                            <ClipboardList size={40} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-500 text-sm">No tasks assigned yet</p>
                            <p className="text-slate-400 text-xs mt-1">Click &quot;Assign Task&quot; to create your first task</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                            >
                                {/* Task Header */}
                                <div className="p-5 lg:p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-slate-900 font-semibold text-base truncate">
                                                    {task.title}
                                                </h3>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${getStatusColor(task.status)}`}>
                                                    {task.status.replace("_", " ")}
                                                </span>
                                            </div>

                                            {task.description && (
                                                <p className="text-slate-500 text-sm mt-1 line-clamp-2">
                                                    {task.description}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                                                <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                                                    {task.reference_id}
                                                </span>
                                                <span>
                                                    {format(new Date(task.start_date), "dd MMM")} → {format(new Date(task.due_date), "dd MMM yyyy")}
                                                </span>
                                                <span>{task.member_count} member{task.member_count !== 1 ? "s" : ""}</span>
                                                {task.pdf_generated_at && (
                                                    <span className="text-green-600 flex items-center gap-1">
                                                        <CheckCircle2 size={10} /> PDF generated
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {task.target_positions.map((pos) => (
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
                                                onClick={() => toggleExpand(task.id)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                                title="View details"
                                            >
                                                {expandedTask === task.id ? (
                                                    <ChevronUp size={16} />
                                                ) : (
                                                    <Eye size={16} />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleExportPDF(task.id)}
                                                disabled={exportLoading === task.id}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-saffron hover:bg-saffron/10 transition-colors disabled:opacity-50"
                                                title="Export as PDF"
                                            >
                                                {exportLoading === task.id ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <FileDown size={16} />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(task.id)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                title="Delete task"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {expandedTask === task.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-slate-200 overflow-hidden"
                                        >
                                            <div className="p-5 lg:p-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold">
                                                        Assigned Members ({members.length})
                                                    </h4>
                                                    <button
                                                        onClick={() => handleExportPDF(task.id)}
                                                        disabled={exportLoading === task.id}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-saffron hover:bg-saffron-light text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        {exportLoading === task.id ? (
                                                            <Loader2 size={12} className="animate-spin" />
                                                        ) : (
                                                            <FileDown size={12} />
                                                        )}
                                                        Export as PDF
                                                    </button>
                                                </div>

                                                {membersLoading ? (
                                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                        <Loader2 size={14} className="animate-spin" />
                                                        Loading...
                                                    </div>
                                                ) : members.length === 0 ? (
                                                    <p className="text-slate-500 text-sm">No members assigned</p>
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
                                                                {members.map((m, i) => (
                                                                    <tr
                                                                        key={m.id}
                                                                        className="border-t border-slate-100"
                                                                    >
                                                                        <td className="py-2.5 pr-4 text-slate-400 text-xs">
                                                                            {i + 1}
                                                                        </td>
                                                                        <td className="py-2.5 pr-4 text-slate-900 font-medium">
                                                                            {m.name}
                                                                        </td>
                                                                        <td className="py-2.5 pr-4 hidden sm:table-cell">
                                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-saffron/10 text-saffron text-[11px] font-medium">
                                                                                {m.position}
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-2.5 pr-4 text-slate-600 hidden md:table-cell">
                                                                            {m.mobile}
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

            {/* Create Task Modal */}
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
                                    ASSIGN NEW TASK
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
                                        Task Title *
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
                                        rows={3}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5 block">
                                        Target Committees (समिती) *
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

                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                        Priority *
                                    </label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) =>
                                            setFormData({ ...formData, priority: e.target.value })
                                        }
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                            Start Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.start_date}
                                            onChange={(e) =>
                                                setFormData({ ...formData, start_date: e.target.value })
                                            }
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors [color-scheme:light]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                                            Due Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.due_date}
                                            onChange={(e) =>
                                                setFormData({ ...formData, due_date: e.target.value })
                                            }
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron transition-colors [color-scheme:light]"
                                            required
                                        />
                                    </div>
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
                                        Assign Task
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Import Result Modal */}
            <AnimatePresence>
                {showImportResult && importResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowImportResult(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <h2 className="text-lg font-bebas text-slate-900 tracking-[0.1em]">
                                    IMPORT SUMMARY
                                </h2>
                                <button
                                    onClick={() => setShowImportResult(false)}
                                    className="text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-green-700">{importResult.added}</p>
                                        <p className="text-xs text-green-600 font-medium mt-1">Successfully Imported</p>
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-red-700">
                                            {importResult.rejected + importResult.skipped}
                                        </p>
                                        <p className="text-xs text-red-600 font-medium mt-1">Failed / Skipped</p>
                                    </div>
                                </div>

                                <div className="text-center text-slate-500 text-sm">
                                    Total rows processed: {importResult.total}
                                </div>

                                {importErrors.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] uppercase tracking-[0.12em] text-red-500 font-semibold flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            Errors ({importErrors.length})
                                        </h4>
                                        <div className="max-h-40 overflow-y-auto space-y-1">
                                            {importErrors.map((err, i) => (
                                                <div
                                                    key={i}
                                                    className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2"
                                                >
                                                    {err.row > 0 && <span className="font-semibold">Row {err.row}: </span>}
                                                    {err.reason}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => setShowImportResult(false)}
                                    className="w-full px-5 py-2.5 bg-saffron hover:bg-saffron-light text-white text-sm font-semibold rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
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
                                Delete Task?
                            </h3>
                            <p className="text-slate-500 text-sm mb-6">
                                This will remove the task, all assignments, and notifications.
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
