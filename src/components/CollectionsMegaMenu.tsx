"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

export interface SubCategoryItem {
  _id: string;
  name: string;
  slug: string;
  rank?: number;
}

export interface DynamicCategory {
  _id: string;
  name: string;
  slug: string;
  rank: number;
  status?: string;
  isTopCategory?: boolean;
  subcategories: SubCategoryItem[];
}

const STATIC_FALLBACK_CATEGORIES: DynamicCategory[] = [
  {
    _id: "pre-owned",
    name: "Pre-Owned",
    slug: "pre-owned",
    rank: 1,
    subcategories: [
      { _id: "sub-1", name: "Men's Collection", slug: "pre-owned-mens-collection" },
      { _id: "sub-2", name: "Women's Collection", slug: "pre-owned-womens-collection" },
    ],
  },
  {
    _id: "new-watches",
    name: "New Watches",
    slug: "new-watches",
    rank: 2,
    subcategories: [
      { _id: "sub-3", name: "Men's Collection", slug: "new-watches-mens-collection" },
      { _id: "sub-4", name: "Women's Collection", slug: "new-watches-womens-collection" },
    ],
  },
  {
    _id: "vintage-watches",
    name: "Vintage Watches",
    slug: "vintage-watches",
    rank: 3,
    subcategories: [
      { _id: "sub-5", name: "Men's Collection", slug: "vintage-watches-mens-collection" },
      { _id: "sub-6", name: "Women's Collection", slug: "vintage-watches-womens-collection" },
    ],
  },
  {
    _id: "jewellery",
    name: "Jewellery",
    slug: "jewellery",
    rank: 4,
    subcategories: [],
  },
  {
    _id: "sold-watches",
    name: "Sold Watches",
    slug: "sold-watches",
    rank: 5,
    subcategories: [],
  },
];

export default function CollectionsMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<DynamicCategory[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("horologe_categories_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback to static data
      }
    }
    return STATIC_FALLBACK_CATEGORIES;
  });

  const [activeParentSlug, setActiveParentSlug] = useState<string>("pre-owned");
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch live categories from backend API on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          if (isMounted) {
            const sorted = (data.categories as DynamicCategory[]).sort(
              (a, b) => (a.rank || 0) - (b.rank || 0)
            );
            setCategories(sorted);
            try {
              localStorage.setItem("horologe_categories_cache", JSON.stringify(sorted));
            } catch {
              // Ignore storage errors
            }
          }
        }
      } catch {
        // Graceful fallback to cached or static categories
      }
    }
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Sorted active parent categories (only render active items in storefront)
  const sortedCategories = categories
    .filter((c) => c.status !== "inactive")
    .map((c) => ({
      ...c,
      subcategories: (c.subcategories || []).filter((s: any) => s.status !== "inactive"),
    }))
    .sort((a, b) => (a.rank || 0) - (b.rank || 0));

  // Active Parent Category (defaults to first active parent, e.g. Pre-Owned)
  const activeParentCategory =
    sortedCategories.find((c) => c.slug === activeParentSlug) ||
    sortedCategories[0] ||
    STATIC_FALLBACK_CATEGORIES[0];

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button / Nav Link */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1.5 hover:text-[#9D7E50] transition-colors cursor-pointer uppercase font-medium tracking-[0.16em] text-xs lg:text-[13px] text-[#2C241E] focus:outline-none"
        aria-expanded={isOpen}
      >
        <span>COLLECTIONS</span>
        <svg
          className={`w-3.5 h-3.5 stroke-current stroke-[2] fill-none transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Mega Menu Dropdown with Soothing Transition */}
      <div
        style={{ left: "-80px" }}
        className={`absolute top-full -left-[80px] mt-2 z-50 w-[630px] lg:w-[670px] bg-[#FFF4E6] border border-[#EBDCCB] shadow-[0_16px_36px_rgba(40,30,20,0.08)] py-4 px-6 transition-all duration-300 ease-out origin-top before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:content-[''] ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto visible"
            : "opacity-0 -translate-y-2 pointer-events-none invisible"
        }`}
        role="menu"
      >
        <div className="flex items-stretch justify-between">
          {/* Column 1: Primary Category List (Ordered by rank) */}
          <div className="w-[33%] shrink-0">
            <nav className="flex flex-col space-y-1.5 text-xs lg:text-[13px] tracking-[0.16em] uppercase font-medium">
              {sortedCategories.map((cat) => {
                const isActive = activeParentCategory?.slug === cat.slug;
                return (
                  <div key={cat._id || cat.slug}>
                    <Link
                      href={`/collections?category=${encodeURIComponent(cat.slug)}`}
                      onMouseEnter={() => setActiveParentSlug(cat.slug)}
                      onClick={() => setIsOpen(false)}
                      className={`transition-colors cursor-pointer select-none block ${
                        isActive
                          ? "bg-[#F5DFC6] text-[#2C241E] font-medium px-3 py-1 -ml-3"
                          : "text-[#4A423A] hover:text-[#9D7E50] py-1 px-3 -ml-3"
                      }`}
                    >
                      {cat.name.toUpperCase()}
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Vertical Hairline Divider */}
          <div className="w-[1px] bg-[#EBDCCB] self-stretch mx-4 my-0.5" />

          {/* Column 2: Dynamic Sub-category Links for activeParentCategory */}
          <div className="flex-1 min-w-[140px] pl-1">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#A69B8F] font-medium mb-2.5 block">
              {activeParentCategory?.name.toUpperCase() || "SELECTION"}
            </span>
            <div className="space-y-0.5">
              {activeParentCategory?.subcategories && activeParentCategory.subcategories.length > 0 ? (
                activeParentCategory.subcategories.map((sub) => (
                  <Link
                    key={sub._id || sub.slug}
                    href={`/collections?category=${encodeURIComponent(
                      activeParentCategory.slug
                    )}&sub=${encodeURIComponent(sub.slug)}`}
                    onClick={() => setIsOpen(false)}
                    className="block text-xs lg:text-[13px] text-[#3A332C] hover:text-[#9D7E50] font-sans py-1 transition-colors cursor-pointer"
                  >
                    {sub.name}
                  </Link>
                ))
              ) : (
                <div className="space-y-1">
                  <Link
                    href={`/collections?category=${encodeURIComponent(
                      activeParentCategory?.slug || "all"
                    )}`}
                    onClick={() => setIsOpen(false)}
                    className="block text-xs lg:text-[13px] text-[#3A332C] hover:text-[#9D7E50] font-sans py-1 transition-colors cursor-pointer"
                  >
                    All {activeParentCategory?.name || "Timepieces"}
                  </Link>
                  <span className="text-[11px] text-[#A69B8F] italic block py-0.5">
                    Curated vault selection
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Feature Media Showcase (Landscape Banner) */}
          <div className="shrink-0 flex items-center justify-end pl-3">
            <div className="w-[170px] lg:w-[185px] aspect-[16/10] bg-[#E7DDD2] border border-[#E0D1C1] rounded-none overflow-hidden shrink-0 flex items-center justify-center p-3 text-center">
              <span className="font-serif text-[11px] uppercase tracking-widest text-[#7A6C5E] leading-tight">
                HOROLOGE ROYALE
                <br />
                <span className="text-[9px] tracking-normal lowercase text-[#9E8D7E]">
                  curated vaults
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
