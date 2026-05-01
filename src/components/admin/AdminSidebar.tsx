"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    CalendarDays,
    ClipboardList,
    Cake,
    ImageIcon,
    Newspaper,
    Settings,
    LogOut,
    X,
    ChevronLeft,
    ChevronRight,
    Layout,
    Mail,
    ShieldAlert,
    Bell,
} from "lucide-react";
import { useState } from "react";

const allNavItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, superAdminOnly: false },
    { label: "Members", href: "/admin/members", icon: Users, superAdminOnly: false },
    { label: "Event Posts", href: "/admin/events", icon: CalendarDays, superAdminOnly: false },
    { label: "Meetings", href: "/admin/meetings", icon: CalendarCheck, superAdminOnly: false },
    { label: "Event Tasks", href: "/admin/tasks", icon: ClipboardList, superAdminOnly: false },
    { label: "Birthdays", href: "/admin/birthdays", icon: Cake, superAdminOnly: false },
    { label: "Gallery", href: "/admin/gallery", icon: ImageIcon, superAdminOnly: false },
    { label: "Articles", href: "/admin/blogs", icon: Newspaper, superAdminOnly: false },
    { label: "Sidebar Config", href: "/admin/sidebar", icon: Layout, superAdminOnly: false },
    { label: "Subscribers", href: "/admin/subscribers", icon: Mail, superAdminOnly: false },
    { label: "Admin Control", href: "/admin/control", icon: ShieldAlert, superAdminOnly: true },
    { label: "Notifications", href: "/admin/notifications", icon: Bell, superAdminOnly: true },
    { label: "Settings", href: "/admin/settings", icon: Settings, superAdminOnly: true },
];

interface AdminSidebarProps {
    adminName?: string;
    adminEmail?: string;
    adminRole?: string;
    mobileOpen?: boolean;
    onMobileClose?: () => void;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}

export default function AdminSidebar({
    adminName = "Admin",
    adminEmail = "admin@bjpyavatmal.in",
    adminRole = "super_admin",
    mobileOpen = false,
    onMobileClose,
    isCollapsed = false,
    onToggleCollapse,
}: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const isSuperAdmin = adminRole === 'super_admin';
    const navItems = allNavItems.filter(item => !item.superAdminOnly || isSuperAdmin);
    const panelTitle = isSuperAdmin ? 'BJP SUPER ADMIN' : 'BJP ADMIN';

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
        } catch {
            setLoggingOut(false);
        }
    };

    const isActive = (href: string) => {
        if (href === "/admin/dashboard") {
            return pathname === "/admin" || pathname === "/admin/dashboard";
        }
        return pathname.startsWith(href);
    };

    const renderNavItems = (collapsedContext: boolean) => (
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar">
            {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={collapsedContext ? undefined : onMobileClose}
                        title={collapsedContext ? item.label : undefined}
                        className={`
                            w-full flex items-center relative py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                            ${collapsedContext ? 'justify-center' : 'px-4 gap-3'}
                            ${active
                                ? "bg-saffron/15 text-saffron"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            }
                        `}
                    >
                        {/* Active Border */}
                        {active && (
                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-saffron rounded-r-full ${collapsedContext ? '-ml-4' : 'ml-0'}`} />
                        )}

                        <item.icon size={20} className="shrink-0" />

                        {!collapsedContext && (
                            <span className="whitespace-nowrap transition-all duration-300">
                                {item.label}
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );

    const renderMobileContent = () => (
        <>
            {/* Logo */}
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-oswald text-slate-900 tracking-[0.15em]">
                            {panelTitle}
                        </h2>
                        <p className="text-saffron text-[10px] font-bold uppercase tracking-[0.2em]">
                            Yavatmal District
                        </p>
                    </div>
                    {/* Mobile close button */}
                    {onMobileClose && (
                        <button
                            onClick={onMobileClose}
                            className="lg:hidden text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation */}
            {renderNavItems(false)}

            {/* User + Logout */}
            <div className="p-4 border-t border-slate-200">
                <div className="px-4 py-3 mb-2">
                    <p className="text-slate-900 text-sm font-medium truncate">{adminName}</p>
                    <p className="text-slate-500 text-xs truncate">{adminEmail}</p>
                    <span className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${isSuperAdmin ? 'bg-saffron/10 text-saffron' : 'bg-slate-100 text-slate-500'}`}>
                        {isSuperAdmin ? 'Super Admin' : 'Admin'}
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                >
                    <LogOut size={18} />
                    {loggingOut ? "Logging out..." : "Logout"}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex flex-col bg-white border-r border-slate-200 h-screen z-30 transition-all duration-300 ease-in-out relative ${isCollapsed ? 'w-20' : 'w-[260px]'}`}>
                {/* Toggle Button */}
                {onToggleCollapse && (
                    <button
                        onClick={onToggleCollapse}
                        className="absolute -right-3 top-8 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-slate-900 z-50 flex items-center justify-center shadow-sm"
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                )}

                {/* Logo */}
                <div className={`p-6 border-b border-slate-200 h-[88px] flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
                    {!isCollapsed ? (
                        <div className="whitespace-nowrap overflow-hidden">
                            <h2 className="text-2xl font-oswald text-slate-900 tracking-[0.15em]">
                                {panelTitle}
                            </h2>
                            <p className="text-saffron text-[10px] font-bold uppercase tracking-[0.2em]">
                                Yavatmal District
                            </p>
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded bg-saffron flex items-center justify-center text-white font-oswald text-xl shrink-0">
                            B
                        </div>
                    )}
                </div>

                {/* Navigation */}
                {renderNavItems(isCollapsed)}

                {/* User + Logout */}
                <div className="p-4 border-t border-slate-200 flex flex-col justify-end">
                    {!isCollapsed && (
                        <div className="px-4 py-3 mb-2 overflow-hidden">
                            <p className="text-slate-900 text-sm font-medium truncate">{adminName}</p>
                            <p className="text-slate-500 text-xs truncate">{adminEmail}</p>
                            <span className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${isSuperAdmin ? 'bg-saffron/10 text-saffron' : 'bg-slate-100 text-slate-500'}`}>
                                {isSuperAdmin ? 'Super Admin' : 'Admin'}
                            </span>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        title={isCollapsed ? "Logout" : undefined}
                        disabled={loggingOut}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200`}
                    >
                        <LogOut size={20} className="shrink-0" />
                        {!isCollapsed && (
                            <span className="whitespace-nowrap overflow-hidden">
                                {loggingOut ? "Logging out..." : "Logout"}
                            </span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={onMobileClose}
                    />
                    <aside className="lg:hidden fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-slate-200 z-50 flex flex-col animate-slideInLeft">
                        {renderMobileContent()}
                    </aside>
                </>
            )}

            {/* Mobile Bottom Nav */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-30 flex items-center justify-around px-2">
                {navItems.slice(0, 5).map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${active ? "text-saffron" : "text-slate-500"
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
