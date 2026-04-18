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
      className="relative w-full h-full flex items-center justify-center min-h-[500px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => onHover(null)}
    >
      {/* Tooltip */}
      {hoveredTaluka && CLICKABLE_TALUKAS.has(hoveredTaluka) && (
        <div
          className="absolute pointer-events-none bg-navy-dark text-white px-3 py-1.5 rounded-md shadow-xl z-50 text-sm font-bold transform -translate-x-1/2 -translate-y-full mt-[-12px] whitespace-nowrap transition-opacity duration-150"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          {hoveredTaluka.charAt(0).toUpperCase() + hoveredTaluka.slice(1).replace("-jamni", "-Jamni")}
          <div className="absolute left-1/2 bottom-0 w-2.5 h-2.5 bg-navy-dark transform -translate-x-1/2 translate-y-1/2 rotate-45"></div>
        </div>
      )}

      {/* SVG Map Container */}
      <div className="w-full max-w-[800px] h-auto object-contain drop-shadow-xl z-10 transition-transform duration-300">
        <svg
          viewBox="0 0 1536 1024"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* We use the simple d="..." identifiers matching those in the existing maps since the real paths were omitted by the user. */}
          {/* In a real scenario, these would be proper SVG paths (e.g. d="M123..."). */}
          {[
            { id: "ner", isClickable: true },
            { id: "pusad", isClickable: true },
            { id: "ralegaon", isClickable: false },
            { id: "digras", isClickable: false },
            { id: "umerkhed", isClickable: true },
            { id: "wani", isClickable: false },
            { id: "zari-jamni", isClickable: true },
            { id: "mahagaon", isClickable: false },
            { id: "yavatmal", isClickable: true },
            { id: "ghatanji", isClickable: true },
            { id: "maregaon", isClickable: false },
            { id: "kelapur", isClickable: false },
            { id: "pusad-south", isClickable: false },
            { id: "babhulgaon", isClickable: false },
            { id: "arni", isClickable: true },
            { id: "darwha", isClickable: true },
          ].map((taluka) => (
            <path
              key={taluka.id}
              d={TALUKA_PATHS[taluka.id]}
              className={`${
                taluka.isClickable
                  ? "cursor-pointer hover:opacity-90 hover:drop-shadow-md transition-all duration-200 ease-in-out hover:-translate-y-0.5"
                  : "cursor-default opacity-80"
              }`}
              fill={getFill(taluka.id, taluka.isClickable)}
              stroke="#3D1C02"
              strokeWidth="2"
              onMouseEnter={() => taluka.isClickable && onHover(taluka.id)}
              onClick={() => {
                if (taluka.isClickable) {
                  // If clicked already selected, unselect, else select
                  onClick(selectedTaluka === taluka.id ? null : taluka.id);
                }
              }}
              onTouchStart={() => taluka.isClickable && onHover(taluka.id)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
