"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ChevronDown } from "lucide-react";
import AccountSidebar from "./AccountSidebar";

export interface WishlistItem {
  id: string;
  brand: string;
  model: string;
  specsLine1: string;
  specsLine2: string;
  price: string;
  rawPrice: number;
  image: string;
  href: string;
  dateAdded: string;
}

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: "w-1",
    brand: "ROLEX",
    model: "Cosmograph Daytona",
    specsLine1: "Chronograph  |  Automatic",
    specsLine2: "Rose Gold",
    price: "₹20,00,000.00",
    rawPrice: 2000000,
    image: "/assets/wishlist-daytona.jpg",
    href: "/timepiece",
    dateAdded: "2026-10-20",
  },
  {
    id: "w-2",
    brand: "OMEGA",
    model: "Speedmaster Moonwatch",
    specsLine1: "Chronograph  |  Manual Wind",
    specsLine2: "Stainless Steel",
    price: "₹8,50,000.00",
    rawPrice: 850000,
    image: "/assets/wishlist-speedmaster.jpg",
    href: "/timepiece",
    dateAdded: "2026-10-18",
  },
  {
    id: "w-3",
    brand: "CARTIER",
    model: "Tank Française",
    specsLine1: "Quartz",
    specsLine2: "Yellow Gold",
    price: "₹12,50,000.00",
    rawPrice: 1250000,
    image: "/assets/wishlist-cartier.jpg",
    href: "/timepiece",
    dateAdded: "2026-10-15",
  },
  {
    id: "w-4",
    brand: "ROLEX",
    model: "Datejust 41",
    specsLine1: "Automatic",
    specsLine2: "Jubilee Bracelet",
    price: "₹16,80,000.00",
    rawPrice: 1680000,
    image: "/assets/wishlist-datejust.jpg",
    href: "/timepiece",
    dateAdded: "2026-10-12",
  },
];

interface ClientWishlistViewProps {
  onTabChange?: (tab: string) => void;
  hideSidebar?: boolean;
}

