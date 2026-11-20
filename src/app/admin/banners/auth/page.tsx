"use client";

import React from "react";
import BannerDeskLayout, { SlotConfig } from "@/components/admin/BannerDeskLayout";

const AUTH_SLOTS: SlotConfig[] = [
  {
    slotKey: "auth-signin",
    section: "1. Sign In Showcase (Sign In Mode)",
    title: "Sign In Showcase Video",
    description: "Left-panel cinematic video loop displayed when a collector visits /login or toggles to Sign In mode.",
    defaultDesktop: "/assets/login%20page.mp4",
    recommendedDims: "800 × 1100 px (Portrait 5:7 MP4/WebM)",
    mediaType: "video",
    hasMobileOverride: true,
  },
  {
    slotKey: "auth-signup",
    section: "2. Registration Showcase (Sign Up Mode)",
    title: "Registration Showcase Video",
    description: "Left-panel cinematic video loop displayed when a collector visits /register or toggles to Create Account mode.",
    defaultDesktop: "/assets/account%20creation.mp4",
    recommendedDims: "800 × 1100 px (Portrait 5:7 MP4/WebM)",
    mediaType: "video",
    hasMobileOverride: true,
  },
];

export default function AuthBannerPage() {
  return (
    <BannerDeskLayout
      pageKey="auth"
      pageTitle="Sign In & Registration Banner Desk"
      breadcrumbLabel="Sign In / Log In Page"
      pageSubtitle="Configure left-panel video loops for client authentication and membership registration."
      storefrontHref="/login"
      slots={AUTH_SLOTS}
    />
  );
}
