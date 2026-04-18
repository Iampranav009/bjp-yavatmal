"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TalukaInfo, districtStats } from "./talukaData";
import Link from "next/link";

interface TalukaInfoPanelProps {
  activeTaluka: TalukaInfo | null;
  activeTalukaId: string | null;
}

const StatCard = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) => (
  <div
    className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60"
    style={{ borderLeftWidth: "4px", borderLeftColor: accent }}
  >
    <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
      {label}
    </span>
    <span className="block text-xl font-bold text-slate-800">{value}</span>
  </div>
);

export default function TalukaInfoPanel({
  activeTaluka,
  activeTalukaId,
}: TalukaInfoPanelProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {activeTaluka ? (
          <motion.div
            key={activeTalukaId ?? "taluka"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col w-full gap-4"
          >
            {/* Taluka name */}
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#F36523] mb-2 block">
                Yavatmal District
              </span>
              <h2 className="text-5xl xl:text-6xl font-['Bebas_Neue'] text-navy-dark uppercase leading-none mb-3">
                {activeTaluka.name}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                {activeTaluka.description}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Taluka HQ" value={activeTaluka.hq} accent="#F36523" />
              <StatCard label="Est. Population" value={activeTaluka.population} accent="#138808" />
              <StatCard label="Area" value={activeTaluka.area} accent="#0A1628" />
              <StatCard label="Main Crops" value={activeTaluka.crops} accent="#F36523" />
            </div>

            {/* Learn More */}
            <Link
              href={activeTaluka.link}
              className="inline-flex items-center gap-2 bg-[#F36523] hover:bg-[#D4541A] text-white font-bold px-6 py-3 rounded-full transition-all duration-200 text-sm w-fit mt-1 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Learn More <span>→</span>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col w-full gap-6"
          >
            {/* Placeholder label & heading */}
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#F36523] mb-2 block">
                Yavatmal District
              </span>
              <h2 className="text-5xl xl:text-6xl font-['Bebas_Neue'] text-navy-dark uppercase leading-none mb-3">
                Explore the District
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                Hover over a highlighted taluka on the map to explore its details — population, area, crops, and more.
              </p>
            </div>

            {/* District-level summary stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60 border-l-4 border-l-[#F36523]">
                <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                  Total Talukas
                </span>
                <span className="block text-2xl font-bold text-slate-800">
                  {districtStats.totalTalukas}
                </span>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60 border-l-4 border-l-[#138808]">
                <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                  Total Area
                </span>
                <span className="block text-2xl font-bold text-slate-800">
                  {districtStats.totalArea}
                </span>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60 border-l-4 border-l-[#0A1628]">
                <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                  Population
                </span>
                <span className="block text-2xl font-bold text-slate-800">
                  {districtStats.population}
                </span>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/60 border-l-4 border-l-[#F36523]">
                <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                  Headquarters
                </span>
                <span className="block text-xl font-bold text-slate-800">
                  {districtStats.headquarters}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Map Legend</span>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <div className="w-4 h-4 rounded-sm" style={{ background: "#F36523" }} />
                  Clickable Taluka
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <div className="w-4 h-4 rounded-sm" style={{ background: "#7B3A10" }} />
                  Selected
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <div className="w-4 h-4 rounded-sm border border-slate-300" style={{ background: "#FDEEC1" }} />
                  Other Area
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
