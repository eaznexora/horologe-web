"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import BannerLink from "@/components/BannerLink";

interface GenderCollectionsProps {
  banners?: Record<string, { desktopUrl?: string; mobileUrl?: string; linkUrl?: string; mediaType?: string }>;
}

function GenderCollections({ banners = {} }: GenderCollectionsProps) {
  const menVideoRef = useRef<HTMLVideoElement>(null);
  const womenVideoRef = useRef<HTMLVideoElement>(null);

  const menSrc = banners?.["gender-men"]?.desktopUrl || "/assets/men.mp4";
  const womenSrc = banners?.["gender-women"]?.desktopUrl || "/assets/women.mp4";

  const menHref = banners?.["gender-men"]?.linkUrl?.trim() || "/collections";
  const womenHref = banners?.["gender-women"]?.linkUrl?.trim() || "/collections";

  useEffect(() => {
    [menVideoRef, womenVideoRef].forEach((ref) => {
      const v = ref.current;
      if (!v) return;

      // Forcibly set native properties on the DOM node to bypass browser autoplay guards
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.loop = true;

      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Retry silently if throttled
          v.muted = true;
          v.play().catch(() => {});
        });
      }
    });
  }, [menSrc, womenSrc]);

  return (
    <section className="w-full bg-[#E7DDD2] py-12 sm:py-16 lg:py-20 relative">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
          {/* Men's Timepieces Card */}
          <BannerLink
            href={menHref}
            className="relative overflow-hidden group cursor-pointer aspect-[16/11] sm:aspect-[4/3] md:aspect-[16/11] lg:aspect-[4/3] w-full bg-[#1A1816] block"
          >
            <video
              ref={menVideoRef}
              key={menSrc}
              src={menSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700 ease-out block"
              style={{ objectPosition: "right center" }}
            >
              <source src={menSrc} type={menSrc.endsWith(".webm") ? "video/webm" : "video/mp4"} />
            </video>

            {/* Gradient Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

            {/* Typography Overlay */}
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-10 text-left">
              <h3 className="font-serif uppercase text-[22px] sm:text-[26px] lg:text-[30px] text-[#F5EFE6] tracking-wide leading-none mb-2.5">
                MEN&apos;S TIMEPIECES
              </h3>
              <div className="w-12 h-[1px] bg-[#B39364] mb-3 transition-all duration-300 group-hover:w-20" />
              <span className="text-[11px] sm:text-[12px] font-sans font-medium uppercase tracking-[0.2em] text-[#C4B29A] group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                EXPLORE COLLECTION &rarr;
              </span>
            </div>
          </BannerLink>

          {/* Women's Timepieces Card */}
          <BannerLink
            href={womenHref}
            className="relative overflow-hidden group cursor-pointer aspect-[16/11] sm:aspect-[4/3] md:aspect-[16/11] lg:aspect-[4/3] w-full bg-[#1A1816] block"
          >
            <video
              ref={womenVideoRef}
              key={womenSrc}
              src={womenSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700 ease-out block"
              style={{ objectPosition: "right center" }}
            >
              <source src={womenSrc} type={womenSrc.endsWith(".webm") ? "video/webm" : "video/mp4"} />
            </video>

            {/* Gradient Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

            {/* Typography Overlay */}
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-10 text-left">
              <h3 className="font-serif uppercase text-[22px] sm:text-[26px] lg:text-[30px] text-[#F5EFE6] tracking-wide leading-none mb-2.5">
                WOMEN&apos;S TIMEPIECES
              </h3>
              <div className="w-12 h-[1px] bg-[#B39364] mb-3 transition-all duration-300 group-hover:w-20" />
              <span className="text-[11px] sm:text-[12px] font-sans font-medium uppercase tracking-[0.2em] text-[#C4B29A] group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                EXPLORE COLLECTION &rarr;
              </span>
            </div>
          </BannerLink>
        </div>
      </div>
    </section>
  );
}

export default React.memo(GenderCollections);
