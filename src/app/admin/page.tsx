import React from "react";
import Link from "next/link";
import {
  Coins,
  Watch,
  ShoppingBag,
  Search,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Package,
} from "lucide-react";

export const metadata = {
  title: "Executive Dashboard | HOROLOGE ROYALE",
  description: "Executive inventory valuation, orders, clients, and sourcing portal.",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* 1. 4 KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Vault Valuation */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex flex-col justify-between hover:border-white/95 transition-all">
          <div>
            <div className="w-9 h-9 rounded-xl bg-[#DECFC0] flex items-center justify-center text-[#5C4529] mb-3 shadow-2xs">
              <Coins size={17} />
            </div>
            <span className="text-xs text-[#7A6C5E] font-medium block">
              Total Vault Valuation
            </span>
            <div className="font-serif text-[24px] lg:text-[26px] font-semibold text-[#2C241E] my-1 leading-snug">
              ₹ 12,48,70,000
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#2F6B3D] flex items-center gap-1 font-medium">
              <ArrowUp size={12} />
              +12.4% <span className="text-[#8C7A6B] font-normal">vs last month</span>
            </span>
            {/* Mini Rising Sparkline Bars */}
            <div className="flex items-end gap-1 h-5 shrink-0">
              <span className="w-1 rounded-xs bg-[#2F6B3D]/30 h-[35%]" />
              <span className="w-1 rounded-xs bg-[#2F6B3D]/45 h-[50%]" />
              <span className="w-1 rounded-xs bg-[#2F6B3D]/40 h-[45%]" />
              <span className="w-1 rounded-xs bg-[#2F6B3D]/70 h-[75%]" />
              <span className="w-1 rounded-xs bg-[#2F6B3D] h-[95%]" />
            </div>
          </div>
        </div>

        {/* Card 2: Active Timepieces */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex flex-col justify-between hover:border-white/95 transition-all">
          <div>
            <div className="w-9 h-9 rounded-xl bg-[#DECFC0] flex items-center justify-center text-[#5C4529] mb-3 shadow-2xs">
              <Watch size={17} />
            </div>
            <span className="text-xs text-[#7A6C5E] font-medium block">
              Active Timepieces
            </span>
            <div className="font-serif text-[24px] lg:text-[26px] font-semibold text-[#2C241E] my-1 leading-snug">
              248
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#2F6B3D] flex items-center gap-1 font-medium">
              <ArrowUp size={12} />
              +8.1% <span className="text-[#8C7A6B] font-normal">vs last month</span>
            </span>
            {/* Mini Rising Sparkline Bars */}
            <div className="flex items-end gap-1 h-5 shrink-0">
              <span className="w-1 rounded-xs bg-[#2F6B3D]/30 h-[40%]" />
              <span className="w-1 rounded-xs bg-[#2F6B3D]/40 h-[45%]" />
              <span className="w-1 rounded-xs bg-[#2F6B3D]/60 h-[65%]" />
              <span className="w-1 rounded-xs bg-[#2F6B3D]/75 h-[80%]" />
              <span className="w-1 rounded-xs bg-[#2F6B3D] h-[100%]" />
            </div>
          </div>
        </div>

        {/* Card 3: Pending Orders */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex flex-col justify-between hover:border-white/95 transition-all">
          <div>
            <div className="w-9 h-9 rounded-xl bg-[#DECFC0] flex items-center justify-center text-[#5C4529] mb-3 shadow-2xs">
              <ShoppingBag size={17} />
            </div>
            <span className="text-xs text-[#7A6C5E] font-medium block">
              Pending Orders
            </span>
            <div className="font-serif text-[24px] lg:text-[26px] font-semibold text-[#2C241E] my-1 leading-snug">
              16
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#7A6C5E] flex items-center gap-1 font-medium">
              <ArrowDown size={12} />
              -5.2% <span className="text-[#8C7A6B] font-normal">vs last month</span>
            </span>
            {/* Mini Falling Sparkline Bars */}
            <div className="flex items-end gap-1 h-5 shrink-0">
              <span className="w-1 rounded-xs bg-[#7A6C5E] h-[90%]" />
              <span className="w-1 rounded-xs bg-[#7A6C5E]/75 h-[75%]" />
              <span className="w-1 rounded-xs bg-[#7A6C5E]/60 h-[60%]" />
              <span className="w-1 rounded-xs bg-[#7A6C5E]/45 h-[45%]" />
              <span className="w-1 rounded-xs bg-[#7A6C5E]/30 h-[30%]" />
            </div>
          </div>
        </div>

        {/* Card 4: Sourcing Requests */}
        <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-5 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex flex-col justify-between hover:border-white/95 transition-all">
          <div>
            <div className="w-9 h-9 rounded-xl bg-[#DECFC0] flex items-center justify-center text-[#5C4529] mb-3 shadow-2xs">
              <Search size={17} />
            </div>
            <span className="text-xs text-[#7A6C5E] font-medium block">
              Sourcing Requests
            </span>
            <div className="font-serif text-[24px] lg:text-[26px] font-semibold text-[#2C241E] my-1 leading-snug">
              27
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#2F6B3D] flex items-center gap-1 font-medium">
              <ArrowUp size={12} />
              +18.6% <span className="text-[#8C7A6B] font-normal">vs last month</span>
            </span>
            {/* Mini Rising Sparkline Bars */}
            <div className="flex items-end gap-1 h-5 shrink-0">
              <span className="w-1 rounded-xs bg-[#2F6B3D]/30 h-[30%]" />
              <span className="w-1 rounded-xs bg-[#2F6B3D]/50 h-[50%]" />
              <span className="w-1 rounded-xs bg-[#2F6B3D]/65 h-[65%]" />
              <span className="w-1 rounded-xs bg-[#2F6B3D]/80 h-[80%]" />
              <span className="w-1 rounded-xs bg-[#2F6B3D] h-[100%]" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Executive Quick Access Gateway */}
      <div className="bg-white/45 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_8px_24px_rgba(80,60,40,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#2C241E] text-[#FAF6F0] flex items-center justify-center shrink-0 shadow-sm">
            <Package size={20} />
          </div>
          <div>
            <h3 className="font-serif text-[18px] text-[#2C241E] font-medium leading-snug">
              Product List & Vault Records
            </h3>
            <p className="text-xs text-[#7A6C5E] mt-0.5">
              Access the complete inventory catalog, stock status filters, and timepiece reference details.
            </p>
          </div>
        </div>

        <Link
          href="/admin/products"
          className="bg-[#2C241E] hover:bg-[#1E1814] text-[#FAF6F0] text-xs font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm shrink-0"
        >
          <span>Open Product List</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
