Implementation Prompt: Yavatmal District Interactive Map Section
Context
We have an existing Next.js website with a homepage that contains a map section. Replace that entire map section with the following interactive Yavatmal District map component.

What to Build
A two-column layout section:

Left column — info panel showing taluka data on hover
Right column — interactive SVG map of Yavatmal district


Layout & Design
[ LEFT PANEL - 35% width ]  [ MAP SVG - 65% width ]

Full-width section with a light background (match existing site theme)
On mobile: stack vertically — map on top, info panel below
Section should have a heading like "Explore Yavatmal District" above the two-column layout


Left Panel Behavior

Default state (nothing hovered): Show a placeholder message like "Hover over a taluka to explore" with a subtle icon or district-level summary stats (total talukas: 16, total area: ~13,582 km², etc.)
On hover of a clickable taluka: Immediately show that taluka's data — no click needed. Data to display:

Taluka name (large heading)
Taluka Headquarters
Estimated Population
Area in km²
Main crops or key info
A "Learn More" button (can be a link to a detail page or anchor)


Transition: Smooth fade or slide-in animation when switching between talukas
The left panel should NOT require a click — hover alone should update it


Map (Right Column) Behavior
Use this exact SVG (the Yavatmal district SVG with all 16 taluka paths provided below):
svg[PASTE THE FULL SVG CODE HERE — the one shared earlier with all paths]
Clickable talukas (saffron color #F36523 by default):

Ner
Pusad
Umerkhed
Zari-Jamni
Yavatmal
Ghatanji
Arni
Darwha

Non-clickable talukas (cream color #FDEEC1, no interaction):

Ralegaon
Digras
Wani
Mahagaon
Maregaon
Kelapur
Babhulgaon
Pusad South

Hover behavior on clickable talukas:

Fill color changes to a slightly darker saffron (#D4541A) on hover
A small tooltip appears near the cursor showing the taluka name
Left panel updates with that taluka's data

Active/selected state:

On click, the taluka turns chocolate brown (#7B3A10) and stays that color until another is clicked
Left panel stays showing that taluka's data even after mouse leaves

Cursor: pointer on hoverable talukas, default on non-clickable ones

Data Object
Create a data file lib/yavatmalData.ts (or .js) with this structure:
tsexport const talukaData = {
  ner: {
    name: "Ner",
    hq: "Ner",
    population: "~1.5 Lakh",
    area: "1,073 km²",
    crops: "Cotton, Soybean",
    description: "Ner is known for its agricultural activity...",
    link: "/talukas/ner"
  },
  pusad: {
    name: "Pusad",
    hq: "Pusad",
    population: "~2.1 Lakh",
    area: "1,447 km²",
    crops: "Cotton, Soybean",
    description: "Pusad is a major commercial hub...",
    link: "/talukas/pusad"
  },
  umerkhed: {
    name: "Umerkhed",
    hq: "Umerkhed",
    population: "~1.8 Lakh",
    area: "1,312 km²",
    crops: "Cotton, Jowar",
    description: "...",
    link: "/talukas/umerkhed"
  },
  "zari-jamni": {
    name: "Zari-Jamni",
    hq: "Zari",
    population: "~1.2 Lakh",
    area: "987 km²",
    crops: "Cotton, Teak",
    description: "...",
    link: "/talukas/zari-jamni"
  },
  yavatmal: {
    name: "Yavatmal",
    hq: "Yavatmal City",
    population: "~3.2 Lakh",
    area: "1,515 km²",
    crops: "Cotton, Soybean",
    description: "District headquarters and the largest taluka...",
    link: "/talukas/yavatmal"
  },
  ghatanji: {
    name: "Ghatanji",
    hq: "Ghatanji",
    population: "~1.6 Lakh",
    area: "1,198 km²",
    crops: "Cotton, Tur",
    description: "...",
    link: "/talukas/ghatanji"
  },
  arni: {
    name: "Arni",
    hq: "Arni",
    population: "~1.4 Lakh",
    area: "1,087 km²",
    crops: "Cotton, Wheat",
    description: "...",
    link: "/talukas/arni"
  },
  darwha: {
    name: "Darwha",
    hq: "Darwha",
    population: "~1.9 Lakh",
    area: "1,278 km²",
    crops: "Cotton, Soybean",
    description: "...",
    link: "/talukas/darwha"
  },
};

Component File Structure
components/
  MapSection/
    MapSection.tsx          ← main section wrapper
    YavatmalMap.tsx         ← SVG map with all interaction logic
    TalukaInfoPanel.tsx     ← left panel component
    talukaData.ts           ← data file
    MapSection.module.css   ← styles (if not using Tailwind)

React Component Logic (YavatmalMap.tsx)
tsxconst [hoveredTaluka, setHoveredTaluka] = useState<string | null>(null);
const [selectedTaluka, setSelectedTaluka] = useState<string | null>(null);

// On mouse enter a clickable path → setHoveredTaluka(id)
// On mouse leave → setHoveredTaluka(null)
// On click → setSelectedTaluka(id)

// Active taluka = hoveredTaluka ?? selectedTaluka
// Pass activeTaluka to TalukaInfoPanel
Fill logic per path:
tsxconst getFill = (id: string, isClickable: boolean) => {
  if (!isClickable) return "#FDEEC1";
  if (selectedTaluka === id) return "#7B3A10";
  if (hoveredTaluka === id) return "#D4541A";
  return "#F36523";
};

Tooltip

Use an absolutely positioned <div> inside the map container
Track mouse position with onMouseMove on the SVG
Show taluka name, positioned 12px above the cursor
Hide when not hovering a clickable taluka


Animation
Add a CSS transition on left panel content:
css.info-panel {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
Or use Framer Motion <AnimatePresence> with key={activeTaluka} for a smooth swap effect.

Existing Map Section Replacement

Find the existing map section in your homepage (likely in pages/index.tsx or app/page.tsx)
Remove the old map component entirely
Replace with <MapSection /> component
Keep the same section ID/anchor (#map or whatever it currently is) so existing nav links don't break


Do NOT change

Site header, footer, or any other section
Global CSS variables or theme colors
Existing routing or page structure