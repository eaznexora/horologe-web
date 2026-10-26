"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";
import ClientProfileView from "@/components/account/ClientProfileView";
import ClientOrdersView from "@/components/account/ClientOrdersView";
import ClientAddressesView from "@/components/account/ClientAddressesView";
import ClientWishlistView from "@/components/account/ClientWishlistView";
import ClientSettingsView from "@/components/account/ClientSettingsView";

export type AccountTab =
  | "profile"
  | "orders"
  | "addresses"
  | "wishlist"
  | "settings";

const VALID_TABS: readonly AccountTab[] = [
  "profile",
  "orders",
  "addresses",
  "wishlist",
  "settings",
] as const;

function isValidTab(tab: unknown): tab is AccountTab {
  return typeof tab === "string" && (VALID_TABS as readonly string[]).includes(tab);
}

function AccountPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read active tab directly from URL query string or default to 'profile'
  const tabFromUrl = searchParams.get("tab");
  const resolvedTab: AccountTab = isValidTab(tabFromUrl) ? tabFromUrl : "profile";

  const [activeTab, setActiveTab] = useState<AccountTab>(resolvedTab);

  // Sync state whenever URL query params change (e.g. browser back/forward or reload)
  useEffect(() => {
    if (isValidTab(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else if (!tabFromUrl) {
      setActiveTab("profile");
    }
  }, [tabFromUrl]);

  // Tab switch handler: updates active tab and pushes URL query without full reload
  const handleTabChange = (tabKey: string) => {
    if (isValidTab(tabKey)) {
      setActiveTab(tabKey);
      router.replace(`/account?tab=${tabKey}`, { scroll: false });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-12 lg:gap-16">
      {/* 1. SIDEBAR - STRICTLY STATIC (NO ANIMATIONS / NO WRAPPERS) */}
      <aside className="w-full">
        <AccountSidebar
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          onTabChange={handleTabChange}
        />
      </aside>

      {/* 2. MAIN CONTENT AREA - SMOOTH SOOTHING SWITCHING TRANSITION */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
          >
            {activeTab === "profile" && <ClientProfileView onTabChange={handleTabChange} />}
            {activeTab === "orders" && <ClientOrdersView onTabChange={handleTabChange} />}
            {activeTab === "addresses" && <ClientAddressesView onTabChange={handleTabChange} />}
            {activeTab === "wishlist" && <ClientWishlistView onTabChange={handleTabChange} />}
            {activeTab === "settings" && <ClientSettingsView onTabChange={handleTabChange} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#E7DDD2] text-[#2C241E]">
      <Header />
      <div className="pt-24 lg:pt-32 pb-4 md:pb-6 w-full px-6 lg:px-12">
        <div className="ml-2 sm:ml-4 md:ml-8 lg:ml-12 xl:ml-16 mr-2 sm:mr-4 md:mr-8 lg:mr-12 xl:mr-16">
          <Suspense fallback={null}>
            <AccountPageContent />
          </Suspense>
        </div>
      </div>
      <Footer hideTopStrip />
    </main>
  );
}
