"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AccountSidebar from "./AccountSidebar";
import ClientProfileView from "./ClientProfileView";
import ClientOrdersView from "./ClientOrdersView";
import ClientAddressesView from "./ClientAddressesView";
import ClientWishlistView from "./ClientWishlistView";
import ClientSettingsView from "./ClientSettingsView";

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

interface ClientAccountTabsProps {
  initialTab?: AccountTab;
}

export default function ClientAccountTabs({
  initialTab = "profile",
}: ClientAccountTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read active tab directly from URL query string or fallback to initialTab / 'profile'
  const tabFromUrl = searchParams.get("tab");
  const resolvedTab: AccountTab = isValidTab(tabFromUrl)
    ? tabFromUrl
    : isValidTab(initialTab)
    ? initialTab
    : "profile";

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

  // Event delegation to catch clicks on any sidebar navigation buttons or mobile ribbon
  const handleContainerClick = (e: React.MouseEvent) => {
    const button = (e.target as HTMLElement).closest("button");
    if (!button) return;
    const isSidebar =
      button.closest("aside") ||
      button.closest("nav") ||
      button.closest(".md\\:hidden");
    if (!isSidebar) return;
    const text = button.textContent?.toLowerCase() || "";
    if (text.includes("wishlist")) {
      handleTabChange("wishlist");
    } else if (text.includes("orders")) {
      handleTabChange("orders");
    } else if (text.includes("address")) {
      handleTabChange("addresses");
    } else if (text.includes("setting")) {
      handleTabChange("settings");
    } else if (text.includes("profile")) {
      handleTabChange("profile");
    }
  };

  return (
    <div onClick={handleContainerClick} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-12 lg:gap-16 items-start">
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
              {activeTab === "profile" && (
                <ClientProfileView hideSidebar onTabChange={handleTabChange} />
              )}
              {activeTab === "orders" && (
                <ClientOrdersView hideSidebar onTabChange={handleTabChange} />
              )}
              {activeTab === "addresses" && (
                <ClientAddressesView hideSidebar onTabChange={handleTabChange} />
              )}
              {activeTab === "wishlist" && (
                <ClientWishlistView hideSidebar onTabChange={handleTabChange} />
              )}
              {activeTab === "settings" && (
                <ClientSettingsView hideSidebar onTabChange={handleTabChange} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
