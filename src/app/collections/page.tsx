import type { Metadata } from "next";
import Header from "@/components/Header";
import CollectionsHero from "@/components/collections/CollectionsHero";
import CategoryCards from "@/components/collections/CategoryCards";
import ProductGrid from "@/components/collections/ProductGrid";
import SourcingBanner from "@/components/collections/SourcingBanner";
import Footer from "@/components/Footer";
import { connectToDatabase } from "@/lib/mongodb";
import { SiteBanner } from "@/models/SiteBanner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Collections | HOROLOGE ROYALE",
  description: "Explore exceptional luxury timepieces, captured through our lens at Horologe Royale.",
};

async function getCollectionsBanners() {
  try {
    await connectToDatabase();
    const records = await SiteBanner.find({ page: "collections" }).lean();
    const map: Record<
      string,
      { desktopUrl: string; mobileUrl: string; linkUrl: string; mediaType: "image" | "video" }
    > = {};
    records.forEach((item: any) => {
      map[item.slotKey] = {
        desktopUrl: item.desktopUrl || "",
        mobileUrl: item.mobileUrl || "",
        linkUrl: item.linkUrl || "",
        mediaType: item.mediaType || "image",
      };
    });
    return map;
  } catch (error) {
    console.error("Error loading collections banners on SSR:", error);
    return {};
  }
}

export default async function CollectionsPage() {
  const banners = await getCollectionsBanners();

  return (
    <main className="min-h-screen bg-[#E7DDD2] text-black overflow-x-hidden flex flex-col">
      <Header />
      <div className="pt-20 md:pt-24 lg:pt-28">
        <CollectionsHero banners={banners} />
        <CategoryCards banners={banners} />
        <ProductGrid />
        <SourcingBanner />
      </div>
      <Footer hideTopStrip />
    </main>
  );
}
