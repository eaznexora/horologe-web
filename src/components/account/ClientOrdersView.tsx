"use client";

import React, { useState } from "react";
import {
  User,
  Package,
  MapPin,
  Heart,
  CreditCard,
  Bell,
  Settings,
  Truck,
  FileText,
  ChevronDown,
  ArrowRight,
  X,
} from "lucide-react";

import AccountSidebar from "./AccountSidebar";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "payments", label: "Payment Methods", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

export type OrderStatus = "Delivered" | "Shipped" | "Processing" | "Cancelled" | "Returned";

export interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  productName: string;
  specsLine1: string;
  specsLine2: string;
  image: string;
  deliveryLabel: string;
  deliveryDate: string;
  price: string;
  itemCount: string;
  shippingAddress: string;
  trackingNumber: string;
  paymentMethod: string;
}

const SAMPLE_ORDERS: OrderItem[] = [
  {
    id: "ord-1",
    orderNumber: "#HR12684",
    date: "12 Oct 2026",
    status: "Delivered",
    productName: "Rolex Cosmograph Daytona",
    specsLine1: "Chronograph  |  Automatic",
    specsLine2: "Rose Gold",
    image: "/assets/Rolex Daytona.png",
    deliveryLabel: "Delivered on",
    deliveryDate: "15 Oct 2026",
    price: "₹20,00,000",
    itemCount: "1 item",
    shippingAddress: "Villa 42, Palm Jumeirah, Dubai, UAE",
    trackingNumber: "HR-DXB-984128",
    paymentMethod: "Wire Transfer (Verified)",
  },
  {
    id: "ord-2",
    orderNumber: "#HR11942",
    date: "28 Sep 2026",
    status: "Shipped",
    productName: "Audemars Piguet Royal Oak",
    specsLine1: "Chronograph 41mm  |  Automatic",
    specsLine2: "Smoked Blue Dial",
    image: "/assets/AP.png",
    deliveryLabel: "Estimated Delivery",
    deliveryDate: "29 Oct 2026",
    price: "₹28,50,000",
    itemCount: "1 item",
    shippingAddress: "Penthouse 18B, Emirates Hills, Dubai, UAE",
    trackingNumber: "HR-DXB-772190",
    paymentMethod: "Escrow Vault Transfer",
  },
  {
    id: "ord-3",
    orderNumber: "#HR10831",
    date: "15 Aug 2026",
    status: "Processing",
    productName: "Patek Philippe Grand Complications",
    specsLine1: "Perpetual Calendar  |  Self-Winding",
    specsLine2: "Platinum Case",
    image: "/assets/categories-brandnew.png",
    deliveryLabel: "Processing at Vault",
    deliveryDate: "Dispatches in 2 days",
    price: "₹45,00,000",
    itemCount: "1 item",
    shippingAddress: "Villa 42, Palm Jumeirah, Dubai, UAE",
    trackingNumber: "HR-VAULT-44120",
    paymentMethod: "Credit Card (•••• 8821)",
  },
  {
    id: "ord-4",
    orderNumber: "#HR09415",
    date: "04 Jun 2026",
    status: "Cancelled",
    productName: "Vacheron Constantin Overseas",
    specsLine1: "Dual Time  |  Automatic",
    specsLine2: "Silver Dial",
    image: "/assets/product-details-main.png",
    deliveryLabel: "Order Cancelled",
    deliveryDate: "Refund processed on 05 Jun",
    price: "₹18,00,000",
    itemCount: "1 item",
    shippingAddress: "Villa 42, Palm Jumeirah, Dubai, UAE",
    trackingNumber: "HR-CAN-11029",
    paymentMethod: "Wire Transfer (Refunded)",
  },
];

interface ClientOrdersViewProps {
  onTabChange?: (tab: string) => void;
  hideSidebar?: boolean;
}

