"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Search,
  RefreshCw,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  X,
  Trash2,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Inbox,
  Filter,
  Watch,
  User,
} from "lucide-react";

// INR Formatter
function formatINR(val: number): string {
  return "₹" + Math.round(val).toLocaleString("en-IN");
}

// Editorial Date Formatter
function formatTimestamp(isoString?: string | Date | null): string {
  if (!isoString) return "Recently Received";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "Recently Received";
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Recently Received";
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

interface InquiryTimepiece {
  timepieceId?: string;
  slug: string;
  title: string;
  brand?: string;
  reference?: string;
  price?: number;
  image?: string;
}

interface InquiryRecord {
  _id: string;
  type: "watch" | "general";
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  timepiece?: InquiryTimepiece | null;
  status: "new" | "in_review" | "resolved";
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface InquiryCounts {
  totalCount: number;
  watchCount: number;
  generalCount: number;
  newCount: number;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [counts, setCounts] = useState<InquiryCounts>({
    totalCount: 0,
    watchCount: 0,
    generalCount: 0,
    newCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "watch" | "general">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "new" | "in_review" | "resolved">("all");

  // Deletion Modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchInquiries = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    setIsRefreshing(true);
    try {
      const params = new URLSearchParams();
      if (selectedType !== "all") params.set("type", selectedType);
      if (selectedStatus !== "all") params.set("status", selectedStatus);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      params.set("t", Date.now().toString());

      const res = await fetch(`/api/admin/inquiries?${params.toString()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (!res.ok) throw new Error("Failed to load salon inquiries");
      const data = await res.json();

      if (data.success) {
        setInquiries(data.inquiries || []);
        if (data.counts) {
          setCounts(data.counts);
        }
      } else {
        throw new Error(data.error || "Failed to load inquiries list");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching inquiries";
      showToast(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedType, selectedStatus, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInquiries();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchInquiries]);

  // Update Status
  const handleUpdateStatus = async (inquiryId: string, newStatus: "new" | "in_review" | "resolved") => {
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update inquiry status");
      }

      setInquiries((prev) =>
        prev.map((item) => (item._id === inquiryId ? { ...item, status: newStatus } : item))
      );
      showToast(`Inquiry marked as ${newStatus.replace("_", " ").toUpperCase()}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating status";
      showToast(msg);
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/inquiries?id=${deleteConfirmId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete inquiry");
      }

      setInquiries((prev) => prev.filter((item) => item._id !== deleteConfirmId));
      setCounts((prev) => ({
        ...prev,
        totalCount: Math.max(0, prev.totalCount - 1),
      }));
      showToast("Inquiry record permanently purged from vault.");
      setDeleteConfirmId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error deleting inquiry";
      showToast(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // WhatsApp Reply Trigger
  const handleWhatsAppReply = (inquiry: InquiryRecord) => {
    const sanitized = sanitizeWhatsAppNumber(inquiry.phone);
    if (!sanitized) {
      showToast("No verified telephone number available for this patron.");
      return;
    }

    let message = "";
    if (inquiry.type === "watch" && inquiry.timepiece) {
      message = `Greetings ${inquiry.name}, this is the Private Salon Concierge at Horologe Royale regarding your inquiry on the ${inquiry.timepiece.title} (Ref. ${inquiry.timepiece.reference || "HR-VAULT"}). How may we assist you with private viewing or bespoke acquisitions today?`;
    } else {
      message = `Greetings ${inquiry.name}, this is the Private Salon Concierge at Horologe Royale regarding your request: "${inquiry.subject || "Concierge Request"}". We are at your service to assist with your inquiry.`;
    }

    const url = `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    showToast(`WhatsApp concierge reply initiated for ${inquiry.name}.`);
  };

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
            CLIENT DISPATCH & CONCIERGE DESK
          </span>
          <h1 className="font-serif text-[28px] sm:text-[32px] text-[#2C241E] leading-tight font-medium uppercase tracking-wide">
            Private Salon Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6C5E] mt-0.5 font-light">
            Centralized ledger for timepiece viewing appointments, private acquisition inquiries, and atelier requests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchInquiries(false)}
          disabled={isRefreshing}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white/60 hover:bg-[#2C241E] text-[#2C241E] hover:text-[#FAF6F0] border border-[#DFCFC0] hover:border-[#2C241E] rounded-none text-xs font-semibold uppercase tracking-[0.16em] transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
          title="Reload Inquiries Ledger"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          <span>{isRefreshing ? "Syncing..." : "Sync Ledger"}</span>
        </button>
      </div>

      {/* 1. KPI Strip (4 Sharp Editorial Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Inquiries */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#7A6C5E] font-medium block">
              Total Inquiries
            </span>
            <div className="font-['Times_New_Roman',serif] text-[30px] font-semibold text-[#2C241E] mt-1 leading-none">
              {counts.totalCount}
            </div>
            <span className="text-[11px] text-[#8C7A6B] block mt-1.5">
              All Client Submissions
            </span>
          </div>
          <div className="w-11 h-11 rounded-none bg-[#DECFC0] flex items-center justify-center text-[#5C4529] shadow-2xs shrink-0">
            <Mail size={20} />
          </div>
        </div>

        {/* Metric 2: Watch Inquiries */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#7A6C5E] font-medium block">
              Watch Enquiries
            </span>
            <div className="font-['Times_New_Roman',serif] text-[30px] font-semibold text-[#2C241E] mt-1 leading-none">
              {counts.watchCount}
            </div>
            <span className="text-[11px] text-[#8C7A6B] block mt-1.5">
              Timepiece-Specific Leads
            </span>
          </div>
          <div className="w-11 h-11 rounded-none bg-[#DECFC0] flex items-center justify-center text-[#5C4529] shadow-2xs shrink-0">
            <Watch size={20} />
          </div>
        </div>

        {/* Metric 3: General Inquiries */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#7A6C5E] font-medium block">
              General Concierge
            </span>
            <div className="font-['Times_New_Roman',serif] text-[30px] font-semibold text-[#2C241E] mt-1 leading-none">
              {counts.generalCount}
            </div>
            <span className="text-[11px] text-[#8C7A6B] block mt-1.5">
              Atelier & Sourcing Desk
            </span>
          </div>
          <div className="w-11 h-11 rounded-none bg-[#DECFC0] flex items-center justify-center text-[#5C4529] shadow-2xs shrink-0">
            <Inbox size={20} />
          </div>
        </div>

        {/* Metric 4: New / Unreviewed */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#7A6C5E] font-medium block">
              Unreviewed Requests
            </span>
            <div className="font-['Times_New_Roman',serif] text-[30px] font-semibold text-[#5C4529] mt-1 leading-none">
              {counts.newCount}
            </div>
            <span className="text-[11px] text-[#8C7A6B] block mt-1.5">
              Awaiting Salon Response
            </span>
          </div>
          <div className="w-11 h-11 rounded-none bg-[#DECFC0] flex items-center justify-center text-[#5C4529] shadow-2xs shrink-0">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* 2. Controls & Search Block */}
      <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-4 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Primary Filter Tabs */}
        <div className="flex items-center gap-1 border-b lg:border-b-0 border-[#DFCFC0] pb-2 lg:pb-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedType("all")}
            className={`px-4 py-2 text-xs uppercase tracking-[0.18em] font-semibold rounded-none transition-all cursor-pointer whitespace-nowrap ${
              selectedType === "all"
                ? "bg-[#2C241E] text-[#FAF6F0]"
                : "bg-transparent text-[#7A6C5E] hover:text-[#2C241E] hover:bg-white/50"
            }`}
          >
            All Inquiries ({counts.totalCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("watch")}
            className={`px-4 py-2 text-xs uppercase tracking-[0.18em] font-semibold rounded-none transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedType === "watch"
                ? "bg-[#2C241E] text-[#FAF6F0]"
                : "bg-transparent text-[#7A6C5E] hover:text-[#2C241E] hover:bg-white/50"
            }`}
          >
            <Watch size={13} />
            <span>Watch Enquiries ({counts.watchCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("general")}
            className={`px-4 py-2 text-xs uppercase tracking-[0.18em] font-semibold rounded-none transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedType === "general"
                ? "bg-[#2C241E] text-[#FAF6F0]"
                : "bg-transparent text-[#7A6C5E] hover:text-[#2C241E] hover:bg-white/50"
            }`}
          >
            <Mail size={13} />
            <span>General & Concierge ({counts.generalCount})</span>
          </button>
        </div>

        {/* Search & Status Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-white/80 border border-[#DFCFC0] text-[#2C241E] rounded-none px-3 py-2 text-xs uppercase tracking-wider outline-none focus:border-[#5C4529] cursor-pointer"
            >
              <option value="all">Status: All</option>
              <option value="new">Status: New Only</option>
              <option value="in_review">Status: In Review</option>
              <option value="resolved">Status: Resolved</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patron, email, phone or watch..."
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
      </div>

      {/* 3. Inquiries Directory / Cards */}
      {isLoading ? (
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-16 text-center shadow-[0_8px_24px_rgba(80,60,40,0.04)]">
          <RefreshCw size={24} className="animate-spin text-[#5C4529] mx-auto mb-3" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#5C4529] font-medium font-sans">
            Syncing Salon Inquiries & Viewing Requests...
          </p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-none p-16 text-center shadow-[0_8px_24px_rgba(80,60,40,0.04)]">
          <Mail size={32} className="text-[#8C7A6B] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-lg text-[#2C241E] uppercase tracking-wider mb-1">
            No Inquiries Match Current Criteria
          </h3>
          <p className="text-xs text-[#7A6C5E] max-w-md mx-auto font-light">
            {searchQuery
              ? `No inquiries found matching "${searchQuery}". Reset your query to view the full ledger.`
              : "No inquiries currently recorded in this category."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => {
            const isWatch = inquiry.type === "watch";
            const sanitizedPhone = sanitizeWhatsAppNumber(inquiry.phone);

            return (
              <div
                key={inquiry._id}
                className="bg-[#FAF6F0]/90 backdrop-blur-md border border-[#DFCFC0] rounded-none p-5 sm:p-6 shadow-[0_6px_20px_rgba(80,60,40,0.03)] hover:border-[#5C4529]/60 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Column: Patron Details, Timepiece (if any), & Message */}
                  <div className="flex-1 min-w-0 space-y-3.5">
                    {/* Top Badges Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isWatch ? (
                          <span className="bg-[#5C4529] text-[#FAF6F0] rounded-none px-2.5 py-0.5 text-[10px] uppercase font-semibold font-sans tracking-[0.16em] flex items-center gap-1.5 shadow-2xs">
                            <Watch size={11} />
                            WATCH ENQUIRY
                          </span>
                        ) : (
                          <span className="bg-[#EFE8DD] text-[#2C241E] border border-[#DFCFC0] rounded-none px-2.5 py-0.5 text-[10px] uppercase font-semibold font-sans tracking-[0.16em] flex items-center gap-1.5">
                            <Mail size={11} />
                            CONCIERGE INQUIRY
                          </span>
                        )}

                        {/* Status Tag */}
                        <span
                          className={`rounded-none px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold font-sans ${
                            inquiry.status === "new"
                              ? "bg-[#2C241E] text-[#FAF6F0]"
                              : inquiry.status === "in_review"
                              ? "bg-[#8C6D46] text-[#FAF6F0]"
                              : "bg-[#EFE8DD] text-[#5C4529] border border-[#DFCFC0]"
                          }`}
                        >
                          {inquiry.status.replace("_", " ")}
                        </span>
                      </div>

                      <span className="font-['Times_New_Roman',serif] text-xs text-[#7A6C5E] flex items-center gap-1">
                        <Clock size={12} className="text-[#8C7A6B]" />
                        {formatTimestamp(inquiry.createdAt)}
                      </span>
                    </div>

                    {/* Patron Contact Header */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white/70 border border-[#DFCFC0] rounded-none text-xs">
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-[#8C7A6B]">
                          Patron Name
                        </span>
                        <span className="font-semibold text-sm text-[#2C241E]">{inquiry.name}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-[#8C7A6B]">
                          Email Address
                        </span>
                        <span className="block truncate text-[#2C241E] font-mono text-[11px]">
                          {inquiry.email}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-[#8C7A6B]">
                          Contact Telephone
                        </span>
                        <span className="block font-['Times_New_Roman',serif] font-medium text-sm text-[#2C241E]">
                          {inquiry.phone}
                        </span>
                      </div>
                    </div>

                    {/* If Watch Enquiry: Framed Timepiece Preview Strip */}
                    {isWatch && inquiry.timepiece && (
                      <div className="flex items-center gap-3.5 p-3 bg-[#EFE8DD]/70 border border-[#DFCFC0] rounded-none">
                        <div className="relative w-14 h-14 rounded-none border border-[#DFCFC0] bg-white overflow-hidden shrink-0 shadow-2xs">
                          <Image
                            src={inquiry.timepiece.image || "/assets/Rolex Daytona.png"}
                            alt={inquiry.timepiece.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase tracking-wider text-[#7A6C5E] font-medium block truncate">
                            {inquiry.timepiece.brand || "Horologe Royale"}
                          </span>
                          <h4 className="font-serif text-sm text-[#2C241E] font-medium truncate">
                            {inquiry.timepiece.title}
                          </h4>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-[11px] text-[#7A6C5E] truncate">
                              Ref. {inquiry.timepiece.reference || "HR-VAULT"}
                            </span>
                            {inquiry.timepiece.price ? (
                              <span className="font-['Times_New_Roman',serif] text-sm font-semibold text-[#5C4529]">
                                {formatINR(inquiry.timepiece.price)}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {inquiry.timepiece.slug && (
                          <Link
                            href={`/timepiece/${inquiry.timepiece.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#8C7A6B] hover:text-[#5C4529] transition-colors cursor-pointer"
                            title="Open Timepiece Dossier"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Subject Line & Message Blockquote */}
                    <div>
                      {inquiry.subject && (
                        <div className="text-xs font-semibold text-[#2C241E] mb-1.5">
                          Subject: {inquiry.subject}
                        </div>
                      )}
                      <blockquote className="bg-white/80 border-l-2 border-[#5C4529] p-3 text-xs leading-relaxed text-[#2C241E] font-light">
                        {inquiry.message}
                      </blockquote>
                    </div>
                  </div>

                  {/* Right Column: Actions (WhatsApp, Status, Delete) */}
                  <div className="flex sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#DFCFC0]">
                    {/* Direct WhatsApp Action */}
                    {sanitizedPhone ? (
                      <button
                        type="button"
                        onClick={() => handleWhatsAppReply(inquiry)}
                        className="flex-1 sm:flex-none w-full sm:w-auto px-4 py-2.5 bg-[#5C4529] hover:bg-[#47341D] text-[#FAF6F0] rounded-none text-xs tracking-[0.16em] uppercase font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                      >
                        <MessageSquare size={14} />
                        <span>WHATSAPP REPLY</span>
                      </button>
                    ) : (
                      <div className="bg-[#EFE8DD] border border-[#DFCFC0] px-3.5 py-2 text-[10px] uppercase tracking-wider text-[#8C7A6B] rounded-none font-medium flex items-center gap-1.5">
                        <span>NO PHONE</span>
                      </div>
                    )}

                    {/* Status Changer Buttons */}
                    <div className="flex items-center gap-1.5">
                      {inquiry.status !== "new" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(inquiry._id, "new")}
                          className="px-2.5 py-1.5 bg-white hover:bg-[#EFE8DD] text-[#2C241E] border border-[#DFCFC0] rounded-none text-[10px] uppercase tracking-wider font-medium cursor-pointer transition-colors"
                        >
                          Mark New
                        </button>
                      )}
                      {inquiry.status !== "in_review" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(inquiry._id, "in_review")}
                          className="px-2.5 py-1.5 bg-white hover:bg-[#EFE8DD] text-[#8C6D46] border border-[#DFCFC0] rounded-none text-[10px] uppercase tracking-wider font-semibold cursor-pointer transition-colors"
                        >
                          In Review
                        </button>
                      )}
                      {inquiry.status !== "resolved" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(inquiry._id, "resolved")}
                          className="px-2.5 py-1.5 bg-[#5C4529]/15 hover:bg-[#5C4529] text-[#5C4529] hover:text-[#FAF6F0] border border-[#5C4529]/30 rounded-none text-[10px] uppercase tracking-wider font-semibold cursor-pointer transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                    </div>

                    {/* Delete Trigger */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(inquiry._id)}
                      className="p-2 bg-white/70 hover:bg-[#2C241E] text-[#7A6C5E] hover:text-[#FAF6F0] border border-[#DFCFC0] hover:border-[#2C241E] rounded-none transition-all cursor-pointer mt-1"
                      title="Purge Inquiry Record"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#FAF6F0] border border-[#DFCFC0] rounded-none max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-none bg-[#2C241E] text-[#FAF6F0] flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#2C241E]">
                  Purge Inquiry Record
                </h3>
                <p className="text-xs text-[#7A6C5E] mt-0.5">
                  Are you sure you wish to permanently delete this client inquiry? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#DFCFC0]">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-white hover:bg-[#EFE8DD] border border-[#DFCFC0] rounded-none text-xs font-semibold text-[#2C241E] transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteInquiry}
                className="px-5 py-2 bg-[#2C241E] hover:bg-black text-[#FAF6F0] rounded-none text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Purging..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

