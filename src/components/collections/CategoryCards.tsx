import React from "react";
import Image from "next/image";
import Link from "next/link";
import BannerLink from "@/components/BannerLink";

interface CategoryCardItem {
  id: string;
  image: string;
  alt: string;
  buttonText: string;
  href: string;
  width: number;
  height: number;
}

const categoryCards: CategoryCardItem[] = [
  {
    id: "preowned",
    image: "/assets/categories-preowned.png",
    alt: "Horologe Royale Preowned Collections - A Higher Standard",
    buttonText: "View Preowned Collections →",
    href: "#",
    width: 624,
    height: 280,
  },
  {
    id: "brandnew",
    image: "/assets/categories-brandnew.png",
    alt: "Horologe Royale New Collections - Exceptional By Nature",
    buttonText: "New Collection →",
    href: "#",
    width: 625,
    height: 280,
  },
];

interface CategoryCardsProps {
  banners?: Record<string, { desktopUrl?: string; mobileUrl?: string; linkUrl?: string; mediaType?: string }>;
}

export default function CategoryCards({ banners = {} }: CategoryCardsProps) {
  const preownedDesktop = banners?.["collections-preowned"]?.desktopUrl || "/assets/categories-preowned.png";
  const preownedMobile = banners?.["collections-preowned"]?.mobileUrl || preownedDesktop;
  const preownedLink = banners?.["collections-preowned"]?.linkUrl?.trim();

  const brandnewDesktop = banners?.["collections-brandnew"]?.desktopUrl || "/assets/categories-brandnew.png";
  const brandnewMobile = banners?.["collections-brandnew"]?.mobileUrl || brandnewDesktop;
  const brandnewLink = banners?.["collections-brandnew"]?.linkUrl?.trim();

  const desktopCards = [
    { ...categoryCards[0], image: preownedDesktop, href: preownedLink || categoryCards[0].href },
    { ...categoryCards[1], image: brandnewDesktop, href: brandnewLink || categoryCards[1].href },
  ];

  const mobileCards = [
    { ...categoryCards[0], image: preownedMobile, href: preownedLink || categoryCards[0].href },
    { ...categoryCards[1], image: brandnewMobile, href: brandnewLink || categoryCards[1].href },
  ];

  return (
    <section className="w-full bg-[#E7DDD2]">
      {/* DESKTOP VIEW (hidden md:grid) */}
      <div className="hidden md:grid max-w-[1440px] mx-auto px-6 lg:px-12 pt-8 lg:pt-12 pb-8 lg:pb-10 grid-cols-2 gap-6 lg:gap-8">
        {desktopCards.map((card) => (
          <BannerLink
            key={card.id}
            href={card.href}
            className="group flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500 cursor-pointer"
          >
            {/* Visual Image Container - Subtle zoom on hover, no HTML overlay */}
            <div className="w-full overflow-hidden leading-none bg-[#E7DDD2]">
              <Image
                src={card.image}
                alt={card.alt}
                width={card.width}
                height={card.height}
                priority
                unoptimized={card.image.startsWith("/api/media/")}
                className="w-full h-auto block object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              />
            </div>

            {/* Bottom Solid Action Ribbon - Flush directly attached to image bottom edge */}
            <div className="w-full bg-[#6D5333] group-hover:bg-[#594226] text-[#F4EDE4] text-[15px] sm:text-[16px] font-sans tracking-wide py-3.5 sm:py-4 px-6 flex items-center justify-center transition-colors duration-300 font-medium">
              <span>{card.buttonText}</span>
            </div>
          </BannerLink>
        ))}
      </div>

      {/* MOBILE VIEW (flex flex-col md:hidden) */}
      <div className="flex flex-col md:hidden px-4 sm:px-6 py-8 gap-6">
        {mobileCards.map((card) => (
          <BannerLink
            key={card.id}
            href={card.href}
            className="group flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500 cursor-pointer"
          >
            {/* Visual Image Container */}
            <div className="w-full overflow-hidden leading-none bg-[#E7DDD2]">
              <Image
                src={card.image}
                alt={card.alt}
                width={card.width}
                height={card.height}
                priority
                unoptimized={card.image.startsWith("/api/media/")}
                className="w-full h-auto block object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              />
            </div>

            {/* Bottom Solid Action Ribbon */}
            <div className="w-full bg-[#6D5333] group-hover:bg-[#594226] text-[#F4EDE4] text-[15px] sm:text-[16px] font-sans tracking-wide py-3.5 sm:py-4 px-6 flex items-center justify-center transition-colors duration-300 font-medium">
              <span>{card.buttonText}</span>
            </div>
          </BannerLink>
        ))}
      </div>
    </section>
  );
}
