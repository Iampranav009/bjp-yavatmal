"use client";

import { ReactNode, useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "react-hot-toast";

interface AdminData {
    name: string;
    email: string;
    role: string;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [admin, setAdmin] = useState<AdminData | null>(null);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => {
                if (data.data) setAdmin(data.data);
            })
            .catch(() => { });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#ffffff",
                        color: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.1)",
                    },
                }}
            />

            <AdminSidebar
                adminName={admin?.name}
                adminEmail={admin?.email}
                mobileOpen={mobileSidebarOpen}
                onMobileClose={() => setMobileSidebarOpen(false)}
            />

            {/* Main content area - scrollable, offset by sidebar width */}
            <div className="lg:ml-[260px] min-h-screen overflow-y-auto pb-16 lg:pb-0">
                {children}
            </div>
        </div>
    );
}
