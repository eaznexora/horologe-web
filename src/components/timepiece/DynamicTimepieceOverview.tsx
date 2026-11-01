"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Share2, ArrowLeft, ArrowRight, Check } from "lucide-react";

export interface DynamicTimepieceData {
  _id?: string;
  name: string;
  slug: string;
  images: string[];
  minorSpecs: string[];
  category?: { name: string; slug: string } | string;
  subCategory?: { name: string; slug: string } | string;
  watchCategory?: { name: string; slug: string } | string;
  conditionBadge: string;
  gradeBadge: string;
  scopeBadge: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  heritageHeadline: string;
  heritageStory: string;
  pillars: { title: string; description: string }[];
  keySpecs: { label: string; value: string }[];
}

// Helper to format currency in Indian format
export function formatINR(val?: number, includeDecimals = true): string {
  if (val === undefined || val === null || isNaN(val)) return "₹0.00";
  const numStr = Math.floor(val).toString();
  let lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  const formattedWhole =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return includeDecimals ? `₹${formattedWhole}.00` : `₹${formattedWhole}`;
}

export default function DynamicTimepieceOverview({
  product,
}: {
  product: DynamicTimepieceData;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showPriceInfo, setShowPriceInfo] = useState(false);

  // Normalize images to exactly 4 items with fallback to /logo.png
  const images = (product.images || []).filter(Boolean);
  const normalizedImages: string[] = [];
  for (let i = 0; i < 4; i++) {
    normalizedImages.push(images[i] || "/logo.png");
  }

  const handlePrevImage = () => {
    setActiveImageIndex(
      (prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % normalizedImages.length);
  };

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | Horologe Royale`,
          text: product.tagline || `Explore this ${product.name} at Horologe Royale.`,
          url: window.location.href,
        });
        return;
      } catch {
        // User dismissed share sheet
      }
    }

    if (typeof window !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        // Fallback silently
      }
    }
  };

  const currentImage = normalizedImages[activeImageIndex] || "/logo.png";

  // Category name display
  const categoryName =
    typeof product.category === "object" && product.category?.name
      ? product.category.name
      : typeof product.category === "string"
      ? product.category
      : product.conditionBadge || "Preowned";

  // Minor specs display
  const minorSpecsText =
    product.minorSpecs && product.minorSpecs.length > 0
      ? product.minorSpecs.slice(0, 3).join("  |  ")
      : "Chronograph  |  Automatic";

  // Dual pricing calculation
  const price = product.price || 0;
  const originalPrice = product.originalPrice;
  const hasSavings = originalPrice && originalPrice > price;
  const savingsAmount = hasSavings ? originalPrice - price : 0;

  return (
    <section className="w-full bg-[#E7DDD2] text-[#2C241E] pt-6 sm:pt-10 lg:pt-14 pb-2 md:pb-3 lg:pb-4 font-sans select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* ========================================================= */}
          {/* 1. LEFT MEDIA GALLERY (EXACTLY 4 SLOTS & FALLBACK)        */}
          {/* ========================================================= */}

          {/* 1A. DESKTOP GALLERY — Landscape Frame with 4 Vertical Overlaid Thumbnails */}
          <div className="hidden md:block w-[55%] lg:w-[56%] xl:w-[57%] md:-ml-4 lg:-ml-8 h-[410px] lg:h-[440px] relative overflow-hidden bg-black shadow-md">
            {/* Main Watch Image */}
            <img
              src={currentImage}
              alt={`${product.name} - View ${activeImageIndex + 1}`}
              className="w-full h-full object-cover object-[25%_center]"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src !== "/logo.png") target.src = "/logo.png";
              }}
            />

            {/* 4 Small Thumbnails Overlaid on the Left of the Big Image */}
            <div className="absolute left-[48px] lg:left-[52px] top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2.5 lg:gap-3 w-[72px] lg:w-[80px]">
              {normalizedImages.map((imgSrc, idx) => {
                const isActive = idx === activeImageIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`relative w-full aspect-square overflow-hidden transition-all duration-200 cursor-pointer shadow-md bg-[#2C241E] ${
                      isActive
                        ? "border-2 border-white ring-1 ring-black/40 scale-105"
                        : "border border-white/50 hover:border-white opacity-85 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgSrc}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src !== "/logo.png") target.src = "/logo.png";
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Navigation Arrows at bottom-right of image frame */}
            <div className="absolute bottom-5 right-5 flex gap-2.5 z-10">
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous timepiece photo"
                className="w-10 h-10 rounded-full border border-white/30 bg-black/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/60 active:scale-95 transition-all cursor-pointer"
              >
                <ArrowLeft size={18} strokeWidth={1.8} />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next timepiece photo"
                className="w-10 h-10 rounded-full border border-white/30 bg-black/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/60 active:scale-95 transition-all cursor-pointer"
              >
                <ArrowRight size={18} strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* 1B. MOBILE GALLERY */}
          <div className="flex flex-col md:hidden w-full mb-5">
            {/* Main Visual Frame */}
            <div className="relative w-full h-[360px] sm:h-[420px] overflow-hidden bg-[#D8CBBA]/40">
              <img
                src={currentImage}
                alt={`${product.name} - View ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== "/logo.png") target.src = "/logo.png";
                }}
              />

              {/* Mobile Floating Share Icon */}
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share timepiece"
                className="absolute top-4 right-4 z-10 text-white p-2.5 rounded-full bg-black/25 backdrop-blur-xs hover:bg-black/40 transition-colors cursor-pointer"
              >
                {copied ? <Check size={20} className="text-[#E7DDD2]" /> : <Share2 size={20} />}
              </button>

              {/* Mobile Floating Navigation Arrows */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/15 shadow-lg">
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous timepiece photo"
                  className="w-9 h-9 rounded-full border border-white/35 text-white flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
                >
                  <ArrowLeft size={16} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next timepiece photo"
                  className="w-9 h-9 rounded-full border border-white/35 text-white flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
                >
                  <ArrowRight size={16} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            {/* Mobile Thumbnails Row Below Main Image */}
            <div className="grid grid-cols-4 gap-2 mt-3 px-1 sm:px-0">
              {normalizedImages.map((imgSrc, idx) => {
                const isActive = idx === activeImageIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`relative aspect-square w-full overflow-hidden transition-all duration-200 cursor-pointer bg-[#2C241E] ${
                      isActive
                        ? "border border-[#6D5333] shadow-xs"
                        : "border border-transparent opacity-85 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgSrc}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src !== "/logo.png") target.src = "/logo.png";
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. RIGHT DETAILS SECTION                                  */}
          {/* ========================================================= */}
          <div className="w-full md:w-[45%] lg:w-[44%] xl:w-[43%] flex flex-col justify-between pl-0 md:pl-7 lg:pl-10 py-0.5 relative">
            {/* Top Details Block */}
            <div>
              {/* Desktop Share Icon at top-right corner of this column */}
              <div className="hidden md:block absolute top-0.5 right-0 z-10">
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share timepiece"
                  className="text-[#4A3E31] hover:text-black transition-colors p-1 cursor-pointer flex items-center gap-1.5 text-xs"
                >
                  {copied ? (
                    <span className="flex items-center gap-1 text-[#6D5333] font-medium text-sm">
                      <Check size={22} /> Copied!
                    </span>
                  ) : (
                    <Share2 size={26} className="w-6.5 h-6.5 lg:w-7 lg:h-7" strokeWidth={1.7} />
                  )}
                </button>
              </div>

              {/* 2. MAIN PRODUCT NAME — High-contrast editorial uppercase serif */}
              <h1 className="font-serif uppercase text-[#5C4831] text-[30px] sm:text-[34px] md:text-[38px] lg:text-[46px] leading-[1.04] tracking-tight font-normal mb-1.5 sm:mb-2 pr-8 md:pr-10">
                {product.name}
              </h1>

              {/* 3. MINOR SPECIFICATIONS (MAX 3 ITEMS) */}
              <p className="text-[13px] md:text-[16px] lg:text-[18px] text-[#7A6E63] font-sans mb-2.5 sm:mb-3 tracking-normal">
                {minorSpecsText}
              </p>

              {/* 4. THE CATEGORY TRIAD (STATUS & PILLS) */}
              <div className="flex flex-wrap items-center gap-2 md:gap-2.5 mb-2.5 sm:mb-3">
                {/* Status 1: Category / Condition (Solid bronze) */}
                <span className="bg-[#6D5333] text-white text-[14px] md:text-[15px] lg:text-[16px] px-4 md:px-5 h-[38px] md:h-[42px] font-medium leading-none inline-flex items-center justify-center">
                  {categoryName}
                </span>
                {/* Status 2: Condition Grade Badge (Soft cream) */}
                <span className="bg-[#D4C5B3] text-[#332A20] text-[14px] md:text-[15px] lg:text-[16px] px-4 md:px-5 h-[38px] md:h-[42px] font-medium leading-none inline-flex items-center justify-center">
                  {product.gradeBadge || "Excellent Condition"}
                </span>
                {/* Status 3: Scope of Delivery Badge (Soft cream) */}
                <span className="bg-[#D4C5B3] text-[#332A20] text-[14px] md:text-[15px] lg:text-[16px] px-4 md:px-5 h-[38px] md:h-[42px] font-medium leading-none inline-flex items-center justify-center">
                  {product.scopeBadge || "Full Set"}
                </span>
              </div>

              {/* 5. THE ONE-LINER PUNCHLINE */}
              {product.tagline && (
                <p className="text-[13px] md:text-[16px] lg:text-[17px] text-[#4A423A] leading-relaxed mb-3 sm:mb-3.5 font-sans">
                  {product.tagline}
                </p>
              )}

              {/* 6. DUAL PRICING & AUTOMATIC SAVINGS */}
              <div className="relative mb-2 sm:mb-2.5">
                {/* Desktop Pricing Row */}
                <div
                  className="hidden md:flex items-center flex-nowrap whitespace-nowrap gap-3 sm:gap-4 overflow-visible select-none"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {/* Selling Price + Info Trigger */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[32px] sm:text-[38px] lg:text-[44px] text-[#6D5333] leading-none tracking-tight font-normal">
                      {formatINR(price, true)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPriceInfo(!showPriceInfo)}
                      onMouseEnter={() => setShowPriceInfo(true)}
                      onMouseLeave={() => setShowPriceInfo(false)}
                      aria-label="Price Details"
                      className="cursor-pointer flex items-center justify-center transition-transform hover:scale-105"
                    >
                      <svg
                        className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] fill-[#6D5333]"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Slashed Original Price */}
                  {hasSavings && (
                    <span className="text-[23px] sm:text-[26px] lg:text-[29px] text-[#9E8E7D] line-through font-normal shrink-0">
                      {formatINR(originalPrice, true)}
                    </span>
                  )}

                  {/* Savings Badge */}
                  {hasSavings && (
                    <span className="bg-[#6D5333] text-white text-[15px] sm:text-[16px] lg:text-[17px] font-normal px-4.5 sm:px-5 h-[40px] md:h-[42px] rounded-none shrink-0 leading-none tracking-normal inline-flex items-center justify-center">
                      Save {formatINR(savingsAmount, false)}
                    </span>
                  )}
                </div>

                {/* Mobile Pricing Block */}
                <div
                  className="flex md:hidden flex-col gap-2 w-full select-none"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[44px] sm:text-[48px] text-[#6D5333] leading-none tracking-tight font-normal">
                      {formatINR(price, true)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPriceInfo(!showPriceInfo)}
                      aria-label="Price Details"
                      className="cursor-pointer flex items-center justify-center p-0.5"
                    >
                      <svg
                        className="w-[22px] h-[22px] fill-[#6D5333]"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  {hasSavings && (
                    <div className="flex items-center justify-between w-full pt-1">
                      <span className="text-[28px] sm:text-[30px] text-[#9E8E7D] line-through font-normal">
                        {formatINR(originalPrice, true)}
                      </span>
                      <span className="bg-[#6D5333] text-white text-[16px] font-normal px-4 h-[42px] rounded-none leading-none tracking-normal inline-flex items-center justify-center">
                        Save {formatINR(savingsAmount, false)}
                      </span>
                    </div>
                  )}
                </div>

                {showPriceInfo && (
                  <div className="absolute left-0 top-full mt-2 z-20 w-80 bg-[#DDD1C1] border border-[#BFAFA0] p-3 text-xs md:text-sm text-[#3E342B] shadow-lg animate-in fade-in duration-200">
                    <p className="leading-snug">
                      Price inclusive of all applicable luxury taxes, comprehensive mechanical inspection, and guaranteed horological certification.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Details Block: Trust Strip + Action Buttons */}
            <div>
              {/* Trust Verification Strip */}
              <div className="border-t border-[#CDC3B5] md:border-b py-3 md:py-2.5 my-3 md:my-2">
                <div className="grid grid-cols-3 divide-x divide-[#CDC3B5] text-center">
                  <div className="flex flex-col items-center justify-center px-1 md:px-2">
                    <div className="h-6 md:h-8 lg:h-9 flex items-center justify-center">
                      <img
                        src="/assets/varified.png"
                        alt="100% Authentic"
                        className="h-6 md:h-8 lg:h-9 w-auto max-w-[32px] md:max-w-[34px] lg:max-w-[38px] object-contain"
                      />
                    </div>
                    <span className="text-[11px] md:text-[14px] lg:text-[15px] text-[#3E342B] font-medium tracking-wide mt-1 leading-tight">
                      100% Authentic
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center px-1 md:px-2">
                    <div className="h-6 md:h-8 lg:h-9 flex items-center justify-center">
                      <img
                        src="/assets/authentic.png"
                        alt="Vault Verified"
                        className="h-6 md:h-8 lg:h-9 w-auto max-w-[32px] md:max-w-[34px] lg:max-w-[38px] object-contain"
                      />
                    </div>
                    <span className="text-[11px] md:text-[14px] lg:text-[15px] text-[#3E342B] font-medium tracking-wide mt-1 leading-tight">
                      100% Authentic
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center px-1 md:px-2">
                    <div className="h-6 md:h-8 lg:h-9 flex items-center justify-center">
                      <img
                        src="/assets/shipping.png"
                        alt="All Over India Delivery"
                        className="h-6 md:h-8 lg:h-9 w-auto max-w-[32px] md:max-w-[34px] lg:max-w-[38px] object-contain"
                      />
                    </div>
                    <span className="text-[11px] md:text-[14px] lg:text-[15px] text-[#3E342B] font-medium tracking-wide mt-1 leading-tight">
                      All Over India Delivery
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 md:gap-3.5 mt-3 md:mt-3.5">
                <button
                  type="button"
                  className="h-[48px] md:h-[52px] lg:h-[56px] border border-[#6D5333] text-[#5C4831] hover:bg-[#6D5333]/10 active:bg-[#6D5333]/20 font-medium flex items-center justify-center transition-colors cursor-pointer text-[14px] md:text-[16px] font-sans tracking-wide"
                >
                  Enquire
                </button>
                <button
                  type="button"
                  className="h-[48px] md:h-[52px] lg:h-[56px] bg-[#6D5333] hover:bg-[#574227] active:bg-[#4d3820] text-white font-medium flex items-center justify-center transition-colors cursor-pointer text-[14px] md:text-[16px] font-sans tracking-wide"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
