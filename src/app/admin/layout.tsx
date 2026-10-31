import type { Metadata } from "next";
import Image from "next/image";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Search, Globe, Bell, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Executive Enclave Portal | HOROLOGE ROYALE",
  description: "Secure management console for luxury timepiece inventory, orders, and concierge requests.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen h-screen flex flex-col md:flex-row overflow-hidden bg-[#EFE6DC] text-[#2C241E] font-sans antialiased selection:bg-[#DFD2C2] selection:text-[#2C241E]">
      {/* Background Editorial Canvas Texture & Atmospheric Staging */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image
          src="/assets/admin-canvas-bg.jpg"
          alt="Warm sand linen background texture"
          fill
          priority
          className="object-cover object-bottom opacity-35"
        />
        {/* Soft Ambient Radial Blur Lights */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] rounded-full bg-[#FFF7EE]/70 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] rounded-full bg-[#E5D5C5]/60 blur-3xl" />
      </div>

      {/* 1. FIXED SIDEBAR */}
      <AdminSidebar />

      {/* 2. SCROLLABLE MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto relative z-10">
        {/* Top Navbar */}
        <header className="h-16 px-6 lg:px-8 border-b border-white/50 bg-white/20 backdrop-blur-lg flex items-center justify-between sticky top-0 z-30 shrink-0 shadow-[0_2px_12px_rgba(80,60,40,0.02)] pl-14 md:pl-6 lg:pl-8">
          {/* Left: Search Bar */}
          <div className="flex items-center gap-3 w-full max-w-[420px]">
            <div className="flex items-center gap-2.5 bg-white/45 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2 w-full shadow-xs">
              <Search size={15} className="text-[#8C7A6B] shrink-0" />
              <input
                type="text"
                placeholder="Search by model, brand, reference or client..."
                className="w-full bg-transparent text-xs text-[#2C241E] placeholder-[#9E8D7E] focus:outline-none"
              />
              <span className="hidden sm:inline-block bg-white/60 text-[10px] text-[#7A6C5E] px-1.5 py-0.5 rounded border border-white/70 font-mono shadow-2xs">
                ⌘ K
              </span>
            </div>
          </div>

          {/* Right: Profile & Utility Cluster */}
          <div className="flex items-center gap-4 lg:gap-6 pl-4">
            {/* Globe / Locale Indicator */}
            <button
              type="button"
              className="hidden xl:flex items-center gap-1.5 text-xs text-[#7A6C5E] hover:text-[#2C241E] transition-colors"
              title="Region: Global"
            >
              <Globe size={15} />
            </button>

            {/* Date Stamp */}
            <span className="hidden sm:inline-block text-xs text-[#7A6C5E] font-medium whitespace-nowrap">
              Mon, 27 Oct 2026
            </span>

            {/* Notification Bell with Amber Unread Dot */}
            <button
              type="button"
              className="relative text-[#7A6C5E] hover:text-[#2C241E] transition-colors p-1"
              aria-label="Notifications"
            >
              <Bell size={17} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B86B35] ring-2 ring-[#EFE6DC]" />
            </button>

            {/* Vertical Hairline Divider */}
            <div className="h-7 w-[1px] bg-[#D4C6B3]/60 hidden sm:block" />

            {/* Admin Avatar & Name */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 rounded-full border border-white/80 overflow-hidden relative shadow-xs shrink-0 bg-[#DFCDBF]">
                <Image
                  src="/assets/nafis-avatar.jpg"
                  alt="Nafis Ansari"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-semibold text-[#2C241E] leading-none block group-hover:text-[#5C4529] transition-colors">
                  Nafis Ansari
                </span>
                <span className="text-[10px] text-[#8C7A6B] block mt-0.5 font-medium leading-none">
                  Executive Admin
                </span>
              </div>
              <ChevronDown
                size={13}
                className="text-[#7A6C5E] group-hover:text-[#2C241E] transition-transform hidden sm:block"
              />
            </div>
          </div>
        </header>

        {/* Main Dashboard Workspace */}
        <main className="flex-1 min-w-0 p-5 sm:p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
