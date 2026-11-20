import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthCard from "@/components/auth/AuthCard";
import { connectToDatabase } from "@/lib/mongodb";
import { SiteBanner } from "@/models/SiteBanner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Join Horologe Royale | Create Account",
  description:
    "Create an account with Horologe Royale to explore exclusive luxury timepiece collections, save wishlist selections, and enjoy priority concierge sourcing.",
};

async function getAuthBanners() {
  try {
    await connectToDatabase();
    const records = await SiteBanner.find({ page: "auth" }).lean();
    const map: Record<
      string,
      { desktopUrl: string; mobileUrl: string; linkUrl: string; mediaType: "image" | "video" }
    > = {};
    records.forEach((item: any) => {
      map[item.slotKey] = {
        desktopUrl: item.desktopUrl || "",
        mobileUrl: item.mobileUrl || "",
        linkUrl: item.linkUrl || "",
        mediaType: item.mediaType || "video",
      };
    });
    return map;
  } catch (error) {
    console.error("Error loading auth banners on SSR:", error);
    return {};
  }
}

export default async function RegisterPage() {
  const banners = await getAuthBanners();

  return (
    <main className="min-h-screen bg-[#FAF6F0] text-[#2C241E] flex flex-col justify-between">
      <Header />
      <div className="pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 flex-1 flex items-center justify-center">
        <AuthCard initialMode="signup" banners={banners} />
      </div>
      <Footer hideTopStrip={true} />
    </main>
  );
}
