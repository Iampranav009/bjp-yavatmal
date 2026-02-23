import HeroSlider from "../components/home/HeroSlider";
import MarqueeStrip from "../components/shared/MarqueeStrip";
import FullPageCardSection from "../components/home/FullPageCardSection";
import AchievementsSlider from "../components/home/AchievementsSlider";
import StatsSection from "../components/home/StatsSection";
import LeaderSlider from "../components/home/LeaderSlider";
import GalleryGrid from "../components/home/GalleryGrid";
import JoinSection from "../components/home/JoinSection";

export default function Home() {
  return (
    <>
      <HeroSlider />

      <MarqueeStrip />

      <FullPageCardSection
        id="about"
        bgImage="/images/gallery/gallery-2.jpg"
        label="ABOUT BJP"
        title="Serving Yavatmal Since Decades"
      >
        <p className="text-slate-900/70 font-['DM_Sans'] text-base xl:text-lg mb-8 max-w-md leading-relaxed">
          The Bharatiya Janata Party has been the cornerstone of development in Yavatmal.
          Driven by the philosophy of &quot;Antyodaya,&quot; we are committed to uplifting the marginalized
          and ensuring prosperity reaches the last person in society.
        </p>

        <div className="flex gap-10 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-saffron rounded-full"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">16+ Years</span>
              <span className="text-slate-900/50 text-xs uppercase tracking-wider font-semibold">Active Service</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-india-green rounded-full"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">5 Lakh+</span>
              <span className="text-slate-900/50 text-xs uppercase tracking-wider font-semibold">Beneficiaries</span>
            </div>
          </div>
        </div>

        <button className="bg-transparent border-2 border-saffron text-saffron hover:bg-saffron hover:text-white px-8 py-3 rounded-full font-bold transition-all w-fit">
          Learn More <span className="ml-2">→</span>
        </button>
      </FullPageCardSection>

      <AchievementsSlider />

      <StatsSection />

      <LeaderSlider />

      <GalleryGrid />

      <JoinSection />
    </>
  );
}
