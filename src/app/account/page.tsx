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
import SuspendedVaultDesk from "@/components/account/SuspendedVaultDesk";

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

  // Authentication gate state
  const [user, setUser] = useState<any>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Centralized session verification function
  async function verifySession() {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      // Catch 403 status OR blocked payload
      if (res.status === 403 || data.blocked || data.user?.status === "blocked") {
        setIsBlocked(true);
        setUser(data.user || null);
        setIsLoading(false);
        return;
      }

      if (!res.ok || !data.success) {
        router.replace("/login?redirect=/account");
        return;
      }

      // Active User
      setIsBlocked(false);
      setUser(data.user);
      setIsLoading(false);
    } catch (err) {
      console.error("Session verification error:", err);
      router.replace("/login?redirect=/account");
    }
  }

  // Trigger on Mount AND Window Focus
  useEffect(() => {
    let isMounted = true;

    // Safety timeout: Never hang on spinner for more than 3.5 seconds
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoading((loading) => {
          if (loading) {
            router.replace("/login?redirect=/account");
          }
          return loading;
        });
      }
    }, 3500);

    verifySession();

    // Re-verify immediately when user tabs back into the window
    const handleFocus = () => {
      verifySession();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      window.removeEventListener("focus", handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const refreshUser = async () => {
    await verifySession();
  };

  const handleLogOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    router.replace("/login");
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[480px] flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-8 h-8 border-2 border-[#5C4529] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-[0.22em] text-[#5C4529] font-medium font-sans">
          Verifying Vault Access...
        </span>
      </div>
    );
  }

  // Render Suspended Vault Desk with Appeal Form if collector is blocked
  if (isBlocked) {
    return (
      <SuspendedVaultDesk
        user={
          user || {
            name: "Privileged Patron",
            email: "",
            blockReason: "Administrative review and portfolio verification in progress.",
          }
        }
        onLogOut={handleLogOut}
        onAppealSubmitted={(newAppeal) => {
          setUser((prev: any) => (prev ? { ...prev, appealMessage: newAppeal } : prev));
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-12 lg:gap-16">
      {/* 1. SIDEBAR - STRICTLY STATIC (NO ANIMATIONS / NO WRAPPERS) */}
      <aside className="w-full">
        <AccountSidebar
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          onTabChange={handleTabChange}
          onLogOut={handleLogOut}
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
              <ClientProfileView user={user} onUpdate={refreshUser} onTabChange={handleTabChange} />
            )}
            {activeTab === "orders" && (
              <ClientOrdersView user={user} onTabChange={handleTabChange} />
            )}
            {activeTab === "addresses" && (
              <ClientAddressesView user={user} onUpdate={refreshUser} onTabChange={handleTabChange} />
            )}
            {activeTab === "wishlist" && (
              <ClientWishlistView user={user} onTabChange={handleTabChange} />
            )}
            {activeTab === "settings" && (
              <ClientSettingsView user={user} onUpdate={refreshUser} onTabChange={handleTabChange} />
            )}
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
