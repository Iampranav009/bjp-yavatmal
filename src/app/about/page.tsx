"use client";

import FullPageCardSection from "../../components/home/FullPageCardSection";
import { useLanguage } from "../../lib/LanguageContext";

export default function AboutPage() {
    const { t } = useLanguage();
    const ab = t("aboutPage");

    return (
        <div className="pt-24 min-h-screen bg-[#F4F6F8]">
            <FullPageCardSection
                bgImage="/images/sections/about-bg.jpg"
                label={ab.label}
                title={ab.title}
                imageOnLeft={false}
            >
                <div className="space-y-6 text-slate-900/70 font-['DM_Sans'] text-base xl:text-lg mb-8 max-w-lg leading-relaxed">
                    <p>{ab.para1}</p>
                    <p>{ab.para2}</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10 w-full max-w-sm">
                    <div className="flex flex-col border-l-2 border-saffron pl-4">
                        <span className="text-3xl font-bold font-['Bebas_Neue'] text-slate-900 tracking-widest">
                            {ab.nationFirst}
                        </span>
                        <span className="text-slate-900/50 text-xs uppercase tracking-wider font-semibold mt-1">
                            {ab.corePrinciple}
                        </span>
                    </div>
                    <div className="flex flex-col border-l-2 border-india-green pl-4">
                        <span className="text-3xl font-bold font-['Bebas_Neue'] text-slate-900 tracking-widest">
                            {ab.sabkaVikas}
                        </span>
                        <span className="text-slate-900/50 text-xs uppercase tracking-wider font-semibold mt-1">
                            {ab.inclusiveGrowth}
                        </span>
                    </div>
                </div>
            </FullPageCardSection>
        </div>
    );
}
