"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowLeft, ArrowRight, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  description: string;
  price?: string;
  href?: string;
}

const catalogProducts: Product[] = [
  {
    id: "p1",
    name: "Rolex Cosmograph Daytona",
    brand: "Rolex",
    image: "/assets/categories-i1.png",
    description: "Precision engineered for those who value every second.",
    price: "$34,500",
    href: "/timepiece",
  },
  {
    id: "p2",
    name: "Omega Speedmaster Professional",
    brand: "Omega",
    image: "/assets/categories-i2.png",
    description: "Legendary chronograph tested under the most demanding conditions.",
    price: "$9,200",
    href: "/timepiece",
  },
  {
    id: "p3",
    name: "Casio G-Shock MR-G Titanium",
    brand: "Casio",
    image: "/assets/categories-i3.png",
    description: "Ultra-tough titanium exterior paired with master artisan craftsmanship.",
    price: "$4,100",
    href: "/timepiece",
  },
  {
    id: "p4",
    name: "Eaz Nexora Celestial Tourbillon",
    brand: "Eaz Nexora",
    image: "/assets/categories-i4.png",
    description: "Architectural dial symmetry with flawless finishing and regal presence.",
    price: "$18,800",
    href: "/timepiece",
  },
  {
    id: "p5",
    name: "Rolex Submariner Date",
    brand: "Rolex",
    image: "/assets/categories-i1.png",
    description: "The definitive diver reference crafted with timeless monobloc proportion.",
    price: "$15,200",
    href: "/timepiece",
  },
  {
    id: "p6",
    name: "Omega Seamaster Aqua Terra",
    brand: "Omega",
    image: "/assets/categories-i2.png",
    description: "A tribute to rich maritime heritage with clean horizontal teak dials.",
    price: "$7,800",
    href: "/timepiece",
  },
  {
    id: "p7",
    name: "Casio Edifice Premium Chrono",
    brand: "Casio",
    image: "/assets/categories-i3.png",
    description: "High-octane motorsport aesthetic with razor-sharp index detailing.",
    price: "$2,950",
    href: "/timepiece",
  },
  {
    id: "p8",
    name: "Eaz Nexora Chrono Sovereign",
    brand: "Eaz Nexora",
    image: "/assets/categories-i4.png",
    description: "Complex skeletonized balance mechanism reflecting pure haute horlogerie.",
    price: "$21,500",
    href: "/timepiece",
  },
  {
    id: "p9",
    name: "Rolex Datejust 41 Fluted",
    brand: "Rolex",
    image: "/assets/categories-i1.png",
    description: "Distinctive fluted bezel in white gold with legendary jubilee links.",
    price: "$14,100",
    href: "/timepiece",
  },
  {
    id: "p10",
    name: "Omega Constellation Co-Axial",
    brand: "Omega",
    image: "/assets/categories-i2.png",
    description: "Dramatic and enduring design characterized by its iconic side claws.",
    price: "$11,600",
    href: "/timepiece",
  },
  {
    id: "p11",
    name: "Casio Oceanus Manta Slim",
    brand: "Casio",
    image: "/assets/categories-i3.png",
    description: "Zaratsu polished titanium case with deep sapphire bezel accents.",
    price: "$3,600",
    href: "/timepiece",
  },
  {
    id: "p12",
    name: "Eaz Nexora Apex Skeleton",
    brand: "Eaz Nexora",
    image: "/assets/categories-i4.png",
    description: "Avant-garde openwork mechanics engineered for discerning collectors.",
    price: "$26,000",
    href: "/timepiece",
  },
];

const filterBrands = ["All", "Rolex", "Omega", "Casio", "Eaz Nexora"];

