"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  RotateCcw,
  Upload,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  X,
  Clock,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Check,
  Plus,
  Trash2,
  Globe,
  ExternalLink,
} from "lucide-react";
import { formatINR } from "@/components/timepiece/DynamicTimepieceOverview";

interface SubCategoryItem {
  _id: string;
  name: string;
  slug: string;
}

interface CategoryParent {
  _id: string;
  name: string;
  slug: string;
  subcategories?: SubCategoryItem[];
}

interface WatchCategoryItem {
  _id: string;
  name: string;
  slug: string;
  status: string;
}

interface ImageSlot {
  id: number;
  label: string;
  file: File | null;
  previewUrl: string;
  fileName: string;
}

interface PillarItem {
  title: string;
  description: string;
}

interface KeySpecItem {
  label: string;
  value: string;
}

// Exactly 4 image slots specification
const INITIAL_IMAGE_SLOTS: ImageSlot[] = [
  { id: 1, label: "Hero Showcase (Main View)", file: null, previewUrl: "", fileName: "" },
  { id: 2, label: "Gallery Slot 2 (Angle 3/4)", file: null, previewUrl: "", fileName: "" },
  { id: 3, label: "Gallery Slot 3 (Side / Profile)", file: null, previewUrl: "", fileName: "" },
  { id: 4, label: "Gallery Slot 4 (Dial Detail)", file: null, previewUrl: "", fileName: "" },
];

const INITIAL_PILLARS: PillarItem[] = [
  {
    title: "TIMEPIECES SOURCED",
    description: "We prioritise transparency, provenance, and complete confidence with every acquisition.",
  },
  {
    title: "AUTHENTICITY ASSURED",
    description: "Rigorous multi-point horological certification conducted by certified master watchmakers.",
  },
  {
    title: "ALL OVER INDIA DELIVERY",
    description: "Fully insured transit and discreet private courier delivery straight to your doorstep.",
  },
];

const INITIAL_KEY_SPECS: KeySpecItem[] = [
  { label: "CASE SIZE", value: "40 mm" },
  { label: "CASE MATERIAL", value: "Stainless Steel" },
  { label: "MOVEMENT", value: "Automatic" },
  { label: "POWER RESERVE", value: "72 Hours" },
  { label: "WATER RESISTANCE", value: "100m" },
];

