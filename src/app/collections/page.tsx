import type { Metadata } from "next";
import Header from "@/components/Header";
import CollectionsHero from "@/components/collections/CollectionsHero";
import CategoryCards from "@/components/collections/CategoryCards";
import ProductGrid from "@/components/collections/ProductGrid";
import SourcingBanner from "@/components/collections/SourcingBanner";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Collections | HOROLOGE ROYALE",
  description: "Explore exceptional luxury timepieces, captured through our lens at Horologe Royale.",
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-[#E7DDD2] text-black overflow-x-hidden flex flex-col">
      <Header />
      <div className="pt-20 md:pt-24 lg:pt-28">
        <CollectionsHero />
        <CategoryCards />
        <ProductGrid />
        <SourcingBanner />
      </div>
      <Footer hideTopStrip />
    </main>
  );
}
