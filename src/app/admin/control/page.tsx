"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, Search, ShieldAlert, User } from "lucide-react";

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface AdminAction {
    id: number;
    admin_id: number;
    admin_name: string;
    action_type: string;
    entity_type: string;
    status: string;
    payload: any;
    created_at: string;
}

export default function AdminControlPage() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [actions, setActions] = useState<AdminAction[]>([]);
    const [selectedAdminId, setSelectedAdminId] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [loading, setLoading] = useState(true);

    const fetchAdmins = async () => {
        try {
            const res = await fetch("/api/admin-users");
            const json = await res.json();
            if (json.data) setAdmins(json.data.filter((a: any) => a.role !== 'super_admin'));
        } catch (err) {
            console.error("Failed to fetch admins", err);
        }
    };

    const fetchActions = async () => {
        setLoading(true);
        try {
            let url = "/api/admin-actions";
            const params = new URLSearchParams();
            if (selectedAdminId) params.append("admin_id", selectedAdminId);
            if (statusFilter !== "all") params.append("status", statusFilter);
            
            if (params.toString()) url += `?${params.toString()}`;

            const res = await fetch(url);
            const json = await res.json();
            if (json.data) setActions(json.data);
        } catch (err) {
            console.error("Failed to fetch actions", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    useEffect(() => {
        fetchActions();
    }, [selectedAdminId, statusFilter]);

    const handleApprove = async (id: number) => {
        if (!confirm("Approve this action?")) return;
        try {
            const res = await fetch(`/api/admin-actions/${id}/approve`, { method: "POST" });
            if (res.ok) {
                alert("Action approved!");
                fetchActions();
            } else {
                alert("Failed to approve");
            }
        } catch (err) {
            alert("Error approving action");
        }
    };

    const handleReject = async (id: number) => {
        if (!confirm("Reject this action?")) return;
        try {
            const res = await fetch(`/api/admin-actions/${id}/reject`, { method: "POST" });
            if (res.ok) {
                alert("Action rejected!");
                fetchActions();
            } else {
                alert("Failed to reject");
            }
        } catch (err) {
            alert("Error rejecting action");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center">
                    <ShieldAlert className="text-saffron w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-oswald text-slate-900 tracking-wide uppercase">Admin Control</h1>
                    <p className="text-sm text-slate-500">Monitor and approve activities from standard admins</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Filter by Admin</label>
                    <select
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-saffron text-sm"
                        value={selectedAdminId}
                        onChange={(e) => setSelectedAdminId(e.target.value)}
                    >
                        <option value="">All Admins</option>
                        {admins.map(admin => (
                            <option key={admin.id} value={admin.id}>{admin.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Filter by Status</label>
                    <select
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-saffron text-sm"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending Approval</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Admin</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Details</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-sm">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading activities...</td></tr>
                            ) : actions.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No activities found.</td></tr>
                            ) : actions.map((action) => (
                                <tr key={action.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                        {format(new Date(action.created_at), "MMM d, yyyy h:mm a")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 flex items-center gap-2">
                                        <User size={14} className="text-slate-400" />
                                        {action.admin_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-slate-700">{action.action_type}</span> <span className="text-slate-500">{action.entity_type}</span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate text-slate-500" title={JSON.stringify(action.payload)}>
                                        {JSON.stringify(action.payload).substring(0, 50)}...
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {action.status === 'pending' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700"><Clock size={12}/> Pending</span>}
                                        {action.status === 'approved' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle size={12}/> Approved</span>}
                                        {action.status === 'rejected' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle size={12}/> Rejected</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {action.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleApprove(action.id)} className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors">Approve</button>
                                                <button onClick={() => handleReject(action.id)} className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors">Reject</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
