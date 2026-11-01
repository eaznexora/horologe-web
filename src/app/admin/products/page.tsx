"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronDown,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatINR } from "@/components/timepiece/DynamicTimepieceOverview";

interface PopulatedCategory {
  _id: string;
  name: string;
  slug: string;
}

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  minorSpecs: string[];
  category?: PopulatedCategory;
  subCategory?: PopulatedCategory;
  watchCategory?: PopulatedCategory;
  conditionBadge: string;
  gradeBadge: string;
  scopeBadge: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  status: "active" | "draft" | "sold";
  createdAt: string;
}

interface Metrics {
  total: number;
  active: number;
  lowStock: number;
  outOfStock: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    total: 0,
    active: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [categories, setCategories] = useState<PopulatedCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Custom Glass Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Fetch Categories for Filter Dropdown
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories?admin=true");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.categories)) {
            setCategories(data.categories);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    }
    loadCategories();
  }, []);

  // Fetch Products & Real-time Metrics from MongoDB Atlas
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus && selectedStatus !== "all") params.set("status", selectedStatus);
      if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (sortBy) params.set("sort", sortBy);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProducts(data.products || []);
          if (data.metrics) {
            setMetrics(data.metrics);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load products from MongoDB", err);
      showToast("Error connecting to Vault database");
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, selectedCategory, searchQuery, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Execute Deletion
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/products?id=${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`"${deleteTarget.name}" removed from vault`);
        setDeleteTarget(null);
        fetchProducts();
      } else {
        showToast(data.error || "Failed to remove timepiece");
      }
    } catch (err) {
      console.error("Failed to delete product", err);
      showToast("Network error deleting timepiece");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#2C241E] text-[#FAF6F0] px-4 py-2.5 rounded-xl shadow-xl border border-[#D4C6B3]/60 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="text-[#5C4529]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Luxury Glassmorphic Top Title Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            href="/admin"
            className="w-9 h-9 bg-white/45 backdrop-blur-md border border-white/60 rounded-xl flex items-center justify-center text-[#2C241E] hover:bg-white/70 transition-all shadow-sm cursor-pointer"
            aria-label="Back to Dashboard"
          >
            <ChevronLeft size={18} />
          </Link>
          <h1 className="font-serif text-[26px] lg:text-[30px] font-medium text-[#2C241E] ml-3 tracking-tight">
            Product List
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-[#5C4529] hover:bg-[#47341D] text-white text-xs font-medium px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <Plus size={14} />
          <span>+ Add Timepiece</span>
        </Link>
      </div>

      {/* 2. Frosted Glass Metric Cards (4 Cards Grid - Hydrated Live from MongoDB Atlas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Total Products */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
            Total Products
          </span>
          <div className="font-serif text-[30px] lg:text-[32px] font-semibold text-[#2C241E] leading-tight">
            {metrics.total}
          </div>
        </div>

        {/* Card 2: Active Products */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
            Active Products
          </span>
          <div className="font-serif text-[30px] lg:text-[32px] font-semibold text-[#5C4529] leading-tight">
            {metrics.active}
          </div>
        </div>

        {/* Card 3: Low Stock / Drafts */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
            Under Review (Draft)
          </span>
          <div className="font-serif text-[30px] lg:text-[32px] font-semibold text-[#2C241E] leading-tight">
            {metrics.lowStock}
          </div>
        </div>

        {/* Card 4: Out of Stock / Sold */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
            Sold References
          </span>
          <div className="font-serif text-[30px] lg:text-[32px] font-semibold text-[#7A6C5E] leading-tight">
            {metrics.outOfStock}
          </div>
        </div>
      </div>

      {/* 3. Frosted Glass Live Filter Bar */}
      <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 mb-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Control 1: Search */}
          <div>
            <label className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
              Search Timepiece
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Name, reference, or tagline..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] shadow-xs outline-none focus:border-[#5C4529]/60 transition-colors"
              />
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
              />
            </div>
          </div>

          {/* Control 2: Category Filter */}
          <div>
            <label className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
              Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-8 shadow-xs focus:border-[#5C4529]/60 transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
              />
            </div>
          </div>

          {/* Control 3: Status Filter */}
          <div>
            <label className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
              Vault Status
            </label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-8 shadow-xs focus:border-[#5C4529]/60 transition-colors"
              >
                <option value="all">All Vault Status</option>
                <option value="active">Active (In Stock)</option>
                <option value="draft">Under Review (Draft)</option>
                <option value="sold">Sold</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
              />
            </div>
          </div>

          {/* Control 4: Sort By */}
          <div>
            <label className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
              Sort By
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-8 shadow-xs focus:border-[#5C4529]/60 transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Vault Catalog Table (Glass Card Container) */}
      <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
        {/* Header Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#D4C6B3]/60">
          <div>
            <h2 className="font-serif text-[22px] text-[#2C241E] font-medium leading-tight">
              Vault Catalog
            </h2>
            <p className="text-xs text-[#7A6C5E] mt-0.5">
              Live inventory synced in real-time with MongoDB Atlas ({products.length} references).
            </p>
          </div>
        </div>

        {/* Catalog Table */}
        <div className="overflow-x-auto no-scrollbar">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-[#7A6C5E]">
              <Loader2 className="w-6 h-6 animate-spin text-[#5C4529] mb-2" />
              <span className="text-xs">Loading live vault records...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center text-[#7A6C5E]">
              <p className="font-serif text-lg text-[#2C241E] mb-1">No timepieces found</p>
              <p className="text-xs mb-4">
                No vault records matched your active search or filter selection.
              </p>
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-1.5 bg-[#5C4529] hover:bg-[#47341D] text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add First Timepiece</span>
              </Link>
            </div>
          ) : (
            <table className="w-full text-left text-xs min-w-[850px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.18em] text-[#786B5D] border-b border-[#D4C6B3]/60">
                  <th className="py-4 pl-1 pr-3 w-8">
                    <input
                      type="checkbox"
                      className="rounded accent-[#5C4529] w-3.5 h-3.5 cursor-pointer"
                      aria-label="Select all"
                    />
                  </th>
                  <th className="py-4 px-3 font-semibold">TIMEPIECE</th>
                  <th className="py-4 px-4 font-semibold">CATEGORY / MAISON</th>
                  <th className="py-4 px-4 font-semibold">SLUG / PATH</th>
                  <th className="py-4 px-4 font-semibold">CONDITION</th>
                  <th className="py-4 px-4 font-semibold">STATUS</th>
                  <th className="py-4 px-4 font-semibold">PRICE (INR)</th>
                  <th className="py-4 pl-4 pr-1 text-right font-semibold">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4C6B3]/40">
                {products.map((item) => {
                  const thumbnail =
                    item.images && item.images[0] ? item.images[0] : "/logo.png";
                  const maison =
                    item.watchCategory?.name || item.category?.name || "Horologe";

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-white/35 transition-colors group"
                    >
                      {/* Selector Checkbox */}
                      <td className="py-4 pl-1 pr-3">
                        <input
                          type="checkbox"
                          className="rounded accent-[#5C4529] w-3.5 h-3.5 cursor-pointer"
                          aria-label={`Select ${item.name}`}
                        />
                      </td>

                      {/* Timepiece & Circular Thumbnail */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-[#E5D7CA]/60 border border-white/80 overflow-hidden shrink-0 shadow-2xs relative">
                            <img
                              src={thumbnail}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                if (target.src !== "/logo.png") target.src = "/logo.png";
                              }}
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-[#2C241E] block text-xs leading-snug">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-[#7A6C5E] font-normal truncate block max-w-[220px]">
                              {item.minorSpecs?.join(" | ") || item.tagline || "Luxury Reference"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Maison / Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-serif tracking-wider font-semibold text-xs text-[#2C241E] uppercase">
                          {maison}
                        </span>
                      </td>

                      {/* Slug / Path */}
                      <td className="py-4 px-4 font-mono text-[#7A6C5E] text-[11px] whitespace-nowrap">
                        /{item.slug}
                      </td>

                      {/* Condition Badge */}
                      <td className="py-4 px-4 text-[#2C241E] text-xs font-medium whitespace-nowrap">
                        {item.conditionBadge || "Preowned"}
                      </td>

                      {/* Status Pill (Strict ZERO-RED Policy) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {item.status === "active" && (
                          <span className="bg-[#5C4529]/15 text-[#5C4529] border border-[#5C4529]/30 text-[11px] px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5C4529]" />
                            <span>In Stock</span>
                          </span>
                        )}
                        {item.status === "draft" && (
                          <span className="bg-[#D4C5B3]/40 text-[#4A3E31] border border-[#D4C6B3] text-[11px] px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8C7A6B]" />
                            <span>Under Review</span>
                          </span>
                        )}
                        {item.status === "sold" && (
                          <span className="bg-[#2C241E]/15 text-[#2C241E] border border-[#2C241E]/30 text-[11px] px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2C241E]" />
                            <span>Sold</span>
                          </span>
                        )}
                      </td>

                      {/* Price (INR) */}
                      <td className="py-4 px-4 font-serif text-[15px] font-semibold text-[#2C241E] whitespace-nowrap">
                        {formatINR(item.price)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-4 pr-1 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/timepiece/${item.slug}`}
                            target="_blank"
                            className="bg-[#2C241E] hover:bg-[#1E1814] text-[#FAF6F0] text-xs px-3 py-1.5 rounded-lg font-medium transition-colors shadow-2xs inline-flex items-center gap-1"
                            title="Open Live Showcase"
                          >
                            <span>View</span>
                            <ExternalLink size={12} />
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget({ id: item._id, name: item.name })
                            }
                            className="w-8 h-8 rounded-lg border border-white/60 bg-white/40 hover:bg-[#5C4529]/15 flex items-center justify-center text-[#7A6C5E] hover:text-[#5C4529] transition-colors cursor-pointer"
                            aria-label={`Delete ${item.name}`}
                            title="Remove from vault"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 5. Custom Frosted-Glass Confirmation Modal (Zero Native alert/confirm, Luxury Bronze Accents) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-[#2C241E]/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#EFE7DE]/95 backdrop-blur-2xl border border-[#D4C6B3] rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#5C4529]/15 text-[#5C4529] flex items-center justify-center mx-auto border border-[#5C4529]/30">
              <AlertCircle size={24} />
            </div>

            <div>
              <h3 className="font-serif text-lg font-medium text-[#2C241E]">
                Remove from Vault?
              </h3>
              <p className="text-xs text-[#7A6C5E] mt-1.5 leading-relaxed">
                Are you sure you wish to delete{" "}
                <span className="font-semibold text-[#2C241E]">&ldquo;{deleteTarget.name}&rdquo;</span>?
                This action will permanently delete the reference and its dynamic showcase page.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="py-2.5 px-4 rounded-xl border border-[#5C4529]/40 text-[#5C4529] hover:bg-white/60 font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="py-2.5 px-4 rounded-xl bg-[#5C4529] hover:bg-[#47341D] text-white font-medium text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
