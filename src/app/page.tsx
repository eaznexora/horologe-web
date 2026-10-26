import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingBar from "@/components/FloatingBar";
import WatchCarousel from "@/components/WatchCarousel";
import HouseOfHorology from "@/components/HouseOfHorology";
import OwnTimeSection from "@/components/OwnTimeSection";
import ExperienceSection from "@/components/ExperienceSection";
import GenderCollections from "@/components/GenderCollections";
import HouseGallery from "@/components/HouseGallery";
import ReviewsSection from "@/components/ReviewsSection";
import FaqSection from "@/components/FaqSection";
import CtaSection from "@/components/CtaSection";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#E7DDD2] text-black overflow-x-hidden flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none h-screen">
        <Image
          src="/assets/hero-bg.png"
          alt="Background Texture"
          fill
          className="object-cover"
        />
      </div>

      <Header />

      {/* Hero Section Container */}
      <div className="flex flex-col pt-28 pb-8 md:min-h-screen md:py-0 justify-start md:justify-center">
        <div className="flex flex-col md:flex-row items-center justify-between w-full px-8 md:px-16 lg:px-24 xl:px-32 relative z-10 mt-2 md:mt-0">
          {/* Left Content */}
          <div className="w-full md:w-[55%] flex flex-col justify-center pl-0 z-20 pt-2 md:pt-0">
            <div className="flex items-center mb-5 md:mb-7">
              <span className="text-[#7A6F66] text-sm md:text-base tracking-[0.25em] uppercase font-medium">
                TIMEPIECES OF DISTINCTION
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-[76px] xl:text-[84px] font-serif font-normal leading-[1.05] mb-5 text-[#1C1A17] uppercase tracking-tight">
              TIMEPIECES<br />WORTHY OF<br />
              <span className="text-[#998565]">YOUR WRIST.</span>
            </h2>
            
            <p className="max-w-sm lg:max-w-[380px] text-[#2c2b29] font-sans text-base lg:text-[19px] font-normal leading-[1.6]">
              From sought-after icons to rare collector pieces, discover a curated world of new and pre-owned luxury timepieces.
            </p>
          </div>

          {/* Right Content - Watch Carousel */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-4 md:mt-0 -translate-y-8 md:translate-y-0 relative z-30">
            {/* Subtle glow behind watch */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-white/30 rounded-full blur-[80px] -z-10"></div>
            <div className="w-full max-w-lg">
              <WatchCarousel />
            </div>
          </div>
        </div>
      </div>

      <HouseOfHorology />

      {/* Brand Value Section: Every Way To Own Time */}
      <OwnTimeSection />

      {/* Experience Section */}
      <ExperienceSection />

      {/* Gender Collections Section */}
      <GenderCollections />

      {/* House Gallery Section */}
      <HouseGallery />

      {/* Luxury Reviews Section */}
      <ReviewsSection />

      {/* Luxury FAQ Section */}
      <FaqSection />

      {/* Luxury CTA Section */}
      <CtaSection />

      {/* Luxury Footer Component */}
      <Footer />

      {/* Floating Bottom Info Bar */}
      <FloatingBar />
    </main>
  );
}
