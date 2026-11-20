"use client";

import React from "react";
import BannerDeskLayout, { SlotConfig } from "@/components/admin/BannerDeskLayout";

const CONCIERGE_SLOTS: SlotConfig[] = [
  {
    slotKey: "concierge-hero",
    section: "1. Concierge Hero Visual",
    title: "Concierge Salon Hero Visual",
    description: "Atmospheric boutique staging visual in Section 1 beside 'The House of Horology' concierge header.",
    defaultDesktop: "/assets/categories-hero.png",
    recommendedDims: "800 × 900 px (Portrait / Fill)",
    mediaType: "image",
    hasMobileOverride: true,
  },
  {
    slotKey: "concierge-boutique",
    section: "2. Kala Ghoda Boutique Showcase",
    title: "Kala Ghoda Boutique Storefront Photo",
    description: "Full-height architectural boutique facade photo displayed in Section 3 ('Visit Our Boutique') beside the location map.",
    defaultDesktop: "/assets/horologe store 1.png",
    recommendedDims: "600 × 800 px (Portrait / Fill)",
    mediaType: "image",
    hasMobileOverride: true,
  },
];

export default function ConciergeBannerPage() {
  return (
    <BannerDeskLayout
      pageKey="concierge"
      pageTitle="Concierge & Contact Banner Desk"
      breadcrumbLabel="Concierge & Contact Page"
      pageSubtitle="Manage visual assets for the private concierge desk, contact directory, and Kala Ghoda boutique salon."
      storefrontHref="/concierge"
      slots={CONCIERGE_SLOTS}
    />
  );
}

