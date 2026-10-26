import React from "react";

export default function CollectionsHero() {
  return (
    <section className="w-full bg-[#E7DDD2] relative overflow-hidden">
      {/* DESKTOP VIEW (hidden md:flex) */}
      <div className="hidden md:flex w-full items-start justify-between">
        {/* Left Column: Text scaled +50% and moved up */}
        <div className="w-[54%] lg:w-[50%] flex flex-col justify-start pt-6 lg:pt-10 pl-6 md:pl-10 lg:pl-16 xl:pl-24 pr-4 pb-12">
          <h1 className="font-serif uppercase tracking-tight leading-[1.02] text-[48px] md:text-[52px] lg:text-[72px] xl:text-[86px] 2xl:text-[96px]">
            <span className="block text-[#1C1A17] whitespace-nowrap">A CLOSER LOOK</span>
            <span className="block text-[#9D7E50] whitespace-nowrap">AT TIME.</span>
          </h1>
          <p className="text-[20px] lg:text-[24px] xl:text-[27px] text-[#332E29] font-sans leading-relaxed mt-6 max-w-[560px]">
            Explore exceptional timepieces, captured through our lens.
          </p>
        </div>

        {/* Right Column: Smaller, fully visible image touching the header at top */}
        <div className="w-[46%] lg:w-[50%] flex justify-end items-start pr-0">
          <img
            src="/assets/categories-hero.png"
            alt="Horologe Royale Boutique Experience"
            className="w-full max-w-[480px] lg:max-w-[520px] xl:max-w-[560px] h-auto object-contain object-top block"
          />
        </div>
      </div>

      {/* MOBILE VIEW (flex flex-col md:hidden) */}
      <div className="flex flex-col md:hidden w-full">
        {/* Top Text Block: Scaled +50% and moved up */}
        <div className="px-6 pt-6 sm:pt-8 pb-6">
          <h1 className="font-serif uppercase tracking-tight leading-[1.06] text-[34px] min-[380px]:text-[40px] sm:text-[48px]">
            <span className="block text-[#1C1A17] whitespace-nowrap">A CLOSER LOOK</span>
            <span className="block text-[#9D7E50] whitespace-nowrap">AT TIME.</span>
          </h1>
          <p className="text-[20px] sm:text-[22px] text-[#332E29] font-sans leading-relaxed mt-4 max-w-[360px]">
            Explore exceptional timepieces, captured through our lens.
          </p>
        </div>

        {/* Bottom Image Block: Smaller and fully visible */}
        <div className="w-full px-6 pb-10 flex justify-center">
          <img
            src="/assets/categories-hero.png"
            alt="Horologe Royale Boutique Experience"
            className="w-full max-w-[380px] h-auto object-contain object-center block"
          />
        </div>
      </div>
    </section>
  );
}
