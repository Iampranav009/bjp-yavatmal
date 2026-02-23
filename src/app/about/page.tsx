import FullPageCardSection from "../../components/home/FullPageCardSection";

export default function AboutPage() {
    return (
        <div className="pt-24 min-h-screen bg-[#F4F6F8]">
            <FullPageCardSection
                bgImage="/images/sections/about-bg.jpg"
                label="ABOUT THE PARTY"
                title="Ideology & Vision"
                imageOnLeft={false}
            >
                <div className="space-y-6 text-slate-900/70 font-['DM_Sans'] text-base xl:text-lg mb-8 max-w-lg leading-relaxed">
                    <p>
                        The Bharatiya Janata Party (BJP) is driven by the philosophy of &quot;Integral Humanism&quot; and &quot;Antyodaya,&quot; striving for the holistic development of every individual and the nation.
                    </p>
                    <p>
                        In Yavatmal, our district committee has been tirelessly working to bring the benefits of both Central and State government schemes to the most remote villages. From empowering our farmers to providing world-class infrastructure and encouraging youth entrepreneurship, our vision is a prosperous and self-reliant Yavatmal.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10 w-full max-w-sm">
                    <div className="flex flex-col border-l-2 border-saffron pl-4">
                        <span className="text-3xl font-bold font-['Bebas_Neue'] text-slate-900 tracking-widest">NATION FIRST</span>
                        <span className="text-slate-900/50 text-xs uppercase tracking-wider font-semibold mt-1">Core Principle</span>
                    </div>
                    <div className="flex flex-col border-l-2 border-india-green pl-4">
                        <span className="text-3xl font-bold font-['Bebas_Neue'] text-slate-900 tracking-widest">SABKA VIKAS</span>
                        <span className="text-slate-900/50 text-xs uppercase tracking-wider font-semibold mt-1">Inclusive Growth</span>
                    </div>
                </div>
            </FullPageCardSection>
        </div>
    );
}
