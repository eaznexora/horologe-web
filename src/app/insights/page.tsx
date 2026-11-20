import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InsightsClientView, {
  SerializedArticle,
} from "@/components/insights/InsightsClientView";
import { connectToDatabase } from "@/lib/mongodb";
import { InsightCategory } from "@/models/InsightCategory";
import { InsightArticle } from "@/models/InsightArticle";
import { SiteBanner } from "@/models/SiteBanner";
import {
  CATEGORIES,
  INSIGHTS_ARTICLES,
} from "@/data/insightsArticles";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InsightsPage() {
  let categories: string[] = [...CATEGORIES.filter((c) => c !== "ALL STORIES")];
  let articles: SerializedArticle[] = [...INSIGHTS_ARTICLES];
  let bannerMap: Record<
    string,
    { desktopUrl: string; mobileUrl: string; linkUrl: string; mediaType: "image" | "video" }
  > = {};

  try {
    await connectToDatabase();

    // 1. Check auto-seed if needed
    const [catCount, artCount] = await Promise.all([
      InsightCategory.countDocuments(),
      InsightArticle.countDocuments(),
    ]);

    if (catCount === 0 && artCount === 0) {
      const defaultCategories = [
        { name: "WATCH GUIDES", slug: "watch-guides", rank: 1 },
        { name: "CRAFTSMANSHIP", slug: "craftsmanship", rank: 2 },
        { name: "BRAND JOURNAL", slug: "brand-journal", rank: 3 },
        { name: "COLLECTORS", slug: "collectors", rank: 4 },
      ];
      await InsightCategory.insertMany(defaultCategories);

      const defaultArticles = INSIGHTS_ARTICLES.map((art) => ({
        title: art.title,
        slug: art.slug,
        category: art.category,
        date: art.date,
        readTime: art.readTime,
        excerpt: art.excerpt,
        image: art.image,
        author: art.author,
        pullQuote: art.pullQuote,
        content: art.content,
        featured: !!art.featured,
        status: "published",
      }));
      await InsightArticle.insertMany(defaultArticles);
    }

    // 2. Fetch live categories from MongoDB
    const liveCats = await InsightCategory.find()
      .sort({ rank: 1, createdAt: 1 })
      .lean();

    if (liveCats && liveCats.length > 0) {
      categories = liveCats.map((c) => c.name);
    }

    // 3. Fetch live published articles from MongoDB
    const liveArticles = await InsightArticle.find({ status: "published" })
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    if (liveArticles && liveArticles.length > 0) {
      articles = liveArticles.map((art: any) => ({
        slug: art.slug,
        category: art.category,
        date: art.date,
        readTime: art.readTime || "5 MIN READ",
        title: art.title,
        excerpt: art.excerpt,
        image: art.image,
        author: art.author || "Horologe Royale Editorial Desk",
        pullQuote: art.pullQuote || "",
        content: Array.isArray(art.content) ? art.content : [],
        featured: Boolean(art.featured),
      }));
    }

    // 4. Fetch live banners for insights page
    const liveBanners = await SiteBanner.find({ page: "insights" }).lean();
    if (liveBanners && liveBanners.length > 0) {
      liveBanners.forEach((b: any) => {
        bannerMap[b.slotKey] = {
          desktopUrl: b.desktopUrl || "",
          mobileUrl: b.mobileUrl || "",
          linkUrl: b.linkUrl || "",
          mediaType: b.mediaType || "image",
        };
      });
    }
  } catch (err) {
    console.warn("Could not connect to MongoDB Atlas for insights; using fallback static articles:", err);
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C241E] flex flex-col justify-between selection:bg-[#5C4529] selection:text-[#FAF6F0] relative overflow-x-hidden font-sans">
      <Header />

      <main className="w-full flex-1 pt-24 sm:pt-28 lg:pt-32">
        <InsightsClientView
          categories={categories}
          articles={articles}
          banners={bannerMap}
        />
      </main>

      <Footer hideContactBar />
    </div>
  );
}
