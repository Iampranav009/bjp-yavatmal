"use client";

import HeroSlider from "../components/home/HeroSlider";
import MapSection from "../components/MapSection/MapSection";
import AchievementsSlider from "../components/home/AchievementsSlider";
import LeaderSlider from "../components/home/LeaderSlider";
import GalleryGrid from "../components/home/GalleryGrid";
import JoinSection from "../components/home/JoinSection";
import OurJourneySection from "../components/home/OurJourneySection";
import ImagePreviewSection from "../components/home/ImagePreviewSection";
import ScrollStackCard from "../components/shared/ScrollStackCard";
import { useLanguage } from "../lib/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const hp = t("homePage");

  return (
    <>
      <HeroSlider />

      <MapSection
        id="about"
        bgImage="/images/sections/bjp-crowd.jpg"
      />

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

      <LeaderSlider />

      <GalleryGrid />

      <JoinSection />
    </>
  );
}
