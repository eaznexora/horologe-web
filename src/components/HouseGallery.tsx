import React from "react";

export default function HouseGallery() {
  return (
    <section className="w-full bg-[#E7DDD2] relative overflow-hidden">
      {/* =========================================
          DESKTOP VIEW (hidden md:block)
          ========================================= */}
      <div className="hidden md:block w-full">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 pb-10">
          {/* Section Header */}
          <h2 className="font-serif uppercase tracking-tight text-[34px] sm:text-[46px] md:text-[66px] lg:text-[76px] xl:text-[80px] leading-[1.02] mb-3 lg:mb-4">
            <span className="text-[#1C1A17]">THE HOUSE OF </span>
            <span className="text-[#9D7E50]">HOROLOGY.</span>
          </h2>
          <p className="text-[21px] lg:text-[22.5px] xl:text-[23px] text-[#3D352E] max-w-none leading-relaxed mb-8 sm:mb-10 font-sans">
            <span className="block">An ever-evolving collection of distinguished timepieces, sourced with discretion and selected for</span>
            <span className="block">those who appreciate what lies beyond the dial.</span>
          </p>

          {/* Asymmetric Mosaic Grid: Top Row */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
            {/* Left Column: Tall image */}
            <div className="w-full">
              <img
                src="/assets/house-1.png"
                alt="Wrist shot"
                className="w-full h-[480px] lg:h-[540px] object-cover"
              />
            </div>

            {/* Right Column: Two stacked images */}
            <div className="flex flex-col gap-4 lg:gap-6">
              <img
                src="/assets/house-2.png"
                alt="Watch in nature"
                className="w-full h-[230px] lg:h-[258px] object-cover"
              />
              <img
                src="/assets/house-3.png"
                alt="Submariner close-up"
                className="w-full h-[230px] lg:h-[258px] object-cover"
              />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6 mb-4">
            <img
              src="/assets/house-5.png"
              alt="Vintage military dial"
              className="w-full h-[260px] lg:h-[290px] object-cover"
            />
            <img
              src="/assets/house-4.png"
              alt="Steel dive watch"
              className="w-full h-[260px] lg:h-[290px] object-cover"
            />
          </div>
        </div>

        {/* Desktop Action Strip */}
        <div className="w-full bg-[#C6B29A] py-3.5 flex items-center justify-center">
          <span className="text-[14px] uppercase tracking-[0.2em] text-[#6B4E26] font-semibold hover:text-[#523B1C] transition-colors cursor-pointer">
            See More Moments &rarr;
          </span>
        </div>
      </div>

      {/* =========================================
          MOBILE VIEW (block md:hidden)
          ========================================= */}
      <div className="block md:hidden w-full">
        {/* Header container with padding */}
        <div className="px-5 pt-10 pb-6">
          {/* Section Header */}
          <h2 
            className="font-serif uppercase tracking-tight mb-3 text-[48px] sm:text-[52px] leading-[1.04]"
            style={{ fontSize: '48px', lineHeight: 1.04 }}
          >
            <span className="block text-[#1C1A17]">THE HOUSE OF</span>
            <span className="block text-[#9D7E50]">HOROLOGY.</span>
          </h2>
          <p 
            className="text-[#3D352E] font-sans text-[16px] leading-[1.45]"
            style={{ fontSize: '16px', lineHeight: 1.45 }}
          >
            <span className="block">An ever-evolving collection of distinguished</span>
            <span className="block">timepieces, sourced with discretion and</span>
            <span className="block">selected for those who appreciate what lies</span>
            <span className="block">beyond the dial.</span>
          </p>
        </div>

        {/* Full-bleed mosaic images touching each other with 0 gap */}
        <div className="w-full flex flex-col">
          {/* Cluster 1: Left tall + Right 2 stacked */}
          <div className="w-full grid grid-cols-2 gap-0">
            <img
              src="/assets/house-1.png"
              alt="Wrist shot"
              className="w-full h-[220px] object-cover block"
            />
            <div className="w-full h-[220px] flex flex-col">
              <img
                src="/assets/house-2.png"
                alt="Watch in nature"
                className="w-full h-[110px] object-cover block"
              />
              <img
                src="/assets/house-3.png"
                alt="Submariner close-up"
                className="w-full h-[110px] object-cover block"
              />
            </div>
          </div>

          {/* Cluster 2: Full width military watch */}
          <img
            src="/assets/house-5.png"
            alt="Vintage military dial"
            className="w-full h-[180px] object-cover block"
          />

          {/* Cluster 3: Full width dive watch */}
          <img
            src="/assets/house-4.png"
            alt="Steel dive watch"
            className="w-full h-[190px] object-cover block"
          />

          {/* Mobile Action Strip: Flush below image */}
          <div className="w-full bg-[#C6B29A] py-3.5 flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-[#3A3026] font-semibold">
              EXPLORE GALLERY &rarr;
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
