import re

html_file = r'c:\myfile\bjp-yavatmal\yavatmal_district_interactive_map.html'
out_file = r'c:\myfile\bjp-yavatmal\src\components\home\InteractiveMapSection.tsx'

with open(html_file, 'r', encoding='utf-8') as f:
    text = f.read()

paths = re.findall(r'<path.*?/>', text, re.DOTALL)

parsed_paths = []
for p in paths:
    uid_match = re.search(r'id="([^"]+)"', p)
    name_match = re.search(r'data-name="([^"]+)"', p)
    clickable_match = re.search(r'data-clickable="([^"]+)"', p)
    fill_match = re.search(r'fill="([^"]+)"', p)
    d_match = re.search(r'd="([^"]+)"', p)
    
    if uid_match and d_match:
        uid = uid_match.group(1)
        if uid == 'west': uid = 'darwha'
        name = name_match.group(1) if name_match else ''
        clickable = clickable_match.group(1) == 'true' if clickable_match else False
        fill = fill_match.group(1) if fill_match else ''
        d_path = d_match.group(1)
        parsed_paths.append({
            'id': uid,
            'name': name,
            'clickable': clickable,
            'fill': fill,
            'd': d_path
        })

component_str = """\"use client\";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface TalukaData {
  id: string;
  name: string;
  population: string;
  area: string;
  hq: string;
  crops: string;
}

const talukaDataList: Record<string, Omit<TalukaData, "id">> = {
  ner: { name: "Ner", population: "~1.5 Lakh", area: "1,073 km²", hq: "Ner", crops: "Cotton, Soybean" },
  pusad: { name: "Pusad", population: "~2.1 Lakh", area: "1,447 km²", hq: "Pusad", crops: "Cotton, Soybean" },
  umerkhed: { name: "Umerkhed", population: "~1.8 Lakh", area: "1,312 km²", hq: "Umerkhed", crops: "Cotton, Jowar" },
  "zari-jamni": { name: "Zari-Jamni", population: "~1.2 Lakh", area: "987 km²", hq: "Zari", crops: "Cotton, Teak" },
  yavatmal: { name: "Yavatmal", population: "~3.2 Lakh", area: "1,515 km²", hq: "Yavatmal", crops: "Cotton, Soybean" },
  ghatanji: { name: "Ghatanji", population: "~1.6 Lakh", area: "1,198 km²", hq: "Ghatanji", crops: "Cotton, Tur" },
  arni: { name: "Arni", population: "~1.4 Lakh", area: "1,087 km²", hq: "Arni", crops: "Cotton, Wheat" },
  darwha: { name: "Darwha", population: "~1.9 Lakh", area: "1,278 km²", hq: "Darwha", crops: "Cotton, Soybean" },
};

export default function InteractiveMapSection({
  id = "map-section",
  bgImage,
  label,
  title,
  children,
}: {
  id?: string;
  bgImage?: string;
  label?: string;
  title?: string;
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
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

  const handlePathClick = (talukaId: string, isClickable: boolean) => {
    if (isClickable && talukaDataList[talukaId]) {
      setSelected(selected === talukaId ? null : talukaId);
    }
  };

  const selectedData = selected ? talukaDataList[selected] : null;

  if (!mounted) return null;

  return (
      <section id={id} className="relative full-page-section min-h-screen w-full flex overflow-hidden z-20">
        {/* Layout for Desktop */}
        <div className="hidden lg:flex w-full h-screen relative">
          <motion.div
              initial={{ x: "-60%", opacity: 0 }}
              whileInView={{ x: "0%", opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-[40%] h-full bg-[#F4F6F8] flex flex-col justify-center p-16 xl:p-24 relative"
          >
              <div className="absolute top-0 right-0 w-full h-1/2 bg-saffron/5 blur-[120px] rounded-full pointer-events-none" />

              <div className="relative z-10 w-full flex flex-col items-start text-left h-full justify-center">
                  <AnimatePresence mode="wait">
                      {selectedData ? (
                          <motion.div
                              key="selected"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex flex-col w-full"
                          >
                                <button 
                                    onClick={() => setSelected(null)}
                                    className="text-saffron mb-6 text-sm font-bold tracking-[0.2em] uppercase flex items-center hover:text-navy-dark transition-colors mr-auto"
                                >
                                    ← Back to Overview
                                </button>
                                <h2 className="text-6xl xl:text-7xl font-['Bebas_Neue'] text-navy-dark uppercase leading-[0.9] mb-8">{selectedData.name}</h2>
                                
                                <div className="space-y-6 w-full">
                                    <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-saffron w-full">
                                        <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Taluka HQ</span>
                                        <span className="block text-2xl font-bold text-slate-800">{selectedData.hq}</span>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-india-green w-full">
                                        <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Est. Population</span>
                                        <span className="block text-2xl font-bold text-slate-800">{selectedData.population}</span>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-navy-light w-full">
                                        <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Area</span>
                                        <span className="block text-2xl font-bold text-slate-800">{selectedData.area}</span>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-saffron w-full">
                                        <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Main Crops</span>
                                        <span className="block text-2xl font-bold text-slate-800">{selectedData.crops}</span>
                                    </div>
                                </div>
                          </motion.div>
                      ) : (
                          <motion.div
                              key="overview"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="flex flex-col w-full"
                          >
                                {label && (
                                    <span className="text-saffron uppercase font-bold tracking-[0.2em] text-sm mb-4">
                                        {label}
                                    </span>
                                )}
                                {title && (
                                    <h2 className="text-6xl xl:text-7xl font-['Bebas_Neue'] uppercase leading-[0.9] text-navy-dark mb-8">
                                        {title}
                                    </h2>
                                )}
                                {children}
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>
          </motion.div>

          <motion.div
              initial={{ x: "60%", opacity: 0 }}
              whileInView={{ x: "0%", opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-[60%] h-full relative"
          >
              {bgImage && (
                  <div className="absolute inset-0 z-0 opacity-20">
                      <Image src={bgImage} alt="Map Region Details" fill className="object-cover" />
                  </div>
              )}
              
              <div 
                  ref={mapRef}
                  className="w-full h-full relative z-10 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-white/80 to-slate-100/30"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHovered(null)}
              >
                  {hovered && talukaDataList[hovered] && (
                    <div 
                      className="absolute pointer-events-none bg-navy-dark text-white px-4 py-2 rounded-lg text-sm font-bold shadow-xl z-50 transform -translate-x-1/2 -translate-y-full mt-[-10px] whitespace-nowrap"
                      style={{ left: mousePos.x, top: mousePos.y }}
                    >
                      {talukaDataList[hovered].name}
                      <div className="absolute left-1/2 bottom-0 w-3 h-3 bg-navy-dark transform -translate-x-1/2 translate-y-1/2 rotate-45"></div>
                    </div>
                  )}
                  
                  <div className="w-full max-w-[800px] object-contain drop-shadow-2xl">
                     <svg viewBox="0 0 1536 1024" className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
"""

