"use client";

import { useState } from "react";
import YavatmalMap from "./YavatmalMap";
import TalukaInfoPanel from "./TalukaInfoPanel";
import { talukaData, CLICKABLE_TALUKAS } from "./talukaData";

interface MapSectionProps {
  id?: string;
  bgImage?: string;
}

export default function MapSection({ id = "map", bgImage }: MapSectionProps) {
  const [hoveredTaluka, setHoveredTaluka] = useState<string | null>(null);
  const [selectedTaluka, setSelectedTaluka] = useState<string | null>(null);

  // Active taluka = hoveredTaluka ?? selectedTaluka
  const activeTalukaId = hoveredTaluka ?? selectedTaluka;
  const activeTalukaInfo = activeTalukaId && CLICKABLE_TALUKAS.has(activeTalukaId) 
    ? talukaData[activeTalukaId] 
    : null;

  return (
    <section 
      id={id} 
      className="relative w-full min-h-screen py-16 lg:py-24 bg-[#F4F6F8] overflow-hidden flex flex-col items-center"
    >
      {/* Background image if provided */}
      {bgImage && (
        <div 
          className="absolute inset-0 z-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl flex flex-col h-full">
        
        {/* Section Heading */}
        <div className="w-full text-center mb-12 lg:mb-16">
          <span className="text-[#F36523] uppercase font-bold tracking-[0.2em] text-sm mb-4 block">
            Discover Our Region
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-['Bebas_Neue'] uppercase leading-[1.1] text-navy-dark">
            Explore Yavatmal District
          </h2>
        </div>

        {/* Two Column Layout: Mobile reverse stack (map top), Desktop 35/65 */}
        <div className="flex flex-col lg:flex-row w-full flex-grow items-center lg:items-stretch gap-10 lg:gap-8">
          
          {/* MAP (Right visually on Desktop, Top on Mobile) */}
          <div className="w-full lg:w-[65%] lg:order-2 h-[450px] sm:h-[500px] lg:h-auto flex-shrink-0 relative bg-white/40 lg:bg-transparent rounded-2xl p-4 lg:p-0 shadow-sm lg:shadow-none border border-slate-200/50 lg:border-none">
            <YavatmalMap 
              hoveredTaluka={hoveredTaluka}
              selectedTaluka={selectedTaluka}
              onHover={setHoveredTaluka}
              onClick={setSelectedTaluka}
            />
          </div>

          {/* LEFT PANEL */}
          <div className="w-full lg:w-[35%] lg:order-1 flex flex-col bg-white/60 lg:bg-transparent backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-0 shadow-sm lg:shadow-none border border-slate-200/50 lg:border-none h-full min-h-[400px]">
            <TalukaInfoPanel 
              activeTaluka={activeTalukaInfo}
              activeTalukaId={activeTalukaId}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
