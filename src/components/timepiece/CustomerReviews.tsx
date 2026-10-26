"use client";

import React, { useState } from "react";
import { Star, Check, ChevronLeft, ChevronRight, ArrowRight, MoreVertical } from "lucide-react";

interface Review {
  id: number;
  initials: string;
  name: string;
  verified: boolean;
  date: string;
  rating: number;
  content: string;
  condition: string;
  delivery: string;
  experience: string;
  hasPhoto?: boolean;
}

const reviewsData: Review[] = [
  {
    id: 1,
    initials: "A",
    name: "Arjun Mehta",
    verified: true,
    date: "12 June 2024",
    rating: 5,
    content:
      "Absolutely stunning piece. The condition was even better than described and the entire buying experience was smooth. Highly recommended.",
    condition: "Excellent",
    delivery: "On Time",
    experience: "Exceptional",
    hasPhoto: true,
  },
  {
    id: 2,
    initials: "S",
    name: "Sarah Khan",
    verified: true,
    date: "28 April 2024",
    rating: 5,
    content:
      "A dream watch. Authentic, well packaged and exactly as shown. The team was very helpful throughout the process.",
    condition: "Excellent",
    delivery: "On Time",
    experience: "Exceptional",
    hasPhoto: false,
  },
  {
    id: 3,
    initials: "R",
    name: "Rohit Nair",
    verified: true,
    date: "19 March 2024",
    rating: 5,
    content:
      "The watch is beautiful and runs perfectly. Communication was prompt and professional. Would definitely buy again.",
    condition: "Excellent",
    delivery: "On Time",
    experience: "Very Good",
    hasPhoto: true,
  },
];

const breakdownData = [
  { stars: "5 star", count: 112, percent: 87.5 },
  { stars: "4 star", count: 12, percent: 9.4 },
  { stars: "3 star", count: 3, percent: 2.3 },
  { stars: "2 star", count: 1, percent: 0.8 },
  { stars: "1 star", count: 0, percent: 0 },
];