const sortOptions = [
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "most-rare", label: "Most Rare" },
];

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const sortRef = useRef<HTMLDivElement>(null);

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

  // Filter items based on activeCategory
  const displayedProducts =
    activeCategory === "All"
      ? catalogProducts
      : catalogProducts.filter((p) => p.brand.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section className="w-full bg-[#E7DDD2]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-3 sm:pb-4">
        {/* 1. FILTER & SORT HEADER BAR */}

        {/* Desktop View (hidden md:flex) */}
        <div className="hidden md:flex justify-between items-center mb-8">
          {/* Left: Filter Buttons */}
          <div className="flex items-center gap-2">
            {filterBrands.map((brand) => {
              const isActive = activeCategory === brand;
              return (
                <button
                  key={brand}
                  onClick={() => {
                    setActiveCategory(brand);
                    setActivePage(1);
                  }}
                  className={`px-4 py-1.5 text-xs tracking-wider uppercase font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#6D5333] text-white"
                      : "border border-[#BFAFA0] bg-transparent text-[#3A332C] hover:border-[#6D5333]"
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>

          {/* Right: Custom Luxury Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen((prev) => !prev)}
              className="border border-[#BFAFA0] bg-transparent hover:border-[#6D5333] px-4 py-2 flex items-center gap-3 cursor-pointer select-none text-[#3A332C] text-[13px] tracking-wide transition-colors"
              aria-expanded={isSortOpen}
            >
              <span>Sort by: {sortBy}</span>
              <ChevronDown
                size={14}
                className={`text-[#3A332C] transition-transform duration-200 ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 z-30 bg-[#E7DDD2] border border-[#BFAFA0] shadow-lg py-1.5 animate-in fade-in zoom-in-95 duration-150">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSortBy(opt.label);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer flex items-center justify-between ${
                      sortBy === opt.label
                        ? "bg-[#6D5333] text-white font-medium"
                        : "text-[#3A332C] hover:bg-[#6D5333] hover:text-white"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.label && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile View (flex md:hidden) — Stationary Filter Icon with Independent Sliding Track */}
        <div className="flex md:hidden items-center gap-2 mb-6 w-full">
          {/* 1. FIXED PINNED FILTER ICON */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="shrink-0 z-10 w-9 h-9 flex items-center justify-center bg-[#6D5333] active:bg-[#594226] text-white border border-[#6D5333] shadow-sm cursor-pointer transition-colors"
            aria-label="Open Filter Drawer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5 4a1 1 0 00-2 0v1H1v2h2v1a1 1 0 002 0V4zm14 2h-12v2h12V6zm-4 4a1 1 0 00-2 0v1H1v2h8v1a1 1 0 002 0v-4zm14 2h-4v2h4v-2zm-8 4a1 1 0 00-2 0v1H1v2h6v1a1 1 0 002 0v-4zm14 2h-8v2h8v-2z" />
            </svg>
          </button>

          {/* 2. INDEPENDENT HORIZONTAL SCROLL TRACK FOR CATEGORIES */}
          <div
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-grow py-1"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* Category Pills */}
            {filterBrands.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setActivePage(1);
                }}
                className={`shrink-0 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#6D5333] text-white border border-[#6D5333]"
                    : "bg-transparent text-[#3A332C] border border-[#BFAFA0] active:bg-[#6D5333]/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 1b. MOBILE FILTER & SORT DRAWER MODAL */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileFilterOpen(false)}
            />

            {/* Bottom Drawer Sheet */}
            <div className="relative z-10 w-full max-h-[85vh] bg-[#E7DDD2] border-t border-[#BFAFA0] rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#D8CCC0]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6D5333]" />
                  <h2 className="font-serif text-[#1C1A17] text-[17px] tracking-wide uppercase font-semibold">
                    Filters &amp; Sort
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#3A332C] hover:bg-black/10 transition-colors cursor-pointer"
                  aria-label="Close Filter Drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-grow">
                {/* Section 1: Brands / Collection */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#6D5438] mb-3">
                    Select Brand
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {filterBrands.map((brand) => {
                      const isActive = activeCategory === brand;
                      return (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => {
                            setActiveCategory(brand);
                            setActivePage(1);
                          }}
                          className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                            isActive
                              ? "bg-[#6D5333] text-white border border-[#6D5333]"
                              : "bg-transparent text-[#3A332C] border border-[#BFAFA0] hover:border-[#6D5333]"
                          }`}
                        >
                          {brand}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Sort By */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#6D5438] mb-3">
                    Sort Order
                  </h3>
                  <div className="space-y-2">
                    {sortOptions.map((opt) => {
                      const isSelected = sortBy === opt.label;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSortBy(opt.label)}
                          className={`w-full flex items-center justify-between px-4 py-3 text-xs tracking-wide transition-colors cursor-pointer border ${
                            isSelected
                              ? "bg-[#6D5333] text-white border-[#6D5333] font-medium"
                              : "bg-transparent text-[#3A332C] border-[#BFAFA0] hover:border-[#6D5333]"
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <span className="text-sm">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-[#D8CCC0] bg-[#E0D4C7] flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("All");
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
          {displayedProducts.map((product) => (
            <Link
              key={product.id}
              href={product.href && product.href !== "#" ? product.href : "/timepiece"}
              className="group flex flex-col bg-[#E7DDD2] h-full cursor-pointer"
            >
              {/* Watch Image & Desktop Hover Overlay */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#D8CCC0]/40 shadow-sm group-hover:shadow-md transition-shadow duration-500">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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
          ))}
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
                className={`w-8 h-8 flex items-center justify-center text-xs transition-colors cursor-pointer ${
                  isCurrent
                    ? "bg-[#D4C5B3] text-[#332A20] font-medium"
                    : "text-[#6E6153] hover:text-[#332A20] hover:bg-[#D4C5B3]/40"
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next Arrow */}
          <button
            onClick={() => setActivePage((p) => Math.min(3, p + 1))}
            disabled={activePage === 3}
            aria-label="Next Page"
            className="bg-[#6D5333] hover:bg-[#594226] disabled:opacity-60 disabled:cursor-not-allowed text-white w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}
