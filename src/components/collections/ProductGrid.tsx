"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ArrowLeft, ArrowRight, X } from "lucide-react";
import { formatINR } from "@/components/timepiece/DynamicTimepieceOverview";

export interface Product {
  id: string;
  name: string;
  brand: string;
  watchCategorySlug?: string;
  categorySlug?: string;
  image: string;
  description: string;
  price?: string;
  rawPrice?: number;
  href?: string;
}

// 1. Permanent Product #1 Benchmark Anchor (strictly preserved)
const BENCHMARK_PRODUCT: Product = {
  id: "p1-benchmark",
  name: "Rolex Cosmograph Daytona",
  brand: "Rolex",
  watchCategorySlug: "rolex",
  image: "/assets/categories-i1.png",
  description: "Precision engineered for those who value every second.",
  price: "₹ 20,00,000",
  rawPrice: 2000000,
  href: "/timepiece",
};

// Fallback catalog references to guarantee editorial density
const fallbackCatalogProducts: Product[] = [
  {
    id: "p2",
    name: "Omega Speedmaster Professional",
    brand: "Omega",
    watchCategorySlug: "omega",
    image: "/assets/categories-i2.png",
    description: "Legendary chronograph tested under the most demanding conditions.",
    price: "₹ 9,20,000",
    rawPrice: 920000,
    href: "/timepiece",
  },
  {
    id: "p3",
    name: "Casio G-Shock MR-G Titanium",
    brand: "Casio",
    watchCategorySlug: "casio",
    image: "/assets/categories-i3.png",
    description: "Ultra-tough titanium exterior paired with master artisan craftsmanship.",
    price: "₹ 4,10,000",
    rawPrice: 410000,
    href: "/timepiece",
  },
  {
    id: "p4",
    name: "Eaz Nexora Celestial Tourbillon",
    brand: "Eaz Nexora",
    watchCategorySlug: "eaz-nexora",
    image: "/assets/categories-i4.png",
    description: "Architectural dial symmetry with flawless finishing and regal presence.",
    price: "₹ 18,80,000",
    rawPrice: 1880000,
    href: "/timepiece",
  },
  {
    id: "p5",
    name: "Rolex Submariner Date",
    brand: "Rolex",
    watchCategorySlug: "rolex",
    image: "/assets/categories-i1.png",
    description: "The definitive diver reference crafted with timeless monobloc proportion.",
    price: "₹ 15,20,000",
    rawPrice: 1520000,
    href: "/timepiece",
  },
  {
    id: "p6",
    name: "Omega Seamaster Aqua Terra",
    brand: "Omega",
    watchCategorySlug: "omega",
    image: "/assets/categories-i2.png",
    description: "A tribute to rich maritime heritage with clean horizontal teak dials.",
    price: "₹ 7,80,000",
    rawPrice: 780000,
    href: "/timepiece",
  },
  {
    id: "p7",
    name: "Casio Edifice Premium Chrono",
    brand: "Casio",
    watchCategorySlug: "casio",
    image: "/assets/categories-i3.png",
    description: "High-octane motorsport aesthetic with razor-sharp index detailing.",
    price: "₹ 2,95,000",
    rawPrice: 295000,
    href: "/timepiece",
  },
  {
    id: "p8",
    name: "Eaz Nexora Chrono Sovereign",
    brand: "Eaz Nexora",
    watchCategorySlug: "eaz-nexora",
    image: "/assets/categories-i4.png",
    description: "Complex skeletonized balance mechanism reflecting pure haute horlogerie.",
    price: "₹ 21,50,000",
    rawPrice: 2150000,
    href: "/timepiece",
  },
  {
    id: "p9",
    name: "Rolex Datejust 41 Fluted",
    brand: "Rolex",
    watchCategorySlug: "rolex",
    image: "/assets/categories-i1.png",
    description: "Distinctive fluted bezel in white gold with legendary jubilee links.",
    price: "₹ 14,10,000",
    rawPrice: 1410000,
    href: "/timepiece",
  },
  {
    id: "p10",
    name: "Omega Constellation Co-Axial",
    brand: "Omega",
    watchCategorySlug: "omega",
    image: "/assets/categories-i2.png",
    description: "Dramatic and enduring design characterized by its iconic side claws.",
    price: "₹ 11,60,000",
    rawPrice: 1160000,
    href: "/timepiece",
  },
  {
    id: "p11",
    name: "Casio Oceanus Manta Slim",
    brand: "Casio",
    watchCategorySlug: "casio",
    image: "/assets/categories-i3.png",
    description: "Zaratsu polished titanium case with deep sapphire bezel accents.",
    price: "₹ 3,60,000",
    rawPrice: 360000,
    href: "/timepiece",
  },
  {
    id: "p12",
    name: "Eaz Nexora Apex Skeleton",
    brand: "Eaz Nexora",
    watchCategorySlug: "eaz-nexora",
    image: "/assets/categories-i4.png",
    description: "Avant-garde openwork mechanics engineered for discerning collectors.",
    price: "₹ 26,00,000",
    rawPrice: 2600000,
    href: "/timepiece",
  },
];

