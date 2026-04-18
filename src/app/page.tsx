"use client";

import HeroSlider from "../components/home/HeroSlider";
import MarqueeStrip from "../components/shared/MarqueeStrip";
import MapSection from "../components/MapSection/MapSection";
import AchievementsSlider from "../components/home/AchievementsSlider";
import StatsSection from "../components/home/StatsSection";
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
      {/*
       * ─── GSAP SCROLL-STACK LAYOUT ────────────────────────────────────────────
       *
       *  How it works:
       *  • Each ScrollStackCard has an outer div of height 200vh (100vh visible
       *    + 100vh scroll-space for the exit animation).
       *  • The inner div is position:sticky top:0, height:100vh.
       *  • GSAP ScrollTrigger scrubs scale 1→0.88 and opacity 1→0.45 on the
       *    inner div as the outer wrapper scrolls off-screen.
       *  • The next card (higher z-index) slides up naturally and covers it.
       *  • The last card (isLast) keeps height:100vh with no outgoing animation.
       *
       *  MarqueeStrip sits between the Hero card and Map card in normal flow —
       *  it scrolls away naturally before the sticky Map card takes over.
       * ─────────────────────────────────────────────────────────────────────────
       */}

      {/* ① Hero */}
      <ScrollStackCard zIndex={10}>
        <HeroSlider />
      </ScrollStackCard>

      {/*
       * MarqueeStrip lives in normal flow between cards.
       * It scrolls off as the user reaches the Map card.
       */}
      <MarqueeStrip />

      {/* ② Map / About */}
      <ScrollStackCard zIndex={20}>
        <MapSection
          id="about"
          bgImage="/images/sections/bjp-crowd.jpg"
        />
      </ScrollStackCard>

      {/* ③ Homepage image slideshow */}
      <ScrollStackCard zIndex={30}>
        <ImagePreviewSection />
      </ScrollStackCard>

      {/* ④ Our Journey — bg parallax handled inside the component */}
      <ScrollStackCard zIndex={40}>
        <OurJourneySection
          label={hp.journeyLabel}
          title={hp.journeyTitle}
          description={hp.journeyDescription}
          readMore={hp.journeyReadMore}
        />
      </ScrollStackCard>

      {/* ⑤ Achievements */}
      <ScrollStackCard zIndex={50}>
        <AchievementsSlider />
      </ScrollStackCard>

      {/* ⑥ Stats */}
      <ScrollStackCard zIndex={60}>
        <StatsSection />
      </ScrollStackCard>

      {/* ⑦ Leaders */}
      <ScrollStackCard zIndex={70}>
        <LeaderSlider />
      </ScrollStackCard>

      {/* ⑧ Gallery */}
      <ScrollStackCard zIndex={80}>
        <GalleryGrid />
      </ScrollStackCard>

      {/* ⑨ Join — last card, stays full-scale */}
      <ScrollStackCard zIndex={90} isLast>
        <JoinSection />
      </ScrollStackCard>
    </>
  );
}
