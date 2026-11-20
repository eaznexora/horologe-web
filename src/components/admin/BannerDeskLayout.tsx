"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  RefreshCw,
  Check,
  AlertCircle,
  Eye,
  ArrowUpRight,
  Smartphone,
  Monitor,
  Film,
  Image as ImageIcon,
  Save,
  RotateCcw,
  ArrowLeft,
  Info,
  Link as LinkIcon,
} from "lucide-react";

export interface SlotConfig {
  slotKey: string;
  section: string;
  title: string;
  description: string;
  defaultDesktop: string;
  defaultMobile?: string;
  recommendedDims: string;
  mediaType: "image" | "video";
  hasMobileOverride: boolean;
}

export interface BannerSlotState {
  desktopUrl: string;
  mobileUrl: string;
  linkUrl?: string;
  mediaType: "image" | "video";
}

interface BannerDeskLayoutProps {
  pageKey: "collections" | "sell-your-luxury" | "concierge" | "auth" | "home" | "insights";
  pageTitle: string;
  breadcrumbLabel: string;
  pageSubtitle: string;
  storefrontHref: string;
  slots: SlotConfig[];
  noticeBanner?: string;
}

export default function BannerDeskLayout({
  pageKey,
  pageTitle,
  breadcrumbLabel,
  pageSubtitle,
  storefrontHref,
  slots,
  noticeBanner,
}: BannerDeskLayoutProps) {
  const [banners, setBanners] = useState<Record<string, BannerSlotState>>({});
  const [loading, setLoading] = useState(true);
  const [savingSlot, setSavingSlot] = useState<string | null>(null);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>("all");

  const desktopFileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const mobileFileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchBanners();
  }, [pageKey]);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/banners?page=${pageKey}&t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && data.banners) {
        setBanners(data.banners);
      }
    } catch (err) {
      console.error(`Failed to load ${pageKey} banners:`, err);
      showNotification("error", "Failed to retrieve banner configurations.");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((current) => (current?.message === message ? null : current));
    }, 4500);
  };

  const handleInputChange = (
    slotKey: string,
    field: "desktopUrl" | "mobileUrl" | "linkUrl",
    value: string
  ) => {
    setBanners((prev) => ({
      ...prev,
      [slotKey]: {
        desktopUrl: field === "desktopUrl" ? value : prev[slotKey]?.desktopUrl || "",
        mobileUrl: field === "mobileUrl" ? value : prev[slotKey]?.mobileUrl || "",
        linkUrl: field === "linkUrl" ? value : prev[slotKey]?.linkUrl || "",
        mediaType: prev[slotKey]?.mediaType || (slotKey.startsWith("gender-") ? "video" : "image"),
      },
    }));
  };

  const handleFileUpload = async (
    slotKey: string,
    target: "desktop" | "mobile",
    file: File
  ) => {
    const uploadKey = `${slotKey}-${target}`;
    setUploadingTarget(uploadKey);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload-media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      const mediaUrl = data.url;
      handleInputChange(slotKey, target === "desktop" ? "desktopUrl" : "mobileUrl", mediaUrl);
      showNotification("success", `Media uploaded successfully: ${data.filename}`);
    } catch (err: any) {
      console.error("Upload error:", err);
      showNotification("error", err.message || "File upload failed.");
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleSaveSlot = async (slot: SlotConfig) => {
    setSavingSlot(slot.slotKey);
    try {
      const current = banners[slot.slotKey] || {
        desktopUrl: "",
        mobileUrl: "",
        linkUrl: "",
        mediaType: slot.mediaType,
      };

      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pageKey,
          slotKey: slot.slotKey,
          desktopUrl: current.desktopUrl,
          mobileUrl: current.mobileUrl,
          linkUrl: current.linkUrl || "",
          mediaType: slot.mediaType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Save failed");
      }

      showNotification("success", `Slot "${slot.title}" successfully saved to MongoDB Atlas.`);
    } catch (err: any) {
      console.error("Save error:", err);
      showNotification("error", err.message || "Failed to save banner slot.");
    } finally {
      setSavingSlot(null);
    }
  };

  const handleResetSlot = async (slot: SlotConfig) => {
    if (!confirm(`Reset "${slot.title}" to original default asset?`)) return;

    setSavingSlot(slot.slotKey);
    try {
      const res = await fetch(
        `/api/banners?page=${pageKey}&slotKey=${encodeURIComponent(slot.slotKey)}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Reset failed");
      }

      setBanners((prev) => {
        const next = { ...prev };
        delete next[slot.slotKey];
        return next;
      });

      showNotification("success", `Slot "${slot.title}" reset to default.`);
    } catch (err: any) {
      console.error("Reset error:", err);
      showNotification("error", err.message || "Failed to reset banner slot.");
    } finally {
      setSavingSlot(null);
    }
  };

  const sections = Array.from(new Set(slots.map((s) => s.section)));

  const filteredSlots =
    activeSectionFilter === "all"
      ? slots
      : slots.filter((s) => s.section === activeSectionFilter);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#DFCFC0]">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#7A6C5E] mb-2 font-medium">
            <Link
              href="/admin/banners/home"
              className="hover:text-[#2C241E] transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Banners
            </Link>
            <span>/</span>
            <span className="text-[#5C4529] font-semibold">{breadcrumbLabel}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#2C241E] font-normal tracking-tight uppercase">
            {pageTitle}
          </h1>
          <p className="text-sm text-[#7A6C5E] mt-1">{pageSubtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={storefrontHref}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#DFCFC0] bg-[#FAF6F0] text-[#5C4529] hover:bg-[#EFE8DD] text-xs font-semibold uppercase tracking-widest transition-colors rounded-none"
          >
            <span>View Page</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={fetchBanners}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5C4529] text-[#FAF6F0] hover:bg-[#4A3720] text-xs font-semibold uppercase tracking-widest transition-colors rounded-none disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {/* Notice Callout (if any, e.g. for Auth) */}
      {noticeBanner && (
        <div className="p-4 border border-[#DFCFC0] bg-[#EFE8DD]/70 text-xs text-[#2C241E] leading-relaxed flex items-start gap-3 rounded-none">
          <Info className="w-4 h-4 text-[#5C4529] shrink-0 mt-0.5" />
          <div>{noticeBanner}</div>
        </div>
      )}

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 border text-xs tracking-wide uppercase font-medium flex items-center justify-between rounded-none transition-all ${
            notification.type === "success"
              ? "bg-[#FAF6F0] border-[#5C4529] text-[#5C4529]"
              : "bg-[#FDF9F3] border-[#7A6C5E] text-[#2C241E]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === "success" ? (
              <Check className="w-4 h-4 text-[#5C4529]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#7A6C5E]" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs text-[#7A6C5E] hover:text-[#2C241E]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Section Filter Pills (rendered only when there are multiple sections) */}
      {sections.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveSectionFilter("all")}
            className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium transition-all rounded-none border cursor-pointer ${
              activeSectionFilter === "all"
                ? "bg-[#2C241E] text-[#FAF6F0] border-[#2C241E]"
                : "bg-[#FAF6F0] text-[#7A6C5E] border-[#DFCFC0] hover:border-[#5C4529]"
            }`}
          >
            All Sections ({slots.length})
          </button>

          {sections.map((sec) => {
            const count = slots.filter((s) => s.section === sec).length;
            return (
              <button
                key={sec}
                type="button"
                onClick={() => setActiveSectionFilter(sec)}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium transition-all rounded-none border cursor-pointer ${
                  activeSectionFilter === sec
                    ? "bg-[#2C241E] text-[#FAF6F0] border-[#2C241E]"
                    : "bg-[#FAF6F0] text-[#7A6C5E] border-[#DFCFC0] hover:border-[#5C4529]"
                }`}
              >
                {sec} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Slots List */}
      <div className="space-y-8">
        {filteredSlots.map((slot) => {
          const liveData = banners[slot.slotKey];
          const hasCustomDesktop = !!liveData?.desktopUrl;
          const hasCustomMobile = !!liveData?.mobileUrl;
          const hasCustomLink = !!liveData?.linkUrl;

          const activeDesktopSrc = liveData?.desktopUrl || slot.defaultDesktop;
          const activeMobileSrc =
            liveData?.mobileUrl || slot.defaultMobile || liveData?.desktopUrl || slot.defaultDesktop;

          const isSaving = savingSlot === slot.slotKey;
          const isUploadingDesktop = uploadingTarget === `${slot.slotKey}-desktop`;
          const isUploadingMobile = uploadingTarget === `${slot.slotKey}-mobile`;

          return (
            <div
              key={slot.slotKey}
              className="border border-[#DFCFC0] bg-[#FAF6F0] rounded-none shadow-xs overflow-hidden"
            >
              {/* Card Header Strip */}
              <div className="bg-[#EFE8DD] px-5 py-3.5 border-b border-[#DFCFC0] flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#5C4529] inline-block" />
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-[#7A6C5E] font-medium block">
                      {slot.section}
                    </span>
                    <h3 className="text-base font-serif text-[#2C241E] font-semibold tracking-wide">
                      {slot.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#7A6C5E] font-medium flex items-center gap-1.5">
                    {slot.mediaType === "video" ? (
                      <Film className="w-3.5 h-3.5 text-[#5C4529]" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 text-[#5C4529]" />
                    )}
                    <span className="font-['Times_New_Roman',serif] text-xs">
                      {slot.recommendedDims}
                    </span>
                  </span>

                  <span
                    className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-none border ${
                      hasCustomDesktop || hasCustomMobile || hasCustomLink
                        ? "bg-[#5C4529] text-[#FAF6F0] border-[#5C4529]"
                        : "bg-[#FAF6F0] text-[#7A6C5E] border-[#DFCFC0]"
                    }`}
                  >
                    {hasCustomDesktop || hasCustomMobile || hasCustomLink ? "Live Custom" : "Default Asset"}
                  </span>
                </div>
              </div>

              {/* Main Body Grid: Left Preview + Right Controls */}
              <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Preview Column (5 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-[#7A6C5E] font-medium flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#5C4529]" />
                      Visual Preview
                    </span>
                    <span className="text-[11px] text-[#7A6C5E]">
                      {slot.mediaType === "video" ? "HTML5 Autoloop" : "Live Frame"}
                    </span>
                  </div>

                  <div className="relative border border-[#DFCFC0] bg-[#2C241E] aspect-video w-full overflow-hidden flex items-center justify-center">
                    {activeDesktopSrc ? (
                      slot.mediaType === "video" ? (
                        <video
                          key={activeDesktopSrc}
                          src={activeDesktopSrc}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={activeDesktopSrc}
                          alt={slot.title}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            if (slot.defaultDesktop) {
                              (e.currentTarget as HTMLImageElement).src = slot.defaultDesktop;
                            }
                          }}
                        />
                      )
                    ) : (
                      <div className="text-center p-6 text-[#DFCFC0] text-xs font-sans">
                        <span className="block font-serif text-sm uppercase text-[#FAF6F0] mb-1">
                          Pure Ivory Canvas
                        </span>
                        <span>No image configured. Renders default #FAF6F0 background.</span>
                      </div>
                    )}

                    <div className="absolute top-2 left-2 bg-[#2C241E]/80 px-2 py-0.5 text-[10px] text-[#FAF6F0] tracking-wider uppercase font-mono">
                      {slot.slotKey}
                    </div>
                  </div>

                  <p className="text-xs text-[#7A6C5E] leading-relaxed">{slot.description}</p>
                </div>

                {/* Right Controls Column (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Desktop Variant Control */}
                  <div className="p-4 border border-[#DFCFC0] bg-white/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs uppercase tracking-wider text-[#2C241E] font-semibold flex items-center gap-2">
                        <Monitor className="w-3.5 h-3.5 text-[#5C4529]" />
                        <span>Desktop Media Path or URL</span>
                      </label>
                      <span className="text-[10px] text-[#7A6C5E] font-mono truncate max-w-[200px]">
                        Default: {slot.defaultDesktop || "None (Transparent)"}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={liveData?.desktopUrl ?? ""}
                        placeholder={slot.defaultDesktop || "e.g. /api/media/banners/... or URL"}
                        onChange={(e) =>
                          handleInputChange(slot.slotKey, "desktopUrl", e.target.value)
                        }
                        className="flex-1 px-3 py-2 text-xs border border-[#DFCFC0] bg-[#FAF6F0] text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-mono rounded-none"
                      />

                      <input
                        type="file"
                        ref={(el) => {
                          desktopFileInputs.current[slot.slotKey] = el;
                        }}
                        accept={
                          slot.mediaType === "video"
                            ? "video/mp4,video/webm"
                            : "image/png,image/jpeg,image/webp"
                        }
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(slot.slotKey, "desktop", file);
                        }}
                      />

                      <button
                        type="button"
                        disabled={isUploadingDesktop}
                        onClick={() => desktopFileInputs.current[slot.slotKey]?.click()}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-[#5C4529] bg-[#EFE8DD] text-[#5C4529] hover:bg-[#5C4529] hover:text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider transition-colors rounded-none disabled:opacity-50 shrink-0"
                      >
                        <Upload
                          className={`w-3.5 h-3.5 ${isUploadingDesktop ? "animate-spin" : ""}`}
                        />
                        <span>{isUploadingDesktop ? "Uploading..." : "Upload File"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Optional Mobile Variant Control */}
                  {slot.hasMobileOverride && (
                    <div className="p-4 border border-[#DFCFC0] bg-white/70 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs uppercase tracking-wider text-[#2C241E] font-semibold flex items-center gap-2">
                          <Smartphone className="w-3.5 h-3.5 text-[#5C4529]" />
                          <span>Mobile Viewport Media Path (Optional)</span>
                        </label>
                        <span className="text-[10px] text-[#7A6C5E] font-mono truncate max-w-[200px]">
                          {slot.defaultMobile
                            ? `Default: ${slot.defaultMobile}`
                            : "Falls back to Desktop"}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={liveData?.mobileUrl ?? ""}
                          placeholder={slot.defaultMobile || "Leave empty to inherit desktop banner"}
                          onChange={(e) =>
                            handleInputChange(slot.slotKey, "mobileUrl", e.target.value)
                          }
                          className="flex-1 px-3 py-2 text-xs border border-[#DFCFC0] bg-[#FAF6F0] text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-mono rounded-none"
                        />

                        <input
                          type="file"
                          ref={(el) => {
                            mobileFileInputs.current[slot.slotKey] = el;
                          }}
                          accept={
                            slot.mediaType === "video"
                              ? "video/mp4,video/webm"
                              : "image/png,image/jpeg,image/webp"
                          }
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(slot.slotKey, "mobile", file);
                          }}
                        />

                        <button
                          type="button"
                          disabled={isUploadingMobile}
                          onClick={() => mobileFileInputs.current[slot.slotKey]?.click()}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-[#5C4529] bg-[#EFE8DD] text-[#5C4529] hover:bg-[#5C4529] hover:text-[#FAF6F0] text-xs font-semibold uppercase tracking-wider transition-colors rounded-none disabled:opacity-50 shrink-0"
                        >
                          <Upload
                            className={`w-3.5 h-3.5 ${isUploadingMobile ? "animate-spin" : ""}`}
                          />
                          <span>{isUploadingMobile ? "Uploading..." : "Upload Mobile"}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Optional Destination Redirect Link */}
                  <div className="p-4 border border-[#DFCFC0] bg-white/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs uppercase tracking-wider text-[#2C241E] font-semibold flex items-center gap-2">
                        <LinkIcon className="w-3.5 h-3.5 text-[#5C4529]" />
                        <span>REDIRECT DESTINATION URL (OPTIONAL)</span>
                      </label>
                      <span className="text-[10px] text-[#7A6C5E] uppercase tracking-wider bg-[#EFE8DD] px-2 py-0.5 rounded-none font-medium">
                        Leave empty for non-clickable display
                      </span>
                    </div>

                    <input
                      type="text"
                      value={liveData?.linkUrl ?? ""}
                      placeholder="e.g. /collections or /timepiece/rolex-daytona"
                      onChange={(e) =>
                        handleInputChange(slot.slotKey, "linkUrl", e.target.value)
                      }
                      className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] rounded-none px-3.5 py-2.5 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-mono"
                    />
                  </div>

                  {/* Action Buttons Strip */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isSaving || (!hasCustomDesktop && !hasCustomMobile && !hasCustomLink)}
                      onClick={() => handleResetSlot(slot)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#DFCFC0] bg-transparent text-[#7A6C5E] hover:text-[#2C241E] hover:bg-[#EFE8DD] text-xs font-semibold uppercase tracking-widest transition-colors rounded-none disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Default</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleSaveSlot(slot)}
                      className="inline-flex items-center gap-1.5 px-6 py-2 bg-[#5C4529] text-[#FAF6F0] hover:bg-[#4A3720] text-xs font-semibold uppercase tracking-widest transition-colors rounded-none disabled:opacity-50"
                    >
                      <Save className={`w-3.5 h-3.5 ${isSaving ? "animate-spin" : ""}`} />
                      <span>{isSaving ? "Saving..." : "Save Banner"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
