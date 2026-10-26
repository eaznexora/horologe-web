import React from "react";
import Link from "next/link";

export default function SourcingBanner() {
  return (
    <section className="w-full bg-[#DDD1C1] py-6 sm:py-9 lg:py-10 mt-1 sm:mt-2 mb-2 sm:mb-3">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-12">
        {/* Left Column: Scaled 50% Editorial Headline */}
        <div>
          <h2 className="font-serif uppercase tracking-tight leading-[1.04] sm:leading-[1.02] text-[34px] min-[390px]:text-[38px] sm:text-[54px] lg:text-[72px]">
            <span className="block text-[#1C1A17]">LOOKING FOR</span>
            <span className="block text-[#9D7E50]">A SPECIFIC PIECE?</span>
          </h2>
        </div>

        {/* Right Column: Body Copy & Action Button */}
        <div className="max-w-[500px] flex flex-col gap-4 sm:gap-5">
          <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#3A332C] leading-relaxed font-sans">
            <span className="block">Tell us what you&apos;re looking for, and our</span>
            <span className="block">specialists will help source the right timepiece</span>
            <span className="block">for you.</span>
          </p>

          <Link
            href="#"
            className="w-full sm:w-fit bg-[#6D5333] hover:bg-[#574227] text-[#F4EDE4] text-xs font-medium uppercase tracking-[0.16em] py-3.5 px-8 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Request a Timepiece &rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
