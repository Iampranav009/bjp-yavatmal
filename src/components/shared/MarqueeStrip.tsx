"use client";

import React from "react";
import { useLanguage } from "../../lib/LanguageContext";

export default function MarqueeStrip() {
    const { t } = useLanguage();
    const slogans = t("marquee").slogans;

    return (
        <div className="w-full bg-saffron py-3 overflow-hidden whitespace-nowrap border-y border-slate-200 select-none">
            <div className="inline-block animate-marquee font-['Tiro_Devanagari_Hindi'] text-xl tracking-wide text-slate-900">
                {[...slogans, ...slogans, ...slogans, ...slogans].map((slogan, idx) => (
                    <React.Fragment key={idx}>
                        <span className="mx-6 font-semibold">{slogan}</span>
                        <span className="text-slate-500">•</span>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
