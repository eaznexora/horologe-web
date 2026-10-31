"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  Inbox,
  ShoppingCart,
  Users,
  Mail,
  ClipboardCheck,
  BarChart3,
  Layers,
  Settings,
  ChevronDown,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export default function AdminSidebar({ onNavigate, className = "" }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(true);

  const handleLinkClick = () => {
    setMobileOpen(false);
    if (onNavigate) {
      onNavigate();
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      isDashboard: true,
      icon: LayoutGrid,
      hasChevron: false,
    },
    {
      label: "Categories",
      href: "/admin/categories",
      isDashboard: false,
      icon: LayoutGrid,
      hasChevron: false,
    },
    {
      label: "Products",
      href: "/admin/products",
      isDashboard: false,
      icon: Package,
      hasChevron: true,
    },
    {
      label: "Orders",
      href: "/admin/orders",
      isDashboard: false,
      icon: Inbox,
      hasChevron: false,
    },
    {
      label: "Cart Activity",
      href: "/admin/cart-activity",
      isDashboard: false,
      icon: ShoppingCart,
      hasChevron: false,
    },
    {
      label: "Users",
      href: "/admin/users",
      isDashboard: false,
      icon: Users,
      hasChevron: false,
    },
    {
      label: "Inquiries",
      href: "/admin/inquiries",
      isDashboard: false,
      icon: Mail,
      hasChevron: false,
    },
    {
      label: "Inventory",
      href: "/admin/inventory",
      isDashboard: false,
      icon: ClipboardCheck,
      hasChevron: false,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      isDashboard: false,
      icon: BarChart3,
      hasChevron: false,
    },
    {
      label: "Banners",
      href: "/admin/banners",
      isDashboard: false,
      icon: Layers,
      hasChevron: true,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      isDashboard: false,
      icon: Settings,
      hasChevron: false,
    },
  ];

  const renderContent = () => (
    <>
      {/* Top Brand & Navigation Block */}
      <div className="flex flex-col min-h-0">
        {/* Maison Brand Header with enlarged /logo.png */}
        <Link href="/admin" onClick={handleLinkClick} className="block group">
          <div className="flex flex-col items-center mb-5">
            <div className="relative w-44 lg:w-48 h-20 lg:h-24 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/logo.png" 
                alt="Horologe Royale" 
                className="w-full h-full object-contain filter drop-shadow-sm"
                onError={(e) => {
                  // Fallback if logo.png is named differently or missing in public/
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </Link>

        {/* Hairline Divider */}
        <div className="w-full h-[1px] bg-[#D4C6B3]/60 mb-4 shrink-0" />

        {/* Navigation Links List */}
        <nav className="flex flex-col space-y-1 font-sans">
          {navItems.map((item) => {
            // Special Accordion Handler for "Products"
            if (item.label === "Products") {
              return (
                <div key="products-group" className="flex flex-col">
                  {/* 1. Products Trigger Row */}
                  <button
                    type="button"
                    onClick={() => setProductsOpen((prev) => !prev)}
                    className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl transition-all cursor-pointer select-none text-left ${
                      productsOpen
                        ? "bg-[#F9FAFB]/80 shadow-xs"
                        : "hover:bg-white/35 text-[#475467]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Package className="w-5 h-5 text-black shrink-0" />
                      <span
                        className={`text-[15px] tracking-normal truncate ${
                          productsOpen
                            ? "text-[#2C241E] font-semibold"
                            : "text-[#475467] font-normal"
                        }`}
                      >
                        Products
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform duration-200 ${
                        productsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* 2. Expandable Submenu Accordion */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      productsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="relative pl-7 py-1 flex flex-col gap-1 mt-1">
                      {/* Connecting Vertical Guide Line */}
                      <div className="absolute left-[22px] top-0 bottom-2 w-[1px] bg-[#D4C6B3]/60" />

                      {/* Submenu Item 1: Product List */}
                      <Link
                        href="/admin/products"
                        onClick={handleLinkClick}
                        className={`text-[13px] transition-colors cursor-pointer block pl-2 py-1.5 ${
                          pathname === "/admin/products"
                            ? "text-[#5C4529] font-semibold"
                            : "text-[#7A6C5E] hover:text-[#2C241E] font-medium"
                        }`}
                      >
                        Product List
                      </Link>

                      {/* Submenu Item 2: Add a Product */}
                      <Link
                        href="/admin/products/new"
                        onClick={handleLinkClick}
                        className={`text-[13px] transition-colors cursor-pointer block pl-2 py-1.5 ${
                          pathname === "/admin/products/new"
                            ? "text-[#5C4529] font-semibold"
                            : "text-[#7A6C5E] hover:text-[#2C241E] font-medium"
                        }`}
                      >
                        Add a Product
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "bg-white/60 shadow-xs text-[#101828] font-medium border border-white/70"
                    : "text-[#475467] hover:text-[#101828] hover:bg-white/35 font-normal"
                }`}
              >
                {/* Left Group: Icon + Label */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {item.isDashboard ? (
                    <svg
                      className="w-5 h-5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                        rx="1.5"
                        className={
                          isActive
                            ? "fill-[#5C4529] stroke-[#5C4529]"
                            : "stroke-current text-[#64748B]"
                        }
                      />
                      <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                        rx="1.5"
                        className={isActive ? "stroke-[#101828]" : "stroke-current text-[#64748B]"}
                      />
                      <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                        rx="1.5"
                        className={isActive ? "stroke-[#101828]" : "stroke-current text-[#64748B]"}
                      />
                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                        rx="1.5"
                        className={isActive ? "stroke-[#101828]" : "stroke-current text-[#64748B]"}
                      />
                    </svg>
                  ) : (
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? "text-[#101828]" : "text-[#64748B]"
                      }`}
                    />
                  )}

                  <span className="text-[15px] tracking-normal truncate">
                    {item.label}
                  </span>
                </div>

                {/* Right Trailing Chevron (for expandable items like Banners) */}
                {item.hasChevron && (
                  <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom Storefront Link */}
      <div className="pt-4 border-t border-[#D4C6B3]/50 mt-4 shrink-0">
        <Link
          href="/"
          className="text-xs text-[#5C4529] hover:underline flex items-center gap-1.5 px-1 font-medium tracking-wide transition-colors"
        >
          <span>Storefront</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Desktop Stationary Pinned Sidebar (Fixed sticky top-0 h-screen select-none overflow-y-auto) */}
      <aside
        className={`hidden md:flex w-[240px] lg:w-[260px] h-screen sticky top-0 shrink-0 p-5 lg:p-6 flex-col justify-between border-r border-white/50 bg-white/30 backdrop-blur-2xl z-40 select-none overflow-y-auto no-scrollbar ${className}`}
      >
        {renderContent()}
      </aside>

      {/* 2. Mobile Header Toggle Button */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#7A6C5E] hover:text-[#2C241E] bg-white/70 backdrop-blur-md rounded-xl border border-white/70 shadow-xs transition-colors flex items-center justify-center"
          aria-label={mobileOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* 3. Mobile Slide-Out Glass Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Glass Backdrop */}
          <div
            className="fixed inset-0 bg-[#2C241E]/30 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Container */}
          <aside className="relative w-72 max-w-[85vw] h-full bg-[#F4EDE5]/95 backdrop-blur-2xl border-r border-white/60 shadow-2xl p-6 flex flex-col justify-between z-10 select-none overflow-y-auto">
            <div className="absolute top-4 right-4 z-20">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-[#7A6C5E] hover:text-[#2C241E] bg-white/60 rounded-lg border border-white/70 transition-colors"
                aria-label="Close Navigation Menu"
              >
                <X size={16} />
              </button>
            </div>
            {renderContent()}
          </aside>
        </div>
      )}
    </>
  );
}