for p in parsed_paths:
    uid = p['id']
    d = p['d']
    is_click = p['clickable']
    base_fill = p['fill'] if p['fill'] else '#FDEEC1'
    clk = "true" if is_click else "false"
    
    class_name_expression = "`${" + clk + " ? 'cursor-pointer hover:opacity-85 filter drop-shadow-md hover:-translate-y-1' : 'cursor-default opacity-80'} transition-all duration-200`"
    
    component_str += f"""
                        <path
                            d="{d}"
                            className={{{class_name_expression}}}
                            fill={{
                                selected === '{uid}' ? '#7B3A10' : 
                                '{base_fill}'
                            }}
                            stroke="#3D1C02"
                            strokeWidth="2"
                            onMouseEnter={{() => {clk} && setHovered('{uid}')}}
                            onClick={{() => handlePathClick('{uid}', {clk})}}
                        />"""

component_str += """
                     </svg>
                  </div>
                  
                  {/* Legend */}
                  <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur shadow-lg rounded-xl p-4 flex gap-6 text-sm font-semibold text-navy-dark z-20">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{background:'#F36523'}}></div> Clickable Taluka</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{background:'#7B3A10'}}></div> Selected</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border border-slate-300" style={{background:'#FDEEC1'}}></div> Other Area</div>
                  </div>
              </div>
          </motion.div>
        </div>

        {/* Layout for Mobile/Tablet */}
        <div className="flex lg:hidden flex-col w-full min-h-screen relative bg-[#F4F6F8]">
            <div className="w-full p-6 pt-12 relative z-10 flex flex-col items-start text-left min-h-[50vh]">
                <AnimatePresence mode="wait">
                      {selectedData ? (
                          <motion.div
                              key="selected"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex flex-col w-full"
                          >
                                <button 
                                    onClick={() => setSelected(null)}
                                    className="text-saffron mb-6 text-sm font-bold tracking-[0.2em] uppercase flex items-center hover:text-navy-dark transition-colors"
                                >
                                    ← Back to Overview
                                </button>
                                <h2 className="text-5xl font-['Bebas_Neue'] text-navy-dark uppercase leading-[0.9] mb-8">{selectedData.name}</h2>
                                
                                <div className="space-y-4 w-full">
                                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-saffron w-full">
                                        <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Taluka HQ</span>
                                        <span className="block text-xl font-bold text-slate-800">{selectedData.hq}</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-india-green w-full">
                                        <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Est. Population</span>
                                        <span className="block text-xl font-bold text-slate-800">{selectedData.population}</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-navy-light w-full">
                                        <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Area</span>
                                        <span className="block text-xl font-bold text-slate-800">{selectedData.area}</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm border-l-4 border-l-saffron w-full">
                                        <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Main Crops</span>
                                        <span className="block text-xl font-bold text-slate-800">{selectedData.crops}</span>
                                    </div>
                                </div>
                          </motion.div>
                      ) : (
                          <motion.div
                              key="overview"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="flex flex-col w-full"
                          >
                                {label && (
                                    <span className="text-saffron uppercase font-bold tracking-[0.2em] text-sm mb-4">
                                        {label}
                                    </span>
                                )}
                                {title && (
                                    <h2 className="text-5xl sm:text-6xl font-['Bebas_Neue'] uppercase leading-[0.9] text-navy-dark mb-6">
                                        {title}
                                    </h2>
                                )}
                                {children}
                          </motion.div>
                      )}
                  </AnimatePresence>
            </div>

            <div 
              ref={mapRef}
              className="w-full relative z-10 flex flex-col items-center justify-center p-4 bg-gradient-to-t from-slate-200/50 to-white/10"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHovered(null)}
            >
              {bgImage && (
                  <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                      <Image src={bgImage} alt="Location" fill className="object-cover" />
                  </div>
              )}

              {hovered && talukaDataList[hovered] && (
                <div 
                  className="absolute pointer-events-none bg-navy-dark text-white px-3 py-1 rounded shadow-lg z-50 text-xs transform -translate-x-1/2 -translate-y-[120%]"
                  style={{ left: mousePos.x, top: mousePos.y }}
                >
                  {talukaDataList[hovered].name}
                </div>
              )}
              
              <div className="w-full max-w-[800px] object-contain drop-shadow-xl z-10 pb-20">
                 <svg viewBox="0 0 1536 1024" className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
"""

