import type { Metadata } from "next";
import { ReactNode } from "react";
import { Bebas_Neue, DM_Sans, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap"
});

const tiroHindi = Tiro_Devanagari_Hindi({
  weight: "400",
  subsets: ["devanagari", "latin"],
  variable: "--font-tiro-hindi",
  display: "swap"
});

export const metadata: Metadata = {
  title: "BJP Yavatmal | Bharatiya Janata Party",
  description: "Official Website of Bharatiya Janata Party, Yavatmal District",
};

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SocialBar from "../components/shared/SocialBar";
import { LanguageProvider } from "../lib/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable} ${tiroHindi.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-[#F4F6F8]">
        <LanguageProvider>
          {/* Tricolor top strip */}
          <div className="fixed top-0 z-[60] h-1 w-full flex">
            <div className="flex-1 bg-saffron h-full"></div>
            <div className="flex-1 bg-white h-full"></div>
            <div className="flex-1 bg-india-green h-full"></div>
          </div>

          <Navbar />
          <SocialBar />

          <main className="min-h-screen animate-fadeIn">
            {children}
          </main>

          <Footer />

          {/* Tricolor bottom strip */}
          <div className="h-1 w-full flex relative z-20">
            <div className="flex-1 bg-saffron h-full"></div>
            <div className="flex-1 bg-white h-full"></div>
            <div className="flex-1 bg-india-green h-full"></div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
