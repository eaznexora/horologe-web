"use client";

import React from "react";
import BannerDeskLayout, { SlotConfig } from "@/components/admin/BannerDeskLayout";

const SELL_SLOTS: SlotConfig[] = [
  {
    slotKey: "sell-hero",
    section: "1. Valuation & Appraisal Hero",
    title: "Valuation & Appraisal Hero Backdrop",
    description: "Atmospheric full-bleed watch photography framing the left side of the valuation card on desktop and mobile header.",
    defaultDesktop: "/assets/sell-your-luxury-hero.jpg",
    recommendedDims: "900 × 1100 px (Portrait / Fill)",
    mediaType: "image",
    hasMobileOverride: true,
  },
];

export default function SellYourLuxuryBannerPage() {
  return (
    <BannerDeskLayout
      pageKey="sell-your-luxury"
      pageTitle="Sell Your Luxury Banner Desk"
      breadcrumbLabel="Sell Your Luxury Page"
      pageSubtitle="Configure valuation backdrops and appraisal showcase visuals for the client acquisition portal."
      storefrontHref="/sell-your-luxury"
      slots={SELL_SLOTS}
    />
  );
}
