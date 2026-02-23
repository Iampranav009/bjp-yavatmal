"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Trash2, Key, Download, X, Loader2 } from "lucide-react";
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

export default function SettingsPage() {
    const [showAddUser, setShowAddUser] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "admin" });

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

    return (
        <>
            <AdminNavbar title="Settings" />
            <main className="p-5 lg:p-8 space-y-8">
                {/* Admin Users Section */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="font-bebas text-slate-900 tracking-[0.1em] text-lg">ADMIN USERS</h2>
                        <button onClick={() => setShowAddUser(true)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-saffron/10 border border-saffron/20 text-saffron text-xs font-semibold rounded-lg hover:bg-saffron/20 transition-colors">
                            <UserPlus size={14} /> Add User
                        </button>
                    </div>
                    <div className="p-5">
                        <p className="text-slate-500 text-sm text-center py-6">
                            Admin user management requires database connection.
                            <br />
                            Configure your <code className="text-saffron/60">.env.local</code> with Hostinger MySQL credentials.
                        </p>
                    </div>
                </motion.section>

                {/* Organization Info */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-slate-200">
                        <h2 className="font-bebas text-slate-900 tracking-[0.1em] text-lg">ORGANIZATION INFO</h2>
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
                        <h2 className="font-bebas text-slate-900 tracking-[0.1em] text-lg">BACKUP & EXPORT</h2>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={handleExportMembers}
                            className="flex items-center gap-3 p-4 bg-white/[0.02] border border-slate-200 rounded-xl hover:border-slate-200 transition-all text-left">
                            <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center">
                                <Download size={18} className="text-saffron" />
                            </div>
                            <div>
                                <p className="text-slate-900 text-sm font-medium">Export All Members</p>
                                <p className="text-slate-500 text-xs">Download full Excel backup</p>
                            </div>
                        </button>
                        <button onClick={() => toast.success("Feature available with DB connection")}
                            className="flex items-center gap-3 p-4 bg-white/[0.02] border border-slate-200 rounded-xl hover:border-slate-200 transition-all text-left">
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

                {/* Database Info */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-slate-200">
                        <h2 className="font-bebas text-slate-900 tracking-[0.1em] text-lg">DATABASE</h2>
                    </div>
                    <div className="p-5">
                        <div className="bg-white/[0.02] border border-slate-200 rounded-lg p-4 font-mono text-xs text-slate-500 space-y-1">
                            <p>Host: <span className="text-slate-900/20">{process.env.DB_HOST ? '●●●●●●' : 'Not configured'}</span></p>
                            <p>Database: <span className="text-slate-900/20">bjp_yavatmal</span></p>
                            <p>Status: <span className="text-amber-400">Configure .env.local</span></p>
                        </div>
                    </div>
                </motion.section>

                <div className="h-4" />
            </main>

            {/* Add User Modal */}
            <AnimatePresence>
                {showAddUser && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowAddUser(false)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between p-5 border-b border-slate-200">
                                <h2 className="font-bebas text-slate-900 tracking-[0.1em]">ADD ADMIN USER</h2>
                                <button onClick={() => setShowAddUser(false)} className="text-slate-500 hover:text-slate-900"><X size={18} /></button>
                            </div>
                            <form className="p-5 space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Requires DB connection"); setShowAddUser(false); }}>
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Name</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" required />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Email</label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" required />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Password</label>
                                    <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron" required />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1 block">Role</label>
                                    <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-saffron [color-scheme:light]">
                                        <option value="admin">Admin</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setShowAddUser(false)} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                                    <button type="submit" className="px-5 py-2.5 bg-saffron hover:bg-saffron-light text-white text-sm font-semibold rounded-lg transition-colors">
                                        Add User
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
