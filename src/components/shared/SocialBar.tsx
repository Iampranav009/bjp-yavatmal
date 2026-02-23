"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, MessageCircle, ChevronUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const socials = [
    { icon: Facebook, href: "#", color: "hover:bg-[#1877F2]" },
    { icon: Twitter, href: "#", color: "hover:bg-black" }, // X
    { icon: Instagram, href: "#", color: "hover:bg-[#E4405F]" },
    { icon: Youtube, href: "#", color: "hover:bg-[#FF0000]" },
    { icon: MessageCircle, href: "#", color: "hover:bg-[#25D366]" }, // WhatsApp
];

export default function SocialBar() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    if (pathname?.startsWith("/admin") || pathname === "/login") return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-[90] hidden md:flex"
        >
            {socials.map((social, index) => {
                const Icon = social.icon;
                return (
                    <Link href={social.href} key={index} target="_blank" rel="noopener noreferrer">
                        <motion.div
                            whileHover={{ scale: 1.15, x: -4 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-10 h-10 rounded-full bg-slate-400/30 border border-slate-300 drop-shadow-md backdrop-blur-md flex items-center justify-center text-slate-900 transition-colors duration-300 hover:border-transparent ${social.color} hover:text-white`}
                        >
                            <Icon size={18} />
                        </motion.div>
                    </Link>
                );
            })}

            {/* Scroll to top button seamlessly included here */}
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={scrollToTop}
                    whileHover={{ scale: 1.15, x: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 mt-2 rounded-full border border-slate-300 bg-slate-400/30 backdrop-blur-md flex items-center justify-center drop-shadow-md text-slate-800 hover:text-white hover:bg-slate-700 transition-colors duration-300"
                >
                    <ChevronUp size={24} />
                </motion.button>
            )}
        </motion.div>
    );
}
