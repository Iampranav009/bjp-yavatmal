"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Link as LinkIcon, User, Globe } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "../../lib/LanguageContext";
import { Language } from "../../lib/translations";
import ShareModal from "./ShareModal";

const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
    { code: "mr", label: "मराठी" },
    { code: "hi", label: "हिंदी" },
    { code: "en", label: "English" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { lang, setLang, t } = useLanguage();
    const nav = t("navbar");

    const navLinks = [
        {
            name: nav.mediaResources,
            dropdown: [
                { name: nav.photoGallery, href: "/media" },
                { name: nav.videoGallery, href: "/media#videos" },
                { name: nav.blog, href: "/articles" },
            ],
        },
        { name: nav.bjpLive, href: "/bjp-live" },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close lang dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setLangDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Hide Navbar on admin and login pages
    if (pathname?.startsWith("/admin") || pathname === "/login") {
        return null;
    }

    const currentLangLabel = LANGUAGE_OPTIONS.find((o) => o.code === lang)?.label ?? "भाषा";

    const isDark = scrolled || pathname?.startsWith("/articles");

    return (
        <>
            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${scrolled
                    ? "bg-white/80 backdrop-blur-lg shadow-sm py-2 border-b border-slate-200"
                    : "bg-transparent py-3 md:py-4"
                    }`}
            >
                <div className="w-full px-3 sm:px-6 md:px-8 lg:px-10 xl:px-14">
                    <div className="flex justify-between items-center w-full">
                        {/* Logo Section */}
                        <Link href="/" className="flex items-center gap-2 md:gap-3 z-50 group flex-shrink-0">
                            <div className="relative w-11 h-11 md:w-16 md:h-16 transition-transform group-hover:scale-105">
                                <Image
                                    src="/images/logos/bjp-logo.png"
                                    alt="BJP Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <div className="flex flex-col justify-center mt-0.5 gap-0 md:gap-1">
                                <span className="font-['Tiro_Devanagari_Hindi'] text-[18px] sm:text-2xl md:text-3xl text-saffron leading-none font-bold">
                                    {nav.logoLine1}
                                </span>
                                <span className="font-['Tiro_Devanagari_Hindi'] text-xs sm:text-lg md:text-xl text-saffron leading-none">
                                    {nav.logoLine2}
                                </span>
                            </div>
                        </Link>

                        {/* Right Section */}
                        <div className="flex flex-col items-end gap-3 flex-grow">
                            {/* Top Links Bar (Desktop only) */}
                            <div
                                className={`hidden lg:flex items-center gap-5 text-[13px] font-medium tracking-wide ${isDark ? "text-slate-800" : "text-white"
                                    }`}
                            >
                                <button onClick={() => setShareModalOpen(true)} className="flex items-center gap-1.5 hover:text-saffron transition-colors cursor-pointer">
                                    <LinkIcon size={14} /> {nav.shareUrl}
                                </button>
                                <span className="w-px h-3 bg-white/30"></span>
                                <Link href="/login" className="flex items-center gap-1.5 hover:text-saffron transition-colors">
                                    <User size={14} /> {nav.login}
                                </Link>
                                <span className="w-px h-3 bg-white/30"></span>
                                <Link href="/contact" className="hover:text-saffron transition-colors">
                                    {nav.contactUs}
                                </Link>
                                <span className="w-px h-3 bg-white/30"></span>

                                {/* Language Toggle Dropdown (Desktop) */}
                                <div ref={langRef} className="relative">
                                    <button
                                        onClick={() => setLangDropdownOpen((o) => !o)}
                                        className="flex items-center gap-1 hover:text-saffron transition-colors"
                                    >
                                        <Globe size={14} />
                                        {currentLangLabel}
                                        <ChevronDown
                                            size={13}
                                            className={`transition-transform duration-200 ${langDropdownOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {langDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 8 }}
                                                transition={{ duration: 0.18 }}
                                                className="absolute top-full right-0 mt-2 w-36 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-lg overflow-hidden flex flex-col py-1 shadow-2xl z-[200]"
                                            >
                                                {LANGUAGE_OPTIONS.map((opt) => (
                                                    <button
                                                        key={opt.code}
                                                        onClick={() => {
                                                            setLang(opt.code);
                                                            setLangDropdownOpen(false);
                                                        }}
                                                        className={`text-left px-4 py-2 text-sm transition-all hover:bg-slate-100 border-l-2 ${lang === opt.code
                                                            ? "border-saffron text-saffron font-semibold"
                                                            : "border-transparent text-slate-700"
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Main Links Bar */}
                            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                                {navLinks.map((link) => (
                                    <div
                                        key={link.name}
                                        className="relative"
                                        onMouseEnter={() => setActiveDropdown(link.name)}
                                        onMouseLeave={() => setActiveDropdown(null)}
                                    >
                                        {link.href ? (
                                            <Link
                                                href={link.href}
                                                className={`hover:text-saffron transition-colors font-bold text-sm lg:text-[15px] tracking-wide px-1 py-2 ${isDark ? "text-slate-900" : "text-white"
                                                    }`}
                                            >
                                                {link.name}
                                            </Link>
                                        ) : (
                                            <button
                                                className={`flex items-center gap-1 hover:text-saffron transition-colors font-bold text-sm lg:text-[15px] tracking-wide px-1 py-2 cursor-pointer ${isDark ? "text-slate-900" : "text-white"
                                                    }`}
                                            >
                                                {link.name}
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition-transform duration-300 ${activeDropdown === link.name ? "rotate-180 text-saffron" : ""
                                                        }`}
                                                />
                                            </button>
                                        )}

                                        {/* Dropdown Menu */}
                                        {link.dropdown && (
                                            <AnimatePresence>
                                                {activeDropdown === link.name && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-lg overflow-hidden flex flex-col py-2 shadow-2xl"
                                                    >
                                                        {link.dropdown.map((subLink, idx) => (
                                                            <Link
                                                                key={idx}
                                                                href={subLink.href}
                                                                className="text-slate-700 hover:text-slate-900 px-4 py-2.5 text-sm transition-all hover:bg-slate-100 border-l-2 border-transparent hover:border-saffron"
                                                            >
                                                                {subLink.name}
                                                            </Link>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        )}
                                    </div>
                                ))}

                                <div className="flex items-center gap-3 pl-2">
                                    <a href="https://membership.bjp.org/en/home/login" target="_blank" rel="noopener noreferrer">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-[#FCA311] hover:bg-[#F29C11] text-white px-5 py-2.5 rounded text-sm font-bold tracking-wide transition-all shadow-md"
                                        >
                                            {nav.joinBjp}
                                        </motion.button>
                                    </a>
                                </div>

                                {/* Menu button (Desktop) */}
                                <button
                                    className={`flex flex-col items-center justify-center gap-0.5 ml-2 hover:text-saffron transition-colors ${isDark ? "text-slate-900" : "text-white"
                                        }`}
                                    onClick={() => setMobileMenuOpen(true)}
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                                        {nav.menu}
                                    </span>
                                    <Menu size={24} />
                                </button>
                            </div>

                            {/* Mobile Toggle inside Right Section */}
                            <div className="flex lg:hidden items-center gap-2 sm:gap-4">
                                <a href="https://membership.bjp.org/en/home/login" target="_blank" rel="noopener noreferrer">
                                    <button className="bg-[#FCA311] hover:bg-[#F29C11] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-[10px] sm:text-xs font-bold tracking-wide shadow transition-colors">
                                        {nav.join}
                                    </button>
                                </a>
                                <button
                                    className={`z-50 p-1 sm:p-2 flex flex-col items-center hover:text-saffron transition-colors ${isDark ? "text-slate-900" : "text-white"
                                        }`}
                                    onClick={() => setMobileMenuOpen(true)}
                                >
                                    <Menu className="w-6 h-6 sm:w-[26px] sm:h-[26px]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile/Hamburger Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="fixed inset-0 z-[100] bg-[#F4F6F8]/95 backdrop-blur-xl pt-20 px-6 pb-8 overflow-y-auto"
                    >
                        <button
                            className="absolute top-6 right-6 text-slate-900 hover:text-saffron transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <X size={32} />
                        </button>

                        <div className="flex flex-col gap-6 mt-8 max-w-lg mx-auto">
                            {navLinks.map((link) => (
                                <div key={link.name} className="flex flex-col border-b border-slate-200 pb-4">
                                    {link.href ? (
                                        <Link
                                            href={link.href}
                                            className="text-2xl font-['Bebas_Neue'] tracking-wider text-slate-900 hover:text-saffron transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ) : (
                                        <>
                                            <div className="text-2xl font-['Bebas_Neue'] tracking-wider text-saffron mb-3">
                                                {link.name}
                                            </div>
                                            <div className="flex flex-col gap-3 pl-4 border-l-2 border-slate-200">
                                                {link.dropdown?.map((subLink, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={subLink.href}
                                                        className="text-slate-700 text-lg py-1 hover:text-saffron transition-colors"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {subLink.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}

                            <div className="flex flex-col gap-4 pt-4 border-b border-slate-200 pb-6">
                                <button onClick={() => { setShareModalOpen(true); setMobileMenuOpen(false); }} className="text-slate-700 hover:text-saffron flex items-center gap-3 text-left w-full cursor-pointer">
                                    <LinkIcon size={18} /> {nav.shareUrl}
                                </button>
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-slate-700 hover:text-saffron flex items-center gap-3"
                                >
                                    <User size={18} /> {nav.login}
                                </Link>
                                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 hover:text-saffron">
                                    {nav.contactUs}
                                </Link>
                            </div>

                            {/* Language Selector – Mobile */}
                            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6">
                                <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 font-bold">
                                    <Globe size={14} /> {nav.language}
                                </p>
                                <div className="flex gap-3">
                                    {LANGUAGE_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.code}
                                            onClick={() => setLang(opt.code)}
                                            className={`flex-1 py-2 rounded text-sm font-semibold border transition-all ${lang === opt.code
                                                ? "bg-saffron text-white border-saffron"
                                                : "border-slate-300 text-slate-700 hover:border-saffron"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2 pb-12 flex flex-col gap-4">
                                <a href="https://membership.bjp.org/en/home/login" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
                                    <button className="w-full bg-[#FCA311] text-white py-4 rounded font-bold text-xl font-['Bebas_Neue'] tracking-widest shadow-lg active:scale-95 transition-transform">
                                        {nav.joinBjp}
                                    </button>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
        </>
    );
}
