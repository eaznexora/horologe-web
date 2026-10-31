import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronDown,
  Plus,
  MoreHorizontal,
} from "lucide-react";

export const metadata = {
  title: "Product List | HOROLOGE ROYALE Admin",
  description: "Comprehensive management of horology products, stock status, and timepiece vault records.",
};

const VAULT_ITEMS = [
  {
    id: "v-1",
    name: "Daytona Cosmograph",
    specs: "Oyster, 40mm",
    brand: "ROLEX",
    brandType: "rolex",
    reference: "126500LN",
    condition: "Unworn",
    status: "In Stock",
    statusType: "in_stock",
    price: "₹ 21,50,000",
    image: "/assets/wishlist-daytona.jpg",
  },
  {
    id: "v-2",
    name: "Royal Oak",
    specs: "Automatic, 41mm",
    brand: "AUDEMARS PIGUET",
    brandType: "ap",
    reference: "15500ST.OO.1220ST.01",
    condition: "Pre-Owned",
    status: "Under Review",
    statusType: "review",
    price: "₹ 32,80,000",
    image: "/assets/AP.png",
  },
  {
    id: "v-3",
    name: "Nautilus",
    specs: "Automatic, 40mm",
    brand: "PATEK PHILIPPE",
    brandType: "patek",
    reference: "5711/1A-010",
    condition: "Pre-Owned",
    status: "Reserved",
    statusType: "reserved",
    price: "₹ 68,00,000",
    image: "/assets/categories-preowned.png",
  },
  {
    id: "v-4",
    name: "Datejust 36",
    specs: "Fluted Bezel, 36mm",
    brand: "ROLEX",
    brandType: "rolex",
    reference: "126234",
    condition: "Unworn",
    status: "In Stock",
    statusType: "in_stock",
    price: "₹ 11,20,000",
    image: "/assets/wishlist-datejust.jpg",
  },
  {
    id: "v-5",
    name: "Santos de Cartier",
    specs: "Automatic, 39.8mm",
    brand: "Cartier",
    brandType: "cartier",
    reference: "WSSA0029",
    condition: "Like New",
    status: "Sold",
    statusType: "sold",
    price: "₹ 6,45,000",
    image: "/assets/wishlist-cartier.jpg",
  },
];

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      {/* 1. Luxury Glassmorphic Top Title Bar */}
      <div className="flex items-center mb-6">
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

      {/* 2. Frosted Glass Metric Cards (4 Cards Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Total Products */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
            Total Products
          </span>
          <div className="font-serif text-[30px] lg:text-[32px] font-semibold text-[#2C241E] leading-tight">
            1380
          </div>
        </div>

        {/* Card 2: Active Products */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
            Active Products
          </span>
          <div className="font-serif text-[30px] lg:text-[32px] font-semibold text-[#2C241E] leading-tight">
            1379
          </div>
        </div>

        {/* Card 3: Low Stock */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
            Low Stock
          </span>
          <div className="font-serif text-[30px] lg:text-[32px] font-semibold text-[#2C241E] leading-tight">
            2
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] text-center transition-all duration-300 hover:border-[#5C4529]/40">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
            Out of Stock
          </span>
          <div className="font-serif text-[30px] lg:text-[32px] font-semibold text-[#2C241E] leading-tight">
            0
          </div>
        </div>
      </div>

      {/* 3. Frosted Glass Filter Bar */}
      <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 mb-6 shadow-[0_12px_36px_rgba(80,60,40,0.05)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Control 1: Search Product */}
          <div>
            <label className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
              Search Product
            </label>
            <input
              type="text"
              placeholder="Product Name / SKU"
              className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2.5 text-xs text-[#2C241E] placeholder-[#9E8D7E] shadow-sm outline-none focus:border-[#5C4529]/60 transition-colors"
            />
          </div>

          {/* Control 2: Category */}
          <div>
            <label className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
              Category
            </label>
            <div className="relative">
              <select
                defaultValue="all"
                className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-8 shadow-sm focus:border-[#5C4529]/60 transition-colors"
              >
                <option value="all">All Categories</option>
                <option value="luxury">Luxury Watches</option>
                <option value="chronograph">Chronographs</option>
                <option value="dress">Dress Watches</option>
                <option value="sports">Sports & Dive</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
              />
            </div>
          </div>

          {/* Control 3: Sub-category */}
          <div>
            <label className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
              Sub-category
            </label>
            <div className="relative">
              <select
                defaultValue="all"
                className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-8 shadow-sm focus:border-[#5C4529]/60 transition-colors"
              >
                <option value="all">All Subcategories</option>
                <option value="steel">Stainless Steel</option>
                <option value="gold">Yellow / Rose Gold</option>
                <option value="platinum">Platinum</option>
                <option value="titanium">Titanium</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
              />
            </div>
          </div>

          {/* Control 4: Stock Status */}
          <div>
            <label className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
              Stock Status
            </label>
            <div className="relative">
              <select
                defaultValue="all"
                className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-8 shadow-sm focus:border-[#5C4529]/60 transition-colors"
              >
                <option value="all">All Stock Status</option>
                <option value="in_stock">In Stock</option>
                <option value="under_review">Under Review</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6C5E]"
              />
            </div>
          </div>

          {/* Control 5: Sort By */}
          <div>
            <label className="text-[11px] uppercase tracking-[0.16em] text-[#7A6C5E] font-medium mb-1.5 block">
              Sort By
            </label>
            <div className="relative">
              <select
                defaultValue="newest"
                className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-xl px-3.5 py-2.5 text-xs text-[#2C241E] cursor-pointer outline-none appearance-none pr-8 shadow-sm focus:border-[#5C4529]/60 transition-colors"
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
              Your curated collection of the world&apos;s finest timepieces.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="bg-[#2C241E] hover:bg-[#1E1814] text-[#FAF6F0] text-xs font-medium px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <Plus size={14} />
            <span>+ Add Timepiece</span>
          </Link>
        </div>

        {/* Catalog Table */}
        <div className="overflow-x-auto no-scrollbar">
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
                <th className="py-4 px-4 font-semibold">BRAND</th>
                <th className="py-4 px-4 font-semibold">REFERENCE</th>
                <th className="py-4 px-4 font-semibold">CONDITION</th>
                <th className="py-4 px-4 font-semibold">STATUS</th>
                <th className="py-4 px-4 font-semibold">PRICE (INR)</th>
                <th className="py-4 pl-4 pr-1 text-right font-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4C6B3]/40">
              {VAULT_ITEMS.map((item) => (
                <tr
                  key={item.id}
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
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-[#2C241E] block text-xs leading-snug">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-[#7A6C5E] font-normal">
                          {item.specs}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Brand Column */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {item.brandType === "rolex" && (
                      <div className="flex items-center gap-1.5 text-[#2C241E]">
                        <svg
                          className="w-3.5 h-3.5 text-[#9C7A4A] shrink-0"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V18H19V19Z" />
                        </svg>
                        <span className="font-serif tracking-[0.2em] font-bold text-xs uppercase">
                          ROLEX
                        </span>
                      </div>
                    )}
                    {item.brandType === "ap" && (
                      <div className="flex items-center gap-1.5 text-[#2C241E]">
                        <span className="font-serif font-black text-xs text-[#2C241E] tracking-tighter">
                          AP
                        </span>
                        <span className="font-serif tracking-[0.14em] font-bold text-[10px] uppercase text-[#2C241E]">
                          AUDEMARS PIGUET
                        </span>
                      </div>
                    )}
                    {item.brandType === "patek" && (
                      <div className="text-[#2C241E]">
                        <span className="font-serif tracking-[0.15em] font-bold text-[11px] uppercase block leading-tight">
                          PATEK PHILIPPE
                        </span>
                        <span className="text-[9px] tracking-[0.25em] text-[#7A6C5E] block leading-none font-serif">
                          GENEVE
                        </span>
                      </div>
                    )}
                    {item.brandType === "cartier" && (
                      <span className="font-serif italic font-normal text-sm tracking-wide text-[#2C241E]">
                        Cartier
                      </span>
                    )}
                  </td>

                  {/* Reference */}
                  <td className="py-4 px-4 font-serif text-[#7A6C5E] text-xs whitespace-nowrap">
                    {item.reference}
                  </td>

                  {/* Condition */}
                  <td className="py-4 px-4 text-[#2C241E] text-xs font-medium whitespace-nowrap">
                    {item.condition}
                  </td>

                  {/* Status Pill */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {item.statusType === "in_stock" && (
                      <span className="bg-[#EAF5EC] text-[#2A6E3B] border border-[#CDE5D2] text-[11px] px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2A6E3B]" />
                        <span>In Stock</span>
                      </span>
                    )}
                    {item.statusType === "review" && (
                      <span className="bg-[#FEF5E7] text-[#9A6217] border border-[#FBE3BC] text-[11px] px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9A6217]" />
                        <span>Under Review</span>
                      </span>
                    )}
                    {item.statusType === "reserved" && (
                      <span className="bg-[#EAF2FB] text-[#245D99] border border-[#CDE0F6] text-[11px] px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#245D99]" />
                        <span>Reserved</span>
                      </span>
                    )}
                    {item.statusType === "sold" && (
                      <span className="bg-[#FDF0ED] text-[#A63824] border border-[#F9D6CE] text-[11px] px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A63824]" />
                        <span>Sold</span>
                      </span>
                    )}
                  </td>

                  {/* Price (INR) */}
                  <td className="py-4 px-4 font-serif text-[15px] font-semibold text-[#2C241E] whitespace-nowrap">
                    {item.price}
                  </td>

                  {/* Actions Column */}
                  <td className="py-4 pl-4 pr-1 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/products/view?id=${item.id}`}
                        className="bg-[#2C241E] hover:bg-[#1E1814] text-[#FAF6F0] text-xs px-3.5 py-1.5 rounded-lg font-medium transition-colors shadow-2xs"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg border border-white/60 bg-white/40 hover:bg-white/80 flex items-center justify-center text-[#7A6C5E] hover:text-[#2C241E] transition-colors"
                        aria-label="More actions"
                      >
                        <MoreHorizontal size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
