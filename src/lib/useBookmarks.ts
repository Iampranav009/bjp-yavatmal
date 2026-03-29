"use client";

import { useState, useEffect } from "react";

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Run only on client side after hydration
        try {
            const stored = localStorage.getItem("bjp_bookmarks");
            if (stored) {
                setBookmarks(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Could not parse bookmarks", e);
        }
        setIsLoaded(true);
    }, []);

    const toggleBookmark = (slugOrId: string | number) => {
        setBookmarks(prev => {
            const strSlug = String(slugOrId);
            let updated: string[];
            if (prev.includes(strSlug)) {
                updated = prev.filter(b => b !== strSlug);
            } else {
                updated = [...prev, strSlug];
            }
            try {
                localStorage.setItem("bjp_bookmarks", JSON.stringify(updated));
            } catch (e) {
                // Ignore write errors (e.g. quota exceeded or private mode)
            }
            return updated;
        });
    };

    const isBookmarked = (slugOrId: string | number) => {
        return bookmarks.includes(String(slugOrId));
    };

    return { bookmarks, toggleBookmark, isBookmarked, isLoaded };
}
