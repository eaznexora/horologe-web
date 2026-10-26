"use client";

import React, { useState } from "react";

const faqItems = [
  {
    id: 1,
    question: "Are all your timepieces authenticated?",
    answer:
      "Yes. Every timepiece is carefully examined and authenticated by our experts before being offered to our clients. We prioritise transparency, provenance, and complete confidence with every acquisition.",
  },
  {
    id: 2,
    question: "Are all your timepieces authenticated?",
    answer:
      "Every watch undergoes a rigorous multi-point inspection to ensure full provenance, mechanical integrity, and authentic component originality.",
  },
  {
    id: 3,
    question: "Are all your timepieces authenticated?",
    answer:
      "We provide comprehensive documentation and certificates of authenticity with every purchase, guaranteed by our horological specialists.",
  },
  {
    id: 4,
    question: "Are all your timepieces authenticated?",
    answer:
      "Our master watchmakers thoroughly verify serial numbers, movement calibers, and case hallmarks before any timepiece enters our collection.",
  },
  {
    id: 5,
    question: "Are all your timepieces authenticated?",
    answer:
      "We stand behind every piece with our lifetime authenticity guarantee, ensuring absolute peace of mind for collectors and enthusiasts alike.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full bg-[#E7DDD2] relative overflow-hidden">
      {/* =========================================
          DESKTOP VIEW (hidden md:flex)
          ========================================= */}
      <div className="hidden md:flex w-full items-stretch overflow-hidden">
        {/* Left Column (Storefront Visual - preserved exactly) */}
        <div className="w-[28%] lg:w-[30%] xl:w-[29%] max-w-[380px] lg:max-w-[420px] relative self-stretch select-none flex-shrink-0">
          <img
            src="/assets/FAQS-desktop.png"
            alt="Horologe Royale Storefront"
            className="w-full h-full object-cover object-center block"
          />
        </div>

        {/* Right Column: FAQ Content */}
        {/* pl-6 lg:pl-8 xl:pl-10 moves text left; pr-0 lets divider line touch right screen border */}
        {/* pt-6 lg:pt-8 and justify-start move text up and ensure no text surpasses image bottom */}
        <div className="flex-1 bg-[#E7DDD2] pl-6 lg:pl-8 xl:pl-10 pr-0 pt-6 lg:pt-8 pb-4 flex flex-col justify-start">
          {/* Section Header (scaled 50% more, moved up and left) */}
          <h2 className="font-serif font-normal uppercase tracking-tight leading-[0.98] text-[54px] lg:text-[66px] xl:text-[72px] mb-4 lg:mb-5">
            <span className="block text-[#1C1A17]">FREQUENTLY ASKED</span>
            <span className="block text-[#9D7E50]">QUESTIONS</span>
          </h2>

          {/* Accordion List (w-full so divider lines touch right border screen) */}
          <div className="w-full">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={item.id}
                  className="w-full border-b-[1.5px] border-[#B89658] transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className="w-full text-left py-2.5 lg:py-3 pr-8 lg:pr-14 flex items-center justify-between cursor-pointer focus:outline-none group select-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[23px] lg:text-[26px] font-sans font-normal text-[#1C1A17] tracking-tight leading-snug group-hover:text-[#9D7E50] transition-colors duration-200">
                      {item.question}
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[17px] lg:text-[19px] font-sans text-[#3D352E] leading-relaxed pt-1 pb-3 pr-8 lg:pr-16 max-w-[760px]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================
          MOBILE VIEW (block md:hidden)
          ========================================= */}
      <div className="block md:hidden w-full">
        {/* Top: Storefront Image */}
        <div className="w-full h-[260px] sm:h-[300px] overflow-hidden select-none">
          <img
            src="/assets/FAQS-mobile.png"
            alt="Horologe Royale Storefront"
            className="w-full h-full object-cover object-top block"
          />
        </div>

        {/* Bottom: FAQ Content */}
        <div className="px-5 pt-7 pb-10 bg-[#E7DDD2]">
          {/* Section Header: FREQUENTLY on line 1, ASKED QUESTIONS on line 2 */}
          <h2 
            className="font-serif font-normal uppercase tracking-tight mb-6 text-[43px]"
            style={{ fontSize: '43px', lineHeight: 1.04 }}
          >
            <span className="block text-[#1C1A17]">FREQUENTLY</span>
            <span className="text-[#1C1A17]">ASKED </span>
            <span className="text-[#9D7E50]">QUESTIONS</span>
          </h2>

          {/* Accordion List */}
          <div className="w-full">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={item.id}
                  className="w-full border-b-[1.5px] border-[#B89658] transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className="w-full text-left py-4 flex items-center justify-between cursor-pointer focus:outline-none select-none"
                    aria-expanded={isOpen}
                  >
                    <span 
                      className="font-sans font-normal text-[#1C1A17] tracking-tight text-[27px]"
                      style={{ fontSize: '27px', lineHeight: 1.25 }}
                    >
                      {item.question}
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p 
                        className="font-sans text-[#3D352E] leading-relaxed pt-2 pb-5 text-[22px]"
                        style={{ fontSize: '22px', lineHeight: 1.5 }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
