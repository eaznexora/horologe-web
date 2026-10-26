"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface CategoryItem {
  id: string;
  label: string;
  href: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: "PRE-OWNED", label: "PRE-OWNED", href: "/collections?category=pre-owned" },
  { id: "NEW WATCHES", label: "NEW WATCHES", href: "/collections?category=new" },
  { id: "VINTAGE WATCHES", label: "VINTAGE WATCHES", href: "/collections?category=vintage" },
  { id: "JEWELLERY", label: "JEWELLERY", href: "/collections?category=jewellery" },
  { id: "SOLD WATCHES", label: "SOLD WATCHES", href: "/collections?category=sold" },
];

export default function CollectionsMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("PRE-OWNED");
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
          {/* Column 1: Primary Category List (~34% width) */}
          <div className="w-[33%] shrink-0">
            <nav className="flex flex-col space-y-1.5 text-xs lg:text-[13px] tracking-[0.16em] uppercase font-medium">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <div key={cat.id}>
                    <Link
                      href={cat.href}
                      onMouseEnter={() => setActiveCategory(cat.id)}
                      onClick={() => setIsOpen(false)}
                      className={`transition-colors cursor-pointer select-none ${
                        isActive
                          ? "bg-[#F5DFC6] text-[#2C241E] font-medium px-3 py-1 -ml-3 inline-block"
                          : "text-[#4A423A] hover:text-[#9D7E50] py-1 px-3 -ml-3 inline-block"
                      }`}
                    >
                      {cat.label}
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Vertical Hairline Divider */}
          <div className="w-[1px] bg-[#EBDCCB] self-stretch mx-4 my-0.5" />

          {/* Column 2: Sub-category Links */}
          <div className="flex-1 min-w-[140px] pl-1">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#A69B8F] font-medium mb-2.5 block">
              {activeCategory}
            </span>
            <div className="space-y-0.5">
              <Link
                href={`/collections?type=${encodeURIComponent(
                  activeCategory.toLowerCase()
                )}&gender=men`}
                onClick={() => setIsOpen(false)}
                className="block text-xs lg:text-[13px] text-[#3A332C] hover:text-[#9D7E50] font-sans py-1 transition-colors cursor-pointer"
              >
                Men&apos;s Collection
              </Link>
              <Link
                href={`/collections?type=${encodeURIComponent(
                  activeCategory.toLowerCase()
                )}&gender=women`}
                onClick={() => setIsOpen(false)}
                className="block text-xs lg:text-[13px] text-[#3A332C] hover:text-[#9D7E50] font-sans py-1 transition-colors cursor-pointer"
              >
                Women&apos;s Collection
              </Link>
            </div>
          </div>

          {/* Column 3: Feature Media Showcase (Landscape Banner) */}
          <div className="shrink-0 flex items-center justify-end pl-3">
            <div className="w-[170px] lg:w-[185px] aspect-[16/10] bg-[#D8D1C7] rounded-none overflow-hidden shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
