"use client";

import { motion } from "framer-motion";
import AnimatedText from "./AnimatedText";

interface SectionHeaderProps {
    label: string;
    title: string;
    highlightWord?: string;
    className?: string;
}

export default function SectionHeader({ label, title, highlightWord, className = "" }: SectionHeaderProps) {
    return (
        <div className={`mb-12 ${className}`}>
            <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-saffron uppercase font-bold tracking-widest text-sm mb-4 flex items-center gap-2"
            >
                <span className="w-4 h-4 rounded-full bg-saffron/20 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron"></span>
                </span>
                {label}
            </motion.p>

            <AnimatedText
                text={title}
                highlightWord={highlightWord}
                className="text-4xl md:text-5xl lg:text-6xl font-['Bebas_Neue'] uppercase leading-tight"
                delayOffset={0.1}
            />
        </div>
    );
}
