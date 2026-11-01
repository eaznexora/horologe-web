"use client";

import React, { useState, useRef, useEffect, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Camera, X, CheckCircle2, ChevronDown, ArrowRight, Check } from "lucide-react";

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
}

const BRAND_OPTIONS = [
  "Rolex",
  "Patek Philippe",
  "Audemars Piguet",
  "Omega",
  "Cartier",
  "Vacheron Constantin",
  "Richard Mille",
  "IWC Schaffhausen",
  "Jaeger-LeCoultre",
  "Breitling",
  "Tudor",
  "Hublot",
  "Other Maison",
];

const CONDITION_OPTIONS = [
  "Brand New / Unworn",
  "Like New / Mint",
  "Pre-Owned",
  "Vintage / Fair",
];

const BOX_OPTIONS = ["Yes", "No"];
const PAPERS_OPTIONS = ["Yes", "No"];

// Reusable Luxury Custom Select Component
interface CustomSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function CustomSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  isOpen,
  onToggle,
  onClose,
}: CustomSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`relative ${isOpen ? "z-30" : "z-10"}`} ref={containerRef}>
      <label className="block text-[11px] sm:text-[11.5px] uppercase tracking-[0.08em] font-medium text-[#7C7064] mb-1.5">
        {label}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={onToggle}
        className={`w-full bg-[#F4ECE2]/80 border text-[#2C241E] rounded-md px-3.5 py-3 flex items-center justify-between text-sm transition-all cursor-pointer ${
          isOpen
            ? "border-[#5C4529] ring-1 ring-[#5C4529]/25 bg-[#FAF7F2]"
            : "border-[#E2D6C5] hover:border-[#5C4529]"
        }`}
      >
        <span className={value ? "text-[#2C241E] font-medium" : "text-[#4A3E35]"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#7C7064] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#5C4529]" : ""
          }`}
        />
      </button>

      {/* Floating Options Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-[#FAF7F2] border border-[#E2D6C5] rounded-md shadow-[0_12px_32px_rgba(44,36,30,0.12)] max-h-60 overflow-y-auto no-scrollbar py-1 animate-in fade-in zoom-in-95 duration-150">
          {options.map((opt) => {
            const isSelected = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  onClose();
                }}
                className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#F4ECE2] text-[#5C4529] font-medium"
                    : "text-[#2C241E] hover:bg-[#F4ECE2]/70 hover:text-[#5C4529]"
                }`}
              >
                <span>{opt}</span>
                {isSelected && <Check size={14} className="text-[#5C4529]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SellYourLuxuryPage() {
  // Form State
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [condition, setCondition] = useState("");
  const [boxIncluded, setBoxIncluded] = useState("");
  const [papersIncluded, setPapersIncluded] = useState("");
  const [details, setDetails] = useState("");
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);

  // Open Dropdown State ('brand' | 'condition' | 'box' | 'papers' | null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // UX State
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  // Photo Upload Handler
  const handlePhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    const availableSlots = 5 - photos.length;
    if (availableSlots <= 0) {
      setFormError("Maximum 5 photographs can be uploaded.");
      return;
    }

    const filesToProcess = selectedFiles.slice(0, availableSlots);
    const newPhotos: UploadedPhoto[] = filesToProcess.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
    setFormError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const filtered = prev.filter((photo) => photo.id !== id);
      const toRemove = prev.find((photo) => photo.id === id);
      if (toRemove) {
        URL.revokeObjectURL(toRemove.preview);
      }
      return filtered;
    });
  };

  // Form Submit Handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    closeDropdown();
    setFormError("");

    if (!brand) {
      setFormError("Please select a brand.");
      return;
    }
    if (!model.trim()) {
      setFormError("Please enter the watch model.");
      return;
    }
    if (!condition) {
      setFormError("Please select the watch condition.");
      return;
    }
    if (!boxIncluded) {
      setFormError("Please indicate if original box is included.");
      return;
    }
    if (!papersIncluded) {
      setFormError("Please indicate if original papers are included.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedRef = `HR-VAL-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceId(generatedRef);
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
    }, 800);
  };

  const handleResetForm = () => {
    setBrand("");
    setModel("");
    setCondition("");
    setBoxIncluded("");
    setPapersIncluded("");
    setDetails("");
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setPhotos([]);
    setFormError("");
    closeDropdown();
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF4E6] text-[#2C241E] flex flex-col justify-between selection:bg-[#5C4529] selection:text-[#FAF6F0] relative overflow-x-hidden font-sans">
      <Header />

      {/* Main Structural Wrapper */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-20 flex-1 relative z-10">
        
        {/* Unified 2-Column Luxury Frame */}
        <div className="bg-[#FAF7F2] rounded-2xl border border-[#E7DDD0] shadow-[0_12px_44px_rgba(44,36,30,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Photographic Backdrop & Narrative (5 cols on desktop)       */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 relative flex flex-col justify-between overflow-hidden min-h-[500px] sm:min-h-[560px] lg:min-h-[680px]">
            {/* Background Editorial Watch Photography */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/assets/sell-your-luxury-hero.jpg"
                alt="Rolex Cosmograph Daytona - Sell Your Luxury Watch"
                fill
                priority
                className="object-cover object-bottom"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              {/* Soft atmospheric gradient for crisp typography contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#FFF4E6]/75 via-[#FFF4E6]/30 to-transparent pointer-events-none" />
            </div>

            {/* Typography Overlay */}
            <div className="relative z-10 p-6 sm:p-10 lg:p-12">
              <h1 className="font-serif text-[#2C241E] text-3xl sm:text-4xl lg:text-[45px] leading-[1.1] tracking-tight mb-4 sm:mb-5">
                Give Your Watch<br />A New Story.
              </h1>
              
              <p className="text-[#5C5248] text-sm sm:text-[15px] leading-relaxed max-w-[420px] font-sans">
                Sell your pre-owned luxury watch with confidence. Get a fair evaluation, a transparent process, and a hassle-free service — all from experts you can trust.
              </p>
            </div>

            {/* Empty bottom spacer to frame the watch and travertine block */}
            <div className="relative z-10 p-6 sm:p-10 pointer-events-none" />
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Valuation Form Card (7 cols on desktop)                    */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 bg-[#FAF7F2] border-t lg:border-t-0 lg:border-l border-[#E7DDD0] p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            
            {/* Card Header */}
            <div className="mb-6 sm:mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-[#2C241E] leading-tight">
                Request a Free Valuation
              </h2>
              <p className="text-[#7C7064] text-xs sm:text-sm mt-1.5 leading-relaxed font-sans">
                Share a few details about your watch and our experts will get back to you with an estimated value.
              </p>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="mb-5 p-3.5 rounded-md bg-[#5C4529]/10 border border-[#5C4529]/25 text-[#5C4529] text-xs sm:text-sm flex items-center gap-2">
                <span className="font-bold">•</span>
                <span>{formError}</span>
              </div>
            )}

            {/* Valuation Intake Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
              
              {/* 1. CUSTOM BRAND DROPDOWN */}
              <CustomSelect
                label="BRAND"
                placeholder="Select Brand"
                value={brand}
                onChange={setBrand}
                options={BRAND_OPTIONS}
                isOpen={openDropdown === "brand"}
                onToggle={() => toggleDropdown("brand")}
                onClose={closeDropdown}
              />

              {/* 2. MODEL INPUT */}
              <div className="relative z-10">
                <label className="block text-[11px] sm:text-[11.5px] uppercase tracking-[0.08em] font-medium text-[#7C7064] mb-1.5">
                  MODEL
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  onFocus={closeDropdown}
                  placeholder="e.g. Datejust, Submariner"
                  className="w-full bg-[#F4ECE2]/80 border border-[#E2D6C5] text-[#2C241E] placeholder-[#A5998B] rounded-md px-3.5 py-3 focus:border-[#5C4529] focus:bg-[#FAF7F2] focus:outline-none text-sm transition-colors"
                />
              </div>

              {/* 3. CUSTOM CONDITION DROPDOWN */}
              <CustomSelect
                label="CONDITION"
                placeholder="Select Condition"
                value={condition}
                onChange={setCondition}
                options={CONDITION_OPTIONS}
                isOpen={openDropdown === "condition"}
                onToggle={() => toggleDropdown("condition")}
                onClose={closeDropdown}
              />

              {/* 4. CUSTOM BOX INCLUDED & PAPERS INCLUDED (2-Col Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomSelect
                  label="BOX INCLUDED"
                  placeholder="Select Option"
                  value={boxIncluded}
                  onChange={setBoxIncluded}
                  options={BOX_OPTIONS}
                  isOpen={openDropdown === "box"}
                  onToggle={() => toggleDropdown("box")}
                  onClose={closeDropdown}
                />

                <CustomSelect
                  label="PAPERS INCLUDED"
                  placeholder="Select Option"
                  value={papersIncluded}
                  onChange={setPapersIncluded}
                  options={PAPERS_OPTIONS}
                  isOpen={openDropdown === "papers"}
                  onToggle={() => toggleDropdown("papers")}
                  onClose={closeDropdown}
                />
              </div>

              {/* 5. ADDITIONAL DETAILS (OPTIONAL) */}
              <div className="relative z-10">
                <label className="block text-[11px] sm:text-[11.5px] uppercase tracking-[0.08em] font-medium text-[#7C7064] mb-1.5">
                  ADDITIONAL DETAILS (OPTIONAL)
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  onFocus={closeDropdown}
                  placeholder="Any other details about your watch"
                  className="w-full bg-[#F4ECE2]/80 border border-[#E2D6C5] text-[#2C241E] placeholder-[#A5998B] rounded-md p-3.5 text-sm focus:border-[#5C4529] focus:bg-[#FAF7F2] focus:outline-none resize-none transition-colors"
                />
              </div>

              {/* 6. PHOTOS DROPZONE */}
              <div className="relative z-10">
                <label className="block text-[11px] sm:text-[11.5px] uppercase tracking-[0.08em] font-medium text-[#7C7064] mb-1.5">
                  PHOTOS
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                {/* Dropzone */}
                <div
                  onClick={() => {
                    closeDropdown();
                    fileInputRef.current?.click();
                  }}
                  className="w-full bg-[#F4ECE2]/80 border border-dashed border-[#D5C7B5] hover:border-[#5C4529] rounded-md py-3.5 px-4 flex items-center justify-center gap-3 cursor-pointer transition-colors group"
                >
                  <Camera size={20} className="text-[#6E5D4F] group-hover:text-[#5C4529] transition-colors shrink-0" />
                  <div className="text-left flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-[13px] font-medium text-[#2C241E]">
                      Upload Photos
                    </span>
                    <span className="text-[11px] text-[#7C7064]">
                      Add up to 5 photos
                    </span>
                  </div>
                </div>

                {/* Selected Photo Thumbnails */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-5 gap-2.5 mt-3">
                    {photos.map((item, idx) => (
                      <div
                        key={item.id}
                        className="relative aspect-square rounded-md overflow-hidden border border-[#E2D6C5] bg-[#F4ECE2]"
                      >
                        <Image
                          src={item.preview}
                          alt={`Uploaded watch photo ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(item.id);
                          }}
                          className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#2C241E]/80 text-[#FAF6F0] flex items-center justify-center hover:bg-[#5C4529] transition-colors cursor-pointer"
                          title="Remove photograph"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 7. SUBMIT CTA BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#5C4529] hover:bg-[#4A3720] text-[#FAF7F2] py-3.5 sm:py-4 px-6 rounded-md font-medium text-sm sm:text-[15px] tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] cursor-pointer mt-5 disabled:opacity-60 disabled:cursor-not-allowed relative z-10"
              >
                {isSubmitting ? (
                  <span>Submitting Details...</span>
                ) : (
                  <>
                    <span>Get Free Valuation</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer hideTopStrip />

      {/* ========================================================================= */}
      {/* FROSTED GLASS CONFIRMATION MODAL                                         */}
      {/* ========================================================================= */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2C241E]/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2]/95 backdrop-blur-2xl border border-white/80 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center flex flex-col items-center">
            
            <div className="w-14 h-14 rounded-full bg-[#5C4529]/10 border border-[#5C4529]/25 flex items-center justify-center text-[#5C4529] mb-4">
              <CheckCircle2 size={32} />
            </div>

            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#5C4529] mb-1">
              CONCIERGE APPRAISAL DESK
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#2C241E] font-normal mb-2">
              Valuation Request Received
            </h3>

            <p className="text-xs text-[#7C7064] font-mono mb-4 bg-[#F4ECE2] px-3 py-1 rounded-full border border-[#E2D6C5]">
              Reference: {referenceId}
            </p>

            <p className="text-[#6C5E52] text-xs sm:text-sm leading-relaxed mb-6 font-sans">
              Thank you. Our horology specialists are reviewing your <strong className="text-[#2C241E]">{brand} {model}</strong> specifications and will reach out with an estimated valuation shortly.
            </p>

            <div className="w-full flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="flex-1 py-3 px-4 rounded-lg border border-[#DFCFC0] text-[#2C241E] hover:bg-[#F4ECE2] text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
              >
                Submit Another Watch
              </button>
              <Link
                href="/collections"
                className="flex-1 py-3 px-4 rounded-lg bg-[#5C4529] hover:bg-[#4A3720] text-[#FAF7F2] text-xs uppercase tracking-wider font-medium transition-colors flex items-center justify-center cursor-pointer shadow-sm"
              >
                Explore Vault
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
