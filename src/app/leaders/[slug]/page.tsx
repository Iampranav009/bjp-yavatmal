"use client";

import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ExternalLink, Award, Users, Calendar } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";

// ── Leader data (can be moved to DB later) ─────────────────────
export const LEADERS: Record<string, LeaderProfile> = {
    "praful-singh-chauhan": {
        slug: "praful-singh-chauhan",
        name: "Advocate Praful Singh Chauhan",
        nameMarathi: "अॅड. प्रफुल सिंह चौहान",
        role: "Jilladhyaksha",
        roleMarathi: "जिल्हाध्यक्ष",
        party: "BJP Yavatmal",
        photo: "/images/leaders/praful-chauhan.jpg",
        coverPhoto: "/images/sections/bjp-crowd.jpg",
        bio: "Advocate Praful Singh Chauhan serves as the Jilladhyaksha (District President) of BJP Yavatmal. A dedicated advocate and public servant, he has been at the forefront of development initiatives across Yavatmal district. His leadership has strengthened the BJP's presence in rural areas and ensured that party programs reach the grassroots level.",
        bioMarathi: "अॅड. प्रफुल सिंह चौहान हे भाजपा यवतमाळ जिल्ह्याचे जिल्हाध्यक्ष म्हणून कार्यरत आहेत. एक समर्पित वकील आणि लोकसेवक म्हणून ते यवतमाळ जिल्ह्यातील विकास उपक्रमांच्या अग्रभागी आहेत.",
        achievements: [
            "Led BJP Yavatmal District to historic victory in local body elections",
            "Organized over 200 public outreach programs across all talukas",
            "Spearheaded membership drives connecting 50,000+ new members",
            "Coordinated relief efforts for farmers during drought years",
            "Established party offices in every mandal of Yavatmal district",
        ],
        contact: {
            phone: "+91 72639 99191",
            email: "praful.chauhan@bjpyavatmal.org",
        },
        social: {
            facebook: "#",
            twitter: "#",
            instagram: "#",
        },
        stats: [
            { label: "Years in Service", value: "15+" },
            { label: "Programs Organized", value: "200+" },
            { label: "Members Added", value: "50K+" },
            { label: "Mandals Covered", value: "18" },
        ],
        type: "jilladhyaksha",
    },
};

interface LeaderProfile {
    slug: string;
    name: string;
    nameMarathi: string;
    role: string;
    roleMarathi: string;
    party: string;
    photo: string;
    coverPhoto?: string;
    bio: string;
    bioMarathi: string;
    achievements: string[];
    contact: {
        phone?: string;
        email?: string;
        address?: string;
    };
    social?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        youtube?: string;
    };
    stats: { label: string; value: string }[];
    type: "jilladhyaksha" | "mla" | "mp";
}

interface Props {
    params: { slug: string };
}

