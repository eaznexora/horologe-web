"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const DESKTOP_HERO_CARDS = [
  { id: "mtw-1", src: "/assets/MTW-1.png", alt: "Buy New Watches" },
  { id: "mtw-2", src: "/assets/MTW-2.png", alt: "Buy Pre-Owned Watches" },
];

const DESKTOP_BOTTOM_CARDS = [
  { id: "mtw-3", src: "/assets/MTW-3.png", alt: "Horology Concierge Inspection" },
  { id: "mtw-4", src: "/assets/MTW-4.png", alt: "Master Watchmaker Provenance" },
  { id: "mtw-5", src: "/assets/MTW-5-6-7.png", alt: "Curated Vault Watch Tray 1" },
  { id: "mtw-6", src: "/assets/MTW-5-6-7.png", alt: "Curated Vault Watch Tray 2" },
  { id: "mtw-7", src: "/assets/MTW-5-6-7.png", alt: "Curated Vault Watch Tray 3" },
];

// Strictly exclude MTW-1.png and MTW-2.png from mobile slider
const MOBILE_SLIDER_BASE = [
  { id: "m-3", src: "/assets/MTW-3.png", alt: "Horology Concierge Inspection" },
  { id: "m-4", src: "/assets/MTW-4.png", alt: "Master Watchmaker Provenance" },
  { id: "m-5", src: "/assets/MTW-5-6-7.png", alt: "Curated Vault Watch Tray 1" },
  { id: "m-6", src: "/assets/MTW-5-6-7.png", alt: "Curated Vault Watch Tray 2" },
  { id: "m-7", src: "/assets/MTW-5-6-7.png", alt: "Curated Vault Watch Tray 3" },
];

// Duplicate for continuous seamless auto-scrolling
const MOBILE_SLIDER_CARDS = [...MOBILE_SLIDER_BASE, ...MOBILE_SLIDER_BASE];

export default function ExperienceSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const autoSlideInterval = setInterval(() => {
      if (isInteractingRef.current) return;

      const cardWidth = slider.firstElementChild?.clientWidth || 260;
      const gap = 12; // gap-3 (12px)
      const step = cardWidth + gap;

      // If near end, loop smoothly back to start, else advance by 1 card
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 1800);

    const handleInteractionStart = () => {
      isInteractingRef.current = true;
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };

    const handleInteractionEnd = () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = setTimeout(() => {
        isInteractingRef.current = false;
      }, 2200); // Resume auto-sliding 2.2s after manual gesture ends
    };

    slider.addEventListener("touchstart", handleInteractionStart, { passive: true });
    slider.addEventListener("touchend", handleInteractionEnd, { passive: true });
    slider.addEventListener("mousedown", handleInteractionStart, { passive: true });
    slider.addEventListener("mouseup", handleInteractionEnd, { passive: true });

    return () => {
      clearInterval(autoSlideInterval);
      slider.removeEventListener("touchstart", handleInteractionStart);
      slider.removeEventListener("touchend", handleInteractionEnd);
      slider.removeEventListener("mousedown", handleInteractionStart);
      slider.removeEventListener("mouseup", handleInteractionEnd);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  return (
    <section className="w-full bg-[#E7DDD2] relative overflow-hidden">
      {/* DESKTOP VIEW */}
      <div className="hidden md:block max-w-[1440px] mx-auto px-6 lg:px-12 pt-16 lg:pt-20 pb-0">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-14">
          <h2 className="font-serif uppercase tracking-tight text-[56px] lg:text-[72px] text-center leading-[1.05] mb-3">
            <span className="text-[#1C1A17]">MORE THAN A </span>
            <span className="text-[#9D7E50]">WATCH.</span>
          </h2>
          <p className="text-[22px] lg:text-[23px] text-[#4A423A] font-sans">
            A Complete Experience, Tailored for you
          </p>
        </div>

        {/* Row 1: Top Hero Pair */}
        <div className="grid grid-cols-2 gap-5 lg:gap-6 mb-5 lg:mb-6">
          {DESKTOP_HERO_CARDS.map((card) => (
            <div 
              key={card.id} 
              className="relative h-[260px] lg:h-[300px] overflow-hidden group shadow-[0_8px_24px_rgba(44,36,30,0.06)]"
            >
              <Image 
                src={card.src} 
                alt={card.alt} 
                fill 
                priority 
                sizes="(max-width: 1440px) 50vw, 700px" 
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" 
              />
            </div>
          ))}
        </div>

        {/* Row 2: Bottom 5 Columns */}
        <div className="grid grid-cols-5 gap-4 lg:gap-5 mb-6 lg:mb-7">
          {DESKTOP_BOTTOM_CARDS.map((card) => (
            <div 
              key={card.id} 
              className="relative aspect-[3/4] h-[280px] lg:h-[320px] overflow-hidden group shadow-[0_6px_20px_rgba(44,36,30,0.05)]"
            >
              <Image 
                src={card.src} 
                alt={card.alt} 
                fill 
                sizes="(max-width: 1440px) 20vw, 280px" 
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              />
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="block md:hidden px-5 pt-10 pb-0">
        {/* Mobile Header */}
        <div className="text-left mb-8">
          <h2 className="font-serif uppercase tracking-tight text-[48px] sm:text-[54px] text-left leading-[1.04] mb-3">
            <span className="block text-[#1C1A17]">MORE THAN</span>
            <span className="block">
              <span className="text-[#1C1A17]">A </span>
              <span className="text-[#9D7E50]">WATCH.</span>
            </span>
          </h2>
          <p className="text-[21px] text-[#4A423A] font-sans leading-relaxed">
            A Complete Experience, Tailored for you
          </p>
        </div>

        {/* Mobile Horizontal Carousel / Slider with Dual Mode (Auto + Swipe) */}
        <div
          ref={sliderRef}
          className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-5 px-5 pb-8 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {MOBILE_SLIDER_CARDS.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              className="w-[72vw] max-w-[280px] aspect-[3/4] shrink-0 snap-center relative overflow-hidden shadow-[0_6px_20px_rgba(44,36,30,0.06)] rounded-none"
            >
              <Image 
                src={card.src} 
                alt={card.alt} 
                fill 
                sizes="72vw" 
                className="object-cover" 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Ribbon Bar */}
      <Link
        href="/contact#boutique"
        className="w-full bg-[#C6B29A] py-3.5 flex items-center justify-center cursor-pointer hover:bg-[#BBA389] transition-colors block text-center"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-[#3A3026]">
          BOOK A VISIT &rarr;
        </span>
      </Link>
    </section>
  );
}
