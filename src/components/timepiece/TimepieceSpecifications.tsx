"use client";

import React from "react";

export default function TimepieceSpecifications() {
  return (
    <section className="w-full bg-[#E7DDD2] text-[#2C241E] pt-0 md:pt-1 pb-12 sm:pb-16 lg:pb-20 font-sans select-text">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* ========================================================= */}
        {/* DESKTOP VIEW (hidden md:block)                            */}
        {/* ========================================================= */}
        <div className="hidden md:block">
          {/* Top Hairline Horizontal Divider */}
          <div className="w-full h-[1px] bg-[#CDC3B5] mb-4 lg:mb-5" />

          {/* Upper Block: Heritage Narrative & Provenance Pillars */}
          <div className="flex items-start justify-between gap-6 lg:gap-10 pb-1">
            {/* Left Column */}
            <div className="w-[42%] lg:w-[44%] shrink-0 pr-4 lg:pr-8">
              <h2 className="font-serif uppercase text-[34px] md:text-[38px] lg:text-[44px] xl:text-[48px] leading-[1.08] text-[#9D7E50] tracking-[0.015em] font-normal mb-4">
                A CHRONOGRAPHY<br />WITH A LEGACY.
              </h2>
              <p
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
                className="text-[17.5px] md:text-[18.5px] lg:text-[19.5px] xl:text-[20px] text-[#6E5F52] leading-[1.55] max-w-[560px] lg:max-w-[620px]"
              >
                We prioritise transparency, provenance, and complete<br className="hidden md:inline" /> confidence with every acquisition.
              </p>
            </div>

            {/* Right Column (~60% width): 3 Pillars with vertical hairline dividers matching reference */}
            <div className="flex-1 grid grid-cols-3 divide-x divide-[#CDC3B5] border-l border-r border-[#CDC3B5] text-center self-stretch py-0.5">
              {/* Pillar 1 */}
              <div className="px-3 lg:px-4 flex flex-col items-center justify-start">
                <h3
                  style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  className="text-[17px] md:text-[18px] lg:text-[20px] xl:text-[21px] font-medium uppercase tracking-[0.14em] text-[#9D7E50] leading-snug mb-3.5"
                >
                  TIMEPIECES<br />SOURCED
                </h3>
                <p
                  style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  className="text-[14.5px] md:text-[15px] lg:text-[16.5px] xl:text-[17.5px] leading-[1.6] text-[#6E5F52] max-w-[210px] lg:max-w-[230px] mx-auto"
                >
                  We prioritise<br />
                  transparency,<br />
                  provenance, and<br />
                  complete<br />
                  confidence with<br />
                  every acquisition.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="px-3 lg:px-4 flex flex-col items-center justify-start">
                <h3
                  style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  className="text-[17px] md:text-[18px] lg:text-[20px] xl:text-[21px] font-medium uppercase tracking-[0.14em] text-[#9D7E50] leading-snug mb-3.5"
                >
                  TIMEPIECES<br />SOURCED
                </h3>
                <p
                  style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  className="text-[14.5px] md:text-[15px] lg:text-[16.5px] xl:text-[17.5px] leading-[1.6] text-[#6E5F52] max-w-[210px] lg:max-w-[230px] mx-auto"
                >
                  We prioritise<br />
                  transparency,<br />
                  provenance, and<br />
                  complete<br />
                  confidence with<br />
                  every acquisition.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="px-3 lg:px-4 flex flex-col items-center justify-start">
                <h3
                  style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  className="text-[17px] md:text-[18px] lg:text-[20px] xl:text-[21px] font-medium uppercase tracking-[0.14em] text-[#9D7E50] leading-snug mb-3.5"
                >
                  TIMEPIECES<br />SOURCED
                </h3>
                <p
                  style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  className="text-[14.5px] md:text-[15px] lg:text-[16.5px] xl:text-[17.5px] leading-[1.6] text-[#6E5F52] max-w-[210px] lg:max-w-[230px] mx-auto"
                >
                  We prioritise<br />
                  transparency,<br />
                  provenance, and<br />
                  complete<br />
                  confidence with<br />
                  every acquisition.
                </p>
              </div>
            </div>
          </div>

          {/* Divider with Section Label */}
          <div className="flex items-center gap-4 mt-4 lg:mt-5 mb-3 lg:mb-3.5">
            <span
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
              className="italic text-[16px] lg:text-[18px] text-[#7A6753] whitespace-nowrap"
            >
              Key Specifications
            </span>
            <div className="flex-1 h-[1px] bg-[#CDC3B5]" />
          </div>

          {/* Bottom Technical Spec Grid (5 Columns) */}
          <div className="grid grid-cols-5 gap-4 lg:gap-6 text-center pt-0 pb-3">
            {/* Column 1 */}
            <div className="flex flex-col items-center justify-center">
              <span
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
                className="text-[13px] md:text-[13.5px] lg:text-[14.5px] xl:text-[15px] uppercase tracking-[0.16em] text-[#948270] mb-2 font-medium"
              >
                CASE SIZE
              </span>
              <span
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
                className="text-[23px] lg:text-[25px] xl:text-[27px] text-[#2A241E] leading-tight font-normal"
              >
                22 mm
              </span>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col items-center justify-center">
              <span
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
                className="text-[13px] md:text-[13.5px] lg:text-[14.5px] xl:text-[15px] uppercase tracking-[0.16em] text-[#948270] mb-2 font-medium"
              >
                CASE MATERIAL
              </span>
              <span
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
                className="text-[23px] lg:text-[25px] xl:text-[27px] text-[#2A241E] leading-tight font-normal"
              >
                Stainless Steel
              </span>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col items-center justify-center">
              <span
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
                className="text-[13px] md:text-[13.5px] lg:text-[14.5px] xl:text-[15px] uppercase tracking-[0.16em] text-[#948270] mb-2 font-medium"
              >
                MOVEMENT
              </span>
              <span
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
                className="text-[23px] lg:text-[25px] xl:text-[27px] text-[#2A241E] leading-tight font-normal"
              >
                Automatic
              </span>
            </div>

            {/* Column 4 */}
            <div className="flex flex-col items-center justify-center">
              <span
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
                className="text-[13px] md:text-[13.5px] lg:text-[14.5px] xl:text-[15px] uppercase tracking-[0.16em] text-[#948270] mb-2 font-medium"
              >
                POWER RESERVE
              </span>
              <span
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
                className="text-[23px] lg:text-[25px] xl:text-[27px] text-[#2A241E] leading-tight font-normal"
              >
                72 Hours
              </span>
            </div>

            {/* Column 5 */}
            <div className="flex flex-col items-center justify-center">
              <span
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
                className="text-[13px] md:text-[13.5px] lg:text-[14.5px] xl:text-[15px] uppercase tracking-[0.16em] text-[#948270] mb-2 font-medium"
              >
                WATER RESISTANCE
              </span>
              <span
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
                className="text-[23px] lg:text-[25px] xl:text-[27px] text-[#2A241E] leading-tight font-normal"
              >
                100m
              </span>
            </div>
          </div>
        </div>


        {/* ========================================================= */}
        {/* MOBILE VIEW (block md:hidden)                             */}
        {/* ========================================================= */}
        <div className="block md:hidden px-4 sm:px-6 py-4">
          {/* Upper Block: Centered Heritage Headline & Narrative */}
          <div className="text-center pt-2 pb-5">
            <h2 className="font-serif uppercase text-[35px] sm:text-[38px] leading-[1.08] text-[#9D7E50] tracking-tight mb-3">
              A CHRONOGRAPHY<br />WITH A LEGACY.
            </h2>
            <p
              style={{ fontFamily: "var(--font-sans), sans-serif" }}
              className="text-[15.5px] sm:text-[16.5px] text-[#6E5F52] leading-[1.55] max-w-[340px] sm:max-w-[380px] mx-auto"
            >
              We prioritise transparency, provenance, and<br />complete confidence with every acquisition.
            </p>
          </div>

          {/* Full-bleed Hairline Horizontal Divider */}
          <div className="w-full h-[1px] bg-[#CDC3B5]" />

          {/* Stacked Pillars with Horizontal Dividers */}
          <div className="text-center">
            {/* Pillar 1 */}
            <div className="py-6 border-b border-[#CDC3B5]">
              <h3
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
                className="text-[17px] sm:text-[18px] font-medium uppercase tracking-[0.16em] text-[#9D7E50] mb-2.5"
              >
                TIMEPIECES SOURCED
              </h3>
              <p
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
                className="text-[15.5px] sm:text-[16.5px] text-[#6E5F52] leading-[1.6] max-w-[320px] mx-auto"
              >
                We prioritise transparency, provenance,<br />
                and complete confidence with<br />
                every acquisition.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="py-6 border-b border-[#CDC3B5]">
              <h3
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
                className="text-[17px] sm:text-[18px] font-medium uppercase tracking-[0.16em] text-[#9D7E50] mb-2.5"
              >
                TIMEPIECES SOURCED
              </h3>
              <p
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
                className="text-[15.5px] sm:text-[16.5px] text-[#6E5F52] leading-[1.6] max-w-[320px] mx-auto"
              >
                We prioritise transparency, provenance,<br />
                and complete confidence with<br />
                every acquisition.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="py-6 border-b border-[#CDC3B5]">
              <h3
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
                className="text-[17px] sm:text-[18px] font-medium uppercase tracking-[0.16em] text-[#9D7E50] mb-2.5"
              >
                TIMEPIECES SOURCED
              </h3>
              <p
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
                className="text-[15.5px] sm:text-[16.5px] text-[#6E5F52] leading-[1.6] max-w-[320px] mx-auto"
              >
                We prioritise transparency, provenance,<br />
                and complete confidence with<br />
                every acquisition.
              </p>
            </div>
          </div>

          {/* Mobile Section Divider: Key Specifications */}
          <div className="flex items-center gap-3 pt-6 pb-2">
            <span
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
              className="italic text-[17px] sm:text-[19px] text-[#7A6753] whitespace-nowrap"
            >
              Key Specifications
            </span>
            <div className="flex-1 h-[1px] bg-[#CDC3B5]" />
          </div>

          {/* Mobile Technical Specifications (2x2 Grid + Centered 5th Item) */}
          <div className="pt-4 pb-6">
            <div className="grid grid-cols-2 gap-y-6 text-center">
              {/* Row 1, Col 1: Case Size */}
              <div>
                <span
                  style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  className="block text-[14px] sm:text-[14.5px] uppercase tracking-[0.16em] text-[#948270] mb-1.5 font-medium"
                >
                  CASE SIZE
                </span>
                <span
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                  className="text-[23px] sm:text-[24.5px] text-[#2A241E] font-normal leading-tight"
                >
                  22 mm
                </span>
              </div>

              {/* Row 1, Col 2: Case Material */}
              <div>
                <span
                  style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  className="block text-[14px] sm:text-[14.5px] uppercase tracking-[0.16em] text-[#948270] mb-1.5 font-medium"
                >
                  CASE MATERIAL
                </span>
                <span
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                  className="text-[23px] sm:text-[24.5px] text-[#2A241E] font-normal leading-tight"
                >
                  Stainless Steel
                </span>
              </div>

              {/* Row 2, Col 1: Movement */}
              <div>
                <span
                  style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  className="block text-[14px] sm:text-[14.5px] uppercase tracking-[0.16em] text-[#948270] mb-1.5 font-medium"
                >
                  MOVEMENT
                </span>
                <span
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                  className="text-[23px] sm:text-[24.5px] text-[#2A241E] font-normal leading-tight"
                >
                  Automatic
                </span>
              </div>

              {/* Row 2, Col 2: Power Reserve */}
              <div>
                <span
                  style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  className="block text-[14px] sm:text-[14.5px] uppercase tracking-[0.16em] text-[#948270] mb-1.5 font-medium"
                >
                  POWER RESERVE
                </span>
                <span
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                  className="text-[23px] sm:text-[24.5px] text-[#2A241E] font-normal leading-tight"
                >
                  72 Hours
                </span>
              </div>
            </div>

            {/* Row 3: Water Resistance (Centered full width) */}
            <div className="mt-6 text-center">
              <span
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
                className="block text-[14px] sm:text-[14.5px] uppercase tracking-[0.16em] text-[#948270] mb-1.5 font-medium"
              >
                WATER RESISTANCE
              </span>
              <span
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
                className="text-[23px] sm:text-[24.5px] text-[#2A241E] font-normal leading-tight"
              >
                100m
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