export default function ClientOrdersView({ onTabChange, hideSidebar = true }: ClientOrdersViewProps) {
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedFilter, setSelectedFilter] = useState<string>("All Orders");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  // Filter orders
  const filteredOrders = SAMPLE_ORDERS.filter((order) => {
    if (selectedFilter === "All Orders") return true;
    return order.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "oldest") return a.date.localeCompare(b.date);
    if (sortBy === "price-high") {
      const pA = parseInt(a.price.replace(/[^\d]/g, ""), 10);
      const pB = parseInt(b.price.replace(/[^\d]/g, ""), 10);
      return pB - pA;
    }
    if (sortBy === "price-low") {
      const pA = parseInt(a.price.replace(/[^\d]/g, ""), 10);
      const pB = parseInt(b.price.replace(/[^\d]/g, ""), 10);
      return pA - pB;
    }
    return 0; // Default newest
  });

  const getStatusBadge = (status: OrderStatus) => {
    const timesStyle = { fontFamily: '"Times New Roman", Times, Georgia, serif' };
    switch (status) {
      case "Delivered":
        return (
          <span style={timesStyle} className="bg-[#D6E8D8] text-[#2F6B3D] px-3.5 py-0.5 text-xs font-normal rounded-full inline-flex items-center justify-center select-none">
            Delivered
          </span>
        );
      case "Shipped":
        return (
          <span style={timesStyle} className="bg-[#E3EFFB] text-[#285D96] px-3.5 py-0.5 text-xs font-normal rounded-full inline-flex items-center justify-center select-none">
            Shipped
          </span>
        );
      case "Processing":
        return (
          <span style={timesStyle} className="bg-[#FCF2DF] text-[#8C6422] px-3.5 py-0.5 text-xs font-normal rounded-full inline-flex items-center justify-center select-none">
            Processing
          </span>
        );
      case "Cancelled":
        return (
          <span style={timesStyle} className="bg-[#FDE7E7] text-[#9E3535] px-3.5 py-0.5 text-xs font-normal rounded-full inline-flex items-center justify-center select-none">
            Cancelled
          </span>
        );
      default:
        return (
          <span style={timesStyle} className="bg-[#EFE7DE] text-[#635546] px-3.5 py-0.5 text-xs font-normal rounded-full inline-flex items-center justify-center select-none">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Main Grid Layout (Desktop: 2-column sidebar + main content) */}
      <div className={hideSidebar ? "w-full" : "grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] gap-10 md:gap-12 lg:gap-16 items-start"}>
        {/* Left Navigation Sidebar */}
        {!hideSidebar && <AccountSidebar activeTab="orders" onTabChange={handleNavClick} />}

        {/* Right Main Content Area */}
        <div className="w-full">
          {/* Header Bar & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-[32px] lg:text-[40px] uppercase tracking-wide text-[#2C241E] leading-tight">
                My Orders
              </h1>
              <p className="text-sm text-[#786B5D] font-sans mt-1">
                View and manage your orders, track deliveries and request returns.
              </p>
            </div>

            {/* Sort Pill Dropdown */}
            <div className="relative shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="border border-[#D4C6B3] bg-transparent text-xs text-[#2C241E] px-3.5 py-1.5 flex items-center gap-2 cursor-pointer hover:border-[#5C4529] transition-colors"
              >
                <span>
                  {sortBy === "newest"
                    ? "Newest First"
                    : sortBy === "oldest"
                    ? "Oldest First"
                    : sortBy === "price-high"
                    ? "Price: High to Low"
                    : "Price: Low to High"}
                </span>
                <ChevronDown size={14} className="text-[#786B5D]" />
              </button>

              {showSortDropdown && (
                <div className="absolute right-0 mt-1 w-44 bg-[#FFFDF9] border border-[#D4C6B3] shadow-lg py-1 z-30 text-xs">
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
                    Newest First
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
                    Oldest First
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

          {/* Filter Tabs Bar */}
          <div className="border-b border-[#D4C6B3] mb-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-6 text-xs lg:text-[13px] tracking-wider uppercase">
              {["All Orders", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"].map(
                (filter) => {
                  const isActive = selectedFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSelectedFilter(filter)}
                      className={`pb-2.5 transition-colors whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "text-[#2C241E] font-medium border-b-2 border-[#2C241E]"
                          : "text-[#786B5D] hover:text-[#2C241E] border-b-2 border-transparent"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Orders List Container */}
          <div className="space-y-4">
            {sortedOrders.length === 0 ? (
              <div className="py-16 text-center border border-[#D4C6B3] bg-[#EFE7DE]/50">
                <Package size={36} className="mx-auto text-[#8A7C6E] mb-3 opacity-60" />
                <p className="font-serif text-lg text-[#2C241E]">No orders found</p>
                <p className="text-xs text-[#786B5D] mt-1">
                  You do not have any orders matching the &ldquo;{selectedFilter}&rdquo; filter.
                </p>
              </div>
            ) : (
              sortedOrders.map((order) => (
                <div
                  key={order.id}
                  style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
                  className="font-times-card border border-[#DECFC0] bg-[#F5EDE4] p-5 lg:p-6 rounded-[4px] mb-4 hover:border-[#C8B8A6] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  {/* ========================================================= */}
                  {/* DESKTOP 2-ROW STRUCTURE (hidden md:block)                  */}
                  {/* Exactly matching reference design                         */}
                  {/* ========================================================= */}
                  <div className="hidden md:block">
                    {/* ROW 1: Order Metadata & Status (Left) | Price (Mid-Right) | View Order (Right) */}
                    <div className="grid grid-cols-[1.8fr_1fr_1fr] items-center pb-3.5 border-b border-[#DECFC0]/80">
                      {/* Col 1: Order ID, Date & Status Pill */}
                      <div className="flex items-center justify-between pr-6 lg:pr-8">
                        <div>
                          <span className="text-[16px] font-semibold text-[#2C241E] block leading-tight">
                            {order.orderNumber}
                          </span>
                          <span className="text-[13px] text-[#8A7C6E] block mt-0.5">
                            {order.date}
                          </span>
                        </div>

                        {/* Status Badge Pill */}
                        <div>{getStatusBadge(order.status)}</div>
                      </div>

                      {/* Col 2: Total Price & Items Count (Aligned to Right of Column 2) */}
                      <div className="flex items-center justify-end pr-6 lg:pr-8">
                        <div className="text-left">
                          <span className="text-[17px] font-medium text-[#2C241E] block leading-tight">
                            {order.price}
                          </span>
                          <span className="text-[13px] text-[#8A7C6E] block mt-0.5">
                            {order.itemCount}
                          </span>
                        </div>
                      </div>

                      {/* Col 3: View Order CTA Button */}
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="bg-[#6E5034] hover:bg-[#584027] text-[#FAF6F0] text-[13px] tracking-wide px-5 py-2.5 rounded-[3px] transition-colors cursor-pointer flex items-center gap-2.5 shadow-xs"
                        >
                          <span>View Order</span>
                          <ArrowRight size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>

                    {/* ROW 2: Product Visual, Specs, Delivery Status, Actions */}
                    <div className="grid grid-cols-[1.8fr_auto_1fr_auto_1fr] items-center pt-3.5">
                      {/* Col 1: Product Thumbnail & Details */}
                      <div className="flex items-center gap-4 pr-6 lg:pr-8 min-w-0">
                        <div className="w-16 h-16 bg-[#EDE3D7] border border-[#DECFC0] rounded-[4px] overflow-hidden flex items-center justify-center shrink-0">
                          <img
                            src={order.image}
                            alt={order.productName}
                            className="w-full h-full object-contain p-1.5"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[17px] text-[#2C241E] font-medium leading-snug truncate">
                            {order.productName}
                          </h3>
                          <p className="text-[13px] text-[#8A7C6E] mt-1 truncate">
                            {order.specsLine1}
                          </p>
                          <p className="text-[13px] text-[#8A7C6E] mt-0.5 truncate">
                            {order.specsLine2}
                          </p>
                        </div>
                      </div>

                      {/* Hairline Divider 1 */}
                      <div className="w-[1px] h-11 bg-[#DECFC0] shrink-0" />

                      {/* Col 2: Delivery Status Column */}
                      <div className="flex items-center gap-3.5 pl-6 lg:pl-8 pr-4">
                        <Truck size={22} className="text-[#6E5034] stroke-[1.4] shrink-0" />
                        <div>
                          <span className="text-[12px] text-[#8A7C6E] block leading-tight">
                            {order.deliveryLabel}
                          </span>
                          <span className="text-[14px] text-[#2C241E] font-medium block mt-1">
                            {order.deliveryDate}
                          </span>
                        </div>
                      </div>

                      {/* Hairline Divider 2 */}
                      <div className="w-[1px] h-11 bg-[#DECFC0] shrink-0" />

                      {/* Col 3: Secondary Action Links */}
                      <div className="flex flex-col gap-1.5 pl-6 lg:pl-8">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-2.5 text-[13px] text-[#524538] hover:text-[#2C241E] transition-colors cursor-pointer text-left"
                        >
                          <Truck size={14} className="text-[#6E5034] stroke-[1.5] shrink-0" />
                          <span>Track Again</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => alert(`Downloading Invoice for ${order.orderNumber}`)}
                          className="flex items-center gap-2.5 text-[13px] text-[#524538] hover:text-[#2C241E] transition-colors cursor-pointer text-left mt-0.5"
                        >
                          <FileText size={14} className="text-[#6E5034] stroke-[1.5] shrink-0" />
                          <span>Download Invoice</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* MOBILE ADAPTATION (flex flex-col md:hidden)               */}
                  {/* ========================================================= */}
                  <div className="flex md:hidden flex-col gap-3.5">
                    {/* Top Row: Order ID, Date & Badge */}
                    <div className="flex justify-between items-center pb-2.5 border-b border-[#DECFC0]/80">
                      <div>
                        <span className="text-[15px] font-semibold text-[#2C241E] block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[12px] text-[#8A7C6E] block">
                          {order.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    {/* Mid Section: Thumbnail + Item Details */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-16 bg-[#EDE3D7] border border-[#DECFC0] rounded-[4px] overflow-hidden flex items-center justify-center shrink-0">
                        <img
                          src={order.image}
                          alt={order.productName}
                          className="w-full h-full object-contain p-1.5"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] text-[#2C241E] font-medium leading-snug">
                          {order.productName}
                        </h3>
                        <p className="text-[12px] text-[#8A7C6E] mt-0.5 truncate">
                          {order.specsLine1}
                        </p>
                        <p className="text-[12px] text-[#8A7C6E] truncate">
                          {order.specsLine2}
                        </p>
                      </div>
                    </div>

                    {/* Status Ribbon */}
                    <div className="flex items-center gap-2.5 py-2 px-3 bg-[#EDE3D7]/70 border border-[#DECFC0] rounded-[3px] text-xs">
                      <Truck size={15} className="text-[#6E5034] shrink-0" />
                      <span className="text-[#8A7C6E]">{order.deliveryLabel}:</span>
                      <span className="text-[#2C241E] font-medium">
                        {order.deliveryDate}
                      </span>
                    </div>

                    {/* Bottom Row: Price & Primary Action */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[16px] font-medium text-[#2C241E] block">
                          {order.price}
                        </span>
                        <span className="text-[12px] text-[#8A7C6E]">
                          {order.itemCount}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="bg-[#6E5034] hover:bg-[#584027] text-[#FAF6F0] text-xs tracking-wide px-4 py-2 rounded-[3px] transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>View Order</span>
                        <ArrowRight size={12} strokeWidth={1.5} />
                      </button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-[#DECFC0]/80 text-xs text-[#524538]">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1.5 hover:text-[#2C241E] transition-colors"
                      >
                        <Truck size={13} className="text-[#6E5034]" />
                        <span>Track Again</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`Downloading Invoice for ${order.orderNumber}`)}
                        className="flex items-center gap-1.5 hover:text-[#2C241E] transition-colors"
                      >
                        <FileText size={13} className="text-[#6E5034]" />
                        <span>Download Invoice</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ORDER DETAILS MODAL                                       */}
      {/* ========================================================= */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
            className="font-times-card w-full max-w-lg bg-[#FAF6F0] border border-[#DECFC0] shadow-2xl p-6 lg:p-8 relative max-h-[90vh] overflow-y-auto rounded-[4px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-[#786B5D] hover:text-[#2C241E] cursor-pointer p-1"
              aria-label="Close details"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="border-b border-[#D4C6B3] pb-4 mb-5">
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#786B5D] font-medium block">
                Order Summary
              </span>
              <div className="flex items-center justify-between mt-1">
                <h3 className="font-serif text-lg font-bold text-[#2C241E]">
                  {selectedOrder.orderNumber}
                </h3>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <p className="text-xs text-[#8A7C6E] mt-1 font-sans">Placed on {selectedOrder.date}</p>
            </div>

            {/* Product Details */}
            <div className="flex items-center gap-4 py-3 bg-[#EFE7DE]/70 border border-[#D4C6B3]/60 p-4 mb-5">
              <div className="w-16 h-16 bg-[#E8DDD1] border border-[#D4C6B3]/60 rounded-xs overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src={selectedOrder.image}
                  alt={selectedOrder.productName}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <h4 className="font-serif text-[17px] font-medium text-[#2C241E]">
                  {selectedOrder.productName}
                </h4>
                <p className="text-xs text-[#8A7C6E] mt-0.5 font-sans">
                  {selectedOrder.specsLine1} • {selectedOrder.specsLine2}
                </p>
                <p className="font-serif text-[16px] font-semibold text-[#6E5334] mt-1.5">
                  {selectedOrder.price}
                </p>
              </div>
            </div>

            {/* Delivery Tracking Details */}
            <div className="space-y-3 border-b border-[#D4C6B3] pb-5 mb-5 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-[#786B5D] uppercase tracking-wider">Tracking Reference:</span>
                <span className="font-mono font-medium text-[#2C241E]">
                  {selectedOrder.trackingNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#786B5D] uppercase tracking-wider">Shipping Destination:</span>
                <span className="text-[#2C241E] text-right max-w-[220px]">
                  {selectedOrder.shippingAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#786B5D] uppercase tracking-wider">Payment Method:</span>
                <span className="text-[#2C241E]">{selectedOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => alert(`Downloading Invoice for ${selectedOrder.orderNumber}`)}
                className="border border-[#D4C6B3] hover:bg-[#DFD2C2]/40 text-[#524538] text-xs uppercase tracking-wider px-4 py-2 transition-colors cursor-pointer"
              >
                Download PDF Invoice
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="bg-[#6E5334] hover:bg-[#584127] text-[#FAF6F0] text-xs uppercase tracking-wider px-5 py-2 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
