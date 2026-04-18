"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: React.ReactNode;
  /** How many pixels the section shifts vertically during scroll.
   *  Positive = upward shift (default 60px). Larger = more dramatic. */
  strength?: number;
  className?: string;
}

/**
 * ParallaxSection wraps any section with a smooth vertical parallax effect.
 * As the section scrolls into / out of view the children translate by `strength` pixels.
 */
export default function ParallaxSection({
  children,
  strength = 60,
  className = "",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map scroll progress [0 → 1] to y translation [strength/2 → -strength/2]
  const y = useTransform(scrollYProgress, [0, 1], [strength / 2, -strength / 2]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
