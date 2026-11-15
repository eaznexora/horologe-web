"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  MessageSquare,
  Phone,
  Search,
  RefreshCw,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Package,
  CheckCircle2,
  X,
  Copy,
  Send,
  Sparkles,
  AlertCircle,
  Eye,
} from "lucide-react";

// Formatter for Indian Rupee
function formatINR(val: number): string {
  return "₹" + Math.round(val).toLocaleString("en-IN");
}

// Format date into luxury editorial time string
function formatTimestamp(isoString?: string | Date | null): string {
  if (!isoString) return "Recently Active";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "Recently Active";
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Recently Active";
  }
}

// Clean phone digits for WhatsApp URL
function sanitizeWhatsAppNumber(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits;
  }
  return digits;
}

interface AbandonedItem {
  _id: string;
  type: "abandoned";
  sessionKey: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingCity: string;
  shippingCountry: string;
  timepieceId?: string | null;
  timepieceSlug: string;
  timepieceTitle: string;
  timepieceBrand: string;
  timepieceReference: string;
  timepieceImage: string;
  timepiecePrice: number;
  ordersCount: number;
  lastActiveAt: string;
  status: string;
}

interface WishlistItemPreview {
  id: string;
  slug: string;
  title: string;
  brand: string;
  reference: string;
  price: number;
  image: string;
}

interface WishlistCollectorItem {
  _id: string;
  type: "wishlist";
  collectorId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingCity: string;
  shippingCountry: string;
  itemsCount: number;
  totalWishlistValue: number;
  items: WishlistItemPreview[];
  ordersCount: number;
  lastActiveAt: string;
}

interface ActivityMetrics {
  abandonedCount: number;
  abandonedPipelineValue: number;
  wishlistCollectorsCount: number;
  wishlistedItemsCount: number;
}

interface CustomMessageModalState {
  recipientName: string;
  recipientPhone: string;
  timepieceTitle: string;
  timepieceReference: string;
  timepieceBrand: string;
  timepiecePrice: number;
  messageText: string;
}

