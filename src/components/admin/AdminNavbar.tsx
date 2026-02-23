"use client";

import { Bell, LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminNavbarProps {
    title: string;
    notificationCount?: number;
    adminName?: string;
    onMenuClick?: () => void;
}

export default function AdminNavbar({
    title,
    notificationCount = 0,
    adminName = "AD",
    onMenuClick,
}: AdminNavbarProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    const initials = adminName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <header className="h-16 bg-slate-50/90 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-4">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <Menu size={22} />
                </button>
                <h1 className="text-xl font-bebas text-slate-900 tracking-[0.12em]">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-3">
                {/* Notifications bell */}
                <button
                    onClick={() => router.push("/admin/birthdays")}
                    className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 relative hover:text-slate-900 hover:bg-slate-200 transition-all"
                >
                    <Bell size={16} />
                    {notificationCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                            {notificationCount > 9 ? "9+" : notificationCount}
                        </span>
                    )}
                </button>

                {/* Admin avatar */}
                <div className="w-9 h-9 rounded-full bg-saffron flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="hidden md:flex w-9 h-9 rounded-full bg-slate-100 items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Logout"
                >
                    <LogOut size={16} />
                </button>
            </div>
        </header>
    );
}
