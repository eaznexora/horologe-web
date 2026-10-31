"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface SubCategoryItem {
  _id: string;
  name: string;
  slug: string;
  rank?: number;
  status?: string;
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

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: DynamicCategory[];
}

export default function MobileNavDrawer({
  isOpen,
  onClose,
  categories: initialCategories,
}: MobileNavDrawerProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<DynamicCategory[]>(() => {
    if (initialCategories && initialCategories.length > 0) return initialCategories;
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

  const [activeParentSlug, setActiveParentSlug] = useState<string | null>("pre-owned");
  const [isDismissing, setIsDismissing] = useState(false);

  // Sync categories if passed via props
  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
    }
  }, [initialCategories]);

  // Fetch live categories from API if not already supplied
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
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
        // Fallback gracefully
      }
    }

    if (!initialCategories || initialCategories.length === 0) {
      loadCategories();
    }

    return () => {
      isMounted = false;
    };
  }, [initialCategories]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setActiveParentSlug("pre-owned");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Filter and sort active categories
  const sortedCategories = categories
    .filter((c) => c.status !== "inactive")
    .map((c) => ({
      ...c,
      subcategories: (c.subcategories || []).filter((s) => s.status !== "inactive"),
    }))
    .sort((a, b) => (a.rank || 0) - (b.rank || 0));

  // Toggle active parent accordion row
  const toggleParent = (slug: string) => {
    setActiveParentSlug((prev) => (prev === slug ? null : slug));
  };

  // Fluid dismissal with soft exit motion before navigation
  const handleNavigate = (href: string) => {
    setIsDismissing(true);
    setTimeout(() => {
      onClose();
      setIsDismissing(false);
      if (href.startsWith("#")) {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          router.push("/" + href);
        }
      } else {
        router.push(href);
      }
    }, 180);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-nav-fullscreen-overlay"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: isDismissing ? 0 : 1, y: isDismissing ? -8 : 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 w-full h-[100dvh] bg-[#FFF4E6] z-50 flex flex-col justify-between overflow-y-auto overflow-x-hidden font-sans select-none"
        >
          {/* Sticky Top Bar inside the Menu: Mirrors the standard mobile header exactly */}
          <div className="border-b border-[#EBDCCB] px-5 py-3.5 flex items-center justify-between sticky top-0 bg-[#FFF4E6] z-10 shrink-0">
            {/* Left: /logo.png brand lockup */}
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate("/");
              }}
              className="relative block ml-2 sm:ml-4 w-64 h-16 max-w-[220px] max-h-[52px]"
            >
              <Image
                src="/logo.png"
                alt="Horologe Royale Logo"
                fill
                sizes="260px"
                className="object-contain object-left"
                priority
              />
            </Link>

            {/* Right: Account icon + Close X button with tactile press feedback */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleNavigate("/account")}
                aria-label="Account"
                className="text-[#2C241E] active:scale-90 transition-transform duration-150 cursor-pointer select-none p-1"
              >
                <User size={24} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-[#2C241E] active:scale-90 transition-transform duration-150 cursor-pointer select-none p-1"
                aria-label="Close Navigation"
              >
                <X size={28} />
              </button>
            </div>
          </div>

          {/* Dynamic Categories Accordion with Fluid Motion */}
          <div className="flex-1 flex flex-col py-4">
            <div className="flex flex-col">
              {sortedCategories.map((cat) => {
                const isActive = activeParentSlug === cat.slug;
                const hasSubs = cat.subcategories && cat.subcategories.length > 0;

                return (
                  <div key={cat._id || cat.slug} className="flex flex-col">
                    {/* Parent Item Row */}
                    <button
                      type="button"
                      onClick={() => toggleParent(cat.slug)}
                      className={`w-full text-left py-3 px-6 text-[14px] tracking-[0.2em] uppercase font-medium transition-all duration-200 flex items-center justify-between cursor-pointer select-none ${
                        isActive
                          ? "bg-[#F5DFC6] text-[#2C241E]"
                          : "text-[#3D332A] hover:bg-[#FAF0E1]/60"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ChevronDown
                        size={16}
                        className={`text-[#7A6C5E] transition-transform duration-300 ${
                          isActive ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Child Subcategories Retraction & Expansion */}
                    <div
                      className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
                        isActive ? "max-h-60 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="pl-5 border-l border-[#D4C6B3] ml-9 my-2 space-y-2.5">
                        {hasSubs ? (
                          <>
                            {cat.subcategories.map((sub) => (
                              <button
                                key={sub._id || sub.slug}
                                type="button"
                                onClick={() =>
                                  handleNavigate(
                                    `/collections?category=${encodeURIComponent(
                                      cat.slug
                                    )}&sub=${encodeURIComponent(sub.slug)}`
                                  )
                                }
                                className="text-[13px] text-[#2C241E] hover:text-[#9D7E50] tracking-wide block py-1 active:opacity-70 transition-opacity text-left cursor-pointer w-full"
                              >
                                {sub.name}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() =>
                                handleNavigate(
                                  `/collections?category=${encodeURIComponent(cat.slug)}`
                                )
                              }
                              className="text-[12px] uppercase tracking-[0.14em] text-[#8C7A6B] hover:text-[#2C241E] block py-0.5 active:opacity-70 transition-opacity text-left cursor-pointer font-medium"
                            >
                              Explore All {cat.name} &rarr;
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleNavigate(
                                `/collections?category=${encodeURIComponent(cat.slug)}`
                              )
                            }
                            className="text-[13px] text-[#2C241E] hover:text-[#9D7E50] tracking-wide block py-1 active:opacity-70 transition-opacity text-left cursor-pointer w-full"
                          >
                            All {cat.name} Collection
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Core Maison Links */}
            <div className="border-t border-[#EBDCCB] mt-5 pt-4 px-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleNavigate("#about")}
                className="text-[13px] tracking-[0.2em] uppercase font-medium text-[#2C241E] hover:text-[#9D7E50] active:scale-[0.99] transition-all text-left block cursor-pointer"
              >
                ABOUT US
              </button>

              <button
                type="button"
                onClick={() => handleNavigate("#insights")}
                className="text-[13px] tracking-[0.2em] uppercase font-medium text-[#2C241E] hover:text-[#9D7E50] active:scale-[0.99] transition-all text-left block cursor-pointer"
              >
                INSIGHTS
              </button>

              <button
                type="button"
                onClick={() => handleNavigate("/sell-your-luxury")}
                className="text-[13px] tracking-[0.2em] uppercase font-medium text-[#2C241E] hover:text-[#9D7E50] active:scale-[0.99] transition-all text-left block cursor-pointer"
              >
                SELL YOUR LUXURY
              </button>
            </div>
          </div>

          {/* Bottom Showcase Card */}
          <div className="px-6 pt-4 pb-8 mt-auto shrink-0">
            <div className="w-full aspect-[16/9] bg-[#E7DDD2] border border-[#E0D1C1] rounded-sm flex items-center justify-center p-4 text-center">
              <div className="flex flex-col items-center">
                <span className="font-serif text-[11px] tracking-[0.25em] uppercase text-[#6D5333]">
                  HOROLOGE ROYALE
                </span>
                <div className="w-6 h-[1px] bg-[#C5A880] my-1 opacity-80" />
                <span className="font-serif text-[10px] tracking-[0.2em] uppercase text-[#8C7A6B]">
                  Curated Vaults &bull; Est. 2016
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
