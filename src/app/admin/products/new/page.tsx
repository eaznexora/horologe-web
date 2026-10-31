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
  Package,
  Layers,
  FileText,
  Image as ImageIcon,
  Check,
} from "lucide-react";

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

const LUXURY_MAISONS = [
  "Rolex",
  "Audemars Piguet",
  "Patek Philippe",
  "Cartier",
  "Richard Mille",
  "Omega",
  "Vacheron Constantin",
  "Hublot",
  "Breitling",
  "IWC Schaffhausen",
  "Casio",
  "Eaz Nexora",
  "Tudor",
  "Panerai",
  "Jaeger-LeCoultre",
];

const INITIAL_IMAGE_SLOTS: ImageSlot[] = [
  { id: 1, label: "Hero Showcase (Wrist View)", file: null, previewUrl: "", fileName: "" },
  { id: 2, label: "Showcase Angle (3/4 View)", file: null, previewUrl: "", fileName: "" },
  { id: 3, label: "Side Profile & Crown", file: null, previewUrl: "", fileName: "" },
  { id: 4, label: "Dial Macro Detail", file: null, previewUrl: "", fileName: "" },
  { id: 5, label: "Caseback & Clasp", file: null, previewUrl: "", fileName: "" },
];

export default function AddProductPage() {
  // Live API States
  const [categories, setCategories] = useState<CategoryParent[]>([]);
  const [watchCategories, setWatchCategories] = useState<WatchCategoryItem[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    // Section A: Core Identity & Commercials
    name: "",
    subSpec: "Chronograph | Automatic",
    brand: "Rolex",
    model: "",
    reference: "",
    sku: "",
    category: "",
    subCategory: "",
    watchCategory: "rolex",
    price: "2000000",
    originalPrice: "2500000",

    // Section B: Horological Specifications
    movement: "Automatic (Self-Winding)",
    calibre: "Calibre 4131",
    caseSize: "40 mm",
    caseMaterial: "Oystersteel (904L)",
    bezel: "Black Cerachrom Ceramic Tachymeter",
    dialColor: "White Lacquer with Snailed Counters",
    crystal: "Scratch-Resistant Sapphire",
    powerReserve: "72 Hours",
    waterResistance: "100m / 330 ft",
    bracelet: "Oystersteel Three-Piece with Oysterlock Clasp",

    // Section C: Provenance, Condition & Logistics
    condition: "Pre-Owned",
    conditionRating: "Excellent Condition (9.8/10)",
    boxPapers: "Full Set (Box & Papers)",
    year: "2024",
    status: "In Stock",
    stock: 1,

    // Section E: Editorial & Heritage Narrative
    shortDescription: "Precision engineered for those who value every second.",
    heritageHeadline: "A CHRONOGRAPHY WITH A LEGACY.",
    editorialStory:
      "We prioritise transparency, provenance, and complete confidence with every acquisition. Each reference undergoes comprehensive mechanical inspection, timegrapher calibration, and vault certification.",
  });

  // Media Slots State
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(INITIAL_IMAGE_SLOTS);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Fetch Live Categories and Watch Categories from MongoDB
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
            if (isMounted) setCategories(catData.categories);
          }
        }

        if (watchCatRes.ok) {
          const watchData = await watchCatRes.json();
          if (watchData.success && Array.isArray(watchData.categories)) {
            if (isMounted) setWatchCategories(watchData.categories);
          }
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (isMounted) setIsLoadingDropdowns(false);
      }
    }

    loadDropdowns();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter available subcategories based on chosen parent category
  const selectedParentCategory = categories.find((c) => c._id === formData.category);
  const availableSubcategories = selectedParentCategory?.subcategories || [];

  // Commercial Pricing & Live Savings Computations
  const priceNum = parseFloat(String(formData.price).replace(/[^0-9.]/g, "")) || 0;
  const origPriceNum = parseFloat(String(formData.originalPrice).replace(/[^0-9.]/g, "")) || 0;
  const savings = origPriceNum > priceNum ? origPriceNum - priceNum : 0;
  const savingsPercent = origPriceNum > 0 && savings > 0 ? Math.round((savings / origPriceNum) * 100) : 0;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Image Upload Handlers
  const handleFileChange = (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImageSlots((prev) =>
      prev.map((slot, idx) =>
        idx === slotIndex
          ? {
              ...slot,
              file,
              previewUrl,
              fileName: file.name,
            }
          : slot
      )
    );
    showToast(`Uploaded image for ${imageSlots[slotIndex].label}`);
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

  // Reset Form
  const handleReset = () => {
    setFormData({
      name: "",
      subSpec: "Chronograph | Automatic",
      brand: "Rolex",
      model: "",
      reference: "",
      sku: "",
      category: "",
      subCategory: "",
      watchCategory: "rolex",
      price: "",
      originalPrice: "",
      movement: "Automatic (Self-Winding)",
      calibre: "Calibre 4131",
      caseSize: "40 mm",
      caseMaterial: "Oystersteel (904L)",
      bezel: "Black Cerachrom Ceramic Tachymeter",
      dialColor: "White Lacquer with Snailed Counters",
      crystal: "Scratch-Resistant Sapphire",
      powerReserve: "72 Hours",
      waterResistance: "100m / 330 ft",
      bracelet: "Oystersteel Three-Piece with Oysterlock Clasp",
      condition: "Pre-Owned",
      conditionRating: "Excellent Condition (9.8/10)",
      boxPapers: "Full Set (Box & Papers)",
      year: "2024",
      status: "In Stock",
      stock: 1,
      shortDescription: "Precision engineered for those who value every second.",
      heritageHeadline: "A CHRONOGRAPHY WITH A LEGACY.",
      editorialStory:
        "We prioritise transparency, provenance, and complete confidence with every acquisition. Each reference undergoes comprehensive mechanical inspection, timegrapher calibration, and vault certification.",
    });
    setImageSlots(INITIAL_IMAGE_SLOTS);
    showToast("Intake fields reset to default values");
  };

  // Submit Handler
  const handleSubmit = (actionType: "draft" | "publish") => {
    if (!formData.name.trim()) {
      showToast("Product Title / Name is required");
      return;
    }
    if (!formData.reference.trim()) {
      showToast("Reference Number is required");
      return;
    }
    if (!formData.price) {
      showToast("Selling Price (INR) is required");
      return;
    }

    showToast(
      actionType === "publish"
        ? `Successfully registered "${formData.name}" into Vault!`
        : `Saved draft for "${formData.name}"`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#2C241E] text-[#FAF6F0] px-4 py-2.5 rounded-xl shadow-xl border border-[#D4C6B3]/60 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="text-[#3B71CA]" />
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

      {/* 2. Main Two-Column Grid: Form Sections on Left, Media & Sticky Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: SECTIONS A, B, C, E                          */}
        {/* ========================================================= */}
        <div className="space-y-6">
          {/* SECTION A: CORE IDENTITY & COMMERCIALS */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D4C6B3]/50">
              <Sparkles size={16} className="text-[#5C4529]" />
              <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                Core Identity &amp; Commercials
              </h2>
            </div>

            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Timepiece Title / Product Name <span className="text-[#5C4529]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rolex Cosmograph Daytona Oyster 40mm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs transition-colors"
                />
              </div>

              {/* Sub-Spec Subtitle */}
              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Sub-Spec Tagline / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chronograph | Automatic"
                  value={formData.subSpec}
                  onChange={(e) => setFormData({ ...formData, subSpec: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs transition-colors"
                />
                <p className="text-[11px] text-[#7A6C5E] mt-1">
                  Appears beneath the title on the product detail showcase.
                </p>
              </div>

              {/* Brand & Model (2-Col) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Maison / Brand <span className="text-[#5C4529]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-8 shadow-xs focus:border-[#5C4529]/60 transition-colors"
                    >
                      {LUXURY_MAISONS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Collection / Model Series
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cosmograph Daytona, Speedmaster"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs transition-colors"
                  />
                </div>
              </div>

              {/* Reference Number & SKU (2-Col) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Reference Number <span className="text-[#5C4529]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 126500LN"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs font-mono transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Vault SKU / Inventory ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HR-ROX-126500-01"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs font-mono transition-colors"
                  />
                </div>
              </div>

              {/* Category Triad (3-Col) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                {/* Storefront Category */}
                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Storefront Category <span className="text-[#5C4529]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                          subCategory: "", // reset subcategory on parent change
                        })
                      }
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
                    Subcategory (Mega-Menu)
                  </label>
                  <div className="relative">
                    <select
                      value={formData.subCategory}
                      onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                      disabled={!formData.category || availableSubcategories.length === 0}
                      className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-7 shadow-xs focus:border-[#5C4529]/60 transition-colors disabled:opacity-50"
                    >
                      <option value="">
                        {!formData.category
                          ? "Select Parent First..."
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

                {/* Catalog Filter Pill Tag */}
                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Catalog Filter Tag <span className="text-[#5C4529]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.watchCategory}
                      onChange={(e) => setFormData({ ...formData, watchCategory: e.target.value })}
                      className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-7 shadow-xs focus:border-[#5C4529]/60 transition-colors uppercase font-medium"
                    >
                      <option value="">Select Watch Filter...</option>
                      {watchCategories.map((wc) => (
                        <option key={wc._id} value={wc.slug}>
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

              {/* Commercial Pricing (2-Col with Live Savings Computation) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Selling Price (INR ₹) <span className="text-[#5C4529]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g. 2000000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs font-mono font-medium"
                    />
                  </div>
                  {priceNum > 0 && (
                    <span className="text-[11px] text-[#6D5333] font-serif mt-1 block">
                      Formatted: {formatINR(priceNum)}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Compare-At / Original Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2500000"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs font-mono font-medium"
                  />
                  {savings > 0 && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="bg-[#6D5333] text-white text-[11px] font-medium px-2 py-0.5 rounded leading-none">
                        Save {formatINR(savings)} ({savingsPercent}% off)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: HOROLOGICAL SPECIFICATIONS */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D4C6B3]/50">
              <Clock size={16} className="text-[#5C4529]" />
              <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                Horological Technical Specifications
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Movement */}
              <div>
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Movement / Calibre
                </label>
                <div className="relative">
                  <select
                    value={formData.movement}
                    onChange={(e) => setFormData({ ...formData, movement: e.target.value })}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-7 shadow-xs"
                  >
                    <option value="Automatic (Self-Winding)">Automatic (Self-Winding)</option>
                    <option value="Manual Wind">Manual Wind</option>
                    <option value="High-Precision Quartz">High-Precision Quartz</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
                  />
                </div>
              </div>

              {/* Calibre Engine */}
              <div>
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Calibre Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. Calibre 4131"
                  value={formData.calibre}
                  onChange={(e) => setFormData({ ...formData, calibre: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                />
              </div>

              {/* Case Size */}
              <div>
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Case Size (mm)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 40 mm"
                  value={formData.caseSize}
                  onChange={(e) => setFormData({ ...formData, caseSize: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                />
              </div>

              {/* Case Material */}
              <div>
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Case Material
                </label>
                <div className="relative">
                  <select
                    value={formData.caseMaterial}
                    onChange={(e) => setFormData({ ...formData, caseMaterial: e.target.value })}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-7 shadow-xs"
                  >
                    <option value="Oystersteel (904L)">Oystersteel (904L)</option>
                    <option value="18K Yellow Gold">18K Yellow Gold</option>
                    <option value="18K Everose Gold">18K Everose Gold</option>
                    <option value="18K White Gold">18K White Gold</option>
                    <option value="950 Platinum">950 Platinum</option>
                    <option value="Grade 5 Titanium">Grade 5 Titanium</option>
                    <option value="Rolesor Two-Tone">Rolesor (Steel &amp; Gold)</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
                  />
                </div>
              </div>

              {/* Bezel Type */}
              <div>
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Bezel Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Black Cerachrom Tachymeter"
                  value={formData.bezel}
                  onChange={(e) => setFormData({ ...formData, bezel: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                />
              </div>

              {/* Dial Color */}
              <div>
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Dial Color &amp; Indices
                </label>
                <input
                  type="text"
                  placeholder="e.g. White Lacquer with Snailed Counters"
                  value={formData.dialColor}
                  onChange={(e) => setFormData({ ...formData, dialColor: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                />
              </div>

              {/* Crystal */}
              <div>
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Crystal Glass
                </label>
                <div className="relative">
                  <select
                    value={formData.crystal}
                    onChange={(e) => setFormData({ ...formData, crystal: e.target.value })}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-7 shadow-xs"
                  >
                    <option value="Scratch-Resistant Sapphire">Scratch-Resistant Sapphire</option>
                    <option value="Domed Sapphire with Anti-Reflective Coating">
                      Domed Sapphire (Anti-Reflective)
                    </option>
                    <option value="Hesalite Vintage Crystal">Hesalite Vintage Crystal</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
                  />
                </div>
              </div>

              {/* Power Reserve */}
              <div>
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Power Reserve
                </label>
                <input
                  type="text"
                  placeholder="e.g. 72 Hours"
                  value={formData.powerReserve}
                  onChange={(e) => setFormData({ ...formData, powerReserve: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                />
              </div>

              {/* Water Resistance */}
              <div>
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Water Resistance
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100m / 330 ft"
                  value={formData.waterResistance}
                  onChange={(e) => setFormData({ ...formData, waterResistance: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                />
              </div>

              {/* Bracelet & Clasp (Span 3 on md+) */}
              <div className="sm:col-span-2 md:col-span-3">
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Bracelet &amp; Clasp Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oystersteel Three-Piece Solid Links with Oysterlock Safety Clasp"
                  value={formData.bracelet}
                  onChange={(e) => setFormData({ ...formData, bracelet: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* SECTION C: PROVENANCE, CONDITION & LOGISTICS */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D4C6B3]/50">
              <ShieldCheck size={16} className="text-[#5C4529]" />
              <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                Provenance, Condition &amp; Logistics
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Condition Status */}
              <div>
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Condition Status
                </label>
                <div className="relative">
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-7 shadow-xs"
                  >
                    <option value="Unworn">Unworn (Vault Fresh)</option>
                    <option value="Pre-Owned">Pre-Owned</option>
                    <option value="Vintage">Vintage Heritage</option>
                    <option value="Like New">Like New</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
                  />
                </div>
              </div>

              {/* Condition Grade */}
              <div>
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Condition Rating Grade
                </label>
                <input
                  type="text"
                  placeholder="e.g. Excellent Condition (9.8/10)"
                  value={formData.conditionRating}
                  onChange={(e) => setFormData({ ...formData, conditionRating: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                />
              </div>

              {/* Scope of Delivery */}
              <div>
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Scope of Delivery (Box &amp; Papers)
                </label>
                <div className="relative">
                  <select
                    value={formData.boxPapers}
                    onChange={(e) => setFormData({ ...formData, boxPapers: e.target.value })}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-7 shadow-xs"
                  >
                    <option value="Full Set (Box & Papers)">Full Set (Box &amp; Papers)</option>
                    <option value="Watch & Original Papers">Watch &amp; Original Papers</option>
                    <option value="Watch & Presentation Box">Watch &amp; Presentation Box</option>
                    <option value="Watch Only">Watch Only</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
                  />
                </div>
              </div>

              {/* Year of Production */}
              <div>
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Year of Production
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2024"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                />
              </div>

              {/* Inventory Status */}
              <div>
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Inventory Status
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-7 shadow-xs"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
                  />
                </div>
              </div>

              {/* Stock Count */}
              <div>
                <label className="text-[11px] text-[#7A6C5E] font-medium mb-1 block">
                  Stock Count
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Math.max(0, parseInt(e.target.value) || 0) })
                  }
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION E: EDITORIAL & HERITAGE NARRATIVE */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D4C6B3]/50">
              <FileText size={16} className="text-[#5C4529]" />
              <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                Editorial &amp; Heritage Narrative
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Short Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Precision engineered for those who value every second."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Heritage Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. A CHRONOGRAPHY WITH A LEGACY."
                  value={formData.heritageHeadline}
                  onChange={(e) => setFormData({ ...formData, heritageHeadline: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs font-serif uppercase transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Editorial Story / Provenance Narrative
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide an editorial overview of this timepiece's provenance, artisanal heritage, and mechanical rarity..."
                  value={formData.editorialStory}
                  onChange={(e) => setFormData({ ...formData, editorialStory: e.target.value })}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 min-h-[110px] resize-none shadow-xs transition-colors leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: SECTION D: MEDIA & IMAGE SLOTS              */}
        {/* ========================================================= */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D4C6B3]/50">
              <div className="flex items-center gap-2">
                <ImageIcon size={16} className="text-[#5C4529]" />
                <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                  Showcase Media Slots
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#8C7A6B]">
                {imageSlots.filter((s) => s.previewUrl).length} / 5 loaded
              </span>
            </div>

            <p className="text-[11px] text-[#7A6C5E] mb-4 leading-snug">
              Slot 1 acts as the primary full-bleed hero showcase. Slots 2–5 populate supporting angles and macro thumbnails.
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
                  Slot 1: Hero Wrist Showcase
                </span>
                {imageSlots[0].previewUrl && (
                  <button
                    type="button"
                    onClick={(e) => handleClearImage(0, e)}
                    className="text-[11px] text-[#8C7A6B] hover:text-[#5C4529] transition-colors cursor-pointer"
                  >
                    Clear Hero
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
                      Click to upload primary hero
                    </span>
                    <span className="text-[10px] text-[#8C7A6B] mt-0.5">
                      PNG, JPG, WEBP (Max 10MB)
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Slots 2 - 5 Grid */}
            <div className="grid grid-cols-2 gap-3">
              {imageSlots.slice(1).map((slot, index) => {
                const actualIndex = index + 1;
                return (
                  <div key={slot.id} className="flex flex-col">
                    <span className="text-[10px] text-[#7A6C5E] font-medium mb-1 truncate">
                      Slot {slot.id}: {slot.label.split("(")[0]}
                    </span>
                    <div
                      onClick={() => triggerUpload(actualIndex)}
                      className="w-full aspect-square border border-white/70 bg-white/40 hover:bg-white/70 rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all shadow-2xs group"
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
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#2C241E]/70 text-white flex items-center justify-center hover:bg-[#2C241E] transition-colors"
                            title="Remove"
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#9E8D7E] group-hover:text-[#5C4529] transition-colors">
                          <Upload size={14} className="mb-1" />
                          <span className="text-[10px] font-medium">Upload Slot {slot.id}</span>
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
              CATALOG LIVE CARD PREVIEW
            </span>
            <div className="border border-[#D4C6B3]/60 rounded-xl overflow-hidden bg-[#E7DDD2] shadow-xs">
              <div className="relative aspect-[4/3] bg-[#D8CCC0]/60 overflow-hidden flex items-center justify-center">
                {imageSlots[0].previewUrl ? (
                  <img
                    src={imageSlots[0].previewUrl}
                    alt="Card Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-[#8C7A6B] font-mono">No Hero Visual</span>
                )}
                {savings > 0 && (
                  <span className="absolute top-2 right-2 bg-[#6D5333] text-white text-[9px] font-medium px-2 py-0.5 rounded leading-none">
                    Save {formatINR(savings)}
                  </span>
                )}
              </div>
              <div className="p-3">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C7A6B] block">
                  {formData.brand} &bull; {formData.reference || "REF-TBD"}
                </span>
                <h4 className="font-serif text-sm font-medium text-[#2C241E] truncate mt-0.5">
                  {formData.name || "Untitled Timepiece"}
                </h4>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#D4C6B3]/40">
                  <span className="font-serif font-medium text-[#6D5333] text-sm">
                    {priceNum > 0 ? formatINR(priceNum) : "₹ --"}
                  </span>
                  <span className="text-[10px] bg-[#EFE7DE] text-[#5C4529] px-2 py-0.5 rounded font-medium">
                    {formData.condition}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 right-0 left-0 md:left-[260px] bg-white/75 backdrop-blur-xl border-t border-white/70 py-4 px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 z-30 shadow-[0_-4px_24px_rgba(44,36,30,0.08)]">
        {/* Left: Dynamic summary indicator */}
        <div className="flex items-center gap-2 overflow-hidden w-full sm:w-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5C4529] shrink-0" />
          <span className="text-xs font-medium text-[#2C241E] truncate">
            {formData.name
              ? `${formData.name} — ${priceNum > 0 ? formatINR(priceNum) : "Price Unassigned"}`
              : "New Timepiece Entry — Unassigned"}
          </span>
          {formData.status && (
            <span className="text-[10px] bg-[#EFE7DE] border border-[#D4C6B3]/60 px-2 py-0.5 rounded-full text-[#5C4529] font-mono shrink-0">
              {formData.status}
            </span>
          )}
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="text-[#8C7A6B] hover:text-[#2C241E] text-xs font-medium px-3.5 py-2 transition-colors cursor-pointer"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            className="border border-[#5C4529]/40 bg-white/50 text-[#5C4529] hover:bg-white text-xs font-semibold px-4.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs whitespace-nowrap"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("publish")}
            className="bg-[#5C4529] hover:bg-[#47341D] text-white text-xs font-semibold px-5.5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            Publish to Vault
          </button>
        </div>
      </div>
    </div>
  );
}
