"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  Upload,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  X,
  Clock,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Plus,
  Trash2,
  Globe,
  ExternalLink,
  Loader2,
  AlertCircle,
  RotateCcw,
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

const INITIAL_IMAGE_SLOTS: ImageSlot[] = [
  { id: 1, label: "Hero Showcase (Main View)", file: null, previewUrl: "", fileName: "" },
  { id: 2, label: "Gallery Slot 2 (Angle 3/4)", file: null, previewUrl: "", fileName: "" },
  { id: 3, label: "Gallery Slot 3 (Side / Profile)", file: null, previewUrl: "", fileName: "" },
  { id: 4, label: "Gallery Slot 4 (Dial Detail)", file: null, previewUrl: "", fileName: "" },
];

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const routeParams = useParams();
  const id = resolvedParams?.id || (routeParams?.id as string);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);
  const [originalProduct, setOriginalProduct] = useState<any>(null);

  // Dropdown Categories
  const [categories, setCategories] = useState<CategoryParent[]>([]);
  const [watchCategories, setWatchCategories] = useState<WatchCategoryItem[]>([]);

  // Timepiece Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [reference, setReference] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [minorSpecs, setMinorSpecs] = useState<string[]>([]);

  // Editorial & Punchline
  const [tagline, setTagline] = useState("");
  const [heritageHeadline, setHeritageHeadline] = useState("");
  const [heritageStory, setHeritageStory] = useState("");

  // SEO Suite
  const [focusKeywords, setFocusKeywords] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");

  // Pillars & Specs
  const [pillars, setPillars] = useState<PillarItem[]>([
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ]);

  const [keySpecs, setKeySpecs] = useState<KeySpecItem[]>([
    { label: "CASE SIZE", value: "" },
    { label: "CASE MATERIAL", value: "" },
    { label: "MOVEMENT", value: "" },
    { label: "POWER RESERVE", value: "" },
    { label: "WATER RESISTANCE", value: "" },
  ]);

  // Image Slots
  const [images, setImages] = useState<string[]>(["", "", "", ""]);
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(INITIAL_IMAGE_SLOTS);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Badges & Status
  const [parentCategory, setParentCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [watchCategory, setWatchCategory] = useState("");
  const [conditionBadge, setConditionBadge] = useState("Preowned");
  const [gradeBadge, setGradeBadge] = useState("Excellent Condition");
  const [scopeBadge, setScopeBadge] = useState("Full Set");
  const [status, setStatus] = useState<"active" | "draft" | "sold">("active");

  // Submission & Success Modal
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // On mount: Fetch categories and timepiece record by ID
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);

        const [catRes, watchCatRes, productRes] = await Promise.all([
          fetch("/api/admin/categories?admin=true"),
          fetch("/api/admin/watch-categories?admin=true"),
          fetch(`/api/admin/products?id=${id}`),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.success && Array.isArray(catData.categories) && isMounted) {
            setCategories(catData.categories);
          }
        }

        if (watchCatRes.ok) {
          const watchData = await watchCatRes.json();
          if (watchData.success && Array.isArray(watchData.categories) && isMounted) {
            setWatchCategories(watchData.categories);
          }
        }

        if (productRes.ok) {
          const pData = await productRes.json();
          if (pData.success && pData.product && isMounted) {
            const p = pData.product;
            setOriginalProduct(p);

            setName(p.name || "");
            setSlug(p.slug || "");
            setBrand(p.brand || "");
            setModel(p.model || "");
            setReference(p.reference || "");
            setSku(p.sku || "");
            setPrice(p.price != null ? String(p.price) : "");
            setOriginalPrice(p.originalPrice != null ? String(p.originalPrice) : "");
            setMinorSpecs(Array.isArray(p.minorSpecs) ? p.minorSpecs : []);
            setTagline(p.tagline || "");
            setHeritageHeadline(p.heritageHeadline || "");
            setHeritageStory(p.heritageStory || "");
            setParentCategory(p.category?._id || p.category || "");
            setSubCategory(p.subCategory?._id || p.subCategory || "");
            setWatchCategory(p.watchCategory?._id || p.watchCategory || "");
            setConditionBadge(p.conditionBadge || "Preowned");
            setGradeBadge(p.gradeBadge || "Excellent Condition");
            setScopeBadge(p.scopeBadge || "Full Set");
            setStatus(p.status || "active");

            if (Array.isArray(p.pillars) && p.pillars.length > 0) {
              setPillars(p.pillars);
            }
            if (Array.isArray(p.keySpecs) && p.keySpecs.length > 0) {
              setKeySpecs(p.keySpecs);
            }

            setMetaTitle(p.seo?.metaTitle || "");
            setMetaDescription(p.seo?.metaDescription || "");
            setCanonicalUrl(p.seo?.canonicalUrl || "");
            setFocusKeywords(
              Array.isArray(p.seo?.keywords)
                ? p.seo.keywords.join(", ")
                : p.seo?.focusKeywords || ""
            );

            if (Array.isArray(p.images) && p.images.length > 0) {
              setImages(p.images);
              setImageSlots(
                INITIAL_IMAGE_SLOTS.map((slot, idx) => {
                  const url = p.images[idx];
                  return {
                    ...slot,
                    previewUrl: url || "",
                    fileName: url && url !== "/logo.png" ? `Vault Image ${idx + 1}` : "",
                  };
                })
              );
            }
          } else {
            if (isMounted) setProductNotFound(true);
          }
        } else {
          if (isMounted) setProductNotFound(true);
        }
      } catch (err) {
        console.error("Failed to load timepiece record:", err);
        if (isMounted) setProductNotFound(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (id) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

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

  // Image Upload Handlers
  const handleFileChange = (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageSlots((prev) =>
        prev.map((slot, idx) =>
          idx === slotIndex
            ? { ...slot, file, previewUrl: result, fileName: file.name }
            : slot
        )
      );
      setImages((prev) => {
        const next = [...prev];
        next[slotIndex] = result;
        return next;
      });
      showToast(`Loaded ${INITIAL_IMAGE_SLOTS[slotIndex].label}`);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImageSlots((prev) =>
      prev.map((slot, idx) =>
        idx === slotIndex
          ? { ...slot, file: null, previewUrl: "", fileName: "" }
          : slot
      )
    );
    setImages((prev) => {
      const next = [...prev];
      next[slotIndex] = "";
      return next;
    });
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
      while (next.length <= index) {
        next.push("");
      }
      next[index] = val;
      return next;
    });
  };

  const handleAddPillar = () => {
    if (pillars.length >= 3) {
      showToast("Maximum 3 Pillar Highlights allowed");
      return;
    }
    setPillars((prev) => [...prev, { title: "", description: "" }]);
  };

  const handleRemovePillar = (index: number) => {
    if (pillars.length <= 1) {
      showToast("At least 1 Pillar must remain");
      return;
    }
    setPillars((prev) => prev.filter((_, idx) => idx !== index));
  };

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

  const handleAddKeySpec = () => {
    setKeySpecs((prev) => [...prev, { label: "", value: "" }]);
  };

  const handleRemoveKeySpec = (index: number) => {
    setKeySpecs((prev) => prev.filter((_, idx) => idx !== index));
  };

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

  // Restore fetched product data
  const handleRevert = () => {
    if (!originalProduct) return;
    const p = originalProduct;

    setName(p.name || "");
    setSlug(p.slug || "");
    setBrand(p.brand || "");
    setModel(p.model || "");
    setReference(p.reference || "");
    setSku(p.sku || "");
    setPrice(p.price != null ? String(p.price) : "");
    setOriginalPrice(p.originalPrice != null ? String(p.originalPrice) : "");
    setMinorSpecs(Array.isArray(p.minorSpecs) ? p.minorSpecs : []);
    setTagline(p.tagline || "");
    setHeritageHeadline(p.heritageHeadline || "");
    setHeritageStory(p.heritageStory || "");
    setParentCategory(p.category?._id || p.category || "");
    setSubCategory(p.subCategory?._id || p.subCategory || "");
    setWatchCategory(p.watchCategory?._id || p.watchCategory || "");
    setConditionBadge(p.conditionBadge || "Preowned");
    setGradeBadge(p.gradeBadge || "Excellent Condition");
    setScopeBadge(p.scopeBadge || "Full Set");
    setStatus(p.status || "active");
    setPillars(Array.isArray(p.pillars) && p.pillars.length > 0 ? p.pillars : []);
    setKeySpecs(Array.isArray(p.keySpecs) && p.keySpecs.length > 0 ? p.keySpecs : []);
    setMetaTitle(p.seo?.metaTitle || "");
    setMetaDescription(p.seo?.metaDescription || "");
    setCanonicalUrl(p.seo?.canonicalUrl || "");
    setFocusKeywords(
      Array.isArray(p.seo?.keywords)
        ? p.seo.keywords.join(", ")
        : p.seo?.focusKeywords || ""
    );

    if (Array.isArray(p.images) && p.images.length > 0) {
      setImages(p.images);
      setImageSlots(
        INITIAL_IMAGE_SLOTS.map((slot, idx) => {
          const url = p.images[idx];
          return {
            ...slot,
            previewUrl: url || "",
            fileName: url && url !== "/logo.png" ? `Vault Image ${idx + 1}` : "",
          };
        })
      );
    }
    showToast("Reverted to saved timepiece values");
  };

  // Submit Handler: Submits PUT /api/admin/products with id
  const handleUpdate = async () => {
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

      const imagesPayload = imageSlots.map(
        (slot, idx) => slot.previewUrl || images[idx] || "/logo.png"
      );

      const payload = {
        id,
        name: name.trim(),
        slug: slug.trim() || undefined,
        brand: brand.trim() || undefined,
        model: model.trim() || undefined,
        reference: reference.trim() || undefined,
        sku: sku.trim() || undefined,
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
        pillars: pillars.filter((p) => p.title || p.description),
        keySpecs: keySpecs.filter((k) => k.label && k.value),
        seo: {
          metaTitle: metaTitle || `${name} | Horologe Royale`,
          metaDescription: metaDescription || tagline,
          canonicalUrl: canonicalUrl || `/timepiece/${slug}`,
          focusKeywords,
        },
        status,
      };

      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          router.push("/admin/products");
        }, 1600);
      } else {
        showToast(data.error || "Failed to update timepiece");
      }
    } catch (err: any) {
      console.error("Update failed:", err);
      showToast("Network error updating product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-12 max-w-md mx-auto shadow-sm space-y-4">
          <Loader2 className="w-8 h-8 text-[#5C4529] animate-spin mx-auto" />
          <h2 className="font-serif text-lg text-[#2C241E] font-medium">
            Loading Timepiece Record...
          </h2>
          <p className="text-xs text-[#7A6C5E]">
            Retrieving horology specifications and vault imagery.
          </p>
        </div>
      </div>
    );
  }

  // Not Found Screen
  if (productNotFound) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="bg-white/50 backdrop-blur-xl border border-[#D4C6B3] rounded-2xl p-10 max-w-md mx-auto shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#5C4529]/15 text-[#5C4529] flex items-center justify-center mx-auto border border-[#5C4529]/30">
            <AlertCircle size={22} />
          </div>
          <h2 className="font-serif text-xl text-[#2C241E] font-medium">
            Timepiece Record Not Found
          </h2>
          <p className="text-xs text-[#7A6C5E] leading-relaxed">
            The requested timepiece could not be located in the vault database.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 bg-[#5C4529] hover:bg-[#47341D] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-2xs"
            >
              <ChevronLeft size={14} />
              <span>Return to Inventory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-36">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#2C241E] text-[#FAF6F0] px-4 py-2.5 rounded-xl shadow-xl border border-[#D4C6B3]/60 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="text-[#5C4529]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Frosted Glass Success Notification Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-[#2C241E]/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#EFE7DE]/95 backdrop-blur-2xl border border-[#D4C6B3] rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#5C4529]/15 text-[#5C4529] flex items-center justify-center mx-auto border border-[#5C4529]/30">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#2C241E]">
                Timepiece Record Updated
              </h3>
              <p className="text-xs text-[#7A6C5E] mt-1">
                {name ? `"${name}"` : "The timepiece"} has been successfully updated in the vault registry. Redirecting to inventory...
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="w-full bg-[#5C4529] hover:bg-[#47341D] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              Return to Inventory
            </button>
          </div>
        </div>
      )}

      {/* 1. Header Bar: Eyebrow 'VAULT REGISTRY UPDATE' & Title 'Edit Timepiece Record' */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Link
            href="/admin/products"
            className="w-9 h-9 bg-white/45 backdrop-blur-md border border-white/60 rounded-xl flex items-center justify-center text-[#2C241E] hover:bg-white/70 shadow-sm transition-all cursor-pointer shrink-0"
            aria-label="Back to Product List"
          >
            <ChevronLeft size={18} />
          </Link>
          <div className="ml-3">
            <span className="text-[10px] tracking-[0.25em] text-[#8C7A6B] uppercase font-semibold block">
              VAULT REGISTRY UPDATE
            </span>
            <h1 className="font-serif text-[22px] lg:text-[26px] font-medium text-[#2C241E] tracking-tight leading-tight truncate max-w-[450px]">
              Edit Timepiece Record
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge Toggle */}
          <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-xl p-1 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setStatus("active")}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                status === "active"
                  ? "bg-[#5C4529] text-white shadow-2xs"
                  : "text-[#7A6C5E] hover:text-[#2C241E]"
              }`}
            >
              In Stock
            </button>
            <button
              type="button"
              onClick={() => setStatus("draft")}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                status === "draft"
                  ? "bg-[#8C7A6B] text-white shadow-2xs"
                  : "text-[#7A6C5E] hover:text-[#2C241E]"
              }`}
            >
              Under Review
            </button>
            <button
              type="button"
              onClick={() => setStatus("sold")}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                status === "sold"
                  ? "bg-[#2C241E] text-white shadow-2xs"
                  : "text-[#7A6C5E] hover:text-[#2C241E]"
              }`}
            >
              Sold
            </button>
          </div>

          <button
            type="button"
            onClick={handleRevert}
            className="text-xs text-[#8C7A6B] hover:text-[#5C4529] bg-white/40 hover:bg-white/70 border border-white/60 px-3.5 py-2 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            title="Revert to saved values"
          >
            <RotateCcw size={13} />
            <span>Revert</span>
          </button>
        </div>
      </div>

      {/* Live Showcase Link Banner */}
      {slug && (
        <div className="mb-6 p-4 bg-white/60 border border-[#5C4529]/30 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#5C4529]/15 text-[#5C4529] flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#2C241E]">
                Active Vault Reference: {name || "Timepiece"}
              </p>
              <p className="text-[11px] text-[#7A6C5E]">
                Live Showcase URL:{" "}
                <span className="font-mono text-[#5C4529]">/timepiece/{slug}</span>
              </p>
            </div>
          </div>
          <Link
            href={`/timepiece/${slug}`}
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
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* SECTION 1: CORE PRODUCT IDENTITY & TECHNICAL CATALOGING */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D4C6B3]/50">
              <Sparkles size={16} className="text-[#5C4529]" />
              <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                1. Core Identity &amp; Title
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  Main Product Name <span className="text-[#5C4529]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rolex Cosmograph Daytona"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs transition-colors"
                />
              </div>

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

              {/* Horology Reference & Catalog Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-[#2C241E] mb-1 block">
                    Brand / Maison
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rolex"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#2C241E] mb-1 block">
                    Model Line
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cosmograph Daytona"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#2C241E] mb-1 block">
                    Reference #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 116500LN"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#2C241E] mb-1 block">
                    SKU / Serial
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HR-DAYTONA-01"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs font-mono"
                  />
                </div>
              </div>

              {/* Minor Specifications */}
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
                        placeholder={
                          idx === 0
                            ? "e.g. Chronograph"
                            : idx === 1
                            ? "e.g. Automatic"
                            : "e.g. Oystersteel"
                        }
                        value={minorSpecs[idx] || ""}
                        onChange={(e) => handleMinorSpecChange(idx, e.target.value)}
                        className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: CATEGORY TRIAD & STATUS BADGES */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D4C6B3]/50">
              <ShieldCheck size={16} className="text-[#5C4529]" />
              <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                2. Category Triad &amp; Status Badges
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

              {/* Triad Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Pill 1: Condition / Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Preowned"
                    value={conditionBadge}
                    onChange={(e) => setConditionBadge(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Pill 2: Grade Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Excellent Condition"
                    value={gradeBadge}
                    onChange={(e) => setGradeBadge(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                    Pill 3: Scope Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Full Set"
                    value={scopeBadge}
                    onChange={(e) => setScopeBadge(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: EDITORIAL PUNCHLINE & DUAL PRICING */}
          <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D4C6B3]/50">
              <Clock size={16} className="text-[#5C4529]" />
              <h2 className="font-serif text-[18px] text-[#2C241E] font-medium">
                3. One-Liner Punchline &amp; Dual Pricing
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#2C241E] mb-1.5 block">
                  The One-Liner Punchline (Tagline)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Precision engineered for those who value every second."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                />
              </div>

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
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs font-serif uppercase"
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
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-3 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 min-h-[90px] resize-none shadow-xs leading-relaxed"
                />
              </div>

              {/* Pillars (Up to 3) */}
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

          {/* SECTION 5: KEY SPECIFICATIONS MATRIX */}
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

          {/* SECTION 6: SEO SUITE */}
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
                  placeholder="e.g. Rolex Cosmograph Daytona | Horologe Royale"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 shadow-xs"
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
                  className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2 text-xs text-[#2C241E] placeholder-[#9E8D7E] outline-none focus:border-[#5C4529]/60 resize-none shadow-xs"
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
                    placeholder="e.g. rolex, daytona, chronograph"
                    value={focusKeywords}
                    onChange={(e) => setFocusKeywords(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2 text-xs text-[#2C241E] outline-none focus:border-[#5C4529]/60 shadow-xs"
                  />
                </div>
              </div>

              {/* Google Search Preview */}
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
                    "Search engine summary preview for this timepiece."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 IMAGES & LIVE CARD PREVIEW */}
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
              Slot 1 serves as the primary hero image. Slots 2–4 populate gallery thumbnails. Defaults to `/logo.png` if blank.
            </p>

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
                      PNG, JPG, WEBP
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Slots 2, 3, 4 Grid */}
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

      {/* 3. Sticky Action Bar: Cancel links back to /admin/products, Update Timepiece submits PUT */}
      <div className="fixed bottom-0 right-0 left-0 md:left-[260px] bg-white/80 backdrop-blur-xl border-t border-white/70 py-4 px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 z-30 shadow-[0_-4px_24px_rgba(44,36,30,0.08)]">
        <div className="flex items-center gap-2 overflow-hidden w-full sm:w-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5C4529] shrink-0" />
          <span className="text-xs font-medium text-[#2C241E] truncate">
            {name
              ? `${name} — ${priceNum > 0 ? formatINR(priceNum) : "Price Unassigned"}`
              : "Timepiece Record Edit"}
          </span>
          {savings > 0 && (
            <span className="text-[10px] bg-[#6D5333] text-white px-2 py-0.5 rounded font-mono shrink-0">
              Save {formatINR(savings, false)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Link
            href="/admin/products"
            className="text-[#8C7A6B] hover:text-[#2C241E] text-xs font-medium px-4 py-2 transition-colors cursor-pointer"
          >
            Cancel
          </Link>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleUpdate}
            className="bg-[#5C4529] hover:bg-[#47341D] text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isSubmitting && <Loader2 size={13} className="animate-spin" />}
            <span>{isSubmitting ? "Updating..." : "Update Timepiece"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
