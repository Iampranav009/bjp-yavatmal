"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TalukaInfo, districtStats } from "./talukaData";

interface TalukaInfoPanelProps {
  activeTaluka: TalukaInfo | null;
  activeTalukaId: string | null;
}

export default function TalukaInfoPanel({
  activeTaluka,
  activeTalukaId,
}: TalukaInfoPanelProps) {
  return (
    <div className="w-full h-full flex flex-col gap-5">

      {/* ── STATIC TITLE (always constant, never animates) ── */}
      <div>
        <h2
          className="uppercase leading-none text-[#1a1a2e] mb-1 font-oswald"
          style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", letterSpacing: "0.02em" }}
        >
          Our Footprints
        </h2>
        <h3 
          className="font-extrabold text-[#1a1a2e] font-oswald uppercase" 
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", marginTop: "-5px" }}
        >
          BJP 21 CITIES
        </h3>
      </div>

      {/* ── DYNAMIC CARD — only this part animates ── */}
      <div className="hidden md:block">
        <AnimatePresence mode="wait">

          {/* ── ACTIVE TALUKA CARD ── */}
        {activeTaluka ? (
          <motion.div
            key={activeTalukaId ?? "taluka"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              background: "rgba(255, 248, 220, 0.25)",
              border: "1.5px solid rgba(180, 130, 50, 0.6)",
              borderRadius: "8px",
              backdropFilter: "blur(8px)",
              overflow: "hidden",
            }}
          >
            {/* TOP SECTION: silhouette left + name right */}
            <div className="flex items-center gap-0">

              {/* Left: City silhouette */}
              <div
                className="flex flex-col items-center justify-between flex-shrink-0"
                style={{
                  width: "130px",
                  minHeight: "130px",
                  borderRight: "1px solid rgba(180,130,50,0.4)",
                  padding: "16px 12px 12px 12px",
                }}
              >
                {/* Brown silhouette placeholder — replace with real SVG per city later */}
                <svg
                  viewBox="0 0 100 110"
                  style={{ width: "70px", height: "80px" }}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Generic region shape placeholder */}
                  <path
                    d="M30 8 C18 12 8 22 10 38 C6 48 10 58 18 65 C14 75 20 88 30 92 C40 96 55 90 65 84 C78 80 90 70 88 56 C92 44 84 30 72 22 C62 12 46 4 30 8 Z"
                    fill="#7B3A10"
                    opacity="0.82"
                  />
                  <path
                    d="M35 18 C26 22 20 32 22 44 C20 52 26 62 35 66 C44 72 58 68 66 60 C74 54 78 42 72 32 C66 22 52 14 35 18 Z"
                    fill="#9B4A18"
                    opacity="0.5"
                  />
                </svg>
                
                {/* Social media icons */}
                <div className="flex items-center gap-2 mt-4">
                  <a href="#" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full border border-[#7B3A10] flex items-center justify-center text-[#7B3A10] hover:bg-[#7B3A10] hover:text-white transition-colors" title="Facebook">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="#" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full border border-[#7B3A10] flex items-center justify-center text-[#7B3A10] hover:bg-[#7B3A10] hover:text-white transition-colors" title="Instagram">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                </div>
              </div>

              {/* Right: Taluka name + subtitle */}
              <div className="flex flex-col justify-center px-5 py-4 min-w-0">
                <h3
                  className="font-extrabold text-[#1a1a2e] leading-tight font-oswald"
                  style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.85rem)", letterSpacing: "0.02em" }}
                >
                  Shri Prafull Singh Chauhan
                </h3>
                <p className="text-sm font-semibold text-[#1a1a2e] mt-0.5">
                  Leader Position, {activeTaluka.name}
                </p>
                <a href="#" className="text-xs font-bold text-slate-700 hover:text-[#F36523] transition-colors mt-1.5 truncate">
                  https://{activeTaluka.name.toLowerCase().replace(/\s+/g, '')}.bjp.org/
                </a>
              </div>
            </div>

            {/* Thin horizontal separator */}
            <div style={{ height: "1px", background: "rgba(180,130,50,0.45)" }} />

            {/* STATS ROW — 4 columns, large brown numbers */}
            <div className="grid grid-cols-4">
              {[
                { label: "MP Loksabha", value: "33" },
                { label: "MP Rajyasabha", value: "24" },
                { label: "MLA", value: "255" },
                { label: "MLC", value: "73" },
              ].map(({ label, value }, i) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center text-center py-4 px-1"
                  style={{
                    borderRight: i < 3 ? "1px solid rgba(180,130,50,0.4)" : "none",
                  }}
                >
                  {/* Label */}
                  <span
                    className="font-semibold uppercase text-[#7a5020] leading-tight block mb-2"
                    style={{ fontSize: "0.58rem", letterSpacing: "0.08em" }}
                  >
                    {label}
                  </span>
                  {/* Value — big brown, matching reference */}
                  <span
                    className="font-extrabold leading-none text-[#7B3A10]"
                    style={{ fontSize: "clamp(0.85rem, 1.5vw, 1.15rem)" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        ) : (
          /* ── PLACEHOLDER CARD (nothing selected) ── */
          <motion.div
            key="placeholder"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              background: "rgba(255, 248, 220, 0.25)",
              border: "1.5px solid rgba(180, 130, 50, 0.6)",
              borderRadius: "8px",
              backdropFilter: "blur(8px)",
              overflow: "hidden",
            }}
          >
            {/* District summary header */}
            <div className="px-5 py-4">
              <p
                className="font-bold text-[#1a1a2e] font-oswald"
                style={{ fontSize: "1.1rem", letterSpacing: "0.04em" }}
              >
                Yavatmal District — Overview
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Click on a <span className="font-bold text-[#F36523]">saffron</span> taluka on the map to explore
              </p>
            </div>

            {/* Thin separator */}
            <div style={{ height: "1px", background: "rgba(180,130,50,0.45)" }} />

            {/* District stats — same style */}
            <div className="grid grid-cols-2">
              {[
                { label: "Total Talukas", value: String(districtStats.totalTalukas) },
                { label: "Total Area", value: districtStats.totalArea },
                { label: "Est. Population", value: districtStats.population },
                { label: "Headquarters", value: districtStats.headquarters },
              ].map(({ label, value }, i) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center text-center py-5 px-3"
                  style={{
                    borderRight: i % 2 === 0 ? "1px solid rgba(180,130,50,0.4)" : "none",
                    borderBottom: i < 2 ? "1px solid rgba(180,130,50,0.4)" : "none",
                  }}
                >
                  <span
                    className="font-semibold uppercase text-[#7a5020] leading-tight block mb-2"
                    style={{ fontSize: "0.6rem", letterSpacing: "0.08em" }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-extrabold text-[#7B3A10] leading-none"
                    style={{ fontSize: "clamp(1rem, 1.8vw, 1.4rem)" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>


            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
