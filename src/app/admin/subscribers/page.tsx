"use client";

import { useEffect, useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { Loader2, Trash2, Mail } from "lucide-react";
import toast from "react-hot-toast";

interface Subscriber {
    id: number;
    email: string;
    created_at: string;
}

export default function AdminSubscribersPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSubscribers = async () => {
        try {
            const res = await fetch("/api/subscribers");
            const data = await res.json();
            setSubscribers(data.data || []);
        } catch {
            toast.error("Failed to fetch subscribers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Remove this subscriber permanently?")) return;
        try {
            const res = await fetch(`/api/subscribers?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Subscriber removed");
                fetchSubscribers();
            } else {
                toast.error("Failed to remove subscriber");
            }
        } catch {
            toast.error("Network error");
        }
    };

    const downloadCSV = () => {
        const headers = "ID,Email/Phone,Subscribed On\n";
        const rows = subscribers.map(s => `${s.id},${s.email},${new Date(s.created_at).toLocaleString()}`).join("\n");
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <AdminNavbar title="Subscribers" />
            <main className="p-5 lg:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bebas text-slate-900 tracking-[0.1em]">SUBSCRIBER LIST</h2>
                        <p className="text-xs text-slate-500 mt-0.5">{subscribers.length} total subscribers</p>
                    </div>
                    {subscribers.length > 0 && (
                        <button onClick={downloadCSV}
                            className="flex items-center gap-1.5 px-4 py-2 bg-saffron text-white text-sm font-semibold rounded-lg hover:bg-saffron-light transition-colors">
                            <Mail size={16} /> Export to CSV
                        </button>
                    )}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-12 flex items-center justify-center">
                            <Loader2 className="animate-spin text-saffron" size={32} />
                        </div>
                    ) : subscribers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-700">
                                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Email / Phone</th>
                                        <th className="px-6 py-4">Subscribed On</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {subscribers.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-slate-500">#{sub.id}</td>
                                            <td className="px-6 py-4 font-medium text-slate-900">{sub.email}</td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(sub.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleDelete(sub.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete subscriber">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-16 text-center text-slate-500">
                            <Mail size={48} className="mx-auto mb-4 text-slate-300" />
                            <p>No subscribers yet.</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
