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

interface ClientProfileViewProps {
  onTabChange?: (tab: string) => void;
  hideSidebar?: boolean;
}

export default function ClientProfileView({ onTabChange, hideSidebar = true }: ClientProfileViewProps = {}) {
  const [activeTab, setActiveTab] = useState("profile");

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  // Editable Profile Data
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Ameen Sarguroh",
    email: "ameen@example.com",
    phone: "+971 50 123 4567",
    country: "United Arab Emirates",
  });
  const [personalForm, setPersonalForm] = useState(personalInfo);

  // Editable Security
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState("Last updated on 12 Oct 2026");
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification Preferences
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(true);

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalInfo(personalForm);
    setIsEditingPersonal(false);
  };

  const handleCancelPersonal = () => {
    setPersonalForm(personalInfo);
    setIsEditingPersonal(false);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.newPassword) {
      setPasswordNotice("Last updated just now");
    }
    setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsEditingSecurity(false);
  };

  const handleCancelSecurity = () => {
    setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsEditingSecurity(false);
  };

  return (
    <div className="w-full">
      {/* Main Grid Layout (Desktop: 2-column sidebar + main content) */}
      <div className={hideSidebar ? "w-full" : "grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] gap-10 md:gap-12 lg:gap-16 items-start"}>
        {/* Left Navigation Sidebar */}
        {!hideSidebar && <AccountSidebar activeTab="profile" onTabChange={handleNavClick} />}

        {/* Right Main Content Area */}
        <div className="w-full">
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
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={personalForm.email}
                      onChange={(e) =>
                        setPersonalForm({ ...personalForm, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D2C4B4] text-[#2C241E] text-[15px] focus:outline-none focus:border-[#5C4529]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#786B5D] font-medium block mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={personalForm.phone}
                      onChange={(e) =>
                        setPersonalForm({ ...personalForm, phone: e.target.value })
                      }
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
              </div>
            )}
          </section>

          {/* Section 2: Account Security Card */}
          <section className="mb-8">
            <div className="flex justify-between items-start gap-4 mb-3">
              <div>
                <h2 className="font-serif text-[22px] lg:text-[24px] text-[#3D332A] leading-snug">
                  Account Security
                </h2>
                <p className="text-xs lg:text-[13px] text-[#786B5D] mt-0.5">
                  Manage your password and keep your account secure.
                </p>
              </div>

              {!isEditingSecurity && (
                <button
                  type="button"
                  onClick={() => setIsEditingSecurity(true)}
                  className="bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs uppercase tracking-wider px-4 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer select-none shrink-0"
                >
                  <Pencil size={12} />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {isEditingSecurity ? (
              <form onSubmit={handleSaveSecurity} className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#786B5D] font-medium block mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={(e) =>
                        setSecurityForm({
                          ...securityForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D2C4B4] text-[#2C241E] text-[15px] focus:outline-none focus:border-[#5C4529]"
                      placeholder="•••••••••"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#786B5D] font-medium block mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={securityForm.newPassword}
                      onChange={(e) =>
                        setSecurityForm({
                          ...securityForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D2C4B4] text-[#2C241E] text-[15px] focus:outline-none focus:border-[#5C4529]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#786B5D] font-medium block mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) =>
                        setSecurityForm({
                          ...securityForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D2C4B4] text-[#2C241E] text-[15px] focus:outline-none focus:border-[#5C4529]"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs uppercase tracking-wider px-5 py-2 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check size={14} />
                    <span>Update Password</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelSecurity}
                    className="border border-[#D2C4B4] hover:bg-[#DFD2C2]/40 text-[#635546] text-xs uppercase tracking-wider px-5 py-2 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-1 py-4 md:grid md:grid-cols-[220px_1fr] md:gap-0 md:items-center">
                <span className="text-[11px] lg:text-[12px] uppercase tracking-[0.18em] text-[#786B5D] font-medium">
                  PASSWORD
                </span>
                <div>
                  <span className="text-[15px] lg:text-[16px] text-[#2C241E] font-sans tracking-widest">
                    •••••••••
                  </span>
                  <p className="text-xs text-[#8A7C6E] mt-1 font-sans">
                    {passwordNotice}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Separator */}
          <div className="w-full h-[1px] bg-[#D2C4B4] my-8" />

          {/* Section 3: Notification Preferences */}
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
