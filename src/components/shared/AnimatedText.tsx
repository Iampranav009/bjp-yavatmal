"use client";

import { motion } from "framer-motion";

interface AnimatedTextProps {
    text: string;
    className?: string;
    delayOffset?: number;
    highlightWord?: string;
}

export default function AnimatedText({ text, className = "", delayOffset = 0, highlightWord }: AnimatedTextProps) {
    const characterAnimation = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <h1 className={className} aria-label={text} role="heading">
            <motion.span
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ staggerChildren: 0.05, delayChildren: delayOffset }}
                aria-hidden="true"
                className="inline-block"
            >
                {text.split(" ").map((word, index) => {
                    const isHighlight = highlightWord && word.toLowerCase() === highlightWord.toLowerCase();
                    return (
                        <span key={index} className="inline-block pr-[0.3em] overflow-hidden">
                            {word.split("").map((character, index) => (
                                <motion.span
                                    variants={characterAnimation}
                                    transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
                                    key={index}
                                    className={`inline-block ${isHighlight ? 'text-saffron' : ''}`}
                                >
                                    {character}
                                </motion.span>
                            ))}
                        </span>
                    );
                })}
            </motion.span>
        </h1>
    );
}
