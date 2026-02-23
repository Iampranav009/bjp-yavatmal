"use client";

import HeroSlider from "../components/home/HeroSlider";
import MarqueeStrip from "../components/shared/MarqueeStrip";
import FullPageCardSection from "../components/home/FullPageCardSection";
import AchievementsSlider from "../components/home/AchievementsSlider";
import StatsSection from "../components/home/StatsSection";
import LeaderSlider from "../components/home/LeaderSlider";
import GalleryGrid from "../components/home/GalleryGrid";
import JoinSection from "../components/home/JoinSection";
import OurJourneySection from "../components/home/OurJourneySection";
import { useLanguage } from "../lib/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const hp = t("homePage");

  return (
    <>
      <HeroSlider />

      <MarqueeStrip />

      <FullPageCardSection
        id="about"
        bgImage="/images/gallery/gallery-2.jpg"
        label={hp.aboutLabel}
        title={hp.aboutTitle}
      >
        <p className="text-slate-900/70 font-['DM_Sans'] text-base xl:text-lg mb-8 max-w-md leading-relaxed">
          {hp.aboutDescription}
        </p>

        <div className="flex gap-10 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-saffron rounded-full"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">16+</span>
              <span className="text-slate-900/50 text-xs uppercase tracking-wider font-semibold">{hp.activeService}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-india-green rounded-full"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">5 Lakh+</span>
              <span className="text-slate-900/50 text-xs uppercase tracking-wider font-semibold">{hp.beneficiaries}</span>
            </div>
          </div>
        </div>

        <button className="bg-transparent border-2 border-saffron text-saffron hover:bg-saffron hover:text-white px-8 py-3 rounded-full font-bold transition-all w-fit">
          {hp.learnMore} <span className="ml-2">→</span>
        </button>
      </FullPageCardSection>

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
