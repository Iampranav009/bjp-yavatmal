"use client";

import React, { useRef, useState, useEffect } from "react";
import { CLICKABLE_TALUKAS } from "./talukaData";
import { TALUKA_PATHS } from "./svgPaths";

interface YavatmalMapProps {
  hoveredTaluka: string | null;
  selectedTaluka: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string | null) => void;
}

// Human-readable names for tooltips
const TALUKA_DISPLAY_NAMES: Record<string, string> = {
  ner: "Ner",
  darwha: "Darwha",
  ralegaon: "Ralegaon",
  digras: "Digras",
  arni: "Arni",
  maregaon: "Maregaon",
  "zari-jamni": "Zari-Jamni",
  yavatmal: "Yavatmal",
  pusad: "Pusad",
  mahagaon: "Mahagaon",
  kalamb: "Kalamb",
  kelapur: "Kelapur",
  wani: "Wani",
  ghatanji: "Ghatanji",
  umerkhed: "Umerkhed",
  babulgaon: "Babulgaon",
};

export default function YavatmalMap({
  hoveredTaluka,
  selectedTaluka,
  onHover,
  onClick,
}: YavatmalMapProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const getFill = (id: string, isClickable: boolean) => {
    if (!isClickable) return "#FDEEC1";
    if (selectedTaluka === id) return "#7B3A10";
    if (hoveredTaluka === id) return "#D4541A";
    return "#F36523";
  };

  if (!mounted) return null;

  return (
    <div
      ref={mapRef}
      className="relative w-full h-full flex items-center justify-center lg:min-h-[500px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => onHover(null)}
    >
      {/* Tooltip — shows for ALL talukas on hover */}
      {hoveredTaluka && TALUKA_PATHS[hoveredTaluka] && (
        <div
          className="absolute pointer-events-none bg-[#1a1a2e] text-white px-3 py-1.5 rounded-md shadow-xl z-50 text-sm font-bold transform -translate-x-1/2 whitespace-nowrap transition-opacity duration-150"
          style={{ left: mousePos.x, top: mousePos.y - 40 }}
        >
          {TALUKA_DISPLAY_NAMES[hoveredTaluka] ?? hoveredTaluka}
          <div className="absolute left-1/2 bottom-0 w-2.5 h-2.5 bg-[#1a1a2e] transform -translate-x-1/2 translate-y-1/2 rotate-45" />
        </div>
      )}

      {/* SVG Map — viewBox matches the new SVG: 0 0 1330 908 */}
      <div className="w-full max-w-[800px] h-auto drop-shadow-xl z-10">
        <svg
          viewBox="0 0 1330 908"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Object.keys(TALUKA_PATHS).map((id) => {
            const isClickable = CLICKABLE_TALUKAS.has(id);
            return (
              <path
                key={id}
                d={TALUKA_PATHS[id]}
                fill={getFill(id, isClickable)}
                stroke="#3D1C02"
                strokeWidth="1.5"
                className={
                  isClickable
                    ? "cursor-pointer transition-all duration-200 ease-in-out hover:brightness-110 hover:drop-shadow-md"
                    : "cursor-default transition-all duration-200 ease-in-out hover:brightness-105"
                }
                onMouseEnter={() => onHover(id)}
                onClick={() => {
                  if (isClickable) {
                    onClick(selectedTaluka === id ? null : id);
                  }
                }}
                onTouchStart={() => onHover(id)}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
