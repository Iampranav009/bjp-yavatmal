"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Trash2, Download, X, Loader2, Edit2, Shield, ShieldCheck, Eye, EyeOff } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface FormData {
    name: string;
    email: string;
    password: string;
    role: string;
}

export default function SettingsPage() {
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [showAddUser, setShowAddUser] = useState(false);
    const [showEditUser, setShowEditUser] = useState<AdminUser | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormData>({ name: "", email: "", password: "", role: "admin" });

    const fetchAdminUsers = useCallback(async () => {
        try {
            const res = await fetch("/api/admin-users");
            const data = await res.json();
            if (data.data) setAdminUsers(data.data);
        } catch {
            // Silently fail if DB not connected
        } finally {
            setLoadingUsers(false);
        }
    }, []);

    useEffect(() => {
        fetchAdminUsers();
    }, [fetchAdminUsers]);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const res = await fetch("/api/admin-users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create user");
            toast.success("Admin user created successfully!");
            setShowAddUser(false);
            setFormData({ name: "", email: "", password: "", role: "admin" });
            fetchAdminUsers();
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to create user");
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!showEditUser) return;
        setFormLoading(true);
        try {
            const payload: Partial<FormData> = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
            };
            if (formData.password) payload.password = formData.password;

            const res = await fetch(`/api/admin-users/${showEditUser.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update user");
            toast.success("User updated successfully!");
            setShowEditUser(null);
            fetchAdminUsers();
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to update user");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteUser = async (user: AdminUser) => {
        if (!confirm(`Delete ${user.name}? This action cannot be undone.`)) return;
        setDeletingId(user.id);
        try {
            const res = await fetch(`/api/admin-users/${user.id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete user");
            toast.success("User deleted successfully!");
            fetchAdminUsers();
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to delete user");
        } finally {
            setDeletingId(null);
        }
    };

    const openEditModal = (user: AdminUser) => {
        setFormData({ name: user.name, email: user.email, password: "", role: user.role });
        setShowEditUser(user);
        setShowPassword(false);
    };

    const handleExportMembers = async () => {
        try {
            const res = await fetch("/api/members/export");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `BJP_Yavatmal_Members_Backup_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
            link.click();
            URL.revokeObjectURL(url);
            toast.success("Backup downloaded!");
        } catch { toast.error("Export failed"); }
    };

    const getRoleBadge = (role: string) => {
        if (role === "super_admin") {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-saffron/10 text-saffron text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck size={10} /> Super Admin
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                <Shield size={10} /> Admin
            </span>
        );
    };

    return (
        <>
            <AdminNavbar title="Settings" />
            <main className="p-5 lg:p-8 space-y-8">

                {/* Admin Users Section */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                        <div>
                            <h2 className="font-oswald text-slate-900 tracking-[0.1em] text-lg">ADMIN USERS</h2>
                            <p className="text-slate-500 text-xs mt-0.5">Manage access credentials and roles</p>
                        </div>
                        <button onClick={() => { setFormData({ name: "", email: "", password: "", role: "admin" }); setShowAddUser(true); }}
                            className="flex items-center gap-1.5 px-3 py-2 bg-saffron/10 border border-saffron/20 text-saffron text-xs font-semibold rounded-lg hover:bg-saffron/20 transition-colors">
                            <UserPlus size={14} /> Add User
                        </button>
                    </div>

                    {loadingUsers ? (
                        <div className="p-8 flex items-center justify-center">
                            <Loader2 size={20} className="animate-spin text-slate-400" />
                        </div>
                    ) : adminUsers.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">
                            No admin users found. Add your first user above.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {adminUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-saffron flex items-center justify-center text-white text-xs font-bold shrink-0">
                                            {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-slate-900 text-sm font-medium">{user.name}</p>
                                            <p className="text-slate-500 text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {getRoleBadge(user.role)}
                                        <span className="text-slate-400 text-xs hidden sm:block">
                                            {format(new Date(user.created_at), "dd MMM yyyy")}
                                        </span>
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:text-saffron hover:bg-saffron/10 transition-colors"
                                            title="Edit user"
                                        >
                                            <Edit2 size={13} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user)}
                                            disabled={deletingId === user.id || user.role === 'super_admin'}
                                            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-slate-500 disabled:hover:bg-slate-100"
                                            title={user.role === 'super_admin' ? "Super Admin cannot be deleted" : "Delete user"}
                                        >
                                            {deletingId === user.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.section>

                {/* Organization Info */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-slate-200">
                        <h2 className="font-oswald text-slate-900 tracking-[0.1em] text-lg">ORGANIZATION INFO</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Organization Name</label>
                                <input type="text" defaultValue="BJP Yavatmal District Committee"
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Phone</label>
                                <input type="tel" placeholder="+91"
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Email</label>
                                <input type="email" placeholder="contact@bjpyavatmal.in"
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Address</label>
                                <input type="text" placeholder="Yavatmal, Maharashtra"
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="px-5 py-2 bg-saffron hover:bg-saffron-light text-white text-sm font-semibold rounded-lg transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </motion.section>

                {/* Backup */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-slate-200">
                        <h2 className="font-oswald text-slate-900 tracking-[0.1em] text-lg">BACKUP & EXPORT</h2>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={handleExportMembers}
                            className="flex items-center gap-3 p-4 bg-white/[0.02] border border-slate-200 rounded-xl hover:border-slate-300 transition-all text-left">
                            <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center">
                                <Download size={18} className="text-saffron" />
                            </div>
                            <div>
                                <p className="text-slate-900 text-sm font-medium">Export All Members</p>
                                <p className="text-slate-500 text-xs">Download full Excel backup</p>
                            </div>
                        </button>
                        <button onClick={() => toast.success("Feature available with DB connection")}
                            className="flex items-center gap-3 p-4 bg-white/[0.02] border border-slate-200 rounded-xl hover:border-slate-300 transition-all text-left">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <Download size={18} className="text-purple-400" />
                            </div>
                            <div>
                                <p className="text-slate-900 text-sm font-medium">Export Gallery URLs</p>
                                <p className="text-slate-500 text-xs">List of all image URLs</p>
                            </div>
                        </button>
                    </div>
                </motion.section>

                <div className="h-4" />
            </main>

            {/* Add User Modal */}
            <AnimatePresence>
                {showAddUser && (
                    <UserModal
                        title="ADD ADMIN USER"
                        formData={formData}
                        setFormData={setFormData}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        onSubmit={handleAddUser}
                        onClose={() => setShowAddUser(false)}
                        loading={formLoading}
                        isEdit={false}
                    />
                )}
                {showEditUser && (
                    <UserModal
                        title="EDIT ADMIN USER"
                        formData={formData}
                        setFormData={setFormData}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        onSubmit={handleEditUser}
                        onClose={() => setShowEditUser(null)}
                        loading={formLoading}
                        isEdit={true}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

interface UserModalProps {
    title: string;
    formData: FormData;
    setFormData: (d: FormData) => void;
    showPassword: boolean;
    setShowPassword: (v: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    loading: boolean;
    isEdit: boolean;
}

function UserModal({ title, formData, setFormData, showPassword, setShowPassword, onSubmit, onClose, loading, isEdit }: UserModalProps) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
                className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-slate-200">
                    <h2 className="font-oswald text-slate-900 tracking-[0.1em]">{title}</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition-colors"><X size={18} /></button>
                </div>
                <form className="p-5 space-y-4" onSubmit={onSubmit}>
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Full Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/20 transition-all"
                            placeholder="Enter full name" required />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Email Address</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/20 transition-all"
                            placeholder="user@bjpyavatmal.in" required />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">
                            Password {isEdit && <span className="text-slate-400 normal-case font-normal">(leave blank to keep current)</span>}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-slate-900 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/20 transition-all"
                                placeholder={isEdit ? "••••••••" : "Minimum 6 characters"}
                                required={!isEdit}
                                minLength={isEdit ? 0 : 6}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Role</label>
                        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            disabled={isEdit && formData.role === 'super_admin'}
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron [color-scheme:light] disabled:opacity-50 disabled:cursor-not-allowed"
                            title={isEdit && formData.role === 'super_admin' ? "Super Admin role cannot be changed" : ""}>
                            <option value="admin">Admin (Limited Access)</option>
                            <option value="super_admin">Super Admin (Full Access)</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-saffron hover:bg-saffron-light disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
                            {loading && <Loader2 size={14} className="animate-spin" />}
                            {isEdit ? "Save Changes" : "Create User"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
