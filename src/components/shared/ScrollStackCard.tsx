"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollStackCardProps {
  children: React.ReactNode;
  /**
   * Set true for the very last card — it never needs to scale away,
   * so we skip the animation and keep the wrapper at 100vh.
   */
  isLast?: boolean;
  /**
   * z-index applied to the sticky card.
   * Pass an incrementing value so later cards stack on top.
   */
  zIndex?: number;
}

export default function ScrollStackCard({
  children,
  isLast = false,
  zIndex = 1,
}: ScrollStackCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Last card never scales away — nothing to animate
    if (isLast || !wrapperRef.current || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { scale: 1, opacity: 1, borderRadius: "0px" },
        {
          scale: 0.88,
          opacity: 0.45,
          borderRadius: "20px",
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            // Animation starts the moment this card hits the top of the viewport
            start: "top top",
            // Animation finishes when the wrapper's bottom reaches the viewport bottom
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [isLast]);

  return (
    /*
     * Outer wrapper — gives the page scroll space for the exit animation.
     * Non-last cards:  200vh  (100vh visible + 100vh for the outgoing animation)
     * Last card:       100vh  (just the visible card, no exit needed)
     */
    <div
      ref={wrapperRef}
      style={{ height: isLast ? "100vh" : "200vh" }}
    >
      {/*
       * Sticky card — stays pinned at the top while the wrapper scrolls.
       * transform-origin: top center so the scale shrinks toward the top edge.
       */}
      <div
        ref={cardRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          transformOrigin: "top center",
          zIndex,
          willChange: "transform, opacity",
        }}
      >
        {children}
      </div>
    </div>
  );
}
