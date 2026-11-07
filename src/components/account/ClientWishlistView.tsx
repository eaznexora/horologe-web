"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Heart, ChevronDown, Loader2 } from "lucide-react";
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

interface ClientWishlistViewProps {
  user?: any;
  onTabChange?: (tab: string) => void;
  hideSidebar?: boolean;
}

export default function ClientWishlistView({
  user,
  onTabChange,
  hideSidebar = true,
}: ClientWishlistViewProps) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const mapWishlistItems = useCallback((raw: any[]): WishlistItem[] => {
    if (!Array.isArray(raw)) return [];
    return raw
      .map((item: any) => {
        if (!item) return null;
        if (typeof item === "object") {
          return {
            id: item._id ? String(item._id) : String(Math.random()),
            brand: item.tagline || "HOROLOGE ROYALE",
            model: item.name || "Luxury Timepiece",
            specsLine1: item.minorSpecs?.[0] || "Certified Chronometer",
            specsLine2: item.minorSpecs?.[1] || "Authenticated Set",
            price: item.price ? `₹${Number(item.price).toLocaleString("en-IN")}` : "Price Upon Request",
            rawPrice: Number(item.price) || 0,
            image: item.images?.[0] || "/assets/admin-hero-watch.jpg",
            href: item.slug ? `/timepiece/${item.slug}` : "/collections",
            dateAdded: item.createdAt || new Date().toISOString(),
          };
        }
        return null;
      })
      .filter(Boolean) as WishlistItem[];
  }, []);

  const fetchWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/account/wishlist");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.wishlist)) {
          setItems(mapWishlistItems(data.wishlist));
        }
      }
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      setIsLoading(false);
    }
  }, [mapWishlistItems]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleRemove = async (id: string, name: string) => {
    try {
      const res = await fetch("/api/account/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timepieceId: id }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.wishlist)) {
        setItems(mapWishlistItems(data.wishlist));
      } else {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
      showToast(`Removed "${name}" from Wishlist`);
    } catch (err) {
      console.error("Failed to toggle wishlist item:", err);
      setItems((prev) => prev.filter((item) => item.id !== id));
      showToast(`Removed "${name}" from Wishlist`);
    }
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
      {/* Toast Notification (Strict Luxury Bronze - Zero Red Policy) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C241E] text-[#F9F5EF] px-5 py-3 rounded-none shadow-xl border border-[#D4C6B3] text-xs font-sans animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className={hideSidebar ? "w-full" : "grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] gap-10 md:gap-12 lg:gap-16 items-start"}>
        {/* Left Navigation Sidebar */}
        {!hideSidebar && <AccountSidebar activeTab="wishlist" onTabChange={onTabChange} />}

        {/* Right Main Content Area */}
        <div className="w-full">
          {/* Header & Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div>
              <h1 className="font-serif text-[32px] lg:text-[40px] text-[#2C241E] leading-tight">
                My Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-[#786B5D] font-sans mt-0.5">
                {items.length} {items.length === 1 ? "timepiece" : "timepieces"} saved to your private curation.
              </p>
            </div>

            {/* Sort Dropdown */}
            {items.length > 0 && (
              <div className="relative self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 border border-[#D4C6B3] bg-[#EFE7DE]/50 px-3.5 py-1.5 text-xs text-[#2C241E] cursor-pointer hover:border-[#5C4529] transition-colors rounded-none"
                >
                  <span className="font-serif uppercase tracking-wider">{getSortLabel()}</span>
                  <ChevronDown size={14} className="text-[#786B5D]" />
                </button>

                {showSortDropdown && (
                  <div className="absolute right-0 mt-1 w-44 bg-[#FFFDF9] border border-[#D4C6B3] shadow-lg py-1 z-30 text-xs rounded-none">
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
            )}
          </div>

          {/* Hairline Separator */}
          <div className="w-full h-[1px] bg-[#D2C4B4] mt-4 mb-8" />

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="py-20 text-center border border-[#D4C6B3] bg-[#EFE7DE]/50 rounded-none">
              <Loader2 className="w-7 h-7 animate-spin text-[#5C4529] mx-auto mb-3" />
              <p className="text-xs uppercase tracking-[0.2em] text-[#5C4529] font-medium font-sans">
                Accessing Vault Wishlist...
              </p>
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="py-20 text-center border border-[#D4C6B3] bg-[#EFE7DE]/50 rounded-none">
              <Heart size={36} className="mx-auto text-[#8A7C6E] mb-3 opacity-60" />
              <h3 className="font-serif text-xl text-[#2C241E]">Your wishlist is currently empty</h3>
              <p className="text-xs text-[#786B5D] mt-1.5 max-w-sm mx-auto font-sans leading-relaxed">
                Explore our curated collection of exceptional timepieces and save your favorite references here.
              </p>
              <Link
                href="/collections"
                className="inline-block mt-6 bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs uppercase tracking-wider font-medium px-6 py-3 transition-colors cursor-pointer rounded-none"
              >
                Explore Collections
              </Link>
            </div>
          ) : (
            <>
              {/* DESKTOP VIEW (hidden md:grid) */}
              <div className="hidden md:grid md:grid-cols-4 gap-4 lg:gap-6">
                {sortedItems.map((item) => (
                  <div
                    key={item.id}
                    style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
                    className="font-times-card border border-[#D4C6B3] bg-[#EFE7DE]/80 p-3 sm:p-4 flex flex-col justify-between group hover:border-[#BFAF9C] transition-all duration-300 rounded-none"
                  >
                    <div>
                      {/* Watch Visual Container */}
                      <div className="aspect-[4/5] relative overflow-hidden bg-[#DDD1C3] mb-4">
                        <img
                          src={item.image}
                          alt={`${item.brand} ${item.model}`}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Floating Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id, `${item.brand} ${item.model}`)}
                          className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 hover:bg-white text-[#2C241E] flex items-center justify-center shadow-sm cursor-pointer transition-colors z-10 rounded-none"
                          aria-label={`Remove ${item.model} from wishlist`}
                        >
                          <Heart size={14} className="fill-[#2C241E] text-[#2C241E]" />
                        </button>
                      </div>

                      {/* Metadata */}
                      <div>
                        <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A7C6E] font-medium block mb-1">
                          {item.brand}
                        </span>
                        <h3 className="font-serif text-[17px] sm:text-[18px] text-[#2C241E] font-medium leading-snug mb-2 line-clamp-1">
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
                          className="w-full bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs uppercase tracking-wider font-medium py-2.5 transition-colors cursor-pointer mb-2 rounded-none"
                        >
                          Add to Cart
                        </button>

                        <Link
                          href={item.href}
                          className="w-full border border-[#D4C6B3] hover:border-[#5C4529] bg-transparent text-[#2C241E] text-xs uppercase tracking-wider font-medium py-2.5 transition-colors cursor-pointer text-center block rounded-none"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* MOBILE VIEW (grid md:hidden) */}
              <div className="grid md:hidden grid-cols-2 gap-3 sm:gap-4">
                {sortedItems.map((item) => (
                  <div
                    key={item.id}
                    style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
                    className="font-times-card border border-[#D4C6B3] bg-[#EFE7DE]/80 p-2.5 sm:p-3 flex flex-col justify-between group hover:border-[#BFAF9C] transition-all rounded-none"
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
                          className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white text-[#2C241E] flex items-center justify-center shadow-sm cursor-pointer transition-colors z-10 rounded-none"
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
                        <h3 className="font-serif text-[15px] text-[#2C241E] font-medium leading-snug mb-1 line-clamp-1">
                          {item.model}
                        </h3>
                        <p className="text-[11px] text-[#786B5D] leading-tight line-clamp-1">
                          {item.specsLine1}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="text-[14px] text-[#2C241E] font-medium mb-2.5">
                        {item.price}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(`${item.brand} ${item.model}`)}
                          className="w-full bg-[#5C4529] text-[#F9F5EF] text-[10px] uppercase tracking-wider py-1.5 font-medium rounded-none"
                        >
                          Add to Bag
                        </button>
                        <Link
                          href={item.href}
                          className="w-full border border-[#D4C6B3] bg-transparent text-[#2C241E] text-[10px] uppercase tracking-wider py-1.5 text-center font-medium rounded-none block"
                        >
                          Details
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
