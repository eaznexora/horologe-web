"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface SerializedArticle {
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: string;
  author?: string;
  pullQuote?: string;
  content: string[];
  featured?: boolean;
}

interface InsightsClientViewProps {
  categories: string[];
  articles: SerializedArticle[];
  banners?: Record<
    string,
    { desktopUrl: string; mobileUrl: string; linkUrl: string; mediaType: "image" | "video" }
  >;
}

export default function InsightsClientView({
  categories,
  articles,
  banners,
}: InsightsClientViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL STORIES");
  const [activePage, setActivePage] = useState<number>(1);

  const bottomBanner = banners?.["insights-bottom"];
  const bottomDesktopUrl = bottomBanner?.desktopUrl?.trim() || "/assets/CTA-desktop.png";
  const bottomMobileUrl = bottomBanner?.mobileUrl?.trim() || bottomDesktopUrl;
  const bottomLinkUrl = bottomBanner?.linkUrl?.trim() || "/collections";
  const bottomMediaType = bottomBanner?.mediaType || "image";

  // All dynamic categories starting with "ALL STORIES"
  const allCategoryTabs = ["ALL STORIES", ...categories.filter((c) => c !== "ALL STORIES")];

  // Separate featured article
  const featuredArticle =
    articles.find((a) => a.featured) || articles[0];

  // Filter journal articles
  const filteredArticles =
    activeCategory === "ALL STORIES"
      ? articles
      : articles.filter((a) => a.category.toUpperCase() === activeCategory.toUpperCase());

  // Show featured card if activeCategory is ALL STORIES or matches featured category
  const showFeatured =
    featuredArticle &&
    (activeCategory === "ALL STORIES" ||
      featuredArticle.category.toUpperCase() === activeCategory.toUpperCase());

  // Exclude featured article from the 3-column grid when on "ALL STORIES" to avoid repetition
  const gridArticles =
    activeCategory === "ALL STORIES"
      ? filteredArticles.filter((a) => a.slug !== featuredArticle?.slug)
      : filteredArticles;

  const handleNextPage = () => {
    setActivePage((prev) => (prev < 3 ? prev + 1 : 1));
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* SECTION 2: DYNAMIC CATEGORY FILTER BAR                                    */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#FAF6F0] border-y border-[#DFCFC0] sticky top-0 z-30 backdrop-blur-md bg-[#FAF6F0]/95">
        <div className="max-w-7xl mx-auto py-3.5 sm:py-4">
          <nav className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar whitespace-nowrap px-5 sm:px-8 gap-1 sm:gap-2 text-xs uppercase tracking-[0.18em]">
            {allCategoryTabs.map((cat, idx) => {
              const isActive = activeCategory.toUpperCase() === cat.toUpperCase();
              return (
                <React.Fragment key={cat}>
                  <button
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 transition-all duration-200 cursor-pointer select-none relative shrink-0 ${
                      isActive
                        ? "font-bold text-[#2C241E]"
                        : "font-medium text-[#7A6C5E] hover:text-[#2C241E]"
                    }`}
                  >
                    <span>{cat}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#9D7E50]" />
                    )}
                  </button>

                  {idx < allCategoryTabs.length - 1 && (
                    <span className="text-[#DFCFC0] select-none px-1 text-sm shrink-0">
                      |
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12 sm:space-y-16">
        {/* ======================================================================= */}
        {/* SECTION 3: FEATURED LEAD STORY CARD                                     */}
        {/* ======================================================================= */}
        {showFeatured && featuredArticle && (
          <section className="w-full">
            <div className="border border-[#DFCFC0] bg-[#FAF6F0] rounded-none grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-none group">
              {/* Left Column: Master Watchmaker at Bench */}
              <Link
                href={`/insights/${featuredArticle.slug}`}
                className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto lg:min-h-[380px] overflow-hidden cursor-pointer block bg-[#EFE8DD]"
              >
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
              </Link>

              {/* Right Column: Editorial Typography */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-[#FAF6F0]">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] mb-4">
                  <span className="font-semibold text-[#9D7E50]">
                    {featuredArticle.category}
                  </span>
                  <span className="text-[#C6B29A]">&bull;</span>
                  <span className="font-['Times_New_Roman',serif] text-[#8C7A6B] tracking-wider text-[13px]">
                    {featuredArticle.date}
                  </span>
                </div>

                <Link href={`/insights/${featuredArticle.slug}`} className="block">
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-[#1C1A17] uppercase tracking-tight leading-[1.1] mb-4 hover:text-[#9D7E50] transition-colors cursor-pointer break-words">
                    {featuredArticle.title}
                  </h2>
                </Link>

                <p className="text-sm sm:text-base text-[#6C5E52] leading-relaxed mb-6 font-sans break-words">
                  {featuredArticle.excerpt}
                </p>

                <Link
                  href={`/insights/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2C241E] hover:text-[#9D7E50] transition-colors cursor-pointer group/cta self-start"
                >
                  <span>READ STORY</span>
                  <span className="group-hover/cta:translate-x-1.5 transition-transform duration-200">
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================================= */}
        {/* SECTION 4: "THE JOURNAL" 3-COLUMN EDITORIAL GRID                         */}
        {/* ======================================================================= */}
        <section className="w-full space-y-8">
          {/* Header: Centered with Editorial Hairlines */}
          <div className="flex items-center justify-center my-6">
            <div className="h-[1px] bg-[#DFCFC0] flex-1 max-w-[120px] sm:max-w-[200px]" />
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase text-[#1C1A17] px-6 text-center">
              THE JOURNAL
            </h2>
            <div className="h-[1px] bg-[#DFCFC0] flex-1 max-w-[120px] sm:max-w-[200px]" />
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {gridArticles.map((article) => (
              <article
                key={article.slug}
                className="border border-[#DFCFC0] bg-[#FAF6F0] rounded-none overflow-hidden flex flex-col justify-between group hover:border-[#9D7E50]/70 transition-all duration-300"
              >
                <div>
                  {/* Card Photograph */}
                  <Link
                    href={`/insights/${article.slug}`}
                    className="relative aspect-[16/10] w-full overflow-hidden cursor-pointer bg-[#EFE8DD] block"
                  >
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </Link>

                  {/* Card Lower Copy */}
                  <div className="p-5 sm:p-6 pb-4">
                    {/* Meta Line */}
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] mb-2.5">
                      <span className="font-semibold text-[#9D7E50]">
                        {article.category}
                      </span>
                      <span className="text-[#C6B29A]">&bull;</span>
                      <span className="font-['Times_New_Roman',serif] text-[#8C7A6B] text-[12px] tracking-wider">
                        {article.date}
                      </span>
                    </div>

                    {/* Story Headline */}
                    <Link href={`/insights/${article.slug}`} className="block">
                      <h3 className="font-serif text-lg sm:text-[19px] lg:text-[20px] text-[#1C1A17] font-normal leading-snug tracking-tight hover:text-[#9D7E50] transition-colors cursor-pointer break-words">
                        {article.title}
                      </h3>
                    </Link>
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="px-5 sm:px-6 pb-5 pt-0">
                  <Link
                    href={`/insights/${article.slug}`}
                    className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2C241E] hover:text-[#9D7E50] transition-colors cursor-pointer group/link"
                  >
                    <span>READ MORE</span>
                    <span className="group-hover/link:translate-x-1.5 transition-transform duration-200">
                      &rarr;
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {gridArticles.length === 0 && !showFeatured && (
            <div className="text-center py-12 border border-dashed border-[#DFCFC0] p-8">
              <p className="text-sm text-[#7A6C5E] uppercase tracking-wider">
                No stories found for this category.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory("ALL STORIES")}
                className="mt-4 text-xs font-semibold uppercase tracking-widest text-[#5C4529] underline cursor-pointer"
              >
                View All Stories
              </button>
            </div>
          )}
        </section>

        {/* ======================================================================= */}
        {/* SECTION 5: FULL-WIDTH DARK HOROLOGY BANNER                              */}
        {/* ======================================================================= */}
        <section className="w-full">
          <div className="w-full bg-[#1C1713] text-[#FAF6F0] rounded-none relative overflow-hidden border border-[#2C241E]">
            {/* Right Background Image with Smooth Gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[65%] lg:w-[58%] select-none pointer-events-none">
              <div className="relative w-full h-full">
                {bottomMediaType === "video" ? (
                  <video
                    src={bottomDesktopUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-right"
                  />
                ) : (
                  <picture className="w-full h-full">
                    {bottomBanner?.mobileUrl?.trim() && (
                      <source media="(max-width: 639px)" srcSet={bottomMobileUrl} />
                    )}
                    <img
                      src={bottomDesktopUrl}
                      alt="Gold Luxury Timepiece with Bracelet"
                      className="w-full h-full object-cover object-right"
                    />
                  </picture>
                )}
                <div className="absolute inset-y-0 left-0 w-32 sm:w-56 bg-gradient-to-r from-[#1C1713] via-[#1C1713]/85 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Left Copy Block */}
            <div className="p-7 sm:p-10 lg:px-12 lg:py-11 relative z-10 max-w-xl">
              <h3 className="font-serif uppercase tracking-tight text-2xl sm:text-3xl lg:text-[34px] leading-tight text-[#FAF6F0] mb-4">
                EXPLORE THE ART OF HOROLOGY
              </h3>

              <Link
                href={bottomLinkUrl}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#C6B29A] hover:text-[#FAF6F0] transition-colors group/cta"
              >
                <span>DISCOVER OUR COLLECTION</span>
                <span className="group-hover/cta:translate-x-1.5 transition-transform duration-200">
                  &rarr;
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 6: EDITORIAL PAGINATION BAR                                     */}
        {/* ======================================================================= */}
        <section className="py-6 sm:py-8 flex items-center justify-center gap-6 sm:gap-8 text-xs tracking-[0.2em] border-t border-[#DFCFC0]/60">
          {[1, 2, 3].map((page) => {
            const isActive = activePage === page;
            const formattedPage = String(page).padStart(2, "0");
            return (
              <button
                key={page}
                type="button"
                onClick={() => setActivePage(page)}
                className={`font-['Times_New_Roman',serif] text-sm sm:text-base transition-colors cursor-pointer select-none pb-1 relative ${
                  isActive
                    ? "font-bold text-[#2C241E]"
                    : "text-[#8C7A6B] hover:text-[#2C241E]"
                }`}
              >
                <span>{formattedPage}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#9D7E50]" />
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleNextPage}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#2C241E] hover:text-[#9D7E50] transition-colors cursor-pointer select-none"
          >
            <span>NEXT</span>
            <span>&rarr;</span>
          </button>
        </section>
      </div>
    </>
  );
}

