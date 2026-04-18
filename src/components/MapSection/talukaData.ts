export interface TalukaInfo {
  name: string;
  hq: string;
  population: string;
  area: string;
  crops: string;
  description: string;
  link: string;
}

export const talukaData: Record<string, TalukaInfo> = {
  ner: {
    name: "Ner",
    hq: "Ner",
    population: "~1.5 Lakh",
    area: "1,073 km²",
    crops: "Cotton, Soybean",
    description: "Ner is known for its agricultural activity and cotton production. It is a prominent taluka in the western part of Yavatmal district.",
    link: "/talukas/ner",
  },
  pusad: {
    name: "Pusad",
    hq: "Pusad",
    population: "~2.1 Lakh",
    area: "1,447 km²",
    crops: "Cotton, Soybean",
    description: "Pusad is a major commercial hub in Yavatmal district, with a thriving cotton market and strong infrastructure.",
    link: "/talukas/pusad",
  },
  umerkhed: {
    name: "Umerkhed",
    hq: "Umerkhed",
    population: "~1.8 Lakh",
    area: "1,312 km²",
    crops: "Cotton, Jowar",
    description: "Umerkhed is a border taluka with rich agricultural land and cultural heritage, known for cotton and jowar cultivation.",
    link: "/talukas/umerkhed",
  },
  "zari-jamni": {
    name: "Zari-Jamni",
    hq: "Zari",
    population: "~1.2 Lakh",
    area: "987 km²",
    crops: "Cotton, Teak",
    description: "Zari-Jamni is a forest-rich taluka with teak plantations alongside cotton farming in its agricultural zones.",
    link: "/talukas/zari-jamni",
  },
  yavatmal: {
    name: "Yavatmal",
    hq: "Yavatmal City",
    population: "~3.2 Lakh",
    area: "1,515 km²",
    crops: "Cotton, Soybean",
    description: "Yavatmal is the district headquarters and the largest taluka. It is the administrative, commercial, and cultural center of Yavatmal district.",
    link: "/talukas/yavatmal",
  },
  ghatanji: {
    name: "Ghatanji",
    hq: "Ghatanji",
    population: "~1.6 Lakh",
    area: "1,198 km²",
    crops: "Cotton, Tur",
    description: "Ghatanji is an agriculturally productive taluka known for tur (pigeon pea) and cotton farming in the southern belt.",
    link: "/talukas/ghatanji",
  },
  arni: {
    name: "Arni",
    hq: "Arni",
    population: "~1.4 Lakh",
    area: "1,087 km²",
    crops: "Cotton, Wheat",
    description: "Arni taluka is set in the central part of the district and is active in wheat cultivation alongside traditional cotton farming.",
    link: "/talukas/arni",
  },
  darwha: {
    name: "Darwha",
    hq: "Darwha",
    population: "~1.9 Lakh",
    area: "1,278 km²",
    crops: "Cotton, Soybean",
    description: "Darwha is a historically significant taluka with a strong cotton economy and a well-connected transport network.",
    link: "/talukas/darwha",
  },
};

export const CLICKABLE_TALUKAS = new Set([
  "ner",
  "pusad",
  "umerkhed",
  "zari-jamni",
  "yavatmal",
  "ghatanji",
  "arni",
  "darwha",
]);

export const districtStats = {
  totalTalukas: 16,
  totalArea: "13,582 km²",
  population: "~27 Lakh",
  headquarters: "Yavatmal City",
};
