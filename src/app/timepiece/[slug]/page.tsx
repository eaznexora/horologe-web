import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TimepieceOverview from "@/components/timepiece/TimepieceOverview";
import TimepieceSpecifications from "@/components/timepiece/TimepieceSpecifications";
import DynamicTimepieceOverview from "@/components/timepiece/DynamicTimepieceOverview";
import DynamicTimepieceSpecifications from "@/components/timepiece/DynamicTimepieceSpecifications";
import CustomerReviews from "@/components/timepiece/CustomerReviews";
import { connectToDatabase } from "@/lib/mongodb";
import { Timepiece } from "@/models/Timepiece";
import "@/models/Category";
import "@/models/WatchCategory";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    await connectToDatabase();
    const timepiece = await Timepiece.findOne({ slug: slug.toLowerCase() }).lean();

    if (timepiece) {
      const title =
        timepiece.seo?.metaTitle || `${timepiece.name} | HOROLOGE ROYALE`;
      const description =
        timepiece.seo?.metaDescription ||
        timepiece.tagline ||
        `Precision engineered luxury horology. Explore the ${timepiece.name} at Horologe Royale.`;
      const mainImage =
        timepiece.images && timepiece.images[0] ? timepiece.images[0] : "/logo.png";
      const canonical = timepiece.seo?.canonicalUrl || `/timepiece/${slug}`;

      return {
        title,
        description,
        keywords: timepiece.seo?.keywords || [
          timepiece.name,
          "luxury watches",
          "horologe royale",
          "certified pre-owned",
        ],
        alternates: {
          canonical,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          siteName: "Horologe Royale",
          images: [
            {
              url: mainImage,
              width: 1200,
              height: 630,
              alt: timepiece.name,
            },
          ],
          type: "website",
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata for slug:", slug, error);
  }

  // Benchmark fallback metadata
  return {
    title: "Rolex Cosmograph Daytona | HOROLOGE ROYALE",
    description:
      "Precision engineered for those who value every second. Discover the Rolex Cosmograph Daytona at Horologe Royale.",
  };
}

export default async function DynamicTimepiecePage({ params }: PageProps) {
  const { slug } = await params;

  let product = null;
  try {
    await connectToDatabase();
    const rawTimepiece = await Timepiece.findOne({ slug: slug.toLowerCase() })
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .populate("watchCategory", "name slug")
      .lean();

    if (rawTimepiece) {
      product = JSON.parse(JSON.stringify(rawTimepiece));
    }
  } catch (error) {
    console.error("Error fetching timepiece for slug:", slug, error);
  }

  // If timepiece record exists in MongoDB, render with Dynamic components
  if (product) {
    return (
      <main className="min-h-screen bg-[#E7DDD2] text-black overflow-x-hidden flex flex-col">
        <Header />
        <div className="pt-20 md:pt-24 lg:pt-28 flex-1">
          <DynamicTimepieceOverview product={product} />
          <DynamicTimepieceSpecifications product={product} />
          <CustomerReviews />
        </div>
        <Footer hideTopStrip />
      </main>
    );
  }

  // Benchmark fallback for product #1 or unknown slug
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
