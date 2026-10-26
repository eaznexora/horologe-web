import type { Metadata } from "next";
import Header from "@/components/Header";
import TimepieceOverview from "@/components/timepiece/TimepieceOverview";
import TimepieceSpecifications from "@/components/timepiece/TimepieceSpecifications";
import CustomerReviews from "@/components/timepiece/CustomerReviews";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Rolex Cosmograph Daytona | HOROLOGE ROYALE",
  description: "Precision engineered for those who value every second. Discover the Rolex Cosmograph Daytona at Horologe Royale.",
};

export default function TimepiecePage() {
  return (
    <main className="min-h-screen bg-[#E7DDD2] text-black overflow-x-hidden flex flex-col">
      <Header />
      <div className="pt-20 md:pt-24 lg:pt-28 flex-1">
        <TimepieceOverview />
        <TimepieceSpecifications />
        <CustomerReviews />
      </div>
      <Footer hideTopStrip />
    </main>
  );
}
