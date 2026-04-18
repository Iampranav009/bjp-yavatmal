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

  // Panel data driven ONLY by click (selectedTaluka), not hover
  const activeTalukaId = selectedTaluka;
  const activeTalukaInfo =
    activeTalukaId && CLICKABLE_TALUKAS.has(activeTalukaId)
      ? talukaData[activeTalukaId]
      : null;


  return (
    <section 
      id={id} 
      className="relative w-full pt-4 pb-0 lg:py-12 bg-[#F4F6F8] overflow-hidden flex flex-col items-center"
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

      <div className="container mx-auto px-2 lg:px-6 relative z-10 w-full max-w-7xl flex flex-col h-full">
        

        {/* Two Column Layout: Mobile reverse stack (Title top), Desktop 35/65 */}
        <div className="flex flex-col lg:flex-row w-full flex-grow items-center lg:items-stretch gap-2 lg:gap-8">
          
          {/* LEFT PANEL (Title visually on Top on Mobile, Left on Desktop) */}
          <div className="w-full lg:w-[35%] lg:order-1 flex flex-col h-full lg:min-h-[400px] z-10 px-4 lg:px-0 mt-4 lg:mt-0">
            <TalukaInfoPanel 
              activeTaluka={activeTalukaInfo}
              activeTalukaId={activeTalukaId}
            />
          </div>

          {/* MAP (Bottom on Mobile, Right on Desktop) */}
          <div className="w-full lg:w-[65%] lg:order-2 h-auto flex-shrink-0 relative">
            <YavatmalMap 
              hoveredTaluka={hoveredTaluka}
              selectedTaluka={selectedTaluka}
              onHover={setHoveredTaluka}
              onClick={setSelectedTaluka}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
