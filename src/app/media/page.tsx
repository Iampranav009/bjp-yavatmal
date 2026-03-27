"use client";

import MediaGallery from "@/components/media/MediaGallery";
import { useLanguage } from "@/lib/LanguageContext";

export default function MediaPage() {
    const { t } = useLanguage();
    const g = t("gallery");
    const m = t("mediaPage");

    return (
        <div className="pt-20 min-h-screen bg-[#F4F6F8]">
            {/* Hero Banner */}
            <section className="py-12 lg:py-16 border-b border-slate-200">
                <div className="container mx-auto px-6 lg:px-12">
                    <p className="text-saffron uppercase font-bold tracking-widest text-sm mb-4 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-saffron/20 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-saffron"></span>
                        </span>
                        {g.label}
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Bebas_Neue'] uppercase leading-tight text-slate-900">
                        {m.title.replace(m.titleHighlight, "").trim()}{" "}
                        <span className="text-saffron">{m.titleHighlight}</span>
                    </h1>
                    <p className="text-slate-600 text-sm md:text-base mt-4 max-w-xl leading-relaxed">
                        {m.description}
                    </p>
                </div>
            </section>

            {/* Media Gallery */}
            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-6 lg:px-12">
                    <MediaGallery />
                </div>
            </section>
        </div>
    );
}