export default function AdminCartActivityPage() {
  const [abandonedCheckouts, setAbandonedCheckouts] = useState<AbandonedItem[]>([]);
  const [wishlistCollectors, setWishlistCollectors] = useState<WishlistCollectorItem[]>([]);
  const [metrics, setMetrics] = useState<ActivityMetrics>({
    abandonedCount: 0,
    abandonedPipelineValue: 0,
    wishlistCollectorsCount: 0,
    wishlistedItemsCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "abandoned" | "wishlist">("all");

  // Custom Message Modal
  const [customModal, setCustomModal] = useState<CustomMessageModalState | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchActivity = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/admin/cart-activity?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (!res.ok) throw new Error("Failed to load cart & wishlist activity");
      const data = await res.json();

      if (data.success) {
        setAbandonedCheckouts(data.abandonedCheckouts || []);
        setWishlistCollectors(data.wishlistCollectors || []);
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      } else {
        throw new Error(data.error || "Failed to load activity telemetry");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error loading activity telemetry";
      showToast(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  // Direct WhatsApp Launch with Pre-filled Template
  const handleDirectWhatsApp = (
    phone: string,
    collectorName: string,
    timepieceTitle: string,
    timepieceRef: string
  ) => {
    const sanitized = sanitizeWhatsAppNumber(phone);
    if (!sanitized) {
      showToast("No verified telephone number available for this patron.");
      return;
    }

    const name = collectorName || "Collector";
    const title = timepieceTitle || "luxury timepiece";
    const ref = timepieceRef ? ` (Ref. ${timepieceRef})` : "";

    const message = `Greetings ${name}, this is the Private Concierge at Horologe Royale. We noticed your interest in the ${title}${ref}. Allow us to assist you with private viewing arrangements, armored delivery details, or any bespoke portfolio inquiries.`;

    const url = `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    showToast(`WhatsApp Concierge initiated for ${name}.`);
  };

  // Open Custom Message Modal
  const openCustomModal = (
    collectorName: string,
    phone: string,
    title: string,
    brand: string,
    ref: string,
    price: number
  ) => {
    const name = collectorName || "Distinguished Collector";
    const defaultMsg = `Greetings ${name}, this is the Private Concierge at Horologe Royale regarding your inquiry on the ${title} (Ref. ${ref || "HR-VAULT"}). Please let us know if you wish to review certified provenance records or arrange an armored boutique presentation.`;

    setCustomModal({
      recipientName: name,
      recipientPhone: phone,
      timepieceTitle: title,
      timepieceBrand: brand,
      timepieceReference: ref,
      timepiecePrice: price,
      messageText: defaultMsg,
    });
  };

  // Modal Template Quick Chooser
  const applyTemplate = (templateType: "viewing" | "delivery" | "holding") => {
    if (!customModal) return;
    const name = customModal.recipientName;
    const title = customModal.timepieceTitle;
    const ref = customModal.timepieceReference ? ` (Ref. ${customModal.timepieceReference})` : "";

    let newText = "";
    if (templateType === "viewing") {
      newText = `Greetings ${name}, this is the Salon Concierge at Horologe Royale. We have prepared private viewing access for the ${title}${ref}. Would you like to reserve a private appointment at our Kala Ghoda Atelier or schedule a secure consultation?`;
    } else if (templateType === "delivery") {
      newText = `Dear ${name}, the Directorate at Horologe Royale has cleared your portfolio for fully insured armored courier transit (Ferrari Group / Malca-Amit) for the ${title}${ref}. May we confirm your vault destination?`;
    } else if (templateType === "holding") {
      newText = `Hello ${name}, we noted your active reservation intent for the ${title}${ref}. Due to high collector demand, we can place a courtesy 24-hour vault reservation hold on this piece upon your confirmation.`;
    }

    setCustomModal({ ...customModal, messageText: newText });
  };

  // Send WhatsApp From Modal
  const handleSendFromModal = () => {
    if (!customModal) return;
    const sanitized = sanitizeWhatsAppNumber(customModal.recipientPhone);
    if (!sanitized) {
      showToast("Cannot transmit: Phone number is invalid or missing.");
      return;
    }
    if (!customModal.messageText.trim()) {
      showToast("Please enter a concierge message before transmitting.");
      return;
    }

    const url = `https://wa.me/${sanitized}?text=${encodeURIComponent(customModal.messageText.trim())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    showToast(`Transmitted WhatsApp message to ${customModal.recipientName}.`);
    setCustomModal(null);
  };

  // Copy modal message text to clipboard
  const handleCopyMessage = () => {
    if (!customModal?.messageText) return;
    navigator.clipboard.writeText(customModal.messageText);
    showToast("Concierge message copied to clipboard.");
  };

  // Filtered List Generation
  const filteredAbandoned = useMemo(() => {
    if (!searchQuery.trim()) return abandonedCheckouts;
    const q = searchQuery.toLowerCase().trim();
    return abandonedCheckouts.filter(
      (it) =>
        it.customerName.toLowerCase().includes(q) ||
        it.customerEmail.toLowerCase().includes(q) ||
        it.customerPhone.toLowerCase().includes(q) ||
        it.timepieceTitle.toLowerCase().includes(q) ||
        it.timepieceBrand.toLowerCase().includes(q) ||
        it.timepieceReference.toLowerCase().includes(q) ||
        it.shippingCity.toLowerCase().includes(q)
    );
  }, [abandonedCheckouts, searchQuery]);

  const filteredWishlists = useMemo(() => {
    if (!searchQuery.trim()) return wishlistCollectors;
    const q = searchQuery.toLowerCase().trim();
    return wishlistCollectors.filter((col) => {
      const matchCollector =
        col.customerName.toLowerCase().includes(q) ||
        col.customerEmail.toLowerCase().includes(q) ||
        col.customerPhone.toLowerCase().includes(q) ||
        col.shippingCity.toLowerCase().includes(q);

      const matchItem = col.items.some(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.brand.toLowerCase().includes(q) ||
          it.reference.toLowerCase().includes(q)
      );

      return matchCollector || matchItem;
    });
  }, [wishlistCollectors, searchQuery]);

  const totalEntries =
    activeTab === "all"
      ? filteredAbandoned.length + filteredWishlists.length
      : activeTab === "abandoned"
      ? filteredAbandoned.length
      : filteredWishlists.length;

  return (
    <div className="space-y-6">
      {/* Toast Alert (Strict Zero Red Policy: #2C241E / #FAF6F0 / #9D7E50) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C241E] text-[#FAF6F0] border border-[#DFCFC0] px-4 py-3 rounded-none shadow-xl text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={15} className="text-[#9D7E50]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#8C6D46] block mb-1">
            COLLECTOR INTENT & CONCIERGE DESK
          </span>
          <h1 className="font-serif text-[28px] sm:text-[32px] text-[#2C241E] leading-tight font-medium uppercase tracking-wide">
            Cart & Wishlist Activity
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6C5E] mt-0.5 font-light">
            Real-time acquisition tracking for abandoned checkout sessions and client wishlist portfolios.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchActivity(false)}
          disabled={isRefreshing}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white/60 hover:bg-[#2C241E] text-[#2C241E] hover:text-[#FAF6F0] border border-[#DFCFC0] hover:border-[#2C241E] rounded-none text-xs font-semibold uppercase tracking-[0.16em] transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
          title="Reload Activity Telemetry"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          <span>{isRefreshing ? "Syncing..." : "Sync Activity"}</span>
        </button>
      </div>

      {/* 1. KPI Strip (4 Sharp Editorial Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Abandoned Checkouts */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#7A6C5E] font-medium block">
              Abandoned Checkouts
            </span>
            <div className="font-['Times_New_Roman',serif] text-[30px] font-semibold text-[#2C241E] mt-1 leading-none">
              {metrics.abandonedCount}
            </div>
            <span className="text-[11px] text-[#8C7A6B] block mt-1.5">
              Uncompleted Checkout Desks
            </span>
          </div>
          <div className="w-11 h-11 rounded-none bg-[#DECFC0] flex items-center justify-center text-[#5C4529] shadow-2xs shrink-0">
            <ShoppingCart size={20} />
          </div>
        </div>

        {/* Metric 2: Unrecovered Pipeline Value */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#7A6C5E] font-medium block">
              Cart Pipeline Value
            </span>
            <div className="font-['Times_New_Roman',serif] text-[26px] font-semibold text-[#2C241E] mt-1 leading-none">
              {formatINR(metrics.abandonedPipelineValue)}
            </div>
            <span className="text-[11px] text-[#8C7A6B] block mt-1.5">
              Pending Timepiece Reservations
            </span>
          </div>
          <div className="w-11 h-11 rounded-none bg-[#DECFC0] flex items-center justify-center text-[#5C4529] shadow-2xs shrink-0">
            <ShieldCheck size={20} />
          </div>
        </div>

        {/* Metric 3: Active Wishlist Patrons */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#7A6C5E] font-medium block">
              Wishlist Collectors
            </span>
            <div className="font-['Times_New_Roman',serif] text-[30px] font-semibold text-[#2C241E] mt-1 leading-none">
              {metrics.wishlistCollectorsCount}
            </div>
            <span className="text-[11px] text-[#8C7A6B] block mt-1.5">
              Clients With Saved Portfolios
            </span>
          </div>
          <div className="w-11 h-11 rounded-none bg-[#DECFC0] flex items-center justify-center text-[#5C4529] shadow-2xs shrink-0">
            <Heart size={20} />
          </div>
        </div>

        {/* Metric 4: Total Wishlisted Items */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#7A6C5E] font-medium block">
              Wishlisted Pieces
            </span>
            <div className="font-['Times_New_Roman',serif] text-[30px] font-semibold text-[#2C241E] mt-1 leading-none">
              {metrics.wishlistedItemsCount}
            </div>
            <span className="text-[11px] text-[#8C7A6B] block mt-1.5">
              Total Saved Allocations
            </span>
          </div>
          <div className="w-11 h-11 rounded-none bg-[#DECFC0] flex items-center justify-center text-[#5C4529] shadow-2xs shrink-0">
            <Package size={20} />
          </div>
        </div>
      </div>

      {/* 2. Controls & Search Block */}
      <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-4 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b md:border-b-0 border-[#DFCFC0] pb-2 md:pb-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-xs uppercase tracking-[0.18em] font-semibold rounded-none transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "all"
                ? "bg-[#2C241E] text-[#FAF6F0]"
                : "bg-transparent text-[#7A6C5E] hover:text-[#2C241E] hover:bg-white/50"
            }`}
          >
            All Activity ({abandonedCheckouts.length + wishlistCollectors.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("abandoned")}
            className={`px-4 py-2 text-xs uppercase tracking-[0.18em] font-semibold rounded-none transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "abandoned"
                ? "bg-[#2C241E] text-[#FAF6F0]"
                : "bg-transparent text-[#7A6C5E] hover:text-[#2C241E] hover:bg-white/50"
            }`}
          >
            <ShoppingCart size={13} />
            <span>Abandoned Checkouts ({abandonedCheckouts.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("wishlist")}
            className={`px-4 py-2 text-xs uppercase tracking-[0.18em] font-semibold rounded-none transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "wishlist"
                ? "bg-[#2C241E] text-[#FAF6F0]"
                : "bg-transparent text-[#7A6C5E] hover:text-[#2C241E] hover:bg-white/50"
            }`}
          >
            <Heart size={13} />
            <span>Wishlist Saves ({wishlistCollectors.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collector, email, phone or watch..."
            className="w-full bg-white/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none pl-9 pr-8 py-2 text-xs outline-none focus:border-[#5C4529] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#2C241E] cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Directory / Cards */}
      {isLoading ? (
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-16 text-center shadow-[0_8px_24px_rgba(80,60,40,0.04)]">
          <RefreshCw size={24} className="animate-spin text-[#5C4529] mx-auto mb-3" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#5C4529] font-medium font-sans">
            Syncing Vault Telemetry & Portfolio Saves...
          </p>
        </div>
      ) : totalEntries === 0 ? (
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-16 text-center shadow-[0_8px_24px_rgba(80,60,40,0.04)]">
          <ShoppingCart size={32} className="text-[#8C7A6B] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-lg text-[#2C241E] uppercase tracking-wider mb-1">
            No Active Cart or Wishlist Records
          </h3>
          <p className="text-xs text-[#7A6C5E] max-w-md mx-auto font-light">
            {searchQuery
              ? `No records found matching "${searchQuery}". Clear your search query to view all activity.`
              : "No abandoned checkout sessions or wishlist saves have been recorded yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* SECTION A: ABANDONED CHECKOUT CARDS */}
          {(activeTab === "all" || activeTab === "abandoned") &&
            filteredAbandoned.map((item) => {
              const sanitizedPhone = sanitizeWhatsAppNumber(item.customerPhone);
              return (
                <div
                  key={`abandoned_${item._id}`}
                  className="bg-[#FAF6F0]/90 backdrop-blur-md border border-[#DFCFC0] rounded-none p-5 sm:p-6 shadow-[0_6px_20px_rgba(80,60,40,0.03)] hover:border-[#5C4529]/60 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Collector & Timepiece Info */}
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 flex-1 min-w-0">
                      {/* Timepiece Image Frame */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-none border border-[#DFCFC0] bg-white overflow-hidden shrink-0 shadow-xs">
                        <Image
                          src={item.timepieceImage || "/assets/Rolex Daytona.png"}
                          alt={item.timepieceTitle}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      {/* Details Column */}
                      <div className="flex-1 min-w-0">
                        {/* Status Badge & Timestamp */}
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                          <span className="bg-[#2C241E] text-[#FAF6F0] rounded-none px-2.5 py-0.5 text-[10px] tracking-[0.18em] uppercase font-semibold font-sans flex items-center gap-1.5">
                            <ShoppingCart size={11} />
                            CHECKOUT ABANDONED
                          </span>

                          <span className="flex items-center gap-1 text-[11px] text-[#7A6C5E] font-['Times_New_Roman',serif]">
                            <Clock size={12} className="text-[#8C7A6B]" />
                            {formatTimestamp(item.lastActiveAt)}
                          </span>
                        </div>

                        {/* Timepiece Title & SKU */}
                        <h3 className="font-serif text-base sm:text-lg text-[#2C241E] font-medium leading-snug truncate">
                          {item.timepieceTitle}
                        </h3>
                        <p className="text-xs text-[#7A6C5E] mt-0.5 truncate">
                          {item.timepieceBrand} • Ref. {item.timepieceReference || "HR-VAULT"}
                        </p>

                        {/* Price Display */}
                        <div className="mt-2 font-['Times_New_Roman',serif] text-base sm:text-lg font-semibold text-[#5C4529]">
                          {formatINR(item.timepiecePrice)}
                        </div>

                        {/* Collector Dossier Row */}
                        <div className="mt-3 pt-3 border-t border-[#DFCFC0]/60 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#5C4F42]">
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-[#8C7A6B]">
                              Collector Name
                            </span>
                            <span className="font-semibold text-[#2C241E]">{item.customerName}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-[#8C7A6B]">
                              Contact Details
                            </span>
                            <span className="block truncate font-mono text-[11px] text-[#2C241E]">
                              {item.customerEmail || "No Email"}
                            </span>
                            <span className="block font-['Times_New_Roman',serif] font-medium text-[#2C241E]">
                              {item.customerPhone || "No Phone on file"}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-[#8C7A6B]">
                              Location & History
                            </span>
                            <span className="flex items-center gap-1 text-[#2C241E]">
                              <MapPin size={11} className="text-[#8C7A6B] shrink-0" />
                              <span className="truncate">{item.shippingCity}, {item.shippingCountry}</span>
                            </span>
                            <span className="block text-[11px] text-[#7A6C5E] font-['Times_New_Roman',serif]">
                              {item.ordersCount} Completed Orders
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: WhatsApp Concierge Actions */}
                    <div className="flex sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#DFCFC0]">
                      {sanitizedPhone ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleDirectWhatsApp(
                                item.customerPhone,
                                item.customerName,
                                item.timepieceTitle,
                                item.timepieceReference
                              )
                            }
                            className="flex-1 sm:flex-none w-full sm:w-auto px-4 py-2.5 bg-[#5C4529] hover:bg-[#47341D] text-[#FAF6F0] rounded-none text-xs tracking-[0.16em] uppercase font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                          >
                            <MessageSquare size={14} />
                            <span>WHATSAPP CONCIERGE</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openCustomModal(
                                item.customerName,
                                item.customerPhone,
                                item.timepieceTitle,
                                item.timepieceBrand,
                                item.timepieceReference,
                                item.timepiecePrice
                              )
                            }
                            className="flex-1 sm:flex-none w-full sm:w-auto px-3.5 py-2.5 border border-[#DFCFC0] bg-[#FAF6F0] hover:bg-[#EFE8DD] text-[#2C241E] rounded-none text-xs tracking-[0.15em] uppercase font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>CUSTOM MESSAGE</span>
                          </button>
                        </>
                      ) : (
                        <div className="bg-[#EFE8DD] border border-[#DFCFC0] px-3.5 py-2 text-[10px] uppercase tracking-wider text-[#8C7A6B] rounded-none font-medium flex items-center gap-1.5">
                          <AlertCircle size={12} />
                          <span>NO PHONE ON FILE</span>
                        </div>
                      )}

                      {item.timepieceSlug && (
                        <Link
                          href={`/timepiece/${item.timepieceSlug}`}
                          target="_blank"
                          className="text-[11px] text-[#7A6C5E] hover:text-[#5C4529] flex items-center gap-1 transition-colors uppercase tracking-wider font-medium mt-1"
                        >
                          <span>View Timepiece Dossier</span>
                          <ExternalLink size={11} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

          {/* SECTION B: WISHLIST COLLECTOR CARDS */}
          {(activeTab === "all" || activeTab === "wishlist") &&
            filteredWishlists.map((col) => {
              const sanitizedPhone = sanitizeWhatsAppNumber(col.customerPhone);
              const primaryItem = col.items[0];

              return (
                <div
                  key={`wishlist_${col._id}`}
                  className="bg-[#FAF6F0]/90 backdrop-blur-md border border-[#DFCFC0] rounded-none p-5 sm:p-6 shadow-[0_6px_20px_rgba(80,60,40,0.03)] hover:border-[#5C4529]/60 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    {/* Left: Collector & Wishlist Items */}
                    <div className="flex-1 min-w-0">
                      {/* Top Header Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="bg-[#5C4529] text-[#FAF6F0] rounded-none px-2.5 py-0.5 text-[10px] tracking-[0.18em] uppercase font-semibold font-sans flex items-center gap-1.5">
                            <Heart size={11} />
                            WISHLIST SAVED ({col.itemsCount} PIECES)
                          </span>
                          <span className="font-['Times_New_Roman',serif] text-xs text-[#7A6C5E]">
                            Updated: {formatTimestamp(col.lastActiveAt)}
                          </span>
                        </div>

                        <div className="font-['Times_New_Roman',serif] text-sm text-[#5C4529] font-semibold">
                          Total Portfolio: {formatINR(col.totalWishlistValue)}
                        </div>
                      </div>

                      {/* Collector Profile Header */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white/70 border border-[#DFCFC0] rounded-none mb-4 text-xs">
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#8C7A6B]">
                            Distinguished Collector
                          </span>
                          <span className="font-semibold text-sm text-[#2C241E]">{col.customerName}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#8C7A6B]">
                            Contact Coordinates
                          </span>
                          <span className="block truncate text-[#2C241E] font-mono text-[11px]">
                            {col.customerEmail || "No Email"}
                          </span>
                          <span className="block font-['Times_New_Roman',serif] font-medium text-[#2C241E]">
                            {col.customerPhone || "No Phone on file"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-[#8C7A6B]">
                            Location & Orders
                          </span>
                          <span className="text-[#2C241E] block">
                            {col.shippingCity}, {col.shippingCountry}
                          </span>
                          <span className="text-[11px] text-[#7A6C5E] font-['Times_New_Roman',serif]">
                            {col.ordersCount} Completed Orders
                          </span>
                        </div>
                      </div>

                      {/* Wishlist Items Preview Strip */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {col.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-2.5 bg-white/80 border border-[#DFCFC0] rounded-none"
                          >
                            <div className="relative w-14 h-14 rounded-none border border-[#DFCFC0] bg-white overflow-hidden shrink-0">
                              <Image
                                src={item.image || "/assets/Rolex Daytona.png"}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif text-xs text-[#2C241E] truncate font-medium">
                                {item.title}
                              </h4>
                              <p className="text-[10px] text-[#7A6C5E] truncate">
                                Ref. {item.reference}
                              </p>
                              <div className="font-['Times_New_Roman',serif] text-xs font-semibold text-[#5C4529] mt-0.5">
                                {formatINR(item.price)}
                              </div>
                            </div>
                            {item.slug && (
                              <Link
                                href={`/timepiece/${item.slug}`}
                                target="_blank"
                                className="text-[#8C7A6B] hover:text-[#5C4529] p-1 cursor-pointer shrink-0"
                                title="Open Timepiece Dossier"
                              >
                                <ExternalLink size={12} />
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: WhatsApp Concierge Action for Wishlist */}
                    <div className="flex sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#DFCFC0]">
                      {sanitizedPhone && primaryItem ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleDirectWhatsApp(
                                col.customerPhone,
                                col.customerName,
                                primaryItem.title,
                                primaryItem.reference
                              )
                            }
                            className="flex-1 sm:flex-none w-full sm:w-auto px-4 py-2.5 bg-[#5C4529] hover:bg-[#47341D] text-[#FAF6F0] rounded-none text-xs tracking-[0.16em] uppercase font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                          >
                            <MessageSquare size={14} />
                            <span>WHATSAPP CONCIERGE</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openCustomModal(
                                col.customerName,
                                col.customerPhone,
                                primaryItem.title,
                                primaryItem.brand,
                                primaryItem.reference,
                                primaryItem.price
                              )
                            }
                            className="flex-1 sm:flex-none w-full sm:w-auto px-3.5 py-2.5 border border-[#DFCFC0] bg-[#FAF6F0] hover:bg-[#EFE8DD] text-[#2C241E] rounded-none text-xs tracking-[0.15em] uppercase font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>CUSTOM MESSAGE</span>
                          </button>
                        </>
                      ) : (
                        <div className="bg-[#EFE8DD] border border-[#DFCFC0] px-3.5 py-2 text-[10px] uppercase tracking-wider text-[#8C7A6B] rounded-none font-medium flex items-center gap-1.5">
                          <AlertCircle size={12} />
                          <span>NO PHONE ON FILE</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* 4. Frosted Glass Custom Message Modal */}
      {customModal && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FAF6F0] border border-[#DFCFC0] rounded-none max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#DFCFC0] pb-3.5">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8C6D46] block mb-1">
                  PRIVATE SALON DISPATCH
                </span>
                <h3 className="font-serif text-xl text-[#2C241E] font-medium">
                  WhatsApp Concierge Transmit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCustomModal(null)}
                className="text-[#8C7A6B] hover:text-[#2C241E] p-1 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Recipient & Watch Summary Banner */}
            <div className="bg-[#EFE8DD]/70 border border-[#DFCFC0] p-3 rounded-none text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[#8C7A6B] uppercase text-[10px] tracking-wider">Recipient</span>
                <span className="font-semibold text-[#2C241E]">{customModal.recipientName}</span>
              </div>
              <div className="flex items-center justify-between font-['Times_New_Roman',serif]">
                <span className="text-[#8C7A6B] uppercase text-[10px] tracking-wider font-sans">
                  Destination Phone
                </span>
                <span className="text-sm font-semibold text-[#2C241E]">
                  +{sanitizeWhatsAppNumber(customModal.recipientPhone)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#DFCFC0]/60">
                <span className="text-[#8C7A6B] uppercase text-[10px] tracking-wider font-sans">
                  Timepiece
                </span>
                <span className="font-serif text-[#5C4529] font-medium truncate max-w-[260px]">
                  {customModal.timepieceTitle} ({formatINR(customModal.timepiecePrice)})
                </span>
              </div>
            </div>

            {/* Quick Template Buttons */}
            <div>
              <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#7A6E63] mb-1.5">
                Quick Concierge Templates
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyTemplate("viewing")}
                  className="px-2.5 py-1 text-[11px] bg-white border border-[#DFCFC0] hover:bg-[#EFE8DD] text-[#2C241E] rounded-none transition-colors cursor-pointer"
                >
                  Private Viewing
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate("delivery")}
                  className="px-2.5 py-1 text-[11px] bg-white border border-[#DFCFC0] hover:bg-[#EFE8DD] text-[#2C241E] rounded-none transition-colors cursor-pointer"
                >
                  Armored Courier
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate("holding")}
                  className="px-2.5 py-1 text-[11px] bg-white border border-[#DFCFC0] hover:bg-[#EFE8DD] text-[#2C241E] rounded-none transition-colors cursor-pointer"
                >
                  24h Allocation Hold
                </button>
              </div>
            </div>

            {/* Message Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#7A6E63]">
                  Concierge Message Text
                </label>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="text-[11px] text-[#5C4529] hover:text-[#2C241E] flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={11} />
                  <span>Copy</span>
                </button>
              </div>
              <textarea
                rows={5}
                value={customModal.messageText}
                onChange={(e) => setCustomModal({ ...customModal, messageText: e.target.value })}
                placeholder="Draft bespoke concierge message..."
                className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none p-3 text-xs outline-none focus:border-[#5C4529] transition-colors leading-relaxed"
              />
              <div className="text-right text-[10px] text-[#8C7A6B] font-['Times_New_Roman',serif] mt-1">
                {customModal.messageText.length} characters
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#DFCFC0]">
              <button
                type="button"
                onClick={() => setCustomModal(null)}
                className="px-4 py-2 bg-white hover:bg-[#EFE8DD] border border-[#DFCFC0] rounded-none text-xs font-semibold text-[#2C241E] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendFromModal}
                className="px-5 py-2 bg-[#5C4529] hover:bg-[#47341D] text-[#FAF6F0] rounded-none text-xs font-semibold uppercase tracking-[0.16em] transition-all cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <Send size={13} />
                <span>SEND VIA WHATSAPP →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

