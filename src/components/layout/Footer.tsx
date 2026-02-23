"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

export default function Footer() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const f = t("footer");

    // Hide Footer on admin and login pages
    if (pathname?.startsWith("/admin") || pathname === "/login") {
        return null;
    }

    const year = new Date().getFullYear();
    const copyright = f.copyright.replace("{year}", String(year));

    return (
        <footer className="bg-[#F8FAFC] pt-16 pb-8 border-t border-slate-300 relative z-10">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* Column 1 - Brand */}
                    <div className="flex flex-col">
                        <Link href="/" className="flex items-center gap-4 mb-6">
                            <div className="relative w-12 h-12">
                                <Image src="/images/logos/bjp-logo.png" alt="BJP Logo" fill className="object-contain" />
                            </div>
                            <div className="flex flex-col justify-center gap-1">
                                <span className="font-['Tiro_Devanagari_Hindi'] text-2xl md:text-3xl text-slate-900 leading-none font-bold">
                                    {f.logoLine1}
                                </span>
                                <span className="font-['Tiro_Devanagari_Hindi'] text-lg md:text-xl text-saffron leading-none">
                                    {f.logoLine2}
                                </span>
                            </div>
                        </Link>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-sm">
                            {f.description}
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 hover:bg-saffron hover:text-white transition-all">
                                <Facebook size={18} />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 hover:bg-saffron hover:text-white transition-all">
                                <Twitter size={18} />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 hover:bg-saffron hover:text-white transition-all">
                                <Instagram size={18} />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 hover:bg-saffron hover:text-white transition-all">
                                <Youtube size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2 - Quick Links */}
                    <div>
                        <h3 className="text-xl font-['Bebas_Neue'] text-slate-900 tracking-wider mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-saffron"></span>
                            {f.quickLinks}
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {f.quickLinkItems.map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-600 hover:text-saffron text-sm transition-colors flex items-center gap-2">
                                        <span className="text-saffron/50 text-xs">▹</span> {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 - Media & Resources */}
                    <div>
                        <h3 className="text-xl font-['Bebas_Neue'] text-slate-900 tracking-wider mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-saffron"></span>
                            {f.media}
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {f.mediaItems.map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-600 hover:text-saffron text-sm transition-colors flex items-center gap-2">
                                        <span className="text-saffron/50 text-xs">▹</span> {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4 - Contact */}
                    <div>
                        <h3 className="text-xl font-['Bebas_Neue'] text-slate-900 tracking-wider mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-saffron"></span>
                            {f.contactUs}
                        </h3>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-saffron shrink-0 mt-1" />
                                <span className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                    {f.address}
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-saffron shrink-0" />
                                <span className="text-slate-600 text-sm">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-saffron shrink-0" />
                                <span className="text-slate-600 text-sm">contact@bjpyavatmal.org</span>
                            </li>
                        </ul>
                        <Link href="/contact" className="inline-block mt-6 text-sm text-saffron underline underline-offset-4 hover:text-slate-900 transition-colors">
                            {f.grievanceCell}
                        </Link>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-200 flex flex-col items-center gap-6">
                    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-slate-500 text-sm">{copyright}</p>
                        <p className="text-slate-900/50 text-base font-['Tiro_Devanagari_Hindi'] tracking-wide">
                            {f.footerTagline}
                        </p>
                        <div className="flex items-center gap-4 text-slate-500 text-sm">
                            <Link href="#" className="hover:text-slate-900 transition-colors">{f.privacyPolicy}</Link>
                            <span>|</span>
                            <Link href="#" className="hover:text-slate-900 transition-colors">{f.termsOfUse}</Link>
                        </div>
                    </div>

                    {/* Developer Credit */}
                    <div className="w-full pt-4 border-t border-slate-200/50 flex justify-center">
                        <p className="text-slate-500 text-xs sm:text-sm flex items-center gap-1.5 font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                            Made with <span className="text-red-500 animate-pulse">❤️</span> by
                            <span className="text-slate-800 font-bold tracking-wide ml-0.5">Pranav Shinde</span> &
                            <span className="text-slate-800 font-bold tracking-wide">Prvesh Upasani</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
