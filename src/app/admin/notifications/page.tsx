"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Bell, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Notification {
    id: number;
    admin_id: number | null;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/admin-notifications");
            const json = await res.json();
            if (json.data) setNotifications(json.data);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center">
                        <Bell className="text-saffron w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-oswald text-slate-900 tracking-wide uppercase">Admin Activity Notifications</h1>
                        <p className="text-sm text-slate-500">Real-time alerts on admin actions</p>
                    </div>
                </div>
                <Link href="/admin/control" className="flex items-center gap-2 text-saffron hover:text-saffron/80 text-sm font-medium transition-colors">
                    Go to Admin Control <ArrowRight size={16} />
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No new notifications.</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {notifications.map((notif) => (
                            <div key={notif.id} className={`p-4 hover:bg-slate-50 transition-colors ${!notif.is_read ? 'bg-blue-50/50' : ''}`}>
                                <div className="flex items-start gap-4">
                                    <div className="w-2 h-2 rounded-full bg-saffron mt-2 shrink-0"></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-slate-900 text-sm">{notif.title}</h3>
                                            <span className="text-xs text-slate-400 whitespace-nowrap">
                                                {format(new Date(notif.created_at), "MMM d, h:mm a")}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 text-sm mt-1">{notif.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
