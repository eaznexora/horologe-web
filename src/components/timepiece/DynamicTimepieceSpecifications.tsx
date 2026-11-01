"use client";

import React from "react";
import { DynamicTimepieceData } from "./DynamicTimepieceOverview";

const DEFAULT_PILLARS = [
  {
    title: "TIMEPIECES SOURCED",
    description: "We prioritise transparency, provenance, and complete confidence with every acquisition.",
  },
  {
    title: "TIMEPIECES SOURCED",
    description: "We prioritise transparency, provenance, and complete confidence with every acquisition.",
  },
  {
    title: "TIMEPIECES SOURCED",
    description: "We prioritise transparency, provenance, and complete confidence with every acquisition.",
  },
];

const DEFAULT_KEY_SPECS = [
  { label: "CASE SIZE", value: "40 mm" },
  { label: "CASE MATERIAL", value: "Stainless Steel" },
  { label: "MOVEMENT", value: "Automatic" },
  { label: "POWER RESERVE", value: "72 Hours" },
  { label: "WATER RESISTANCE", value: "100m" },
];

export default function DynamicTimepieceSpecifications({
  product,
}: {
  product: DynamicTimepieceData;
}) {
  const headline = product.heritageHeadline || "A CHRONOGRAPHY WITH A LEGACY.";
  const story =
    product.heritageStory ||
    "We prioritise transparency, provenance, and complete confidence with every acquisition.";

  const rawPillars = product.pillars && product.pillars.length > 0 ? product.pillars : DEFAULT_PILLARS;
  const pillars = rawPillars.slice(0, 3);

  const keySpecs = product.keySpecs && product.keySpecs.length > 0 ? product.keySpecs : DEFAULT_KEY_SPECS;

  return (
    <section className="w-full bg-[#E7DDD2] text-[#2C241E] pt-0 md:pt-1 pb-12 sm:pb-16 lg:pb-20 font-sans select-text">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* ========================================================= */}
        {/* DESKTOP VIEW (hidden md:block)                            */}
        {/* ========================================================= */}
        <div className="hidden md:block">
          {/* Top Hairline Horizontal Divider */}
          <div className="w-full h-[1px] bg-[#CDC3B5] mb-4 lg:mb-5" />

          {/* Upper Block: Heritage Narrative (Left) & Auto-Centered Pillars (Right) */}
          <div className="flex items-start justify-between gap-6 lg:gap-10 pb-1">
            {/* 7. HERITAGE NARRATIVE & MAIN STORY (Left Column) */}
            <div className="w-[42%] lg:w-[44%] shrink-0 pr-4 lg:pr-8">
              <h2 className="font-serif uppercase text-[34px] md:text-[38px] lg:text-[44px] xl:text-[48px] leading-[1.08] text-[#9D7E50] tracking-[0.015em] font-normal mb-4 whitespace-pre-line">
                {headline}
              </h2>
              <p
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
                className="text-[17px] md:text-[18px] lg:text-[19.5px] xl:text-[20px] text-[#6E5F52] leading-[1.55] max-w-[560px] lg:max-w-[620px] whitespace-pre-line"
              >
                {story}
              </p>
            </div>

            {/* 8. THE 3 PILLAR HIGHLIGHTS (UP TO 3, AUTO-CENTERED) */}
            {/* Using flex justify-center items-stretch gap-6 flex-wrap so 1, 2, or 3 cards center gracefully */}
            <div className="flex-1 flex justify-center items-stretch gap-4 lg:gap-6 flex-wrap self-stretch py-0.5">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="flex-1 min-w-[160px] max-w-[240px] px-3 lg:px-4 border-l border-r border-[#CDC3B5] text-center flex flex-col items-center justify-start"
                >
                  <h3
                    style={{ fontFamily: "var(--font-sans), sans-serif" }}
                    className="text-[17px] md:text-[18px] lg:text-[20px] xl:text-[21px] font-medium uppercase tracking-[0.14em] text-[#9D7E50] leading-snug mb-3.5 whitespace-pre-line"
                  >
                    {pillar.title}
                  </h3>
                  <p
                    style={{ fontFamily: "var(--font-sans), sans-serif" }}
                    className="text-[14.5px] md:text-[15px] lg:text-[16.5px] xl:text-[17.5px] leading-[1.6] text-[#6E5F52] max-w-[210px] lg:max-w-[230px] mx-auto whitespace-pre-line"
                  >
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider with Section Label */}
          <div className="flex items-center gap-4 mt-6 lg:mt-8 mb-4 lg:mb-5">
            <span
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
              className="italic text-[16px] lg:text-[18px] text-[#7A6753] whitespace-nowrap"
            >
              Key Specifications
            </span>
            <div className="flex-1 h-[1px] bg-[#CDC3B5]" />
          </div>

          {/* 9. KEY SPECIFICATIONS MATRIX (DYNAMIC 5-COL WRAPPING GRID) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 border-t border-[#CDC3B5] pt-6 text-center">
            {keySpecs.map((spec, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-2">
                <span
                  style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  className="text-[13px] md:text-[13.5px] lg:text-[14.5px] xl:text-[15px] uppercase tracking-[0.16em] text-[#948270] mb-2 font-medium"
                >
                  {spec.label}
                </span>
                <span
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                  className="text-[23px] lg:text-[25px] xl:text-[27px] text-[#2A241E] leading-tight font-normal"
                >
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE VIEW (block md:hidden)                             */}
        {/* ========================================================= */}
        <div className="block md:hidden px-2 sm:px-4 py-4">
          {/* Upper Block: Centered Heritage Headline & Narrative */}
          <div className="text-center pt-2 pb-5">
            <h2 className="font-serif uppercase text-[32px] sm:text-[36px] leading-[1.08] text-[#9D7E50] tracking-tight mb-3 whitespace-pre-line">
              {headline}
            </h2>
            <p
              style={{ fontFamily: "var(--font-sans), sans-serif" }}
              className="text-[15px] sm:text-[16px] text-[#6E5F52] leading-[1.55] max-w-[340px] sm:max-w-[380px] mx-auto whitespace-pre-line"
            >
              {story}
            </p>
          </div>

          {/* Full-bleed Hairline Horizontal Divider */}
          <div className="w-full h-[1px] bg-[#CDC3B5]" />

          {/* Stacked Pillars with Horizontal Dividers */}
          <div className="text-center">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="py-6 border-b border-[#CDC3B5]">
                <h3
                  style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  className="text-[17px] sm:text-[18px] font-medium uppercase tracking-[0.16em] text-[#9D7E50] mb-2.5 whitespace-pre-line"
                >
                  {pillar.title}
                </h3>
                <p
                  style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  className="text-[15px] sm:text-[16px] text-[#6E5F52] leading-[1.6] max-w-[320px] mx-auto whitespace-pre-line"
                >
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile Key Specifications Section */}
          <div className="mt-8 pt-4">
            <div className="text-center mb-6">
              <span
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
                className="italic text-[18px] text-[#7A6753]"
              >
                Key Specifications
              </span>
            </div>

            {/* Mobile Key Specs Grid */}
            <div className="grid grid-cols-2 gap-4 border-t border-[#CDC3B5] pt-6 text-center">
              {keySpecs.map((spec, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-2">
                  <span
                    style={{ fontFamily: "var(--font-sans), sans-serif" }}
                    className="text-[12px] sm:text-[13px] uppercase tracking-[0.16em] text-[#948270] mb-1.5 font-medium"
                  >
                    {spec.label}
                  </span>
                  <span
                    style={{ fontFamily: '"Times New Roman", Times, serif' }}
                    className="text-[20px] sm:text-[22px] text-[#2A241E] leading-tight font-normal"
                  >
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
