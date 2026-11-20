import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { connectToDatabase } from "@/lib/mongodb";
import { InsightArticle } from "@/models/InsightArticle";
import { SiteBanner } from "@/models/SiteBanner";
import {
  getArticleBySlug,
  getRelatedArticles,
  INSIGHTS_ARTICLES,
} from "@/data/insightsArticles";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchArticle(slug: string) {
  const normalizedSlug = slug.toLowerCase().trim();

  try {
    await connectToDatabase();
    const liveArticle = await InsightArticle.findOne({
      slug: normalizedSlug,
      status: "published",
    }).lean();

    if (liveArticle) {
      return {
        slug: (liveArticle as any).slug,
        title: (liveArticle as any).title,
        category: (liveArticle as any).category,
        date: (liveArticle as any).date,
        readTime: (liveArticle as any).readTime || "5 MIN READ",
        excerpt: (liveArticle as any).excerpt,
        image: (liveArticle as any).image,
        author: (liveArticle as any).author || "Horologe Royale Editorial Desk",
        pullQuote: (liveArticle as any).pullQuote || "",
        content: Array.isArray((liveArticle as any).content) ? (liveArticle as any).content : [],
        featured: Boolean((liveArticle as any).featured),
      };
    }
  } catch (err) {
    console.warn("MongoDB fetch error for insight slug, using local fallback:", err);
  }

  // Fallback to static articles
  return getArticleBySlug(normalizedSlug);
}

async function fetchRelatedArticles(currentSlug: string, count = 3) {
  const normalizedSlug = currentSlug.toLowerCase().trim();

  try {
    await connectToDatabase();
    const liveRelated = await InsightArticle.find({
      slug: { $ne: normalizedSlug },
      status: "published",
    })
      .sort({ createdAt: -1 })
      .limit(count)
      .lean();

    if (liveRelated && liveRelated.length > 0) {
      return liveRelated.map((art: any) => ({
        slug: art.slug,
        title: art.title,
        category: art.category,
        date: art.date,
        readTime: art.readTime || "5 MIN READ",
        excerpt: art.excerpt,
        image: art.image,
      }));
    }
  } catch (err) {
    console.warn("MongoDB fetch error for related insights, using local fallback:", err);
  }

  // Fallback to static articles
  return getRelatedArticles(normalizedSlug, count);
}

async function fetchArticleBanner() {
  try {
    await connectToDatabase();
    const banner = await SiteBanner.findOne({
      page: "insights",
      slotKey: "insights-article-bottom",
    }).lean();

    if (banner) {
      return {
        desktopUrl: (banner as any).desktopUrl || "",
        mobileUrl: (banner as any).mobileUrl || "",
        linkUrl: (banner as any).linkUrl || "",
        mediaType: ((banner as any).mediaType as "image" | "video") || "image",
      };
    }
  } catch (err) {
    console.warn("MongoDB fetch error for article banner, using fallback:", err);
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found | Horologe Royale Journal",
      description: "The requested editorial story could not be located in our archives.",
    };
  }

  return {
    title: `${article.title} | Horologe Royale Journal`,
    description: article.excerpt,
    alternates: {
      canonical: `/insights/${article.slug}`,
    },
    openGraph: {
      title: `${article.title} | Horologe Royale Journal`,
      description: article.excerpt,
      images: [
        {
          url: article.image,
          alt: article.title,
        },
      ],
    },
  };
}