for p in parsed_paths:
    uid = p['id']
    d = p['d']
    is_click = p['clickable']
    base_fill = p['fill'] if p['fill'] else '#FDEEC1'
    clk = "true" if is_click else "false"
    
    class_name_expression_mobile = "`${" + clk + " ? 'cursor-pointer hover:opacity-85 hover:-translate-y-1 drop-shadow-sm' : 'cursor-default opacity-80'} transition-all duration-200`"
    
    component_str += f"""
                    <path
                        d="{d}"
                        className={{{class_name_expression_mobile}}}
                        fill={{
                            selected === '{uid}' ? '#7B3A10' : 
                            '{base_fill}'
                        }}
                        stroke="#3D1C02"
                        strokeWidth="2"
                        onTouchStart={{() => {clk} && handlePathClick('{uid}', {clk})}}
                        onClick={{() => handlePathClick('{uid}', {clk})}}
                    />"""

component_str += """
                 </svg>
              </div>

              {/* Legend Mobile */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur shadow-md rounded-lg p-3 flex flex-wrap justify-center gap-3 text-xs font-semibold text-navy-dark z-20">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{background:'#F36523'}}></div> Clickable</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{background:'#7B3A10'}}></div> Selected</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded border border-slate-300" style={{background:'#FDEEC1'}}></div> Area</div>
              </div>
            </div>
        </div>
      </section>
  );
}
"""

with open(out_file, 'w', encoding='utf-8') as f:
    f.write(component_str)

print("Generated " + out_file)
