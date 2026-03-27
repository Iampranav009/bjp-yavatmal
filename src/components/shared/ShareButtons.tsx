"use client";

import { Facebook, Twitter, MessageCircle, Link2, Share2 } from "lucide-react";
import toast from "react-hot-toast";

interface ShareButtonsProps {
    url: string;
    title: string;
    description?: string;
    compact?: boolean;
}

export function getShareUrl(platform: string, url: string, title: string, description?: string): string {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description || title);

    switch (platform) {
        case "facebook":
            return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
        case "twitter":
            return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        case "whatsapp":
            return `https://wa.me/?text=${encodedTitle}%0A${encodedDesc}%0A${encodedUrl}`;
        case "youtube":
            return `https://www.youtube.com/`;
        case "instagram":
            return `https://www.instagram.com/`;
        default:
            return url;
    }
}

const SHARE_PLATFORMS = [
    { key: "facebook", icon: Facebook, label: "Facebook", color: "hover:bg-blue-600 hover:text-white", bg: "bg-blue-50 text-blue-600 border-blue-200" },
    { key: "twitter", icon: Twitter, label: "Twitter", color: "hover:bg-sky-500 hover:text-white", bg: "bg-sky-50 text-sky-500 border-sky-200" },
    { key: "whatsapp", icon: MessageCircle, label: "WhatsApp", color: "hover:bg-green-500 hover:text-white", bg: "bg-green-50 text-green-600 border-green-200" },
];

export default function ShareButtons({ url, title, description, compact = false }: ShareButtonsProps) {
    const handleCopyLink = () => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied!");
    };

    const handleShare = (platform: string) => {
        const shareUrl = getShareUrl(platform, url, title, description);
        window.open(shareUrl, "_blank", "width=600,height=400");
    };

    if (compact) {
        return (
            <div className="flex items-center gap-1.5">
                {SHARE_PLATFORMS.map((p) => (
                    <button
                        key={p.key}
                        onClick={() => handleShare(p.key)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${p.bg} ${p.color}`}
                        title={p.label}
                    >
                        <p.icon size={14} />
                    </button>
                ))}
                <button
                    onClick={handleCopyLink}
                    className="w-8 h-8 rounded-full flex items-center justify-center border bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-700 hover:text-white transition-all"
                    title="Copy Link"
                >
                    <Link2 size={14} />
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 size={12} /> Share
            </p>
            <div className="flex items-center gap-2 flex-wrap">
                {SHARE_PLATFORMS.map((p) => (
                    <button
                        key={p.key}
                        onClick={() => handleShare(p.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${p.bg} ${p.color}`}
                    >
                        <p.icon size={13} />
                        {p.label}
                    </button>
                ))}
                <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-700 hover:text-white transition-all"
                >
                    <Link2 size={13} />
                    Copy Link
                </button>
            </div>
        </div>
    );
}