export default function AddProductPage() {
  // Live API Categories
  const [categories, setCategories] = useState<CategoryParent[]>([]);
  const [watchCategories, setWatchCategories] = useState<WatchCategoryItem[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [minorSpecs, setMinorSpecs] = useState<string[]>([
    "Chronograph",
    "Automatic",
    "Oystersteel",
  ]);

  // Category Triad
  const [parentCategory, setParentCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [watchCategory, setWatchCategory] = useState("");
  const [conditionBadge, setConditionBadge] = useState("Preowned");
  const [gradeBadge, setGradeBadge] = useState("Excellent Condition");
  const [scopeBadge, setScopeBadge] = useState("Full Set");

  // Editorial & Punchline
  const [tagline, setTagline] = useState(
    "Precision engineered for those who value every second."
  );
  const [heritageHeadline, setHeritageHeadline] = useState(
    "A CHRONOGRAPHY WITH A LEGACY."
  );
  const [heritageStory, setHeritageStory] = useState(
    "We prioritise transparency, provenance, and complete confidence with every acquisition. Each reference undergoes comprehensive mechanical inspection, timegrapher calibration, and vault certification."
  );

  // Dual Pricing
  const [price, setPrice] = useState("2000000");
  const [originalPrice, setOriginalPrice] = useState("2500000");

  // Dynamic Pillars (Up to 3)
  const [pillars, setPillars] = useState<PillarItem[]>(INITIAL_PILLARS);

  // Dynamic Key-Value Specs Grid
  const [keySpecs, setKeySpecs] = useState<KeySpecItem[]>(INITIAL_KEY_SPECS);

  // SEO Suite
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [focusKeywords, setFocusKeywords] = useState("rolex, daytona, luxury watch, chronograph");

  // Exactly 4 image slots
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(INITIAL_IMAGE_SLOTS);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [createdProductSlug, setCreatedProductSlug] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Fetch Live Categories from MongoDB
  useEffect(() => {
    let isMounted = true;
    async function loadDropdowns() {
      try {
        setIsLoadingDropdowns(true);
        const [catRes, watchCatRes] = await Promise.all([
          fetch("/api/admin/categories?admin=true"),
          fetch("/api/admin/watch-categories?admin=true"),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.success && Array.isArray(catData.categories)) {
            if (isMounted) {
              setCategories(catData.categories);
              if (catData.categories.length > 0) {
                setParentCategory(catData.categories[0]._id);
              }
            }
          }
        }

        if (watchCatRes.ok) {
          const watchData = await watchCatRes.json();
          if (watchData.success && Array.isArray(watchData.categories)) {
            if (isMounted) {
              setWatchCategories(watchData.categories);
              if (watchData.categories.length > 0) {
                setWatchCategory(watchData.categories[0]._id);
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load intake dropdowns", err);
      } finally {
        if (isMounted) setIsLoadingDropdowns(false);
      }
    }
    loadDropdowns();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute available subcategories
  const selectedParentObj = categories.find((c) => c._id === parentCategory);
  const availableSubcategories = selectedParentObj?.subcategories || [];

  // Dual Pricing Computations
  const priceNum = parseFloat(price) || 0;
  const originalPriceNum = parseFloat(originalPrice) || 0;
  const savings =
    originalPriceNum > priceNum && priceNum > 0 ? originalPriceNum - priceNum : 0;
  const savingsPercent =
    originalPriceNum > 0 && savings > 0
      ? Math.round((savings / originalPriceNum) * 100)
      : 0;

  // Auto-generate slug when name changes (if user hasn't manually edited slug)
  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(autoSlug);
    if (!metaTitle) {
      setMetaTitle(`${val} | Horologe Royale`);
    }
  };

  // Image Upload Handler
  const handleFileChange = (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageSlots((prev) =>
        prev.map((slot, idx) =>
          idx === slotIndex
            ? {
                ...slot,
                file,
                previewUrl: result,
                fileName: file.name,
              }
            : slot
        )
      );
      showToast(`Loaded ${INITIAL_IMAGE_SLOTS[slotIndex].label}`);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImageSlots((prev) =>
      prev.map((slot, idx) =>
        idx === slotIndex
          ? {
              ...slot,
              file: null,
              previewUrl: "",
              fileName: "",
            }
          : slot
      )
    );
    if (fileInputRefs.current[slotIndex]) {
      fileInputRefs.current[slotIndex]!.value = "";
    }
    showToast(`Cleared Slot ${slotIndex + 1}`);
  };

  const triggerUpload = (slotIndex: number) => {
    fileInputRefs.current[slotIndex]?.click();
  };

  // Minor Specs Handlers (Max 3)
  const handleMinorSpecChange = (index: number, val: string) => {
    setMinorSpecs((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  // Pillar Handlers (Up to 3)
  const handlePillarChange = (
    index: number,
    field: "title" | "description",
    val: string
  ) => {
    setPillars((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleAddPillar = () => {
    if (pillars.length >= 3) {
      showToast("Maximum 3 Pillar Highlights allowed");
      return;
    }
    setPillars((prev) => [
      ...prev,
      { title: "EXQUISITE CRAFTSMANSHIP", description: "Unrivaled artisanal finishing." },
    ]);
  };

  const handleRemovePillar = (index: number) => {
    if (pillars.length <= 1) {
      showToast("At least 1 Pillar must remain");
      return;
    }
    setPillars((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Key Specs Handlers
  const handleKeySpecChange = (
    index: number,
    field: "label" | "value",
    val: string
  ) => {
    setKeySpecs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleAddKeySpec = () => {
    setKeySpecs((prev) => [
      ...prev,
      { label: "DIAL COLOR", value: "White Lacquer" },
    ]);
  };

  const handleRemoveKeySpec = (index: number) => {
    setKeySpecs((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Reset Form
  const handleReset = () => {
    setName("");
    setSlug("");
    setMinorSpecs(["Chronograph", "Automatic", "Oystersteel"]);
    setPrice("2000000");
    setOriginalPrice("2500000");
    setTagline("Precision engineered for those who value every second.");
    setHeritageHeadline("A CHRONOGRAPHY WITH A LEGACY.");
    setHeritageStory(
      "We prioritise transparency, provenance, and complete confidence with every acquisition. Each reference undergoes comprehensive mechanical inspection, timegrapher calibration, and vault certification."
    );
    setConditionBadge("Preowned");
    setGradeBadge("Excellent Condition");
    setScopeBadge("Full Set");
    setPillars(INITIAL_PILLARS);
    setKeySpecs(INITIAL_KEY_SPECS);
    setMetaTitle("");
    setMetaDescription("");
    setCanonicalUrl("");
    setFocusKeywords("rolex, daytona, luxury watch");
    setImageSlots(INITIAL_IMAGE_SLOTS);
    setCreatedProductSlug(null);
    showToast("Intake fields reset to default values");
  };

  // Submit Handler
  const handleSubmit = async (actionType: "draft" | "publish") => {
    if (!name.trim()) {
      showToast("Product Title / Name is required");
      return;
    }
    if (!price || isNaN(Number(price))) {
      showToast("A valid Selling Price (INR) is required");
      return;
    }

    try {
      setIsSubmitting(true);

      // Extract image URLs or previews
      const imagesPayload = imageSlots.map((slot) => slot.previewUrl || "/logo.png");

      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        images: imagesPayload,
        minorSpecs: minorSpecs.filter(Boolean).slice(0, 3),
        category: parentCategory || undefined,
        subCategory: subCategory || undefined,
        watchCategory: watchCategory || undefined,
        conditionBadge,
        gradeBadge,
        scopeBadge,
        tagline,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        heritageHeadline,
        heritageStory,
        pillars,
        keySpecs,
        seo: {
          metaTitle: metaTitle || `${name} | Horologe Royale`,
          metaDescription: metaDescription || tagline,
          canonicalUrl: canonicalUrl || `/timepiece/${slug}`,
          focusKeywords,
        },
        status: actionType === "publish" ? "active" : "draft",
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCreatedProductSlug(data.slug);
        showToast(
          actionType === "publish"
            ? `Successfully registered "${name}" into Vault!`
            : `Saved draft for "${name}"`
        );
      } else {
        showToast(data.error || "Failed to register timepiece");
      }
    } catch (err: any) {
      console.error("Submission failed:", err);
      showToast("Network error submitting product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-36">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#2C241E] text-[#FAF6F0] px-4 py-2.5 rounded-xl shadow-xl border border-[#D4C6B3]/60 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="text-[#5C4529]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            href="/admin/products"
            className="w-9 h-9 bg-white/45 backdrop-blur-md border border-white/60 rounded-xl flex items-center justify-center text-[#2C241E] hover:bg-white/70 shadow-sm transition-all cursor-pointer"
            aria-label="Back to Product List"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <span className="text-[10px] tracking-[0.25em] text-[#8C7A6B] uppercase font-semibold block ml-3 mt-0.5">
              VAULT INTAKE ENGINE
            </span>
            <h1 className="font-serif text-[24px] lg:text-[28px] font-medium text-[#2C241E] ml-3 tracking-tight leading-tight">
              Add a New Timepiece
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-[#8C7A6B] hover:text-[#5C4529] bg-white/40 hover:bg-white/70 border border-white/60 px-3.5 py-1.5 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          title="Reset intake form"
        >
          <RotateCcw size={13} />
          <span>Reset Form</span>
        </button>
      </div>

      {/* Success Banner when product created */}
      {createdProductSlug && (
        <div className="mb-6 p-4 rounded-2xl bg-[#EFE7DE] border border-[#D4C6B3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#5C4529] text-white flex items-center justify-center shrink-0">
              <Check size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#2C241E]">
                Timepiece is live in the vault!
              </p>
              <p className="text-[11px] text-[#7A6C5E]">
                Accessible via slug:{" "}
                <span className="font-mono text-[#5C4529] font-medium">
                  /timepiece/{createdProductSlug}
                </span>
              </p>
            </div>
          </div>
          <Link
            href={`/timepiece/${createdProductSlug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-[#5C4529] hover:bg-[#47341D] text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            <span>View Live Showcase</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      )}

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: CORE IDENTITY, TRIAD, PRICING, NARRATIVE, SEO */}
        {/* ========================================================= */}
        <div className="space-y-6">
          {/* SECTION 1: CORE PRODUCT IDENTITY & MINOR SPECS */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D4C6B3]/50">
              <Sparkles size={16} className="text-[#5C4529]" />
              <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                1. Core Identity &amp; Title
              </h2>
            </div>

            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Main Product Name <span className="text-[#5C4529]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rolex Cosmograph Daytona"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs transition-colors"
                />
                <p className="text-[11px] text-[#7A6C5E] mt-1">
                  Rendered in high-contrast editorial uppercase serif on the storefront showcase.
                </p>
              </div>

              {/* Slug */}
              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Product Slug / URL Path
                </label>
                <div className="flex items-center bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3 py-2 text-xs text-[#2C241E]">
                  <span className="text-[#8C7A6B] font-mono text-[11px] select-none">
                    /timepiece/
                  </span>
                  <input
                    type="text"
                    placeholder="rolex-cosmograph-daytona"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-[#2C241E] font-mono ml-1 text-xs"
                  />
                </div>
              </div>

              {/* Minor Specifications (Max 3 Items) */}
              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Minor Specifications (Max 3 Tags)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx}>
                      <span className="text-[10px] text-[#8C7A6B] block mb-1">
                        Tag {idx + 1}
                      </span>
                      <input
                        type="text"
                        placeholder={idx === 0 ? "Chronograph" : idx === 1 ? "Automatic" : "Oystersteel"}
                        value={minorSpecs[idx] || ""}
                        onChange={(e) => handleMinorSpecChange(idx, e.target.value)}
                        className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#7A6C5E] mt-1">
                  Rendered below the title separated by vertical bars:{" "}
                  <span className="font-mono text-[#5C4529]">
                    {minorSpecs.filter(Boolean).join(" | ") || "Tag 1 | Tag 2 | Tag 3"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: THE CATEGORY TRIAD (STATUS & PILLS) */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D4C6B3]/50">
              <ShieldCheck size={16} className="text-[#5C4529]" />
              <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                2. Category Triad &amp; Status Badges
              </h2>
            </div>

            <div className="space-y-4">
              {/* Category Dropdowns (Parent, Subcategory, WatchCategory) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Storefront Parent Category */}
                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Parent Category <span className="text-[#5C4529]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={parentCategory}
                      onChange={(e) => {
                        setParentCategory(e.target.value);
                        setSubCategory("");
                      }}
                      className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-7 shadow-xs focus:border-[#5C4529]/60 transition-colors"
                    >
                      <option value="">Select Mega-Menu Category...</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
                    />
                  </div>
                </div>

                {/* Subcategory */}
                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Subcategory (Optional)
                  </label>
                  <div className="relative">
                    <select
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      disabled={!parentCategory || availableSubcategories.length === 0}
                      className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-7 shadow-xs focus:border-[#5C4529]/60 transition-colors disabled:opacity-50"
                    >
                      <option value="">
                        {!parentCategory
                          ? "Select Parent First"
                          : availableSubcategories.length === 0
                          ? "No Subcategories"
                          : "Select Subcategory..."}
                      </option>
                      {availableSubcategories.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
                    />
                  </div>
                </div>

                {/* Watch Category Filter Pill */}
                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Watch Category Filter Pill
                  </label>
                  <div className="relative">
                    <select
                      value={watchCategory}
                      onChange={(e) => setWatchCategory(e.target.value)}
                      className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-7 shadow-xs focus:border-[#5C4529]/60 transition-colors uppercase font-medium"
                    >
                      <option value="">Select Watch Category...</option>
                      {watchCategories.map((wc) => (
                        <option key={wc._id} value={wc._id}>
                          {wc.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
                    />
                  </div>
                </div>
              </div>

              {/* Triad Badges: Condition, Grade, Scope */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Pill 1: Category / Condition
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Preowned"
                    value={conditionBadge}
                    onChange={(e) => setConditionBadge(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs transition-colors"
                  />
                  <span className="text-[10px] text-[#7A6C5E] mt-1 block">
                    Rendered in solid bronze (`#6D5333`)
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Pill 2: Condition Grade Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Excellent Condition"
                    value={gradeBadge}
                    onChange={(e) => setGradeBadge(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs transition-colors"
                  />
                  <span className="text-[10px] text-[#7A6C5E] mt-1 block">
                    Rendered in soft cream (`#D4C5B3`)
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Pill 3: Scope of Delivery Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Full Set"
                    value={scopeBadge}
                    onChange={(e) => setScopeBadge(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs transition-colors"
                  />
                  <span className="text-[10px] text-[#7A6C5E] mt-1 block">
                    Rendered in soft cream (`#D4C5B3`)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: THE ONE-LINER PUNCHLINE & DUAL PRICING */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D4C6B3]/50">
              <Clock size={16} className="text-[#5C4529]" />
              <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                3. One-Liner Punchline &amp; Dual Pricing
              </h2>
            </div>

            <div className="space-y-4">
              {/* Tagline */}
              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  The One-Liner Punchline (Tagline)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Precision engineered for those who value every second."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs transition-colors"
                />
                <p className="text-[11px] text-[#7A6C5E] mt-1">
                  Placed directly above the pricing row in subtle editorial styling.
                </p>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Selling Price (INR ₹) <span className="text-[#5C4529]">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2000000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs font-mono font-medium"
                  />
                  {priceNum > 0 && (
                    <span className="text-[11px] text-[#6D5333] font-serif mt-1 block">
                      Live Preview: {formatINR(priceNum)}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Original / Slashed Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2500000"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs font-mono font-medium"
                  />
                  {savings > 0 && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="bg-[#6D5333] text-white text-[11px] font-medium px-2 py-0.5 rounded leading-none">
                        Save {formatINR(savings, false)} ({savingsPercent}% off)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: HERITAGE NARRATIVE & 3 PILLARS */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D4C6B3]/50">
              <FileText size={16} className="text-[#5C4529]" />
              <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                4. Heritage Narrative &amp; Pillars
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Heritage Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. A CHRONOGRAPHY WITH A LEGACY."
                  value={heritageHeadline}
                  onChange={(e) => setHeritageHeadline(e.target.value)}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs font-serif uppercase transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Heritage Story / Provenance Body
                </label>
                <textarea
                  rows={3}
                  placeholder="We prioritise transparency, provenance, and complete confidence with every acquisition..."
                  value={heritageStory}
                  onChange={(e) => setHeritageStory(e.target.value)}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 min-h-[90px] resize-none shadow-xs transition-colors leading-relaxed"
                />
              </div>

              {/* Pillars (Up to 3, Auto-Centered) */}
              <div className="pt-2 border-t border-[#D4C6B3]/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#2C241E]">
                    The 3 Pillar Highlights ({pillars.length} / 3)
                  </span>
                  {pillars.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddPillar}
                      className="text-[11px] text-[#5C4529] hover:text-[#47341D] font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Add Pillar</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {pillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white/35 border border-[#D4C6B3]/60 rounded-xl relative space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#5C4529] uppercase tracking-wide">
                          Pillar #{idx + 1}
                        </span>
                        {pillars.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePillar(idx)}
                            className="text-[#8C7A6B] hover:text-[#5C4529] transition-colors p-1"
                            title="Remove Pillar"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Pillar Title (e.g. TIMEPIECES SOURCED)"
                        value={pillar.title}
                        onChange={(e) => handlePillarChange(idx, "title", e.target.value)}
                        className="w-full bg-white/60 border border-white/80 rounded-lg px-3 py-1.5 text-xs text-[#2C241E] uppercase font-medium outline-none focus:border-[#5C4529]"
                      />
                      <textarea
                        rows={2}
                        placeholder="Pillar Description"
                        value={pillar.description}
                        onChange={(e) =>
                          handlePillarChange(idx, "description", e.target.value)
                        }
                        className="w-full bg-white/60 border border-white/80 rounded-lg px-3 py-1.5 text-xs text-[#2C241E] outline-none focus:border-[#5C4529] resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: KEY SPECIFICATIONS MATRIX (DYNAMIC GRID) */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D4C6B3]/50">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#5C4529]" />
                <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                  5. Key Specifications Matrix ({keySpecs.length} Specs)
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddKeySpec}
                className="text-xs bg-[#5C4529] hover:bg-[#47341D] text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              >
                <Plus size={13} />
                <span>Add Specification</span>
              </button>
            </div>

            <p className="text-[11px] text-[#7A6C5E] mb-3">
              Rendered on the storefront in a structured 5-column responsive grid (`grid-cols-2 lg:grid-cols-5`). Additional specifications wrap cleanly into subsequent rows.
            </p>

            <div className="space-y-2.5">
              {keySpecs.map((spec, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 bg-white/35 border border-[#D4C6B3]/50 rounded-xl"
                >
                  <div className="w-1/3">
                    <input
                      type="text"
                      placeholder="Label (e.g. CASE SIZE)"
                      value={spec.label}
                      onChange={(e) => handleKeySpecChange(idx, "label", e.target.value)}
                      className="w-full bg-white/60 border border-white/80 rounded-lg px-3 py-1.5 text-xs text-[#2C241E] uppercase font-mono outline-none focus:border-[#5C4529]"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Value (e.g. 40 mm)"
                      value={spec.value}
                      onChange={(e) => handleKeySpecChange(idx, "value", e.target.value)}
                      className="w-full bg-white/60 border border-white/80 rounded-lg px-3 py-1.5 text-xs text-[#2C241E] outline-none focus:border-[#5C4529]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeySpec(idx)}
                    className="text-[#8C7A6B] hover:text-[#5C4529] p-1.5 transition-colors cursor-pointer"
                    title="Delete specification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: SEO CONFIGURATION SUITE */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D4C6B3]/50">
              <Globe size={16} className="text-[#5C4529]" />
              <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                6. SEO Configuration Suite
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Meta Title Tag
                </label>
                <input
                  type="text"
                  placeholder="Rolex Cosmograph Daytona | Horologe Royale"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Search engine summary preview..."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 resize-none shadow-xs transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Canonical URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder={`/timepiece/${slug || "slug"}`}
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2 text-xs text-[#2C241E] font-mono outline-none focus:border-[#5C4529]/60 shadow-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Focus Keywords (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="rolex, daytona, chronograph"
                    value={focusKeywords}
                    onChange={(e) => setFocusKeywords(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2 text-xs text-[#2C241E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                  />
                </div>
              </div>

              {/* Live Google Search Preview */}
              <div className="p-3.5 bg-white/60 border border-[#D4C6B3]/50 rounded-xl">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C7A6B] block mb-1">
                  GOOGLE SEARCH SNIPPET PREVIEW
                </span>
                <p className="text-sm text-[#1A0DAB] hover:underline font-medium cursor-pointer truncate">
                  {metaTitle || `${name || "Timepiece Title"} | Horologe Royale`}
                </p>
                <p className="text-[11px] text-[#006621] truncate font-mono">
                  https://horologe.com{canonicalUrl || `/timepiece/${slug || "product-slug"}`}
                </p>
                <p className="text-xs text-[#545454] line-clamp-2 mt-0.5 leading-snug">
                  {metaDescription ||
                    tagline ||
                    "Precision engineered for those who value every second. Certified luxury horology at Horologe Royale."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: EXACTLY 4 IMAGE SLOTS & LIVE CARD PREVIEW   */}
        {/* ========================================================= */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D4C6B3]/50">
              <div className="flex items-center gap-2">
                <ImageIcon size={16} className="text-[#5C4529]" />
                <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                  Images (Exactly 4 Slots)
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#8C7A6B]">
                {imageSlots.filter((s) => s.previewUrl).length} / 4 loaded
              </span>
            </div>

            <p className="text-[11px] text-[#7A6C5E] mb-4 leading-snug">
              Slot 1 serves as the primary hero image. Slots 2–4 populate gallery thumbnails. If any slot is missing or empty, it defaults automatically to `/logo.png`.
            </p>

            {/* Hidden native file inputs */}
            {imageSlots.map((slot, idx) => (
              <input
                key={slot.id}
                type="file"
                accept="image/*"
                ref={(el) => {
                  fileInputRefs.current[idx] = el;
                }}
                onChange={(e) => handleFileChange(idx, e)}
                className="hidden"
              />
            ))}

            {/* Slot 1: Primary Hero Dropzone */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#5C4529] tracking-wide uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5C4529]" />
                  Slot 1: Hero Main View
                </span>
                {imageSlots[0].previewUrl && (
                  <button
                    type="button"
                    onClick={(e) => handleClearImage(0, e)}
                    className="text-[11px] text-[#8C7A6B] hover:text-[#5C4529] transition-colors cursor-pointer"
                  >
                    Clear Slot
                  </button>
                )}
              </div>

              <div
                onClick={() => triggerUpload(0)}
                className="w-full aspect-[16/10] border-2 border-dashed border-[#5C4529]/40 bg-[#F4EDE5]/60 hover:bg-[#F4EDE5] rounded-xl overflow-hidden relative flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all shadow-xs group"
              >
                {imageSlots[0].previewUrl ? (
                  <>
                    <img
                      src={imageSlots[0].previewUrl}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 text-[#2C241E] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">
                        Change Hero Image
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center text-[#5C4529] group-hover:scale-110 transition-transform shadow-xs">
                      <Upload size={18} />
                    </div>
                    <span className="text-xs font-semibold text-[#5C4529] mt-2 group-hover:underline">
                      Upload Slot 1: Hero Main
                    </span>
                    <span className="text-[10px] text-[#8C7A6B] mt-0.5">
                      PNG, JPG, WEBP (Fallback: /logo.png)
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Slots 2, 3, 4 Grid (Gallery Thumbnails) */}
            <div className="grid grid-cols-3 gap-2.5">
              {imageSlots.slice(1).map((slot, index) => {
                const actualIndex = index + 1;
                return (
                  <div key={slot.id} className="flex flex-col">
                    <span className="text-[10px] text-[#7A6C5E] font-medium mb-1 truncate">
                      Slot {slot.id}
                    </span>
                    <div
                      onClick={() => triggerUpload(actualIndex)}
                      className="w-full aspect-square border border-white/70 bg-white/40 hover:bg-white/70 rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-1.5 text-center cursor-pointer transition-all shadow-2xs group"
                    >
                      {slot.previewUrl ? (
                        <>
                          <img
                            src={slot.previewUrl}
                            alt={slot.label}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => handleClearImage(actualIndex, e)}
                            className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#2C241E]/70 text-white flex items-center justify-center hover:bg-[#2C241E] transition-colors"
                            title="Remove"
                          >
                            <X size={10} />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#9E8D7E] group-hover:text-[#5C4529] transition-colors">
                          <Upload size={13} className="mb-0.5" />
                          <span className="text-[9px] font-medium">Slot {slot.id}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mini Live Preview Snapshot */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7A6B] font-semibold block mb-2">
              LIVE CARD PREVIEW
            </span>
            <div className="border border-[#D4C6B3]/60 rounded-xl overflow-hidden bg-[#E7DDD2] shadow-xs">
              <div className="relative aspect-[4/3] bg-[#D8CCC0]/60 overflow-hidden flex items-center justify-center">
                <img
                  src={imageSlots[0].previewUrl || "/logo.png"}
                  alt="Card Preview"
                  className="w-full h-full object-cover"
                />
                {savings > 0 && (
                  <span className="absolute top-2 right-2 bg-[#6D5333] text-white text-[9px] font-medium px-2 py-0.5 rounded leading-none">
                    Save {formatINR(savings, false)}
                  </span>
                )}
              </div>
              <div className="p-3">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C7A6B] block">
                  {minorSpecs.filter(Boolean).slice(0, 2).join(" | ") || "LUXURY HOROLOGY"}
                </span>
                <h4 className="font-serif text-sm font-medium text-[#2C241E] truncate mt-0.5">
                  {name || "Untitled Timepiece"}
                </h4>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#D4C6B3]/40">
                  <span className="font-serif font-medium text-[#6D5333] text-sm">
                    {priceNum > 0 ? formatINR(priceNum) : "₹ --"}
                  </span>
                  <span className="text-[10px] bg-[#EFE7DE] text-[#5C4529] px-2 py-0.5 rounded font-medium">
                    {conditionBadge}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sticky Bottom Bronze Action Bar */}
      <div className="fixed bottom-0 right-0 left-0 md:left-[260px] bg-white/80 backdrop-blur-xl border-t border-white/70 py-4 px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 z-30 shadow-[0_-4px_24px_rgba(44,36,30,0.08)]">
        {/* Dynamic summary indicator */}
        <div className="flex items-center gap-2 overflow-hidden w-full sm:w-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5C4529] shrink-0" />
          <span className="text-xs font-medium text-[#2C241E] truncate">
            {name
              ? `${name} — ${priceNum > 0 ? formatINR(priceNum) : "Price Unassigned"}`
              : "New Timepiece Entry"}
          </span>
          {savings > 0 && (
            <span className="text-[10px] bg-[#6D5333] text-white px-2 py-0.5 rounded font-mono shrink-0">
              Save {formatINR(savings, false)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="text-[#8C7A6B] hover:text-[#2C241E] text-xs font-medium px-3.5 py-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            Discard
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit("draft")}
            className="border border-[#5C4529]/40 bg-white/50 text-[#5C4529] hover:bg-white text-xs font-semibold px-4.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs whitespace-nowrap disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save as Draft"}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit("publish")}
            className="bg-[#5C4529] hover:bg-[#47341D] text-white text-xs font-semibold px-5.5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {isSubmitting ? "Registering..." : "Publish to Vault"}
          </button>
        </div>
      </div>
    </div>
  );
}
