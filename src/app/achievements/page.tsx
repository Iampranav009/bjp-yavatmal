"use client";

import AchievementsSlider from "../../components/home/AchievementsSlider";
import { useLanguage } from "../../lib/LanguageContext";

export default function AchievementsPage() {
    const { t } = useLanguage();
    const ap = t("achievementsPage");

    return (
        <div className="pt-32 pb-16 min-h-screen bg-[#F4F6F8]">
            <div className="container mx-auto px-6 lg:px-12 mb-16 text-center">
                <h1 className="text-5xl md:text-7xl font-['Bebas_Neue'] uppercase text-slate-900 tracking-wide mb-6">
                    {ap.heading}
                </h1>
                <p className="max-w-xl mx-auto text-slate-600 font-['DM_Sans'] text-lg">
                    {ap.description}
                </p>
            </div>

            <AchievementsSlider />
        </div>
    );
}