export default function ClientWishlistView({ onTabChange, hideSidebar = true }: ClientWishlistViewProps) {
  const [items, setItems] = useState<WishlistItem[]>(INITIAL_WISHLIST);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleRemove = (id: string, name: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    showToast(`Removed "${name}" from Wishlist`);
  };

  const handleAddToCart = (name: string) => {
    showToast(`Added "${name}" to your bag`);
  };

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "oldest") return a.dateAdded.localeCompare(b.dateAdded);
    if (sortBy === "price-high") return b.rawPrice - a.rawPrice;
    if (sortBy === "price-low") return a.rawPrice - b.rawPrice;
    return b.dateAdded.localeCompare(a.dateAdded); // Default newest first
  });

  const getSortLabel = () => {
    switch (sortBy) {
      case "oldest":
        return "Added: Oldest First";
      case "price-high":
        return "Price: High to Low";
      case "price-low":
        return "Price: Low to High";
      default:
        return "Added: Newest First";
    }
  };

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C241E] text-[#F9F5EF] px-5 py-3 rounded-none shadow-xl border border-[#D4C6B3] text-xs font-sans animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Main Grid Layout: Left Sidebar + Main Content */}
      <div className={hideSidebar ? "w-full" : "grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] gap-10 md:gap-12 lg:gap-16 items-start"}>
        {/* Left Navigation Sidebar */}
        {!hideSidebar && <AccountSidebar activeTab="wishlist" onTabChange={onTabChange} />}

        {/* Right Main Content Area */}
        <div className="w-full">
          {/* Header Block & Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
            {/* Title Block */}
            <div>
              <h1 className="font-serif text-[32px] lg:text-[40px] text-[#2C241E] leading-tight">
                My Wishlist
              </h1>
              <p className="text-sm text-[#786B5D] font-sans mt-1">
                Your saved timepieces and accessories.
              </p>
            </div>

            {/* Right Toolbar */}
            <div className="flex items-center self-start sm:self-auto shrink-0">
              <span className="text-xs text-[#8A7C6E] mr-4 hidden sm:inline-block font-sans">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>

              <div className="h-4 w-px bg-[#D2C4B4] mr-4 hidden sm:inline-block" />

              {/* Sort Pill Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="border border-[#D4C6B3] bg-transparent text-xs text-[#2C241E] px-3.5 py-1.5 flex items-center gap-2 cursor-pointer hover:border-[#5C4529] transition-colors"
                >
                  <span>{getSortLabel()}</span>
                  <ChevronDown size={14} className="text-[#786B5D]" />
                </button>

                {showSortDropdown && (
                  <div className="absolute right-0 mt-1 w-48 bg-[#FFFDF9] border border-[#D4C6B3] shadow-lg py-1 z-30 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setSortBy("newest");
                        setShowSortDropdown(false);
                      }}
                      className={`block w-full text-left px-3 py-1.5 hover:bg-[#DFD2C2]/50 ${
                        sortBy === "newest" ? "font-semibold text-[#5C4529]" : "text-[#2C241E]"
                      }`}
                    >
                      Added: Newest First
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSortBy("oldest");
                        setShowSortDropdown(false);
                      }}
                      className={`block w-full text-left px-3 py-1.5 hover:bg-[#DFD2C2]/50 ${
                        sortBy === "oldest" ? "font-semibold text-[#5C4529]" : "text-[#2C241E]"
                      }`}
                    >
                      Added: Oldest First
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSortBy("price-high");
                        setShowSortDropdown(false);
                      }}
                      className={`block w-full text-left px-3 py-1.5 hover:bg-[#DFD2C2]/50 ${
                        sortBy === "price-high" ? "font-semibold text-[#5C4529]" : "text-[#2C241E]"
                      }`}
                    >
                      Price: High to Low
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSortBy("price-low");
                        setShowSortDropdown(false);
                      }}
                      className={`block w-full text-left px-3 py-1.5 hover:bg-[#DFD2C2]/50 ${
                        sortBy === "price-low" ? "font-semibold text-[#5C4529]" : "text-[#2C241E]"
                      }`}
                    >
                      Price: Low to High
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hairline Separator */}
          <div className="w-full h-[1px] bg-[#D2C4B4] mt-4 mb-8" />

          {/* Empty State */}
          {sortedItems.length === 0 ? (
            <div className="py-20 text-center border border-[#D4C6B3] bg-[#EFE7DE]/50">
              <Heart size={36} className="mx-auto text-[#8A7C6E] mb-3 opacity-60" />
              <p className="font-serif text-xl text-[#2C241E]">Your wishlist is currently empty</p>
              <p className="text-xs text-[#786B5D] mt-1.5 max-w-sm mx-auto font-sans">
                Explore our curated collection of exceptional timepieces and save your favorite references here.
              </p>
              <Link
                href="/collections"
                className="inline-block mt-6 bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs uppercase tracking-wider font-medium px-6 py-3 transition-colors cursor-pointer"
              >
                Explore Collections
              </Link>
            </div>
          ) : (
            <>
              {/* ========================================================= */}
              {/* DESKTOP VIEW (hidden md:grid)                             */}
              {/* 4-column catalog grid matching reference screenshot       */}
              {/* ========================================================= */}
              <div className="hidden md:grid md:grid-cols-4 gap-4 lg:gap-6">
                {sortedItems.map((item) => (
                  <div
                    key={item.id}
                    style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
                    className="font-times-card border border-[#D4C6B3] bg-[#EFE7DE]/80 p-3 sm:p-4 flex flex-col justify-between group hover:border-[#BFAF9C] transition-all duration-300"
                  >
                    <div>
                      {/* Watch Visual Container */}
                      <div className="aspect-[4/5] relative overflow-hidden bg-[#DDD1C3] mb-4">
                        <img
                          src={item.image}
                          alt={`${item.brand} ${item.model}`}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Floating Remove / Favorite Button */}
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id, `${item.brand} ${item.model}`)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#2C241E] flex items-center justify-center shadow-sm cursor-pointer transition-colors z-10"
                          aria-label={`Remove ${item.model} from wishlist`}
                        >
                          <Heart size={16} className="fill-[#2C241E] text-[#2C241E]" />
                        </button>
                      </div>

                      {/* Metadata & Specs */}
                      <div>
                        <span className="text-[10px] tracking-[0.18em] uppercase text-[#8A7C6E] font-medium block mb-1">
                          {item.brand}
                        </span>
                        <h3 className="text-[17px] sm:text-[18px] text-[#2C241E] font-normal leading-tight mb-1">
                          {item.model}
                        </h3>
                        <p className="text-xs text-[#786B5D] leading-tight mb-1">
                          {item.specsLine1}
                        </p>
                        <p className="text-xs text-[#786B5D] leading-tight mb-3">
                          {item.specsLine2}
                        </p>
                      </div>
                    </div>

                    <div>
                      {/* Pricing */}
                      <div className="text-[17px] sm:text-[18px] text-[#2C241E] font-medium mb-4">
                        {item.price}
                      </div>

                      {/* Action Buttons Stack */}
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(`${item.brand} ${item.model}`)}
                          className="w-full bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs uppercase tracking-wider font-medium py-2.5 transition-colors cursor-pointer mb-2"
                        >
                          Add to Cart
                        </button>

                        <Link
                          href={item.href}
                          className="w-full border border-[#D4C6B3] hover:border-[#5C4529] bg-transparent text-[#2C241E] text-xs uppercase tracking-wider font-medium py-2.5 transition-colors cursor-pointer text-center block"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ========================================================= */}
              {/* MOBILE VIEW (grid md:hidden)                              */}
              {/* 2-column touch grid with scaled typography & padding      */}
              {/* ========================================================= */}
              <div className="grid md:hidden grid-cols-2 gap-3 sm:gap-4">
                {sortedItems.map((item) => (
                  <div
                    key={item.id}
                    style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
                    className="font-times-card border border-[#D4C6B3] bg-[#EFE7DE]/80 p-2.5 sm:p-3 flex flex-col justify-between group hover:border-[#BFAF9C] transition-all"
                  >
                    <div>
                      {/* Watch Visual Container */}
                      <div className="aspect-[4/5] relative overflow-hidden bg-[#DDD1C3] mb-3">
                        <img
                          src={item.image}
                          alt={`${item.brand} ${item.model}`}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Floating Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id, `${item.brand} ${item.model}`)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#2C241E] flex items-center justify-center shadow-sm cursor-pointer transition-colors z-10"
                          aria-label={`Remove ${item.model} from wishlist`}
                        >
                          <Heart size={14} className="fill-[#2C241E] text-[#2C241E]" />
                        </button>
                      </div>

                      {/* Metadata & Specs */}
                      <div>
                        <span className="text-[9px] tracking-[0.16em] uppercase text-[#8A7C6E] font-medium block mb-0.5">
                          {item.brand}
                        </span>
                        <h3 className="text-[15px] text-[#2C241E] font-normal leading-tight mb-1">
                          {item.model}
                        </h3>
                        <p className="text-[11px] text-[#786B5D] leading-tight mb-0.5 truncate">
                          {item.specsLine1}
                        </p>
                        <p className="text-[11px] text-[#786B5D] leading-tight mb-2.5 truncate">
                          {item.specsLine2}
                        </p>
                      </div>
                    </div>

                    <div>
                      {/* Pricing */}
                      <div className="text-[15px] text-[#2C241E] font-medium mb-3">
                        {item.price}
                      </div>

                      {/* Action Buttons Stack */}
                      <div className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(`${item.brand} ${item.model}`)}
                          className="w-full bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-[11px] uppercase tracking-wider font-medium py-2 transition-colors cursor-pointer"
                        >
                          Add to Cart
                        </button>

                        <Link
                          href={item.href}
                          className="w-full border border-[#D4C6B3] hover:border-[#5C4529] bg-transparent text-[#2C241E] text-[11px] uppercase tracking-wider font-medium py-2 transition-colors cursor-pointer text-center block"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
