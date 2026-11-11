"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  Headphones,
  Check,
  ArrowRight,
  Package,
  CreditCard,
  CheckCircle2,
  Loader2,
  Plus,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Currency Formatter for INR
function formatINR(val: number): string {
  return "₹" + val.toLocaleString("en-IN");
}

interface TimepieceCheckoutItem {
  id?: string;
  slug: string;
  name: string;
  brand: string;
  model?: string;
  reference?: string;
  price: number;
  conditionBadge?: string;
  image: string;
}

interface SavedAddress {
  _id?: string;
  tag?: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug");

  // State: Authenticated Collector Profile
  const [user, setUser] = useState<any>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // State: Form Inputs
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressCity, setAddressCity] = useState("Mumbai");
  const [addressState, setAddressState] = useState("Maharashtra");
  const [addressPostalCode, setAddressPostalCode] = useState("400001");
  const [addressCountry, setAddressCountry] = useState("India");

  // State: Dedicated Logistics & Payment (Streamlined Single Options)
  const deliveryOption = "courier";
  const paymentMethod = "razorpay";

  // State: Timepiece Item
  const [timepiece, setTimepiece] = useState<TimepieceCheckoutItem | null>(null);
  const [isLoadingTimepiece, setIsLoadingTimepiece] = useState(true);

  // Interaction State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  // 1. Fetch authenticated user if available
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.status === 403) {
          const data = await res.json();
          if (data.blocked) {
            setFormError("Your vault privileges have been suspended by the Salon Directorate. Timepiece reservations are locked.");
            return;
          }
        }
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            if (data.user.status === 'blocked') {
              setFormError("Your vault privileges have been suspended by the Salon Directorate. Timepiece reservations are locked.");
              return;
            }
            setUser(data.user);
            setContactName(data.user.name || "");
            setContactEmail(data.user.email || "");
            setContactPhone(data.user.phone || "");

            if (Array.isArray(data.user.addresses) && data.user.addresses.length > 0) {
              setSavedAddresses(data.user.addresses);
              const defaultIdx = data.user.addresses.findIndex((a: any) => a.isDefault);
              setSelectedAddressIndex(defaultIdx >= 0 ? defaultIdx : 0);
            } else {
              setIsAddingNewAddress(true);
            }
          }
        } else {
          setIsAddingNewAddress(true);
        }
      } catch {
        setIsAddingNewAddress(true);
      }
    }
    loadUser();
  }, []);

  // 2. Fetch Timepiece by slug or fallback to bag
  useEffect(() => {
    async function loadTimepiece() {
      setIsLoadingTimepiece(true);
      if (slugParam) {
        try {
          const res = await fetch(`/api/timepiece/${encodeURIComponent(slugParam)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.timepiece) {
              const tp = data.timepiece;
              setTimepiece({
                id: tp._id,
                slug: tp.slug,
                name: tp.name,
                brand: tp.tagline || (typeof tp.category === "object" ? tp.category?.name : "Horologe Royale"),
                model: tp.name,
                reference: tp.keySpecs?.[0]?.value || tp.slug.toUpperCase(),
                price: Number(tp.price) || 2000000,
                conditionBadge: tp.conditionBadge || "Certified Pre-Owned",
                image: tp.images?.[0] || "/assets/Rolex Daytona.png",
              });
              setIsLoadingTimepiece(false);
              return;
            }
          }
        } catch (err) {
          console.error("Failed to load timepiece by slug:", err);
        }
      }

      // Check localStorage bag
      if (typeof window !== "undefined") {
        try {
          const bagData = localStorage.getItem("horologe_bag");
          if (bagData) {
            const parsed = JSON.parse(bagData);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const first = parsed[0];
              setTimepiece({
                id: first.id,
                slug: first.slug || "cosmograph-daytona",
                name: first.name || first.model || "Cosmograph Daytona",
                brand: first.brand || "Rolex",
                model: first.model,
                reference: first.reference || "116508",
                price: Number(first.price) || 2000000,
                conditionBadge: first.conditionBadge || "Certified Vault Grade",
                image: first.image || "/assets/Rolex Daytona.png",
              });
              setIsLoadingTimepiece(false);
              return;
            }
          }
        } catch {
          // ignore
        }
      }

      // Default Showcase Fallback Watch for direct checkout visits
      setTimepiece({
        slug: "rolex-cosmograph-daytona",
        name: "Cosmograph Daytona 116508",
        brand: "Rolex Master Collection",
        reference: "116508-0009",
        price: 2000000,
        conditionBadge: "Certified Pre-Owned",
        image: "/assets/Rolex Daytona.png",
      });
      setIsLoadingTimepiece(false);
    }

    loadTimepiece();
  }, [slugParam]);

  // Financial Ledger Math
  const subtotal = timepiece?.price || 0;
  // 3% Luxury Horology GST Rate in India
  const tax = Math.round(subtotal * 0.03);
  const totalAmount = subtotal + tax;

  // Strict Phone KeyDown Validator
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) return;
    if (!/[0-9+\s-]/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Submit Handler
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (user?.status === 'blocked') {
      setFormError("Your collector privileges have been suspended by the Salon Directorate. Timepiece acquisitions are locked.");
      return;
    }
    if (!contactName.trim()) {
      setFormError("Please provide your full legal name for authentication.");
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes("@")) {
      setFormError("Please provide a valid client email address for insured notifications.");
      return;
    }
    if (!contactPhone.trim() || contactPhone.trim().length < 8) {
      setFormError("Please provide a valid contact telephone number with country code.");
      return;
    }

    let resolvedShipping: SavedAddress;

    if (!isAddingNewAddress && savedAddresses.length > 0 && savedAddresses[selectedAddressIndex]) {
      resolvedShipping = savedAddresses[selectedAddressIndex];
    } else {
      if (!addressLine1.trim() || !addressCity.trim() || !addressPostalCode.trim()) {
        setFormError("Please provide complete street address and postal details.");
        return;
      }
      resolvedShipping = {
        name: contactName.trim(),
        line1: addressLine1.trim(),
        line2: addressLine2.trim(),
        city: addressCity.trim(),
        state: addressState.trim(),
        postalCode: addressPostalCode.trim(),
        country: addressCountry.trim(),
        phone: contactPhone.trim(),
      };
    }

    if (!timepiece) {
      setFormError("No certified timepiece selected for acquisition.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerSnapshot: {
          name: contactName.trim(),
          email: contactEmail.trim().toLowerCase(),
          phone: contactPhone.trim(),
        },
        items: [
          {
            timepieceId: timepiece.id,
            name: timepiece.name,
            brand: timepiece.brand,
            model: timepiece.model || timepiece.name,
            reference: timepiece.reference || timepiece.slug,
            price: timepiece.price,
            image: timepiece.image,
          },
        ],
        shippingAddress: resolvedShipping,
        financials: {
          subtotal,
          tax,
          totalAmount,
          currency: "INR",
        },
        deliveryOption: "courier",
        paymentGateway: {
          gateway: "razorpay",
          paymentStatus: "captured",
        },
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to finalize vault reservation");
      }

      setConfirmedOrder(data.order);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record vault order";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDE5DA] text-[#2C241E] flex flex-col justify-between selection:bg-[#5C4529] selection:text-[#FAF6F0]">
      <Header />

      <main className="w-full flex-1 pt-28 sm:pt-32 lg:pt-36 pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Page Breadcrumb & Header */}
        <div className="mb-8 border-b border-[#DFCFC0] pb-5">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#8C7A6B] font-medium mb-2">
            <Link href="/" className="hover:text-[#2C241E] transition-colors">
              Vault
            </Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-[#2C241E] transition-colors">
              Timepieces
            </Link>
            <span>/</span>
            <span className="text-[#5C4529]">Private Checkout Desk</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#2C241E] font-normal tracking-tight">
            Certified Vault Acquisition
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6C5E] mt-1 font-light">
            Fully insured armored logistics, verified mechanical provenance, and white-glove escrow clearance.
          </p>
        </div>

        {/* Global Error Notice (Strict Zero-Red Policy) */}
        {formError && (
          <div className="mb-6 p-4 bg-[#EFE8DD]/80 border border-[#5C4529] text-xs text-[#5C4529] font-medium tracking-wide flex items-center gap-2.5 rounded-none animate-in fade-in">
            <span className="font-serif text-sm font-bold text-[#5C4529]">•</span>
            <span>{formError}</span>
          </div>
        )}

        {/* 2-Column Editorial Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ============================================================= */}
          {/* LEFT COLUMN: 4-STEP PROGRESSION ACCORDION (lg:col-span-8)     */}
          {/* ============================================================= */}
          <div className="lg:col-span-8">
            {/* STEP 1: COLLECTOR CONTACT & VERIFICATION */}
            <section className="bg-[#FAF6F0] border border-[#DFCFC0] rounded-none p-6 sm:p-8 mb-6">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#8C6D46] mb-1.5 block">
                STEP <span className="font-['Times_New_Roman',serif] text-xs">01</span>
              </span>
              <div className="flex items-center justify-between border-b border-[#DFCFC0] pb-3 mb-6">
                <h2 className="font-serif text-2xl text-[#2C241E] uppercase tracking-wider">
                  Collector Contact & Verification
                </h2>
                {user && (
                  <span className="text-[10px] bg-[#EFE8DD] text-[#5C4529] border border-[#DFCFC0] px-3 py-1 uppercase tracking-widest font-semibold rounded-none">
                    Authenticated Patron
                  </span>
                )}
              </div>

              {user ? (
                <div className="bg-[#EFE8DD]/70 border border-[#DFCFC0] p-4 text-xs space-y-1 mb-5 rounded-none">
                  <p className="font-semibold text-sm text-[#2C241E]">{user.name}</p>
                  <p className="text-[#6C5E52]">{user.email}</p>
                  <p className="text-[#6C5E52]">
                    Contact Tel:{" "}
                    <span className="font-['Times_New_Roman',serif]">
                      {user.phone || "Not recorded (add below)"}
                    </span>
                  </p>
                </div>
              ) : null}

              {/* Input Fields strictly matching contact page */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#7A6E63] mb-2">
                    FULL LEGAL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Lord Charles Sterling"
                    className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-4 py-3.5 focus:border-[#5C4529] focus:ring-1 focus:ring-[#5C4529] text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#7A6E63] mb-2">
                    EMAIL ADDRESS (INSURED UPDATES) *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="sterling@royale.com"
                    className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-4 py-3.5 focus:border-[#5C4529] focus:ring-1 focus:ring-[#5C4529] text-sm outline-none transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#7A6E63] mb-2">
                    CONTACT TELEPHONE (ARMORED LOGISTICS ESCORT) *
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    pattern="[0-9+\s\-]*"
                    required
                    value={contactPhone}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9+\s-]/g, "");
                      setContactPhone(clean);
                    }}
                    onKeyDown={handlePhoneKeyDown}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-4 py-3.5 focus:border-[#5C4529] focus:ring-1 focus:ring-[#5C4529] text-sm outline-none transition-all font-['Times_New_Roman',serif]"
                  />
                </div>
              </div>
            </section>

            {/* STEP 2: ARMORED VAULT DELIVERY ADDRESS */}
            <section className="bg-[#FAF6F0] border border-[#DFCFC0] rounded-none p-6 sm:p-8 mb-6">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#8C6D46] mb-1.5 block">
                STEP <span className="font-['Times_New_Roman',serif] text-xs">02</span>
              </span>
              <div className="flex items-center justify-between border-b border-[#DFCFC0] pb-3 mb-6">
                <h2 className="font-serif text-2xl text-[#2C241E] uppercase tracking-wider">
                  Armored Vault Delivery Address
                </h2>
                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                    className="text-xs uppercase tracking-wider font-semibold text-[#5C4529] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>{isAddingNewAddress ? "Use Saved Vault" : "Add New Delivery Destination"}</span>
                  </button>
                )}
              </div>

              {/* Saved Address Radio Cards */}
              {!isAddingNewAddress && savedAddresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {savedAddresses.map((addr, idx) => {
                    const isSelected = selectedAddressIndex === idx;
                    return (
                      <div
                        key={addr._id || idx}
                        onClick={() => setSelectedAddressIndex(idx)}
                        className={`border rounded-none p-4 cursor-pointer transition-all relative ${
                          isSelected
                            ? "border-[#5C4529] bg-[#EFE8DD]/70"
                            : "border-[#DFCFC0] bg-[#FAF6F0] hover:border-[#A89887]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-xs text-[#2C241E] uppercase tracking-wider">
                            {addr.tag || "Vault Destination"}
                          </span>
                          {isSelected && (
                            <span className="w-4 h-4 bg-[#5C4529] text-white flex items-center justify-center rounded-none text-[10px]">
                              <Check size={11} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#2C241E] font-medium">{addr.name}</p>
                        <p className="text-xs text-[#6C5E52] leading-relaxed mt-1">
                          {addr.line1}
                          {addr.line2 ? `, ${addr.line2}` : ""}
                        </p>
                        <p className="text-xs text-[#6C5E52]">
                          {addr.city}, {addr.state}{" "}
                          <span className="font-['Times_New_Roman',serif]">{addr.postalCode}</span>
                        </p>
                        <p className="text-xs text-[#6C5E52] mt-0.5">
                          Tel:{" "}
                          <span className="font-['Times_New_Roman',serif]">{addr.phone}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {/* New Address Form */}
              {(isAddingNewAddress || savedAddresses.length === 0) && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#7A6E63] mb-2">
                      STREET ADDRESS (PRIVATE ENCLAVE / VAULT) *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="e.g. 14A Altamount Road, Cumballa Hill"
                      className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-4 py-3.5 focus:border-[#5C4529] focus:ring-1 focus:ring-[#5C4529] text-sm outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#7A6E63] mb-2">
                      APARTMENT, SUITE, OR RESIDENCY WING (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Penthouse 4, East Wing"
                      className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-4 py-3.5 focus:border-[#5C4529] focus:ring-1 focus:ring-[#5C4529] text-sm outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#7A6E63] mb-2">
                        CITY *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressCity}
                        onChange={(e) => setAddressCity(e.target.value)}
                        placeholder="Mumbai"
                        className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-4 py-3.5 focus:border-[#5C4529] focus:ring-1 focus:ring-[#5C4529] text-sm outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#7A6E63] mb-2">
                        STATE / EMIRATE *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressState}
                        onChange={(e) => setAddressState(e.target.value)}
                        placeholder="Maharashtra"
                        className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-4 py-3.5 focus:border-[#5C4529] focus:ring-1 focus:ring-[#5C4529] text-sm outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#7A6E63] mb-2">
                        PIN / POSTAL CODE *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressPostalCode}
                        onChange={(e) => setAddressPostalCode(e.target.value)}
                        placeholder="400001"
                        className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-4 py-3.5 focus:border-[#5C4529] focus:ring-1 focus:ring-[#5C4529] text-sm outline-none transition-all font-['Times_New_Roman',serif]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#7A6E63] mb-2">
                      COUNTRY / TERRITORY *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressCountry}
                      onChange={(e) => setAddressCountry(e.target.value)}
                      placeholder="India"
                      className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-4 py-3.5 focus:border-[#5C4529] focus:ring-1 focus:ring-[#5C4529] text-sm outline-none transition-all"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* STEP 3: BESPOKE LOGISTICS & DELIVERY OPTIONS */}
            <section className="bg-[#FAF6F0] border border-[#DFCFC0] rounded-none p-6 sm:p-8 mb-6">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#8C6D46] mb-1.5 block">
                STEP <span className="font-['Times_New_Roman',serif] text-xs">03</span>
              </span>
              <div className="border-b border-[#DFCFC0] pb-3 mb-6">
                <h2 className="font-serif text-2xl text-[#2C241E] uppercase tracking-wider">
                  Bespoke Logistics & Delivery Options
                </h2>
              </div>

              <div className="space-y-3">
                {/* Sole Active Option: Insured Armored Courier */}
                <div className="border border-[#5C4529] bg-[#EFE8DD]/70 rounded-none p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-none bg-[#5C4529] text-[#FAF6F0] flex items-center justify-center shrink-0 mt-0.5">
                      <Truck size={16} />
                    </div>
                    <div>
                      <span className="font-semibold text-xs sm:text-sm text-[#2C241E] uppercase tracking-wide block">
                        Insured Armored Courier (Malca-Amit / Ferrari Group)
                      </span>
                      <p className="text-xs text-[#6C5E52] mt-1 leading-relaxed">
                        Dedicated door-to-door transit with armed courier security and full transit coverage.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#5C4529] bg-[#EFE8DD] border border-[#DFCFC0] px-3 py-1 rounded-none">
                      COMPLIMENTARY
                    </span>
                    <span className="w-4 h-4 bg-[#5C4529] text-white flex items-center justify-center rounded-none text-[10px]">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* STEP 4: SECURE PAYMENT GATEWAY */}
            <section className="bg-[#FAF6F0] border border-[#DFCFC0] rounded-none p-6 sm:p-8 mb-6">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#8C6D46] mb-1.5 block">
                STEP <span className="font-['Times_New_Roman',serif] text-xs">04</span>
              </span>
              <div className="border-b border-[#DFCFC0] pb-3 mb-6">
                <h2 className="font-serif text-2xl text-[#2C241E] uppercase tracking-wider">
                  Secure Payment Gateway
                </h2>
              </div>

              <div className="space-y-3 mb-6">
                {/* Sole Active Gateway: Razorpay Smart Collect */}
                <div className="border border-[#5C4529] bg-[#EFE8DD]/70 rounded-none p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-none bg-[#5C4529] text-[#FAF6F0] flex items-center justify-center shrink-0 mt-0.5">
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <span className="font-semibold text-xs sm:text-sm text-[#2C241E] uppercase tracking-wide block">
                        Razorpay Smart Collect
                      </span>
                      <p className="text-xs text-[#6C5E52] mt-1 leading-relaxed">
                        Instant automated settlement via Credit/Debit Cards, UPI, NetBanking, or Luxury EMI.
                      </p>
                    </div>
                  </div>
                  <span className="w-4 h-4 bg-[#5C4529] text-white flex items-center justify-center rounded-none text-[10px] shrink-0">
                    <Check size={11} strokeWidth={3} />
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#DFCFC0]">
                <div className="flex items-center gap-2 text-xs text-[#6C5E52]">
                  <ShieldCheck size={15} className="text-[#5C4529] shrink-0" />
                  <span>
                    <span className="font-['Times_New_Roman',serif]">256</span>-Bit Encrypted Vault
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6C5E52]">
                  <CheckCircle2 size={15} className="text-[#5C4529] shrink-0" />
                  <span>Authenticity Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6C5E52]">
                  <Package size={15} className="text-[#5C4529] shrink-0" />
                  <span>Transit Insurance Included</span>
                </div>
              </div>
            </section>
          </div>

          {/* ============================================================= */}
          {/* RIGHT COLUMN: STICKY ORDER DOSSIER & LEDGER (lg:col-span-4)   */}
          {/* ============================================================= */}
          <aside className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-[#FAF6F0] border border-[#DFCFC0] rounded-none p-6 sm:p-8">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#8C6D46] mb-1.5 block">
                ACQUISITION DOSSIER
              </span>
              <h3 className="font-serif text-2xl text-[#2C241E] uppercase tracking-wider mb-6">
                Order Summary
              </h3>

              {/* Timepiece Item Card */}
              {isLoadingTimepiece ? (
                <div className="py-12 text-center">
                  <Loader2 size={24} className="animate-spin text-[#5C4529] mx-auto mb-2" />
                  <span className="text-xs uppercase tracking-widest text-[#7A6C5E]">
                    Loading Timepiece Dossier...
                  </span>
                </div>
              ) : timepiece ? (
                <div className="pb-5 border-b border-[#DFCFC0] mb-5">
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-20 bg-[#F5EFE6] border border-[#DFCFC0] rounded-none shrink-0 overflow-hidden relative">
                      <Image
                        src={timepiece.image}
                        alt={timepiece.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#8C7A6B] font-semibold block truncate">
                        {timepiece.brand}
                      </span>
                      <h4 className="font-serif text-base text-[#2C241E] font-medium leading-snug mt-0.5">
                        {timepiece.name}
                      </h4>
                      <p className="text-[11px] text-[#7A6C5E] font-mono mt-0.5 truncate">
                        Ref: <span className="font-['Times_New_Roman',serif]">{timepiece.reference}</span>
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] bg-[#EFE8DD] text-[#5C4529] border border-[#DFCFC0] px-2 py-0.5 rounded-none font-medium uppercase tracking-wider">
                          {timepiece.conditionBadge || "Certified"}
                        </span>
                        <span className="font-['Times_New_Roman',serif] tracking-tight text-base font-semibold text-[#2C241E]">
                          {formatINR(timepiece.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#7A6C5E]">
                  No timepiece selected.{" "}
                  <Link href="/collections" className="underline text-[#5C4529]">
                    Explore Collections
                  </Link>
                </div>
              )}

              {/* Financial Ledger */}
              <div className="space-y-3.5 text-xs mb-6">
                <div className="flex justify-between text-[#6C5E52]">
                  <span>Timepiece Subtotal</span>
                  <span className="font-['Times_New_Roman',serif] text-sm text-[#2C241E] font-medium">
                    {formatINR(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6C5E52]">
                  <span>Insured Priority Armored Transit</span>
                  <span className="font-semibold text-[#5C4529] uppercase tracking-wider">
                    COMPLIMENTARY
                  </span>
                </div>
                <div className="flex justify-between text-[#6C5E52]">
                  <span>GST (<span className="font-['Times_New_Roman',serif]">3%</span> Luxury Horology Rate)</span>
                  <span className="font-['Times_New_Roman',serif] text-sm text-[#2C241E] font-medium">
                    {formatINR(tax)}
                  </span>
                </div>
                <div className="border-t border-[#DFCFC0] pt-3.5 flex justify-between items-baseline">
                  <div>
                    <span className="font-serif text-base text-[#2C241E] font-semibold block">
                      Total Investment
                    </span>
                    <span className="text-[10px] text-[#8C7A6B] block">
                      All taxes & transit insurance included
                    </span>
                  </div>
                  <span className="font-['Times_New_Roman',serif] font-medium text-2xl text-[#2C241E]">
                    {formatINR(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                disabled={isSubmitting || !timepiece}
                onClick={handleProceedToPayment}
                className="w-full bg-[#5C4529] hover:bg-[#47341D] text-[#FAF6F0] rounded-none py-4 px-6 text-xs tracking-[0.2em] uppercase font-semibold transition-all cursor-pointer shadow-none active:scale-[0.99] mt-6 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-[#FAF6F0]" />
                    <span>Reserving Timepiece in Vault...</span>
                  </>
                ) : (
                  <>
                    <span>CONFIRM & PROCEED TO PAYMENT</span>
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </div>

            {/* Trust Pillars Card */}
            <div className="bg-[#FAF6F0] border border-[#DFCFC0] rounded-none p-6 text-xs space-y-4">
              <div className="flex items-start gap-3.5">
                <ShieldCheck size={18} className="text-[#5C4529] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-[#2C241E] uppercase tracking-wider text-[11px]">
                    Verified Swiss Provenance
                  </h5>
                  <p className="text-[#7A6C5E] mt-1 leading-relaxed text-[11px]">
                    Every timepiece passes a <span className="font-['Times_New_Roman',serif]">48</span>-point mechanical inspection and certificate authenticity check.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Truck size={18} className="text-[#5C4529] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-[#2C241E] uppercase tracking-wider text-[11px]">
                    <span className="font-['Times_New_Roman',serif]">100%</span> Insured Armored Transit
                  </h5>
                  <p className="text-[#7A6C5E] mt-1 leading-relaxed text-[11px]">
                    Full value insured transit underwritten by Lloyd&apos;s of London until physical handover.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Headphones size={18} className="text-[#5C4529] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-[#2C241E] uppercase tracking-wider text-[11px]">
                    Concierge White-Glove Support
                  </h5>
                  <p className="text-[#7A6C5E] mt-1 leading-relaxed text-[11px]">
                    Private horologist on call <span className="font-['Times_New_Roman',serif]">24/7</span> for delivery coordination and provenance dossier questions.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ============================================================= */}
        {/* ORDER CONFIRMATION MODAL                                      */}
        {/* ============================================================= */}
        {confirmedOrder && (
          <div className="fixed inset-0 z-50 bg-[#2C241E]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#FAF6F0] border border-[#DFCFC0] rounded-none max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
              <div className="text-center">
                <div className="w-14 h-14 rounded-none bg-[#5C4529] text-[#FAF6F0] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#8C6D46] block mb-1.5">
                  PRIVATE VAULT ALLOCATION
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#2C241E] mb-2 uppercase tracking-wider">
                  Acquisition Reserved
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6C5E] font-light max-w-md mx-auto leading-relaxed mb-6 font-sans">
                  Your certified timepiece reservation has been recorded in the Horologe Royale Ledger.
                </p>

                {/* Order Summary Box */}
                <div className="bg-[#EFE8DD]/70 border border-[#DFCFC0] p-4 text-left text-xs mb-6 space-y-2.5 rounded-none font-sans">
                  <div className="flex justify-between border-b border-[#DFCFC0] pb-2">
                    <span className="text-[#8C7A6B] uppercase tracking-wider text-[11px]">Order Reference</span>
                    <span className="font-['Times_New_Roman',serif] font-semibold text-[#2C241E]">
                      {confirmedOrder.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#DFCFC0] pb-2">
                    <span className="text-[#8C7A6B] uppercase tracking-wider text-[11px]">Client</span>
                    <span className="font-medium text-[#2C241E]">
                      {confirmedOrder.customerSnapshot?.name}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#DFCFC0] pb-2">
                    <span className="text-[#8C7A6B] uppercase tracking-wider text-[11px]">Total Investment</span>
                    <span className="font-['Times_New_Roman',serif] font-medium text-base text-[#2C241E]">
                      {formatINR(confirmedOrder.financials?.totalAmount || totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#8C7A6B] uppercase tracking-wider text-[11px]">Delivery Mode</span>
                    <span className="font-medium text-[#5C4529]">
                      Insured Armored Courier (Malca-Amit / Ferrari Group)
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/account?tab=orders"
                    className="flex-1 bg-[#5C4529] hover:bg-[#47341D] text-[#FAF6F0] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-center transition-colors rounded-none"
                  >
                    View Private Vault Ledger →
                  </Link>
                  <Link
                    href="/collections"
                    className="flex-1 border border-[#DFCFC0] hover:bg-[#EFE8DD]/50 text-[#2C241E] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-center transition-colors rounded-none"
                  >
                    Continue Exploring
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer hideTopStrip />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EDE5DA] flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[#5C4529]" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
