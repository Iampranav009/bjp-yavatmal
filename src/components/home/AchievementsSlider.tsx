"use client";

import Image from "next/image";
import SectionHeader from "../shared/SectionHeader";
import { motion } from "framer-motion";

const achievements = [
    {
        title: "500KM Rural Roads (PMGSY)",
        date: "Dec 2023",
        desc: "Connected 120+ remote villages in Yavatmal district to the main highway network.",
        image: "/images/gallery/gallery-1.jpg"
    },
    {
        title: "12,000 PM Awas Houses",
        date: "2019-2024",
        desc: "Provided pucca houses to eligible families, ensuring dignity and shelter.",
        image: "/images/gallery/gallery-2.jpg"
    },
    {
        title: "Jal Jeevan Mission",
        date: "Ongoing",
        desc: "Installed 80,000 tap connections providing clean drinking water to households.",
        image: "/images/gallery/gallery-3.jpg"
    },
    {
        title: "PM-KISAN Scheme",
        date: "2024",
        desc: "Over 2 Lakh farmers in Yavatmal received direct income support.",
        image: "/images/hero/img-2.jpg"
    },
    {
        title: "Ayushman Bharat",
        date: "2018-2024",
        desc: "3.5 Lakh families registered for free health insurance up to ₹5 Lakh.",
        image: "/images/hero/img-3.jpg"
    },
    {
        title: "Digital Classrooms",
        date: "2023",
        desc: "Modernized 300 Zilla Parishad schools with smart boards and digital infra.",
        image: "/images/hero/img-4.jpg"
    }
];

export default function AchievementsSlider() {
    // We duplicate the array to allow for seamless infinite scrolling
    const duplicatedAchievements = [...achievements, ...achievements];

    return (
        <section className="py-24 bg-[#F4F6F8] relative overflow-hidden border-t border-slate-300/5">
            <div className="container mx-auto px-6 lg:px-12 relative z-10 mb-12">
                <SectionHeader
                    label="Our Work & Achievements"
                    title="What We've Delivered"
                    highlightWord="Delivered"
                />
            </div>

            {/* mask-image ensures the edges gently fade out, hiding the pop-in of new elements */}
            <div className="w-full relative group [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <div className="flex w-max animate-scrollLeft hover:[animation-play-state:paused]">
                    {duplicatedAchievements.map((item, idx) => (
                        <div key={idx} className="pr-6 shrink-0">
                            <motion.div
                                whileHover={{ y: -6, borderColor: "rgba(255,106,0,0.4)" }}
                                className="w-[300px] sm:w-[320px] shrink-0 bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xl transition-all duration-300 group-hover:duration-200 h-full"
                            >
                                <div className="w-full h-[200px] relative overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
                                        quality={90}
                                        placeholder="empty"
                                    />
                                </div>
                                <div className="p-6">
                                    <span className="text-saffron text-xs font-bold uppercase tracking-wider mb-2 block">
                                        {item.date}
                                    </span>
                                    <h3 className="text-2xl font-['Bebas_Neue'] text-slate-900 tracking-wide mb-3 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-900/70 text-sm font-['DM_Sans'] leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
