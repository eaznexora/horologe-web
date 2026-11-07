"use client";

import React, { useState } from "react";
import {
  User,
  Package,
  MapPin,
  Heart,
  CreditCard,
  Bell,
  Settings,
  Pencil,
  Check,
  X,
} from "lucide-react";
import AccountSidebar from "./AccountSidebar";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "payments", label: "Payment Methods", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

interface UserProps {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  createdAt?: string | Date;
  addresses?: Array<{
    country?: string;
    city?: string;
  }>;
}

interface ClientProfileViewProps {
  user?: UserProps | null;
  onUpdate?: () => Promise<void> | void;
  onTabChange?: (tab: string) => void;
  hideSidebar?: boolean;
}

export default function ClientProfileView({
  user,
  onUpdate,
  onTabChange,
  hideSidebar = true,
}: ClientProfileViewProps = {}) {
  const [activeTab, setActiveTab] = useState("profile");

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  // Editable Profile Data
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const initialFullName = user?.name || "";
  const initialEmail = user?.email || "";
  const initialPhone = user?.phone || "";
  const initialCountry = user?.country || user?.addresses?.[0]?.country || "India";

  const [personalInfo, setPersonalInfo] = useState({
    fullName: initialFullName,
    email: initialEmail,
    phone: initialPhone,
    country: initialCountry,
  });
  const [personalForm, setPersonalForm] = useState(personalInfo);

  // Sync when user prop is loaded or updated, or fetch if not present
  React.useEffect(() => {
    if (user) {
      const data = {
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || user.addresses?.[0]?.country || "India",
      };
      setPersonalInfo(data);
      setPersonalForm(data);
    } else {
      // Fallback fetch from /api/auth/me
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            const fetched = {
              fullName: data.user.name || "",
              email: data.user.email || "",
              phone: data.user.phone || "",
              country: data.user.country || data.user.addresses?.[0]?.country || "India",
            };
            setPersonalInfo(fetched);
            setPersonalForm(fetched);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  // Notification Preferences
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(true);

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPersonal(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: personalForm.fullName,
          phone: personalForm.phone,
          country: personalForm.country,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update profile");
      }
      setPersonalInfo(personalForm);
      setIsEditingPersonal(false);
      if (onUpdate) await onUpdate();
      setToastMessage("Collector profile successfully updated.");
      setTimeout(() => setToastMessage(null), 3200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3200);
    } finally {
      setIsSavingPersonal(false);
    }
  };

  const handleCancelPersonal = () => {
    setPersonalForm(personalInfo);
    setIsEditingPersonal(false);
  };

  return (
    <div className="w-full">
      {/* Main Grid Layout (Desktop: 2-column sidebar + main content) */}
      <div className={hideSidebar ? "w-full" : "grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] gap-10 md:gap-12 lg:gap-16 items-start"}>
        {/* Left Navigation Sidebar */}
        {!hideSidebar && <AccountSidebar activeTab="profile" onTabChange={handleNavClick} />}

        {/* Right Main Content Area */}
        <div className="w-full">
          {/* Toast Notice */}
          {toastMessage && (
            <div className="mb-6 p-3.5 bg-[#FAF7F2] border border-[#5C4529]/30 text-xs text-[#5C4529] font-medium tracking-wide flex items-center gap-2">
              <Check size={14} className="text-[#5C4529] shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Header Block */}
          <div className="mb-6">
            <h1 className="font-serif text-[32px] lg:text-[40px] uppercase tracking-wide text-[#2C241E] leading-tight">
              MY PROFILE
            </h1>
            <p className="text-[14px] text-[#786B5D] font-sans mt-1">
              Manage your personal information and account settings.
            </p>
          </div>

          {/* Horizontal Separator */}
          <div className="w-full h-[1px] bg-[#D2C4B4] my-6" />

          {/* Section 1: Personal Information Card */}
          <section className="mb-8">
            <div className="flex justify-between items-start gap-4 mb-3">
              <div>
                <h2 className="font-serif text-[22px] lg:text-[24px] text-[#3D332A] leading-snug">
                  Personal Information
                </h2>
                <p className="text-xs lg:text-[13px] text-[#786B5D] mt-0.5">
                  Update your personal details associated with your account.
                </p>
              </div>

              {!isEditingPersonal && (
                <button
                  type="button"
                  onClick={() => setIsEditingPersonal(true)}
                  className="bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs uppercase tracking-wider px-4 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer select-none shrink-0"
                >
                  <Pencil size={12} />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {/* Field Rows / Edit Form */}
            {isEditingPersonal ? (
              <form onSubmit={handleSavePersonal} className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#786B5D] font-medium block mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={personalForm.fullName}
                      onChange={(e) =>
                        setPersonalForm({ ...personalForm, fullName: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D2C4B4] text-[#2C241E] text-[15px] focus:outline-none focus:border-[#5C4529]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#786B5D] font-medium block mb-1.5">
                      Email Address (Account Identifier)
                    </label>
                    <input
                      type="email"
                      value={personalForm.email}
                      readOnly
                      disabled
                      className="w-full px-3.5 py-2 bg-[#EFE8DD]/70 border border-[#D2C4B4] text-[#786B5D] text-[15px] cursor-not-allowed outline-none select-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#786B5D] font-medium block mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      pattern="[0-9+\s\-]*"
                      value={personalForm.phone}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/[^0-9+\s-]/g, "");
                        setPersonalForm({ ...personalForm, phone: cleanValue });
                      }}
                      onKeyDown={(e) => {
                        if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) return;
                        if (!/[0-9+\s-]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D2C4B4] text-[#2C241E] text-[15px] focus:outline-none focus:border-[#5C4529]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#786B5D] font-medium block mb-1.5">
                      Country / Region
                    </label>
                    <input
                      type="text"
                      value={personalForm.country}
                      onChange={(e) =>
                        setPersonalForm({ ...personalForm, country: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D2C4B4] text-[#2C241E] text-[15px] focus:outline-none focus:border-[#5C4529]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs uppercase tracking-wider px-5 py-2 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check size={14} />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelPersonal}
                    className="border border-[#D2C4B4] hover:bg-[#DFD2C2]/40 text-[#635546] text-xs uppercase tracking-wider px-5 py-2 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="divide-y divide-[#D2C4B4]/60 pt-2">
                <div className="flex flex-col gap-1 py-3.5 md:grid md:grid-cols-[220px_1fr] md:gap-0 md:items-center">
                  <span className="text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#786B5D] font-medium">
                    FULL NAME
                  </span>
                  <span className="text-[15px] lg:text-[16px] text-[#2C241E] font-sans">
                    {personalInfo.fullName}
                  </span>
                </div>

                <div className="flex flex-col gap-1 py-3.5 md:grid md:grid-cols-[220px_1fr] md:gap-0 md:items-center">
                  <span className="text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#786B5D] font-medium">
                    EMAIL ADDRESS
                  </span>
                  <span className="text-[15px] lg:text-[16px] text-[#2C241E] font-sans">
                    {personalInfo.email}
                  </span>
                </div>

                <div className="flex flex-col gap-1 py-3.5 md:grid md:grid-cols-[220px_1fr] md:gap-0 md:items-center">
                  <span className="text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#786B5D] font-medium">
                    PHONE NUMBER
                  </span>
                  <span className="text-[15px] lg:text-[16px] text-[#2C241E] font-sans">
                    {personalInfo.phone}
                  </span>
                </div>

                <div className="flex flex-col gap-1 py-3.5 md:grid md:grid-cols-[220px_1fr] md:gap-0 md:items-center">
                  <span className="text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#786B5D] font-medium">
                    COUNTRY / REGION
                  </span>
                  <span className="text-[15px] lg:text-[16px] text-[#2C241E] font-sans">
                    {personalInfo.country}
                  </span>
                </div>

                <div className="flex flex-col gap-1 py-3.5 md:grid md:grid-cols-[220px_1fr] md:gap-0 md:items-center">
                  <span className="text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#786B5D] font-medium">
                    MEMBER SINCE
                  </span>
                  <span className="text-[15px] lg:text-[16px] text-[#2C241E] font-sans">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      : "Privileged Patron"}
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Separator */}
          <div className="w-full h-[1px] bg-[#D2C4B4] my-8" />

          {/* Section 2: Notification Preferences */}
          <section className="mb-0">
            <div className="mb-6">
              <h2 className="font-serif text-[22px] lg:text-[24px] text-[#3D332A] leading-snug">
                Notification Preferences
              </h2>
              <p className="text-xs lg:text-[13px] text-[#786B5D] mt-0.5">
                Choose what you&apos;d like to be notified about.
              </p>
            </div>

            <div className="divide-y divide-[#D2C4B4]/60">
              {/* Notification Item 1: Order updates */}
              <div className="flex items-center justify-between py-4 gap-4">
                <div className="pr-4">
                  <h3 className="text-[15px] font-medium text-[#2C241E] font-sans">
                    Order updates
                  </h3>
                  <p className="text-xs lg:text-[13px] text-[#786B5D] mt-0.5 font-sans leading-relaxed">
                    Get notified about your order status, shipping updates and delivery
                    confirmations.
                  </p>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={orderUpdates}
                  onClick={() => setOrderUpdates(!orderUpdates)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    orderUpdates ? "bg-[#5C4529]" : "bg-[#D2C4B4]"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#FAF6F0] shadow-sm transition duration-200 ease-in-out ${
                      orderUpdates ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Notification Item 2: Promotions and new arrivals */}
              <div className="flex items-center justify-between py-4 gap-4">
                <div className="pr-4">
                  <h3 className="text-[15px] font-medium text-[#2C241E] font-sans">
                    Promotions and new arrivals
                  </h3>
                  <p className="text-xs lg:text-[13px] text-[#786B5D] mt-0.5 font-sans leading-relaxed">
                    Be the first to know about new collections, exclusive pieces and special offers.
                  </p>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={promotions}
                  onClick={() => setPromotions(!promotions)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    promotions ? "bg-[#5C4529]" : "bg-[#D2C4B4]"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#FAF6F0] shadow-sm transition duration-200 ease-in-out ${
                      promotions ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
