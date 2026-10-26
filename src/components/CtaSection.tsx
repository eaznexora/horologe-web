import React from "react";

export default function CtaSection() {
  return (
    <section className="w-full bg-[#E7DDD2] relative overflow-hidden">
      {/* =========================================
          DESKTOP VIEW (hidden md:block)
          ========================================= */}
      <div className="hidden md:block w-full relative overflow-hidden">
        {/* Right Half Visual with Soft Gradient Blend */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%] lg:w-[58%] xl:w-[55%] h-full pointer-events-none select-none">
          <div className="relative w-full h-full">
            <img
              src="/assets/CTA-desktop.png"
              alt="Luxury Timepiece"
              className="w-full h-full object-cover object-right"
            />
            {/* Gentle gradient overlay to blend softly to the left into #E7DDD2 background */}
            <div className="absolute inset-y-0 left-0 w-36 lg:w-56 bg-gradient-to-r from-[#E7DDD2] via-[#E7DDD2]/70 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Content Container */}
        <div className="w-full min-h-[480px] lg:min-h-[540px] flex items-center px-8 md:px-16 lg:px-24 xl:px-32 relative z-10">
          <div className="w-full md:w-[56%] lg:w-[52%] py-12 lg:py-16">
            {/* Headline */}
            <h2 className="font-serif font-normal uppercase tracking-tight leading-[0.98] text-[60px] lg:text-[78px] xl:text-[82px] mb-6">
              <span className="block text-[#1C1A17]">LET&apos;S TALK</span>
              <span className="block text-[#1C1A17]">ABOUT YOUR</span>
              <span className="block text-[#9D7E50]">NEXT TIMEPIECE</span>
            </h2>

            {/* Body Copy */}
            <p className="text-[22px] lg:text-[24px] text-[#3D352E] leading-relaxed max-w-[620px] mb-8 font-sans">
              An ever-evolving collection of distinguished timepieces, sourced with discretion and selected for those who appreciate what lies beyond the dial.
            </p>

            {/* CTA Buttons (Side-by-Side) */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="bg-[#6D5333] hover:bg-[#594226] text-[#F4EDE4] text-sm lg:text-[15px] tracking-wide min-w-[200px] lg:min-w-[220px] text-center py-4 px-10 transition-colors duration-300 font-medium cursor-pointer"
              >
                Get in Touch
              </button>
              <button
                type="button"
                className="border border-[#8F775B] text-[#705537] hover:bg-[#8F775B]/10 text-sm lg:text-[15px] tracking-wide min-w-[200px] lg:min-w-[220px] text-center py-4 px-10 transition-colors duration-300 font-medium cursor-pointer"
              >
                Visit Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          MOBILE VIEW (block md:hidden)
          ========================================= */}
      <div className="block md:hidden w-full px-6 pt-12 pb-0">
        <div className="max-w-md mx-auto">
          {/* Headline */}
          <h2 
            className="font-serif font-normal uppercase tracking-tight mb-4 text-[50px] leading-[1.04]"
            style={{ fontSize: '50px', lineHeight: 1.04 }}
          >
            <span className="block text-[#1C1A17]">LET&apos;S TALK</span>
            <span className="block text-[#1C1A17]">ABOUT YOUR</span>
            <span className="block text-[#9D7E50]">NEXT TIMEPIECE</span>
          </h2>

          {/* Body Copy */}
          <p 
            className="text-[#3D352E] font-sans mb-6 text-[19px] leading-relaxed"
            style={{ fontSize: '19px', lineHeight: 1.55 }}
          >
            An ever-evolving collection of distinguished timepieces, sourced with discretion and selected for those who appreciate what lies beyond the dial.
          </p>

          {/* CTA Buttons (Stacked Full Width) */}
          <div className="flex flex-col gap-3 w-full mb-8">
            <button
              type="button"
              className="w-full py-3.5 bg-[#6D5333] hover:bg-[#594226] text-[#F4EDE4] text-center text-sm tracking-wide font-medium transition-colors duration-300 cursor-pointer"
            >
              Get in Touch
            </button>
            <button
              type="button"
              className="w-full py-3.5 border border-[#8F775B] text-[#705537] hover:bg-[#8F775B]/10 text-center text-sm tracking-wide font-medium transition-colors duration-300 cursor-pointer"
            >
              Visit Us
            </button>
          </div>
        </div>

        {/* Mobile Visual (anchored flush to the bottom) */}
        <div className="-mx-6 mt-2 flex justify-center overflow-hidden">
          <img
            src="/assets/CTA-mobile.png"
            alt="Luxury Timepiece and Pen"
            className="w-full h-auto object-cover object-top select-none pointer-events-none block"
          />
        </div>
      </div>
    </section>
  );
}