export default function LeaderPage({ params }: Props) {
    const leader = LEADERS[params.slug];
    const { t } = useLanguage();
    const f = t("footer");

    if (!leader) return notFound();

    return (
        <div className="min-h-screen bg-[#F4F6F8]">
            {/* Cover */}
            <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-[#F4F6F8]" />
                {leader.coverPhoto ? (
                    <Image src={leader.coverPhoto} alt="cover" fill className="object-cover brightness-50" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-saffron/20 to-slate-900" />
                )}

                {/* Breadcrumb */}
                <div className="absolute top-6 left-6 lg:left-12 z-10">
                    <Link href="/" className="text-white/70 text-xs hover:text-white transition-colors">
                        Home
                    </Link>
                    <span className="text-white/40 mx-2">›</span>
                    <span className="text-white text-xs font-semibold">Leaders</span>
                    <span className="text-white/40 mx-2">›</span>
                    <span className="text-saffron text-xs font-semibold">{leader.name}</span>
                </div>
            </div>

            {/* Profile card */}
            <div className="container mx-auto px-6 lg:px-12 -mt-24 relative z-10 pb-16">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 border-b border-slate-100">
                        {/* Photo */}
                        <div className="flex-shrink-0">
                            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-saffron/30 shadow-lg bg-slate-100">
                                <Image
                                    src={leader.photo}
                                    alt={leader.name}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/images/logos/bjp-logo.png";
                                    }}
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start gap-3 mb-3">
                                <span className="text-[10px] px-3 py-1 rounded-full bg-saffron/10 text-saffron font-bold uppercase tracking-wider">
                                    {leader.role}
                                </span>
                                <span className="text-[10px] px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-bold uppercase tracking-wider">
                                    {leader.party}
                                </span>
                            </div>
                            <h1 className="font-oswald text-3xl sm:text-4xl text-slate-900 uppercase tracking-wide leading-tight">
                                {leader.name}
                            </h1>
                            <p className="text-saffron font-medium text-lg mt-1">{leader.nameMarathi}</p>
                            <p className="text-slate-500 text-sm mt-1">{leader.roleMarathi} — {leader.party}</p>

                            {/* Social links */}
                            {leader.social && (
                                <div className="flex items-center gap-3 mt-4">
                                    {leader.social.facebook && (
                                        <a href={leader.social.facebook} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-saffron hover:text-white transition-all">
                                            <FaFacebook size={16} />
                                        </a>
                                    )}
                                    {leader.social.twitter && (
                                        <a href={leader.social.twitter} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-saffron hover:text-white transition-all">
                                            <FaTwitter size={16} />
                                        </a>
                                    )}
                                    {leader.social.instagram && (
                                        <a href={leader.social.instagram} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-saffron hover:text-white transition-all">
                                            <FaInstagram size={16} />
                                        </a>
                                    )}
                                    {leader.social.youtube && (
                                        <a href={leader.social.youtube} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-saffron hover:text-white transition-all">
                                            <FaYoutube size={16} />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100">
                        {leader.stats.map((stat) => (
                            <div key={stat.label} className="p-5 text-center">
                                <p className="text-2xl sm:text-3xl font-oswald text-saffron">{stat.value}</p>
                                <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wide">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Body sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    {/* Left: Bio + Achievements */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Biography */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl border border-slate-200 p-6"
                        >
                            <h2 className="font-oswald text-xl text-slate-900 tracking-wide mb-4 flex items-center gap-2">
                                <span className="w-1 h-5 bg-saffron rounded-full" />
                                BIOGRAPHY
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-4">{leader.bio}</p>
                            <p className="text-slate-500 text-sm leading-relaxed font-['Tiro_Devanagari_Hindi']">{leader.bioMarathi}</p>
                        </motion.div>

                        {/* Achievements */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl border border-slate-200 p-6"
                        >
                            <h2 className="font-oswald text-xl text-slate-900 tracking-wide mb-4 flex items-center gap-2">
                                <span className="w-1 h-5 bg-saffron rounded-full" />
                                KEY ACHIEVEMENTS
                            </h2>
                            <ul className="space-y-3">
                                {leader.achievements.map((ach, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + i * 0.07 }}
                                        className="flex items-start gap-3"
                                    >
                                        <Award size={16} className="text-saffron flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-600 text-sm leading-relaxed">{ach}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Right: Contact */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white rounded-2xl border border-slate-200 p-6"
                        >
                            <h2 className="font-oswald text-xl text-slate-900 tracking-wide mb-4 flex items-center gap-2">
                                <span className="w-1 h-5 bg-saffron rounded-full" />
                                CONTACT
                            </h2>
                            <ul className="space-y-4">
                                {leader.contact.phone && (
                                    <li className="flex items-start gap-3">
                                        <Phone size={16} className="text-saffron flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Phone</p>
                                            <a href={`tel:${leader.contact.phone}`} className="text-sm text-slate-700 hover:text-saffron transition-colors font-medium">
                                                {leader.contact.phone}
                                            </a>
                                        </div>
                                    </li>
                                )}
                                {leader.contact.email && (
                                    <li className="flex items-start gap-3">
                                        <Mail size={16} className="text-saffron flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Email</p>
                                            <a href={`mailto:${leader.contact.email}`} className="text-sm text-slate-700 hover:text-saffron transition-colors break-all">
                                                {leader.contact.email}
                                            </a>
                                        </div>
                                    </li>
                                )}
                                {(leader.contact.address || f.address) && (
                                    <li className="flex items-start gap-3">
                                        <MapPin size={16} className="text-saffron flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Office Address</p>
                                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{leader.contact.address || f.address}</p>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </motion.div>

                        {/* Quick Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-gradient-to-br from-saffron/5 to-saffron/10 rounded-2xl border border-saffron/20 p-6"
                        >
                            <h3 className="font-oswald text-lg text-saffron tracking-wide mb-3">BJP Yavatmal</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Bharatiya Janata Party, Yavatmal District Committee — committed to the holistic development of the Yavatmal region.
                            </p>
                            <Link href="/contact" className="flex items-center gap-2 text-saffron text-sm font-semibold hover:underline">
                                Get in Touch <ExternalLink size={13} />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
