import AchievementsSlider from "../../components/home/AchievementsSlider";
import AnimatedText from "../../components/shared/AnimatedText";

export default function AchievementsPage() {
    return (
        <div className="pt-32 pb-16 min-h-screen bg-[#F4F6F8]">
            <div className="container mx-auto px-6 lg:px-12 mb-16 text-center">
                <AnimatedText
                    text="Transforming Yavatmal"
                    className="text-5xl md:text-7xl font-['Bebas_Neue'] uppercase text-slate-900 tracking-wide mb-6"
                />
                <p className="max-w-xl mx-auto text-slate-600 font-['DM_Sans'] text-lg">
                    A detailed look at the infrastructure, agricultural, and socio-economic milestones achieved under the BJP&apos;s governance in the district.
                </p>
            </div>

            {/* We reuse the slider component which already has its own styling */}
            <AchievementsSlider />

            {/* Additional static content could go here */}
        </div>
    );
}
