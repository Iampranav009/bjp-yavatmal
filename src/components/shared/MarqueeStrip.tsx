"use client";

import React from "react";

const slogans = [
    "सबका साथ, सबका विकास, सबका विश्वास",
    "एक भारत, श्रेष्ठ भारत",
    " आत्मनिर्भर भारत",
    "वंदे मातरम",
    "जय श्री राम",
];

export default function MarqueeStrip() {
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