export default function CustomerReviews() {
  const [activeTab, setActiveTab] = useState<"all" | "photos" | "verified">("all");
  const [page, setPage] = useState(1);
  const totalPages = 9;

  const filteredReviews = reviewsData.filter((rev) => {
    if (activeTab === "photos") return rev.hasPhoto;
    if (activeTab === "verified") return rev.verified;
    return true;
  });

  return (
    <section className="w-full bg-[#E7DDD2] text-[#2C241E] pt-8 md:pt-12 pb-14 md:pb-20 font-sans select-text">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Section Title, Narrative & Rating Card      */}
          {/* ========================================================= */}
          <div className="md:col-span-5 lg:col-span-4 xl:col-span-4 flex flex-col items-center md:items-start">
            {/* Eyebrow */}
            <span className="block text-[12px] sm:text-[13px] md:text-[11px] lg:text-[12px] uppercase tracking-[0.22em] text-[#8F7D6B] font-semibold md:font-medium font-sans mb-2.5 text-center md:text-left">
              CUSTOMER REVIEWS
            </span>

            {/* Main Section Headline */}
            <h2 className="font-serif text-[38px] sm:text-[44px] md:text-[46px] lg:text-[52px] text-[#1C1A17] leading-[1.06] tracking-tight mb-3.5 font-normal text-center md:text-left">
              Trusted by<br />Collectors<br />Worldwide.
            </h2>

            {/* Narrative Subtext */}
            <p className="text-[15px] sm:text-[16px] md:text-[13.5px] lg:text-[14px] leading-relaxed text-[#5C5045] font-sans max-w-[380px] sm:max-w-[420px] md:max-w-[340px] mb-7 text-center md:text-left mx-auto md:mx-0">
              From first-time buyers to seasoned collectors, our clients value the quality, accuracy and service that come with every timepiece.
            </p>

            {/* Overall Rating Summary Card */}
            <div className="w-full max-w-[420px] md:max-w-[360px] border border-[#D4C6B3] bg-[#EDE4D9]/60 rounded-md p-5 sm:p-6 shadow-xs mx-auto md:mx-0">
              {/* Score & Stars Row */}
              <div className="flex items-start justify-between pb-4 border-b border-[#DCD1C2]/80">
                <div>
                  <span className="text-[44px] lg:text-[48px] font-serif leading-none text-[#1C1A17] font-normal block">
                    4.9
                  </span>
                  <span className="text-[11px] text-[#7A6E62] block mt-1 font-sans">
                    out of 5
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-[#9D7E50]">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} size={15} fill="#9D7E50" strokeWidth={0} />
                    ))}
                    {/* Partial 5th Star */}
                    <div className="relative inline-block">
                      <Star size={15} fill="#DCD1C2" strokeWidth={0} />
                      <div className="absolute top-0 left-0 w-[85%] overflow-hidden">
                        <Star size={15} fill="#9D7E50" strokeWidth={0} />
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#7A6E62] font-sans mt-1.5">
                    Based on 128 reviews
                  </span>
                </div>
              </div>

              {/* 5-Star Breakdown Bars */}
              <div className="space-y-2 mt-4 pt-1">
                {breakdownData.map((row) => (
                  <div key={row.stars} className="flex items-center text-[11px] text-[#7A6E62] font-sans">
                    <span className="w-10 shrink-0">{row.stars}</span>
                    <div className="flex-1 h-[5px] bg-[#DCD1C2] rounded-full overflow-hidden mx-3">
                      <div
                        className="h-full bg-[#9D7E50] rounded-full transition-all duration-500"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="w-6 text-right shrink-0">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Filter Tabs, Action Button & Review Cards   */}
          {/* ========================================================= */}
          <div className="md:col-span-7 lg:col-span-8 xl:col-span-8 flex flex-col justify-between">
            {/* Top Bar: Filters + Write a Review Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#D4C6B3]/60 mb-5">
              {/* Filter Tabs */}
              <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`text-[13px] font-sans transition-colors cursor-pointer relative pb-1 whitespace-nowrap ${
                    activeTab === "all"
                      ? "text-[#1C1A17] font-medium"
                      : "text-[#7A6E62] hover:text-[#1C1A17]"
                  }`}
                >
                  All Reviews (128)
                  {activeTab === "all" && (
                    <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-[#1C1A17]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("photos")}
                  className={`text-[13px] font-sans transition-colors cursor-pointer relative pb-1 whitespace-nowrap ${
                    activeTab === "photos"
                      ? "text-[#1C1A17] font-medium"
                      : "text-[#7A6E62] hover:text-[#1C1A17]"
                  }`}
                >
                  With Photos (24)
                  {activeTab === "photos" && (
                    <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-[#1C1A17]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("verified")}
                  className={`text-[13px] font-sans transition-colors cursor-pointer relative pb-1 whitespace-nowrap ${
                    activeTab === "verified"
                      ? "text-[#1C1A17] font-medium"
                      : "text-[#7A6E62] hover:text-[#1C1A17]"
                  }`}
                >
                  Verified Buyers (128)
                  {activeTab === "verified" && (
                    <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-[#1C1A17]" />
                  )}
                </button>
              </div>

              {/* Write a Review Button */}
              <button
                type="button"
                className="bg-[#6D5333] hover:bg-[#574227] active:bg-[#48361f] text-white text-[12px] font-sans font-medium px-4 py-2.5 rounded-[3px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer tracking-wider uppercase shrink-0"
              >
                <span>Write a Review</span>
                <ArrowRight size={13} strokeWidth={2} />
              </button>
            </div>

            {/* Review Cards Stack */}
            <div className="space-y-4 mb-6">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-[#D4C6B3] bg-[#EDE4D9]/80 rounded-[6px] p-5 sm:p-6 transition-all hover:border-[#BDB09F] shadow-2xs"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Initials Avatar */}
                      <div className="w-9 h-9 rounded-full bg-[#D8CCBD] text-[#3D3328] font-sans font-medium flex items-center justify-center text-[13px] shrink-0 border border-[#CDC1B0]">
                        {review.initials}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-sans font-semibold text-[14px] text-[#1C1A17]">
                            {review.name}
                          </span>
                          {review.verified && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-[#7A6E62] font-medium font-sans">
                              <span className="w-3.5 h-3.5 rounded-full bg-[#8A7558] flex items-center justify-center text-white">
                                <Check size={9} strokeWidth={3} />
                              </span>
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#9E9081] font-sans block mt-0.5">
                          {review.date}
                        </span>
                      </div>
                    </div>

                    {/* Stars & Context Menu */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-[#9D7E50]">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={13} fill="#9D7E50" strokeWidth={0} />
                        ))}
                      </div>
                      <button
                        type="button"
                        aria-label="More options"
                        className="text-[#9E9081] hover:text-[#1C1A17] transition-colors p-0.5 cursor-pointer"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Body Review Quote */}
                  <p className="text-[13.5px] lg:text-[14px] text-[#2E2720] font-sans leading-[1.6] my-3.5">
                    {review.content}
                  </p>

                  {/* Metadata Tags Row */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-[#7A6E62] font-sans pt-1">
                    <span>
                      Condition: <strong className="font-semibold text-[#1C1A17]">{review.condition}</strong>
                    </span>
                    <span className="text-[#CDC3B5]">|</span>
                    <span>
                      Delivery: <strong className="font-semibold text-[#1C1A17]">{review.delivery}</strong>
                    </span>
                    <span className="text-[#CDC3B5]">|</span>
                    <span>
                      Overall Experience: <strong className="font-semibold text-[#1C1A17]">{review.experience}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row: View All Reviews & Pagination Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                className="text-[11.5px] lg:text-[12px] uppercase tracking-widest text-[#4A3E32] font-semibold hover:text-[#1C1A17] flex items-center gap-1.5 transition-colors cursor-pointer group"
              >
                <span>View All Reviews</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Page Counter & Navigation */}
              <div className="flex items-center gap-2 text-[12px] font-sans font-medium text-[#4A3E32]">
                <button
                  type="button"
                  aria-label="Previous page"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-7 h-7 rounded-full border border-[#CDC3B5] flex items-center justify-center text-[#4A3E32] hover:border-[#1C1A17] hover:bg-black/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>

                <span className="px-1 text-[12px] text-[#4A3E32]">
                  {page} / {totalPages}
                </span>

                <button
                  type="button"
                  aria-label="Next page"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-7 h-7 rounded-full border border-[#CDC3B5] flex items-center justify-center text-[#4A3E32] hover:border-[#1C1A17] hover:bg-black/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
