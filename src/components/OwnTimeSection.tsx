"use client";

import React from "react";
import Image from "next/image";

interface Pillar {
  title: string;
  description: string;
}

const pillars: Pillar[] = [
  {
    title: "EXPERIENCE",
    description: "Personal guidance for collectors, enthusiasts and first-time buyers alike.",
  },
  {
    title: "AUTHENTICATED",
    description: "Every timepiece is carefully examined before it finds its place in our collection.",
  },
  {
    title: "CURATED",
    description: "New and pre-owned pieces selected from the world of fine watchmaking.",
  },
  {
    title: "EXCEPTIONAL",
    description: "Distinctive references chosen for their character, rarity and enduring appeal.",
  },
];

export default function OwnTimeSection() {
  return (
    <section className="w-full bg-[#E7DDD2] relative overflow-hidden">
      {/* 1. TOP BANNER STRIP */}
      <div className="w-full bg-[#C6B29A] py-3 flex items-center justify-center cursor-pointer hover:bg-[#BBA389] transition-colors">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3A3026]">
          DISCOVER THE TIMEPIECES &rarr;
        </span>
      </div>

      {/* 2. HERO BANNER BLOCK */}
      {/* Desktop Hero View - Full native aspect ratio (1440x329) to eliminate cropping */}
      <div className="hidden md:block relative w-full overflow-hidden">
        <Image
          src="/assets/own-time-desktop.png"
          alt="Every way to own time"
          width={1440}
          height={329}
          priority
          className="w-full h-auto block object-cover"
        />
        <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-12 lg:left-16 z-10 max-w-[750px]">
          <h2 className="font-serif uppercase tracking-tight text-[51px] md:text-[63px] lg:text-[78px] leading-[1.02]">
            <span className="block text-[#1C1A17]">EVERY WAY</span>
            <span className="block">
              <span className="text-[#1C1A17]">TO OWN </span>
              <span className="text-[#9D7E50]">TIME.</span>
            </span>
          </h2>
        </div>
      </div>

      {/* Mobile Hero View - Full native aspect ratio (428x316) to eliminate cropping */}
      <div className="block md:hidden relative w-full overflow-hidden">
        <Image
          src="/assets/own-time-mobile.png"
          alt="Every way to own time"
          width={428}
          height={316}
          priority
          className="w-full h-auto block object-cover"
        />
        <div className="absolute top-3.5 sm:top-5 left-4 sm:left-6 z-10 max-w-[90%] sm:max-w-[380px]">
          <h2 className="font-serif uppercase tracking-tight text-[48px] sm:text-[56px] leading-[1.0]">
            <span className="block text-[#1C1A17]">EVERY WAY</span>
            <span className="block">
              <span className="text-[#1C1A17]">TO OWN </span>
              <span className="text-[#9D7E50]">TIME.</span>
            </span>
          </h2>
        </div>
      </div>

      {/* 3. THE 4 PILLARS (VALUE PROPOSITIONS) */}
      {/* Desktop Pillars Layout */}
      <div className="hidden md:block max-w-[1440px] mx-auto px-6 lg:px-12 pt-7 lg:pt-8 pb-3 lg:pb-4">
        <div className="grid grid-cols-4 gap-8 lg:gap-10 text-center">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex flex-col items-center">
              <h3 className="font-serif uppercase tracking-[0.12em] text-[30px] lg:text-[33px] text-[#9D7E50] mb-3.5">
                {pillar.title}
              </h3>
              <p className="text-[17.5px] lg:text-[19px] leading-relaxed text-[#3D352E] font-sans max-w-[280px] lg:max-w-[300px] mx-auto">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Pillars Layout */}
      <div className="block md:hidden px-6 py-14">
        <div className="flex flex-col gap-10 text-center max-w-[340px] sm:max-w-[380px] mx-auto">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex flex-col items-center">
              <h3 className="font-serif uppercase tracking-[0.12em] text-[30px] text-[#9D7E50] mb-2.5">
                {pillar.title}
              </h3>
              <p className="text-[19px] leading-relaxed text-[#3D352E] font-sans">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
