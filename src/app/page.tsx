"use client";

import HeroSlider from "../components/home/HeroSlider";
import MarqueeStrip from "../components/shared/MarqueeStrip";
import FullPageCardSection from "../components/home/FullPageCardSection";
import InteractiveMapSection from "../components/home/InteractiveMapSection";
import AchievementsSlider from "../components/home/AchievementsSlider";
import StatsSection from "../components/home/StatsSection";
import LeaderSlider from "../components/home/LeaderSlider";
import GalleryGrid from "../components/home/GalleryGrid";
import JoinSection from "../components/home/JoinSection";
import OurJourneySection from "../components/home/OurJourneySection";
import ImagePreviewSection from "../components/home/ImagePreviewSection";
import { useLanguage } from "../lib/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const hp = t("homePage");

  return (
    <>
      <HeroSlider />

      <MarqueeStrip />

      <InteractiveMapSection
        id="about"
        bgImage="/images/sections/bjp-crowd.jpg"
        label={hp.aboutLabel}
        title={hp.aboutTitle}
      >
        <p className="text-slate-900/70 font-['DM_Sans'] text-base xl:text-lg mb-8 max-w-md leading-relaxed">
          {hp.aboutDescription}
        </p>

        <div className="grid grid-cols-2 gap-x-10 gap-y-8 mb-10 w-full">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-saffron rounded-full"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">16+</span>
              <span className="text-slate-900/50 text-xs uppercase tracking-wider font-semibold">{hp.activeService || "सेवेची वर्षे"}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-india-green rounded-full"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">5L+</span>
              <span className="text-slate-900/50 text-xs uppercase tracking-wider font-semibold">{hp.beneficiaries || "लाभार्थी"}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-saffron rounded-full"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">₹800CR</span>
              <span className="text-slate-900/50 text-xs uppercase tracking-wider font-semibold">{hp.developmentFund || "विकास निधी"}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-india-green rounded-full"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">300+</span>
              <span className="text-slate-900/50 text-xs uppercase tracking-wider font-semibold">{hp.completedProjects || "पूर्ण झालेले प्रकल्प"}</span>
            </div>
          </div>
        </div>

        <button className="bg-transparent border-2 border-saffron text-saffron hover:bg-saffron hover:text-white px-8 py-3 rounded-full font-bold transition-all w-fit mt-auto">
          {hp.learnMore} <span className="ml-2">→</span>
        </button>
      </InteractiveMapSection>

      <div className="mt-8">
        <ImagePreviewSection />
      </div>

      <OurJourneySection
        label={hp.journeyLabel}
        title={hp.journeyTitle}
        description={hp.journeyDescription}
        readMore={hp.journeyReadMore}
      />

      <AchievementsSlider />

      <StatsSection />

      <LeaderSlider />

      <GalleryGrid />

      <JoinSection />
    </>
  );
}
