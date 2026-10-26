"use client";

import React, { useState } from "react";
import {
  User,
  Lock,
  Globe,
  Package,
  Tag,
  Percent,
  Shield,
  FileText,
  Trash2,
  ChevronRight,
  X,
  Check,
} from "lucide-react";
import AccountSidebar from "./AccountSidebar";

interface ClientSettingsViewProps {
  onTabChange?: (tab: string) => void;
  hideSidebar?: boolean;
}

export default function ClientSettingsView({ onTabChange, hideSidebar = true }: ClientSettingsViewProps) {
  // Notification toggle states
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [newArrivals, setNewArrivals] = useState(true);
  const [exclusiveOffers, setExclusiveOffers] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Language & Region state
  const [selectedLanguage, setSelectedLanguage] = useState("English (UK)");
  const [selectedCountry, setSelectedCountry] = useState("United Arab Emirates");
  const [selectedCurrency, setSelectedCurrency] = useState("AED (د.إ)");

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleToggle = (
    title: string,
    currentVal: boolean,
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const nextVal = !currentVal;
    setter(nextVal);
    showToast(`${title} notifications ${nextVal ? "enabled" : "disabled"}.`);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showToast("Password must be at least 8 characters.");
      return;
    }
    showToast("Password updated successfully.");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsPasswordModalOpen(false);
  };

  const handleLanguageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Preferences updated: ${selectedLanguage} · ${selectedCurrency}.`);
    setIsLanguageModalOpen(false);
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(false);
    showToast("Account deletion request submitted. Support will contact you.");
  };

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C241E] text-[#F9F5EF] px-5 py-3 rounded-none shadow-xl border border-[#D4C6B3] text-xs font-sans animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Main Grid Layout: Left Sidebar + Main Content */}
      <div className={hideSidebar ? "w-full" : "grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] gap-10 md:gap-12 lg:gap-16 items-start"}>
        {/* Left Navigation Sidebar */}
        {!hideSidebar && <AccountSidebar activeTab="settings" onTabChange={onTabChange} />}

        {/* Right Main Content Area */}
        <div className="font-times-card w-full">
          {/* Header Block */}
          <div>
            <h1 className="font-serif text-[32px] lg:text-[40px] text-[#2C241E] leading-tight">
              Settings
            </h1>
            <p className="text-sm text-[#786B5D] font-sans mt-1">
              Manage your account preferences, security and other settings.
            </p>
          </div>

          {/* Separator */}
          <div className="w-full h-[1px] bg-[#D2C4B4] mt-4 mb-8" />

          {/* Card 1: Account Settings */}
          <div className="border border-[#D4C6B3] bg-[#EFE7DE]/80 p-5 sm:p-6 mb-6 rounded-[3px]">
            <div>
              <h2 className="font-serif text-[20px] lg:text-[22px] text-[#2C241E]">
                Account Settings
              </h2>
              <p className="text-xs sm:text-sm text-[#786B5D] font-sans mt-0.5 mb-4">
                Manage your account details and preferences.
              </p>
            </div>

            <div className="divide-y divide-[#D2C4B4]/60">
              {/* Personal Information */}
              <button
                type="button"
                onClick={() => {
                  if (onTabChange) {
                    onTabChange("profile");
                  }
                }}
                className="w-full flex items-center justify-between py-4 cursor-pointer hover:bg-black/[0.02] transition-colors group text-left"
              >
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 pr-4">
                  <div className="w-9 h-9 rounded-full bg-[#E5D7C7]/70 flex items-center justify-center shrink-0 text-[#786B5D] group-hover:text-[#2C241E] transition-colors">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-[15px] sm:text-[16px] text-[#2C241E] font-medium leading-snug">
                      Personal Information
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#786B5D] font-sans leading-relaxed mt-0.5">
                      Update your name, email, phone number and other details.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center">
                  <ChevronRight size={18} className="text-[#786B5D] group-hover:text-[#2C241E] transition-colors" />
                </div>
              </button>

              {/* Password */}
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full flex items-center justify-between py-4 cursor-pointer hover:bg-black/[0.02] transition-colors group text-left"
              >
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 pr-4">
                  <div className="w-9 h-9 rounded-full bg-[#E5D7C7]/70 flex items-center justify-center shrink-0 text-[#786B5D] group-hover:text-[#2C241E] transition-colors">
                    <Lock size={18} />
                  </div>
                  <div>
                    <h3 className="text-[15px] sm:text-[16px] text-[#2C241E] font-medium leading-snug">
                      Password
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#786B5D] font-sans leading-relaxed mt-0.5">
                      Change your password to keep your account secure.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center">
                  <ChevronRight size={18} className="text-[#786B5D] group-hover:text-[#2C241E] transition-colors" />
                </div>
              </button>

              {/* Language & Region */}
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(true)}
                className="w-full flex items-center justify-between py-4 cursor-pointer hover:bg-black/[0.02] transition-colors group text-left"
              >
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 pr-4">
                  <div className="w-9 h-9 rounded-full bg-[#E5D7C7]/70 flex items-center justify-center shrink-0 text-[#786B5D] group-hover:text-[#2C241E] transition-colors">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h3 className="text-[15px] sm:text-[16px] text-[#2C241E] font-medium leading-snug">
                      Language & Region
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#786B5D] font-sans leading-relaxed mt-0.5">
                      Set your preferred language, country and currency.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="hidden sm:inline-block text-xs text-[#8A7C6E] font-sans">
                    {selectedLanguage} · {selectedCurrency.split(" ")[0]}
                  </span>
                  <ChevronRight size={18} className="text-[#786B5D] group-hover:text-[#2C241E] transition-colors" />
                </div>
              </button>
            </div>
          </div>

          {/* Card 2: Notification Preferences */}
          <div className="border border-[#D4C6B3] bg-[#EFE7DE]/80 p-5 sm:p-6 mb-6 rounded-[3px]">
            <div>
              <h2 className="font-serif text-[20px] lg:text-[22px] text-[#2C241E]">
                Notification Preferences
              </h2>
              <p className="text-xs sm:text-sm text-[#786B5D] font-sans mt-0.5 mb-4">
                Choose what you&apos;d like to be notified about.
              </p>
            </div>

            <div className="divide-y divide-[#D2C4B4]/60">
              {/* Order updates */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 pr-4">
                  <div className="w-9 h-9 rounded-full bg-[#E5D7C7]/70 flex items-center justify-center shrink-0 text-[#786B5D]">
                    <Package size={18} />
                  </div>
                  <div>
                    <h3 className="text-[15px] sm:text-[16px] text-[#2C241E] font-medium leading-snug">
                      Order updates
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#786B5D] font-sans leading-relaxed mt-0.5">
                      Get notified about your order status, shipping updates and delivery confirmations.
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={orderUpdates}
                    onClick={() => handleToggle("Order updates", orderUpdates, setOrderUpdates)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                      orderUpdates ? "bg-[#5C4529]" : "bg-[#D2C4B4]"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 bg-[#FAF6F0] rounded-full shadow-xs transform transition-transform duration-200 ${
                        orderUpdates ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* New arrivals and restocks */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 pr-4">
                  <div className="w-9 h-9 rounded-full bg-[#E5D7C7]/70 flex items-center justify-center shrink-0 text-[#786B5D]">
                    <Tag size={18} />
                  </div>
                  <div>
                    <h3 className="text-[15px] sm:text-[16px] text-[#2C241E] font-medium leading-snug">
                      New arrivals and restocks
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#786B5D] font-sans leading-relaxed mt-0.5">
                      Be the first to know about new collections and limited pieces.
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={newArrivals}
                    onClick={() => handleToggle("New arrivals and restocks", newArrivals, setNewArrivals)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                      newArrivals ? "bg-[#5C4529]" : "bg-[#D2C4B4]"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 bg-[#FAF6F0] rounded-full shadow-xs transform transition-transform duration-200 ${
                        newArrivals ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Exclusive offers */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 pr-4">
                  <div className="w-9 h-9 rounded-full bg-[#E5D7C7]/70 flex items-center justify-center shrink-0 text-[#786B5D]">
                    <Percent size={18} />
                  </div>
                  <div>
                    <h3 className="text-[15px] sm:text-[16px] text-[#2C241E] font-medium leading-snug">
                      Exclusive offers
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#786B5D] font-sans leading-relaxed mt-0.5">
                      Receive special promotions and member-only offers.
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={exclusiveOffers}
                    onClick={() => handleToggle("Exclusive offers", exclusiveOffers, setExclusiveOffers)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                      exclusiveOffers ? "bg-[#5C4529]" : "bg-[#D2C4B4]"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 bg-[#FAF6F0] rounded-full shadow-xs transform transition-transform duration-200 ${
                        exclusiveOffers ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Account and security alerts */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 pr-4">
                  <div className="w-9 h-9 rounded-full bg-[#E5D7C7]/70 flex items-center justify-center shrink-0 text-[#786B5D]">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h3 className="text-[15px] sm:text-[16px] text-[#2C241E] font-medium leading-snug">
                      Account and security alerts
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#786B5D] font-sans leading-relaxed mt-0.5">
                      Important updates regarding your account, login activity and security.
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={securityAlerts}
                    onClick={() => handleToggle("Security alerts", securityAlerts, setSecurityAlerts)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                      securityAlerts ? "bg-[#5C4529]" : "bg-[#D2C4B4]"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 bg-[#FAF6F0] rounded-full shadow-xs transform transition-transform duration-200 ${
                        securityAlerts ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Privacy & Data */}
          <div className="border border-[#D4C6B3] bg-[#EFE7DE]/80 p-5 sm:p-6 mb-6 rounded-[3px]">
            <div>
              <h2 className="font-serif text-[20px] lg:text-[22px] text-[#2C241E]">
                Privacy & Data
              </h2>
              <p className="text-xs sm:text-sm text-[#786B5D] font-sans mt-0.5 mb-4">
                Manage your data and privacy preferences.
              </p>
            </div>

            <div className="divide-y divide-[#D2C4B4]/60">
              {/* Privacy Policy */}
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="w-full flex items-center justify-between py-4 cursor-pointer hover:bg-black/[0.02] transition-colors group text-left"
              >
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 pr-4">
                  <div className="w-9 h-9 rounded-full bg-[#E5D7C7]/70 flex items-center justify-center shrink-0 text-[#786B5D] group-hover:text-[#2C241E] transition-colors">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-[15px] sm:text-[16px] text-[#2C241E] font-medium leading-snug">
                      Privacy Policy
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#786B5D] font-sans leading-relaxed mt-0.5">
                      Learn how we collect and use your information.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center">
                  <ChevronRight size={18} className="text-[#786B5D] group-hover:text-[#2C241E] transition-colors" />
                </div>
              </button>

              {/* Delete Account */}
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full flex items-center justify-between py-4 cursor-pointer hover:bg-red-500/[0.03] transition-colors group text-left"
              >
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 pr-4">
                  <div className="w-9 h-9 rounded-full bg-red-100/60 flex items-center justify-center shrink-0 text-[#9E3535]">
                    <Trash2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-[15px] sm:text-[16px] text-[#9E3535] font-medium leading-snug">
                      Delete Account
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#786B5D] font-sans leading-relaxed mt-0.5">
                      Permanently delete your account and all associated data.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center">
                  <ChevronRight size={18} className="text-[#9E3535] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C241E]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="font-times-card bg-[#EFE7DE] border border-[#D4C6B3] w-full max-w-md p-6 sm:p-7 rounded-[3px] shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-5 right-5 text-[#786B5D] hover:text-[#2C241E] p-1 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
            <h2 className="font-serif text-[22px] text-[#2C241E] mb-1">Update Password</h2>
            <p className="text-xs text-[#786B5D] font-sans mb-5">
              Ensure your account is protected with a secure password.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529]"
                />
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529]"
                />
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4C6B3]/60">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-xs font-serif text-[#6B5D4F] hover:text-[#2C241E] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs font-medium uppercase tracking-wider px-5 py-2.5 transition-colors cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Language & Region Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C241E]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="font-times-card bg-[#EFE7DE] border border-[#D4C6B3] w-full max-w-md p-6 sm:p-7 rounded-[3px] shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(false)}
              className="absolute top-5 right-5 text-[#786B5D] hover:text-[#2C241E] p-1 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
            <h2 className="font-serif text-[22px] text-[#2C241E] mb-1">Language & Region</h2>
            <p className="text-xs text-[#786B5D] font-sans mb-5">
              Select your preferred browsing language, country and display currency.
            </p>

            <form onSubmit={handleLanguageSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                  Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529]"
                >
                  <option value="English (UK)">English (UK)</option>
                  <option value="English (US)">English (US)</option>
                  <option value="Arabic (العربية)">Arabic (العربية)</option>
                  <option value="French (Français)">French (Français)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                  Country / Region
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529]"
                >
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="India">India</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Switzerland">Switzerland</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                  Display Currency
                </label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529]"
                >
                  <option value="AED (د.إ)">AED (د.إ) - UAE Dirham</option>
                  <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                  <option value="USD ($)">USD ($) - US Dollar</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4C6B3]/60">
                <button
                  type="button"
                  onClick={() => setIsLanguageModalOpen(false)}
                  className="px-4 py-2 text-xs font-serif text-[#6B5D4F] hover:text-[#2C241E] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs font-medium uppercase tracking-wider px-5 py-2.5 transition-colors cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C241E]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="font-times-card bg-[#EFE7DE] border border-[#D4C6B3] w-full max-w-lg p-6 sm:p-8 rounded-[3px] shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(false)}
              className="absolute top-5 right-5 text-[#786B5D] hover:text-[#2C241E] p-1 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
            <h2 className="font-serif text-[22px] text-[#2C241E] mb-1">Privacy & Data Standards</h2>
            <p className="text-xs text-[#786B5D] font-sans mb-4">
              Horologe Royale Data Protection Commitment
            </p>
            <div className="text-xs sm:text-[13px] text-[#6B5D4F] font-sans space-y-3 leading-relaxed border-t border-[#D4C6B3]/60 pt-4">
              <p>
                At Horologe Royale, we maintain strict privacy protocols matching the standards of Swiss horology. Your personal identity, purchase histories, and payment tokens are protected with enterprise-grade encryption.
              </p>
              <p>
                <strong>Data Collection:</strong> We collect only necessary details to authenticate transactions, arrange insured bespoke courier delivery, and tailor personalized horological offerings.
              </p>
              <p>
                <strong>Third Parties:</strong> We never sell or license client data. Disclosures occur solely with licensed armored delivery services (e.g. Malca-Amit, Ferrari Express) and compliance verification bodies.
              </p>
              <p>
                <strong>Right to Erasure:</strong> You retain the full legal right to request complete data extraction or permanent deletion of your profile at any time.
              </p>
            </div>
            <div className="flex justify-end pt-5 mt-4 border-t border-[#D4C6B3]/60">
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(false)}
                className="bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs font-medium uppercase tracking-wider px-5 py-2.5 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C241E]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="font-times-card bg-[#EFE7DE] border border-[#D4C6B3] w-full max-w-md p-6 sm:p-7 rounded-[3px] shadow-2xl relative">
            <h3 className="font-serif text-[22px] text-[#9E3535] mb-2">Delete Horologe Account?</h3>
            <p className="text-sm text-[#6B5D4F] font-sans leading-relaxed mb-6">
              This action is permanent and cannot be reversed. You will forfeit your order history, guarantee certificates, saved preferences, and private horological concierge allocations.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-serif text-[#6B5D4F] hover:text-[#2C241E] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="bg-[#9E3535] hover:bg-[#852828] text-[#F9F5EF] text-xs font-medium uppercase tracking-wider px-5 py-2.5 transition-colors cursor-pointer"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