export default async function InsightArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) {
    notFound();
  }

  const [relatedArticles, articleBanner] = await Promise.all([
    fetchRelatedArticles(article.slug, 3),
    fetchArticleBanner(),
  ]);

  const bannerMedia = articleBanner?.desktopUrl?.trim();
  const bannerLink = articleBanner?.linkUrl?.trim() || "/collections";

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C241E] flex flex-col justify-between selection:bg-[#5C4529] selection:text-[#FAF6F0] relative overflow-x-hidden font-sans">
      <Header />

      <main className="w-full flex-1 pt-24 sm:pt-28 lg:pt-32 pb-16 overflow-x-hidden">
        {/* Unified Master Container: All sections align to the exact same left and right vertical axis */}
        <div className="w-full max-w-5xl mx-auto px-5 sm:px-8 space-y-10 sm:space-y-12">
          {/* Top Breadcrumb Navigation */}
          <nav className="w-full">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#5C4529] hover:text-[#2C241E] transition-colors group cursor-pointer"
            >
              <span className="group-hover:-translate-x-1.5 transition-transform duration-200">
                &larr;
              </span>
              <span>BACK TO THE JOURNAL</span>
            </Link>
          </nav>

          {/* Article Header */}
          <header className="w-full">
            {/* Category & Meta Strip */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-[#9D7E50] mb-4">
              <span className="font-semibold">{article.category}</span>
              <span className="text-[#C6B29A]">&bull;</span>
              <span className="font-['Times_New_Roman',serif] text-[#8C7A6B] text-[13px] tracking-wider">
                {article.date}
              </span>
              <span className="text-[#C6B29A]">&bull;</span>
              <span className="font-['Times_New_Roman',serif] text-[#8C7A6B] text-[13px] tracking-wider">
                {article.readTime}
              </span>
            </div>

            {/* Article Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2C241E] leading-[1.12] tracking-tight uppercase break-words">
              {article.title}
            </h1>

            {/* Subtitle / Lead Excerpt */}
            <p className="text-base sm:text-lg text-[#5A4E43] leading-relaxed mt-4 font-sans break-words">
              {article.excerpt}
            </p>

            {/* Author & Atelier Divider */}
            <div className="flex items-center justify-between pt-6 mt-6 border-b border-[#DFCFC0] pb-6 text-xs uppercase tracking-[0.18em] text-[#7A6C5E]">
              <div className="flex items-center gap-2">
                <span className="text-[#9D7E50]">BY</span>
                <span className="font-medium text-[#2C241E]">{article.author}</span>
              </div>
              <span className="font-['Times_New_Roman',serif] text-[#8C7A6B] tracking-wider hidden sm:inline">
                Horologe Royale Atelier
              </span>
            </div>
          </header>

          {/* Full-Width Framed Feature Photograph */}
          <div className="w-full">
            <div className="relative aspect-[16/9] w-full border border-[#DFCFC0] rounded-none overflow-hidden bg-[#EFE8DD]">
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>

          {/* Editorial Essay Body */}
          <article className="w-full">
            <div className="space-y-6 text-[15px] sm:text-[17px] leading-[1.85] text-[#2C241E] font-sans break-words">
              {article.content && article.content.length > 0 ? (
                <>
                  {article.content.slice(0, 2).map((paragraph, idx) => (
                    <p key={idx} className="break-words">{paragraph}</p>
                  ))}

                  {/* Editorial Pull Quote */}
                  {article.pullQuote && (
                    <blockquote className="w-full border-l-2 border-[#5C4529] pl-6 py-4 my-8 bg-[#EFE8DD]/50 font-serif italic text-lg sm:text-xl text-[#2C241E] rounded-none break-words">
                      &ldquo;{article.pullQuote}&rdquo;
                    </blockquote>
                  )}

                  {article.content.slice(2).map((paragraph, idx) => (
                    <p key={idx + 2} className="break-words">{paragraph}</p>
                  ))}
                </>
              ) : (
                <p className="break-words">{article.excerpt}</p>
              )}
            </div>
          </article>

          {/* Bottom Salon CTA Strip */}
          <section className="w-full pt-4">
            <div className="w-full p-7 sm:p-10 bg-[#1C1713] text-[#FAF6F0] rounded-none border border-[#2C241E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
              {bannerMedia && (
                <>
                  {articleBanner?.mediaType === "video" ? (
                    <video
                      src={bannerMedia}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                    />
                  ) : (
                    <picture className="absolute inset-0 w-full h-full pointer-events-none select-none">
                      {articleBanner?.mobileUrl?.trim() && (
                        <source
                          media="(max-width: 639px)"
                          srcSet={articleBanner.mobileUrl.trim()}
                        />
                      )}
                      <img
                        src={bannerMedia}
                        alt="Banner Background"
                        className="w-full h-full object-cover"
                      />
                    </picture>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1C1713]/95 via-[#1C1713]/80 to-[#1C1713]/50 pointer-events-none" />
                </>
              )}

              <div className="max-w-md relative z-10">
                <h3 className="font-serif uppercase tracking-tight text-xl sm:text-2xl text-[#FAF6F0] mb-2">
                  DISCOVER DISTINGUISHED TIMEPIECES
                </h3>
                <p className="text-xs sm:text-sm text-[#C6B29A] leading-relaxed font-sans">
                  Explore our authenticated collection of modern and vintage horology.
                </p>
              </div>
              <Link
                href={bannerLink}
                className="inline-flex items-center gap-2 bg-[#5C4529] hover:bg-[#47341D] text-[#FAF6F0] rounded-none px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold transition-colors shrink-0 group relative z-10"
              >
                <span>EXPLORE COLLECTION</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-200">
                  &rarr;
                </span>
              </Link>
            </div>
          </section>

          {/* Related Stories Section */}
          {relatedArticles.length > 0 && (
            <section className="w-full pt-10 border-t border-[#DFCFC0]">
              {/* Header with Hairlines */}
              <div className="flex items-center justify-center mb-10">
                <div className="h-[1px] bg-[#DFCFC0] flex-1 max-w-[120px] sm:max-w-[200px]" />
                <h2 className="font-serif text-xl sm:text-2xl tracking-tight uppercase text-[#1C1A17] px-6 text-center">
                  MORE FROM THE JOURNAL
                </h2>
                <div className="h-[1px] bg-[#DFCFC0] flex-1 max-w-[120px] sm:max-w-[200px]" />
              </div>

              {/* 3-Column Related Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {relatedArticles.map((rel) => (
                  <article
                    key={rel.slug}
                    className="border border-[#DFCFC0] bg-[#FAF6F0] rounded-none overflow-hidden flex flex-col justify-between group hover:border-[#9D7E50]/70 transition-all duration-300"
                  >
                    <div>
                      {/* Card Photograph */}
                      <Link
                        href={`/insights/${rel.slug}`}
                        className="relative aspect-[16/10] w-full overflow-hidden cursor-pointer bg-[#EFE8DD] block"
                      >
                        <Image
                          src={rel.image}
                          alt={rel.title}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </Link>

                      {/* Card Meta & Title */}
                      <div className="p-5 sm:p-6 pb-4">
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] mb-2.5">
                          <span className="font-semibold text-[#9D7E50]">
                            {rel.category}
                          </span>
                          <span className="text-[#C6B29A]">&bull;</span>
                          <span className="font-['Times_New_Roman',serif] text-[#8C7A6B] text-[12px] tracking-wider">
                            {rel.date}
                          </span>
                        </div>

                        <Link href={`/insights/${rel.slug}`} className="block">
                          <h3 className="font-serif text-lg text-[#1C1A17] font-normal leading-snug tracking-tight hover:text-[#9D7E50] transition-colors cursor-pointer break-words">
                            {rel.title}
                          </h3>
                        </Link>
                      </div>
                    </div>

                    {/* Card Bottom CTA */}
                    <div className="px-5 sm:px-6 pb-5 pt-0">
                      <Link
                        href={`/insights/${rel.slug}`}
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
            </section>
          )}
        </div>
      </main>

      <Footer hideContactBar />
    </div>
  );
}
