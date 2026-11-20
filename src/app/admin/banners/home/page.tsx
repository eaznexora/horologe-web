"use client";

import React from "react";
import BannerDeskLayout, { SlotConfig } from "@/components/admin/BannerDeskLayout";

const HOME_SLOTS: SlotConfig[] = [
  // Section 1
  {
    slotKey: "house-of-horology",
    section: "1. The House of Horology",
    title: "Boutique Architectural Visual",
    description: "Featured portrait visual displayed alongside the Maison editorial philosophy and sourced timepiece metrics.",
    defaultDesktop: "/assets/horologe%20store%201.png",
    recommendedDims: "800 × 950 px (Portrait)",
    mediaType: "image",
    hasMobileOverride: false,
  },
  // Section 2
  {
    slotKey: "own-time",
    section: "2. Every Way to Own Time",
    title: "Full-Width Brand Panoramic Banner",
    description: "Full-bleed centerpiece banner with distinct desktop and mobile aspect ratios across the 4 horology pillars.",
    defaultDesktop: "/assets/own-time-desktop.png",
    defaultMobile: "/assets/own-time-mobile.png",
    recommendedDims: "Desktop: 1440 × 329 px | Mobile: 428 × 316 px",
    mediaType: "image",
    hasMobileOverride: true,
  },
  // Section 3 - Top Pair
  {
    slotKey: "mtw-1",
    section: "3. More Than a Watch (Top Hero)",
    title: "Top Left Hero: Buy New Watches",
    description: "Primary large showcase card for pristine, unworn reference acquisitions.",
    defaultDesktop: "/assets/MTW-1.png",
    recommendedDims: "700 × 300 px (Landscape)",
    mediaType: "image",
    hasMobileOverride: true,
  },
  {
    slotKey: "mtw-2",
    section: "3. More Than a Watch (Top Hero)",
    title: "Top Right Hero: Buy Pre-Owned Watches",
    description: "Primary large showcase card for certified pre-owned and museum-grade collector pieces.",
    defaultDesktop: "/assets/MTW-2.png",
    recommendedDims: "700 × 300 px (Landscape)",
    mediaType: "image",
    hasMobileOverride: true,
  },
  // Section 3 - Bottom 5 Cards
  {
    slotKey: "mtw-3",
    section: "3. More Than a Watch (Experience Cards & Mobile Carousel)",
    title: "Card 1: Concierge Inspection",
    description: "First portrait experience card on desktop and leading slide in the mobile swipe carousel.",
    defaultDesktop: "/assets/MTW-3.png",
    recommendedDims: "280 × 320 px (3:4 Portrait)",
    mediaType: "image",
    hasMobileOverride: true,
  },
  {
    slotKey: "mtw-4",
    section: "3. More Than a Watch (Experience Cards & Mobile Carousel)",
    title: "Card 2: Master Provenance",
    description: "Second portrait card detailing timepiece authentication and horological dossiers.",
    defaultDesktop: "/assets/MTW-4.png",
    recommendedDims: "280 × 320 px (3:4 Portrait)",
    mediaType: "image",
    hasMobileOverride: true,
  },
  {
    slotKey: "mtw-5",
    section: "3. More Than a Watch (Experience Cards & Mobile Carousel)",
    title: "Card 3: Curated Vault Tray I",
    description: "Third portrait card showcasing private vault curations and collector allocations.",
    defaultDesktop: "/assets/MTW-5-6-7.png",
    recommendedDims: "280 × 320 px (3:4 Portrait)",
    mediaType: "image",
    hasMobileOverride: true,
  },
  {
    slotKey: "mtw-6",
    section: "3. More Than a Watch (Experience Cards & Mobile Carousel)",
    title: "Card 4: Curated Vault Tray II",
    description: "Fourth portrait card displaying haute horlogerie selections and rare complications.",
    defaultDesktop: "/assets/MTW-5-6-7.png",
    recommendedDims: "280 × 320 px (3:4 Portrait)",
    mediaType: "image",
    hasMobileOverride: true,
  },
  {
    slotKey: "mtw-7",
    section: "3. More Than a Watch (Experience Cards & Mobile Carousel)",
    title: "Card 5: Curated Vault Tray III",
    description: "Fifth portrait card completing the desktop experience strip and mobile carousel loop.",
    defaultDesktop: "/assets/MTW-5-6-7.png",
    recommendedDims: "280 × 320 px (3:4 Portrait)",
    mediaType: "image",
    hasMobileOverride: true,
  },
  // Section 4
  {
    slotKey: "gender-men",
    section: "4. Men's & Women's Timepieces (Dual Video Banners)",
    title: "Men's Timepieces Editorial Video",
    description: "Cinematic looping video banner for the Men's Haute Horlogerie Collection.",
    defaultDesktop: "/assets/men.mp4",
    recommendedDims: "16:11 or 4:3 Ratio (MP4 / WebM)",
    mediaType: "video",
    hasMobileOverride: true,
  },
  {
    slotKey: "gender-women",
    section: "4. Men's & Women's Timepieces (Dual Video Banners)",
    title: "Women's Timepieces Editorial Video",
    description: "Cinematic looping video banner for the Women's High Complications & Jewelry Collection.",
    defaultDesktop: "/assets/women.mp4",
    recommendedDims: "16:11 or 4:3 Ratio (MP4 / WebM)",
    mediaType: "video",
    hasMobileOverride: true,
  },
  // Section 5 - Gallery Mosaic
  {
    slotKey: "house-gallery-1",
    section: "5. Gallery Mosaic (House of Horology)",
    title: "Left Tall Feature: Wrist Shot",
    description: "Large portrait wrist showcase anchoring the left side of the mosaic collage.",
    defaultDesktop: "/assets/house-1.png",
    recommendedDims: "Desktop: 700 × 540 px | Mobile: 360 × 220 px",
    mediaType: "image",
    hasMobileOverride: true,
  },
  {
    slotKey: "house-gallery-2",
    section: "5. Gallery Mosaic (House of Horology)",
    title: "Right Top Stacked: Watch in Nature",
    description: "Upper right card in the 2-stack mosaic cluster.",
    defaultDesktop: "/assets/house-2.png",
    recommendedDims: "Desktop: 700 × 258 px | Mobile: 360 × 110 px",
    mediaType: "image",
    hasMobileOverride: true,
  },
  {
    slotKey: "house-gallery-3",
    section: "5. Gallery Mosaic (House of Horology)",
    title: "Right Bottom Stacked: Submariner Close-up",
    description: "Lower right card in the 2-stack mosaic cluster.",
    defaultDesktop: "/assets/house-3.png",
    recommendedDims: "Desktop: 700 × 258 px | Mobile: 360 × 110 px",
    mediaType: "image",
    hasMobileOverride: true,
  },
  {
    slotKey: "house-gallery-5",
    section: "5. Gallery Mosaic (House of Horology)",
    title: "Bottom Row Left: Vintage Military Dial",
    description: "Lower left card in the horizontal gallery duo.",
    defaultDesktop: "/assets/house-5.png",
    recommendedDims: "Desktop: 700 × 290 px | Mobile: 420 × 180 px",
    mediaType: "image",
    hasMobileOverride: true,
  },
  {
    slotKey: "house-gallery-4",
    section: "5. Gallery Mosaic (House of Horology)",
    title: "Bottom Row Right: Steel Dive Watch",
    description: "Lower right card in the horizontal gallery duo.",
    defaultDesktop: "/assets/house-4.png",
    recommendedDims: "Desktop: 700 × 290 px | Mobile: 420 × 190 px",
    mediaType: "image",
    hasMobileOverride: true,
  },
  // Section 6 - FAQ Storefront
  {
    slotKey: "faq-storefront",
    section: "6. Frequently Asked Questions",
    title: "Storefront Visual Showcase",
    description: "Left-side boutique facade image on desktop and top banner visual on mobile viewports.",
    defaultDesktop: "/assets/FAQS-desktop.png",
    defaultMobile: "/assets/FAQS-mobile.png",
    recommendedDims: "Desktop: 420 × 650 px | Mobile: 428 × 300 px",
    mediaType: "image",
    hasMobileOverride: true,
  },
  // Section 7 - Bottom CTA
  {
    slotKey: "cta-bottom",
    section: "7. Bottom Acquisition CTA",
    title: "Timepiece Acquisition Hero Visual",
    description: "Right-half blended hero visual on desktop and flush bottom anchor image on mobile.",
    defaultDesktop: "/assets/CTA-desktop.png",
    defaultMobile: "/assets/CTA-mobile.png",
    recommendedDims: "Desktop: 900 × 520 px | Mobile: 428 × 380 px",
    mediaType: "image",
    hasMobileOverride: true,
  },
];

export default function AdminHomeBannersPage() {
  return (
    <BannerDeskLayout
      pageKey="home"
      pageTitle="Home Page Banner Desk"
      breadcrumbLabel="Home Page"
      pageSubtitle="Manage live boutique visual assets, editorial photography, destination redirect links, and video loops with instant VPS-safe streaming."
      storefrontHref="/"
      slots={HOME_SLOTS}
    />
  );
}
