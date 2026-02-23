"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Language, allTranslations } from "./translations";

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface LanguageContextValue {
    lang: Language;
    setLang: (lang: Language) => void;
    t: <S extends keyof typeof allTranslations.mr>(section: S) => typeof allTranslations.mr[S];
}

// ----------------------------------------------------------------
// Context
// ----------------------------------------------------------------
const LanguageContext = createContext<LanguageContextValue | null>(null);

// ----------------------------------------------------------------
// Provider
// ----------------------------------------------------------------
export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Language>("mr");

    // On mount, restore language from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem("bjp_lang") as Language | null;
            if (stored && ["mr", "hi", "en"].includes(stored)) {
                setLangState(stored);
            }
        } catch {
            // localStorage not available
        }
    }, []);

    const setLang = useCallback((newLang: Language) => {
        setLangState(newLang);
        try {
            localStorage.setItem("bjp_lang", newLang);
        } catch {
            // ignore
        }
    }, []);

    // t(section) returns the full section object for the active language
    // (which already has Marathi fallback baked-in via deepMerge)
    const t = useCallback(
        <S extends keyof typeof allTranslations.mr>(section: S) => {
            return allTranslations[lang][section];
        },
        [lang]
    );

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

// ----------------------------------------------------------------
// Hook
// ----------------------------------------------------------------
export function useLanguage(): LanguageContextValue {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
    return ctx;
}