export interface WatchCategoryItem {
  _id: string;
  name: string;
  slug: string;
  rank: number;
  status: string;
}

const DEFAULT_WATCH_CATEGORIES: WatchCategoryItem[] = [
  { _id: "def-1", name: "ROLEX", slug: "rolex", rank: 1, status: "active" },
  { _id: "def-2", name: "OMEGA", slug: "omega", rank: 2, status: "active" },
  { _id: "def-3", name: "CASIO", slug: "casio", rank: 3, status: "active" },
  { _id: "def-4", name: "EAZ NEXORA", slug: "eaz-nexora", rank: 4, status: "active" },
];

const sortOptions = [
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "most-rare", label: "Most Rare" },
];

export default function ProductGrid() {
  const [watchCategories, setWatchCategories] =
    useState<WatchCategoryItem[]>(DEFAULT_WATCH_CATEGORIES);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("Newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const sortRef = useRef<HTMLDivElement>(null);

  // Fetch active watch categories & live active timepieces from MongoDB Atlas
  useEffect(() => {
    let isMounted = true;

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) {
        setActiveCategory(cat.toUpperCase());
      }
    }

    async function loadData() {
      try {
        const [watchCatRes, productsRes] = await Promise.all([
          fetch("/api/admin/watch-categories"),
          fetch("/api/admin/products?status=active"),
        ]);

        if (watchCatRes.ok) {
          const watchData = await watchCatRes.json();
          if (
            watchData.success &&
            Array.isArray(watchData.categories) &&
            watchData.categories.length > 0
          ) {
            if (isMounted) setWatchCategories(watchData.categories);
          }
        }

        if (productsRes.ok) {
          const prodData = await productsRes.json();
          if (prodData.success && Array.isArray(prodData.products)) {
            const mapped: Product[] = prodData.products.map((p: any) => ({
              id: p._id,
              name: p.name,
              brand: p.watchCategory?.name || p.category?.name || "Horologe",
              watchCategorySlug: p.watchCategory?.slug || "",
              categorySlug: p.category?.slug || "",
              image: p.images && p.images[0] ? p.images[0] : "/logo.png",
              description:
                p.tagline ||
                (p.minorSpecs && p.minorSpecs.length > 0
                  ? p.minorSpecs.join(" | ")
                  : "Certified luxury timepiece."),
              price: formatINR(p.price, false),
              rawPrice: p.price,
              href: `/timepiece/${p.slug}`,
            }));
            if (isMounted) setLiveProducts(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load live data for collections", err);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Close custom desktop dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  // Dynamic filter buttons: First button is always ALL, remaining are active watch categories
  const categoryButtons = [
    { id: "all", name: "ALL", slug: "all" },
    ...watchCategories
      .filter((c) => c.status !== "inactive")
      .map((c) => ({
        id: c._id,
        name: c.name.toUpperCase(),
        slug: c.slug,
      })),
  ];

  // Merge: Anchor Product #1 permanently, followed by live MongoDB products, followed by fallback fillers
  const filteredLive = liveProducts.filter(
    (lp) =>
      lp.name.toLowerCase() !== BENCHMARK_PRODUCT.name.toLowerCase() &&
      lp.href !== "/timepiece"
  );

  const mergedCatalog: Product[] = [
    BENCHMARK_PRODUCT,
    ...filteredLive,
    ...fallbackCatalogProducts.filter(
      (fb) => !filteredLive.some((lp) => lp.name.toLowerCase() === fb.name.toLowerCase())
    ),
  ];

  // Filter items based on activeCategory
  let displayedProducts = mergedCatalog.filter((product) => {
    if (activeCategory === "ALL" || activeCategory === "all") return true;
    const active = activeCategory.toLowerCase().trim();
    const brand = (product.brand || "").toLowerCase().trim();
    const name = (product.name || "").toLowerCase().trim();
    const watchCat = (product.watchCategorySlug || "").toLowerCase().trim();

    return (
      brand === active ||
      watchCat === active ||
      name.includes(active) ||
      active.includes(brand)
    );
  });

  // Apply sorting
  if (sortBy === "Price: Low to High") {
    displayedProducts = [...displayedProducts].sort(
      (a, b) => (a.rawPrice || 0) - (b.rawPrice || 0)
    );
  } else if (sortBy === "Price: High to Low") {
    displayedProducts = [...displayedProducts].sort(
      (a, b) => (b.rawPrice || 0) - (a.rawPrice || 0)
    );
  }

  return (
    <section className="w-full bg-[#E7DDD2]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-3 sm:pb-4">
        {/* 1. FILTER & SORT HEADER BAR */}

        {/* Desktop View (hidden md:flex) */}
        <div className="hidden md:flex justify-between items-center mb-8">
          {/* Left: Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {categoryButtons.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.name);
                    setActivePage(1);
                  }}
                  className={`px-6 py-2 text-xs uppercase tracking-widest font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#6D5333] text-white shadow-xs"
                      : "bg-[#DFD4C7] text-[#3A332C] hover:bg-[#D5C9BB]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Right: Custom Dropdown Sort Filter */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-wider text-[#3A332C] bg-[#DFD4C7] hover:bg-[#D5C9BB] transition-colors cursor-pointer"
            >
              <span>{sortBy}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#DFD4C7] border border-[#CDC1B4] shadow-md z-20">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSortBy(opt.label);
                      setIsSortOpen(false);
                      setActivePage(1);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider hover:bg-[#D5C9BB] transition-colors cursor-pointer ${
                      sortBy === opt.label
                        ? "text-[#6D5333] font-semibold bg-[#D5C9BB]/40"
                        : "text-[#3A332C]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile View: Filter Pill Button */}
        <div className="flex md:hidden justify-between items-center mb-6">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#DFD4C7] text-[#3A332C] text-xs uppercase tracking-widest font-medium cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#8A7968]">Filters:</span>
              <span className="text-[#3A332C] font-semibold">{activeCategory}</span>
              <span className="text-[#8A7968]">|</span>
              <span className="text-[#6D5333] font-medium">{sortBy}</span>
            </div>
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Mobile Full-Screen Filter Drawer Modal */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 md:hidden animate-in fade-in duration-200">
            <div
              className="fixed inset-0"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="relative w-full bg-[#E7DDD2] border-t border-[#CDC1B4] max-h-[85vh] overflow-y-auto flex flex-col p-6 shadow-2xl z-10 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-[#CDC1B4] mb-6">
                <h3 className="font-serif text-lg tracking-wider uppercase text-[#3A332C]">
                  Filter &amp; Sort
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-[#6D5333] hover:text-[#594226] p-1 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Categories Section */}
              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-widest text-[#7A6C5E] font-semibold mb-3">
                  Watch Categories
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {categoryButtons.map((cat) => {
                    const isActive = activeCategory === cat.name;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.name);
                          setActivePage(1);
                        }}
                        className={`py-2.5 px-3 text-xs uppercase tracking-wider text-center font-medium transition-colors cursor-pointer ${
                          isActive
                            ? "bg-[#6D5333] text-white"
                            : "bg-[#DFD4C7] text-[#3A332C] hover:bg-[#D5C9BB]"
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort By Section */}
              <div className="mb-8">
                <h4 className="text-xs uppercase tracking-widest text-[#7A6C5E] font-semibold mb-3">
                  Sort Order
                </h4>
                <div className="space-y-1.5">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSortBy(opt.label);
                        setActivePage(1);
                      }}
                      className={`w-full text-left py-2.5 px-4 text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-between ${
                        sortBy === opt.label
                          ? "bg-[#6D5333] text-white font-semibold"
                          : "bg-[#DFD4C7] text-[#3A332C] hover:bg-[#D5C9BB]"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.label && <span className="text-sm">&bull;</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2 mt-auto border-t border-[#CDC1B4]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("ALL");
                    setSortBy("Newest");
                    setActivePage(1);
                  }}
                  className="w-1/3 py-3 border border-[#BFAFA0] text-[#3A332C] text-xs font-medium uppercase tracking-wider hover:bg-black/5 transition-colors cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-2/3 py-3 bg-[#6D5333] hover:bg-[#594226] text-white text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCT CARDS GRID */}
        {/* Unified Responsive Grid: Desktop displays image-only cards (4 cols); Mobile displays image + styled details (2 cols) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {displayedProducts.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <p className="font-serif text-lg text-[#2C241E] mb-2">
                No timepieces currently cataloged under {activeCategory}
              </p>
              <p className="text-xs text-[#7A6C5E] mb-6">
                Our curators are sourcing and verifying references daily.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory("ALL")}
                className="bg-[#5C4529] hover:bg-[#47341D] text-[#FAF6F0] px-6 py-2 text-xs tracking-widest uppercase font-medium cursor-pointer transition-colors"
              >
                View All Watches
              </button>
            </div>
          ) : (
            displayedProducts.map((product) => {
              return (
                <Link
                  key={product.id}
                  href={product.href && product.href !== "#" ? product.href : "/timepiece"}
                  className="group flex flex-col bg-[#E7DDD2] h-full cursor-pointer"
                >
                  {/* Watch Image & Desktop Hover Overlay */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#D8CCC0]/40 shadow-sm group-hover:shadow-md transition-shadow duration-500">
                    <img
                      src={product.image || "/logo.png"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src !== "/logo.png") target.src = "/logo.png";
                      }}
                    />

                    {/* Desktop Dark Gradient Hover Overlay — Visible only on md+ on hover */}
                    <div className="hidden md:flex absolute inset-0 flex-col justify-end p-5 lg:p-6 z-10 pointer-events-none bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-500 ease-out">
                      <h3 className="font-serif text-white text-[20px] lg:text-[23px] xl:text-[24px] leading-[1.15] mb-2 font-normal">
                        {product.name}
                      </h3>
                      <p className="font-sans text-[#D5CEC5] text-[11px] lg:text-[12px] xl:text-[13px] leading-snug mb-4 max-w-[280px]">
                        {product.description}
                      </p>
                      <div className="w-full border border-white/80 hover:border-white bg-black/40 hover:bg-white hover:text-black text-white text-[11px] lg:text-[12px] tracking-[0.16em] uppercase font-medium py-2.5 px-4 flex items-center justify-center gap-2 transition-colors duration-300">
                        <span>VIEW TIMEPIECE &rarr;</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Details Container — COMPLETELY HIDDEN ON DESKTOP (md:!hidden), VISIBLE ONLY ON MOBILE */}
                  <div className="flex flex-col md:!hidden pt-3.5 pb-2 px-1 justify-between flex-grow bg-[#E7DDD2]">
                    <div>
                      <h3 className="font-serif text-[17px] sm:text-[18px] text-[#6D5438] leading-[1.15] mb-1.5">
                        {product.name}
                      </h3>
                      <p className="font-sans text-[11px] sm:text-[12px] text-[#827466] leading-snug mb-3">
                        {product.description}
                      </p>
                    </div>

                    {/* Mobile Button per Image 2 */}
                    <div className="w-full border border-[#9D856D] bg-[#E7DDD2] text-[#6D5438] text-[11px] sm:text-[12px] tracking-[0.14em] uppercase font-medium py-2 px-2 flex items-center justify-center gap-1.5 active:bg-[#6D5438] active:text-white transition-colors">
                      <span>VIEW TIMEPIECE &rarr;</span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* 3. PAGINATION */}
        <div className="mt-4 md:mt-5 flex items-center justify-end gap-2">
          {/* Previous Arrow */}
          <button
            onClick={() => setActivePage((p) => Math.max(1, p - 1))}
            disabled={activePage === 1}
            aria-label="Previous Page"
            className="bg-[#6D5333] hover:bg-[#594226] disabled:opacity-60 disabled:cursor-not-allowed text-white w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} />
          </button>

          {/* Page Numbers */}
          {[1, 2, 3].map((page) => {
            const isCurrent = activePage === page;
            return (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                aria-current={isCurrent ? "page" : undefined}
                className={`w-8 h-8 flex items-center justify-center text-xs font-medium transition-colors cursor-pointer ${
                  isCurrent
                    ? "bg-[#6D5333] text-white"
                    : "bg-[#DFD4C7] text-[#3A332C] hover:bg-[#D5C9BB]"
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next Arrow */}
          <button
            onClick={() => setActivePage((p) => p + 1)}
            aria-label="Next Page"
            className="bg-[#6D5333] hover:bg-[#594226] text-white w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}
