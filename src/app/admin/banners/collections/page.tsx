"use client";

import React from "react";
import BannerDeskLayout, { SlotConfig } from "@/components/admin/BannerDeskLayout";

const COLLECTIONS_SLOTS: SlotConfig[] = [
  {
    slotKey: "collections-hero",
    section: "1. Collections Header Hero",
    title: "Collections Hero Visual",
    description: "Featured right-side boutique visual showcasing 'A Closer Look at Time' across both desktop and mobile viewports.",
    defaultDesktop: "/assets/categories-hero.png",
    defaultMobile: "/assets/categories-hero.png",
    recommendedDims: "Desktop: 560 × 640 px | Mobile: 380 × 420 px",
    mediaType: "image",
    hasMobileOverride: true,
  },
  {
    slotKey: "collections-preowned",
    section: "2. Category Showcase Cards",
    title: "Pre-Owned Collection Card Banner",
    description: "Showcase card promoting 'A Higher Standard' certified pre-owned timepieces.",
    defaultDesktop: "/assets/categories-preowned.png",
    recommendedDims: "624 × 280 px (Landscape)",
    mediaType: "image",
    hasMobileOverride: true,
  },
  {
    slotKey: "collections-brandnew",
    section: "2. Category Showcase Cards",
    title: "Brand New Collection Card Banner",
    description: "Showcase card highlighting 'Exceptional by Nature' unworn contemporary luxury references.",
    defaultDesktop: "/assets/categories-brandnew.png",
    recommendedDims: "625 × 280 px (Landscape)",
    mediaType: "image",
    hasMobileOverride: true,
  },
];

export default function CollectionsBannerPage() {
  return (
    <BannerDeskLayout
      pageKey="collections"
      pageTitle="Collections Banner Desk"
      breadcrumbLabel="Collections Page"
      pageSubtitle="Configure hero photography and category showcase cards for the Horologe Royale Collections salon."
      storefrontHref="/collections"
      slots={COLLECTIONS_SLOTS}
    />
  );
}
