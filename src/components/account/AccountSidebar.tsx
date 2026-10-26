"use client";

import React from "react";
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];

interface AccountSidebarProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  onLogOut?: () => void;
}

export default function AccountSidebar({
  activeTab,
  onTabChange,
  onSelectTab,
  onLogOut,
}: AccountSidebarProps) {
  const handleNavClick = (tabId: string) => {
    if (onSelectTab) {
      onSelectTab(tabId);
    }
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const handleLogOutClick = () => {
    if (onLogOut) {
      onLogOut();
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  return (
    <>
      {/* Mobile Horizontal Scrolling Sub-Nav (md:hidden) */}
      <div className="md:hidden mb-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 border-b border-[#D2C4B4]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs uppercase font-medium tracking-wider shrink-0 transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#DFD2C2] text-[#2C241E] shadow-sm"
                    : "text-[#635546] hover:text-[#2C241E] hover:bg-[#DFD2C2]/40"
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
          {/* Mobile Log Out */}
          <button
            type="button"
            onClick={handleLogOutClick}
            className="flex items-center gap-2 px-4 py-2 text-xs uppercase font-medium tracking-wider shrink-0 text-[#635546] hover:text-[#2C241E] hover:bg-[#DFD2C2]/40 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Desktop Left Navigation Sidebar (hidden md:block) */}
      <aside className="hidden md:block sticky top-28 border-r border-[#D2C4B4]/60 pr-8 lg:pr-10">
        <span className="font-serif text-[22px] text-[#2C241E] mb-6 block tracking-tight">
          My Account
        </span>

        <nav className="flex flex-col space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3.5 py-3 px-4 text-[14px] transition-colors duration-200 cursor-pointer relative text-left w-full ${
                  isActive
                    ? "bg-[#DFD2C2] text-[#2C241E] font-medium"
                    : "text-[#635546] hover:text-[#2C241E] hover:bg-[#DFD2C2]/40"
                }`}
              >
                {/* Left bronze accent indicator bar */}
                {isActive && (
                  <span className="w-1 bg-[#5C4529] h-full absolute left-0 top-0" />
                )}
                <Icon
                  size={17}
                  className={isActive ? "text-[#5C4529]" : "text-[#786B5D]"}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Separator before Log Out */}
        <div className="w-full h-px bg-[#D2C4B4]/70 my-6" />

        {/* Log Out button */}
        <button
          type="button"
          onClick={handleLogOutClick}
          className="text-[#635546] hover:text-[#2C241E] flex items-center gap-3.5 py-3 px-4 text-[14px] transition-colors cursor-pointer w-full text-left"
        >
          <LogOut size={17} className="text-[#786B5D]" />
          <span>Log Out</span>
        </button>
      </aside>
    </>
  );
}
