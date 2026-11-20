"use client";

import React from "react";
import BannerDeskLayout, { SlotConfig } from "@/components/admin/BannerDeskLayout";

const INSIGHTS_SLOTS: SlotConfig[] = [
  {
    slotKey: "insights-bottom",
    section: "1. Insights Journal Bottom Banner",
    title: "Insights Journal Bottom Banner",
    description: "Full-width dark editorial CTA banner displayed below The Journal grid on /insights.",
    defaultDesktop: "/assets/CTA-desktop.png",
    recommendedDims: "1280 × 260 px (Wide Panoramic Banner)",
    mediaType: "image",
    hasMobileOverride: true,
  },
  {
    slotKey: "insights-article-bottom",
    section: "2. Opened Article Bottom Banner",
    title: "Opened Article Bottom CTA Banner",
    description: "Editorial CTA banner displayed below the article body on /insights/[slug]. Leave empty to use the default dark espresso card, or upload a custom panoramic background photograph.",
    defaultDesktop: "",
    recommendedDims: "1024 × 240 px (Article Footer Banner)",
    mediaType: "image",
    hasMobileOverride: true,
  },
];

export default function InsightsBannerDeskPage() {
  return (
    <BannerDeskLayout
      pageKey="insights"
      pageTitle="Insights Banner Desk"
      breadcrumbLabel="Insights Page"
      pageSubtitle="Configure responsive bottom CTA banners for the main Insights journal page (/insights) and opened article reading pages (/insights/[slug])."
      storefrontHref="/insights"
      slots={INSIGHTS_SLOTS}
    />
  );
}

