"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Check,
  Globe,
} from "lucide-react";

const SUBJECT_OPTIONS = [
  "Acquisition Inquiry",
  "Sell / Consign a Timepiece",
  "Private Viewing Appointment",
  "Authentication & Sourcing",
  "General Inquiries",
];

const DIAL_CODES = [
  { code: "+91", label: "India (+91)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+1", label: "USA (+1)" },
  { code: "+41", label: "Switzerland (+41)" },
  { code: "+65", label: "Singapore (+65)" },
];

export default function ConciergePage() {
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dialCode, setDialCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Dropdown states
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [isDialCodeOpen, setIsDialCodeOpen] = useState(false);

  // UX Feedback State
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const subjectRef = useRef<HTMLDivElement>(null);
  const dialCodeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside & Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (subjectRef.current && !subjectRef.current.contains(e.target as Node)) {
        setIsSubjectOpen(false);
      }
      if (dialCodeRef.current && !dialCodeRef.current.contains(e.target as Node)) {
        setIsDialCodeOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSubjectOpen(false);
        setIsDialCodeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!firstName.trim()) {
      setFormError("Please provide your First Name.");
      return;
    }
    if (!lastName.trim()) {
      setFormError("Please provide your Last Name.");
      return;
    }
    if (!phoneNumber.trim()) {
      setFormError("Please provide your Phone Number.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setFormError("Please provide a valid Email Address.");
      return;
    }
    if (!subject) {
      setFormError("Please select a Subject for your inquiry.");
      return;
    }
    if (!message.trim()) {
      setFormError("Please enter your message or inquiry details.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedRef = `HR-CON-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceId(generatedRef);
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
    }, 850);
  };

  const handleResetForm = () => {
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setEmail("");
    setSubject("");
    setMessage("");
    setFormError("");
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2C241E] flex flex-col justify-between selection:bg-[#5C4529] selection:text-[#FAF6F0] relative overflow-x-hidden font-sans">
      <Header />

      {/* Main Structural Wrapper with top offset for fixed/absolute Header */}
      <main className="w-full flex-1 pt-24 sm:pt-28 md:pt-32">
        
        {/* ========================================================================= */}
        {/* SECTION 1: HERO (THE HOUSE OF HOROLOGY)                                   */}
        {/* ========================================================================= */}
        <section className="w-full border-b border-[#EBDCCB]">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px] lg:min-h-[480px]">
            
            {/* Left Block: Editorial Typography */}
            <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 lg:py-16 bg-[#FAF5EE]">
              <h1 className="font-serif text-[36px] sm:text-[46px] lg:text-[56px] leading-[1.05] tracking-tight uppercase text-[#2C241E] mb-6">
                The House of <br />
                <span className="text-[#9D7E50]">Horology.</span>
              </h1>
              
              <p className="text-[#6C5E52] font-sans text-sm sm:text-base leading-relaxed max-w-lg">
                An ever-evolving collection of distinguished timepieces, sourced with discretion and selected for those who appreciate what lies beyond the dial.
              </p>
            </div>

            {/* Right Block: Boutique Atmospheric Visual */}
            <div className="lg:col-span-5 relative min-h-[300px] sm:min-h-[360px] lg:min-h-full overflow-hidden bg-[#1A1816]">
              <Image
                src="/assets/categories-hero.png"
                alt="Horologe Royale Boutique Staging - More than a watch"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: DUAL INQUIRY & CONTACT DIRECTORY                               */}
        {/* ========================================================================= */}
        <section id="inquiry-form" className="w-full bg-[#EDE5DA] py-14 sm:py-20 lg:py-24 border-b border-[#D8C7B3]">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* ------------------------------------------------------------------- */}
              {/* A. Left Column: "SEND US A MESSAGE" Form Box (~7 cols)              */}
              {/* ------------------------------------------------------------------- */}
              <div className="lg:col-span-7 bg-[#EDE5DA] border border-[#9C846E] rounded-none p-6 sm:p-8 lg:p-9 xl:p-10 shadow-none">
                
                {/* Header */}
                <div className="mb-6">
                  <h2 className="font-serif text-[22px] sm:text-[24px] tracking-[0.14em] uppercase text-[#A08261] mb-2 font-normal">
                    Send Us A Message
                  </h2>
                  <p className="text-[#3C3229] text-[13px] leading-relaxed font-sans">
                    Every timepiece is carefully examined before it finds its place in our collection.
                  </p>
                </div>

                {/* Error Banner */}
                {formError && (
                  <div className="mb-5 p-3 rounded-none bg-[#6E4F2E]/10 border border-[#6E4F2E]/30 text-[#6E4F2E] text-xs sm:text-sm flex items-center gap-2">
                    <span className="font-bold">•</span>
                    <span>{formError}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* 1. Full Name Row (2-col grid) */}
                  <div>
                    <label className="block text-[12.5px] font-sans font-medium text-[#3C3229] mb-1.5">
                      Your Full Name
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="w-full bg-[#EDE5DA] border border-[#9C846E] text-[#2C241E] placeholder-[#B3A293] rounded-none px-3.5 py-2.5 text-sm outline-none focus:border-[#6E4F2E] focus:bg-[#F3ECE2] transition-colors"
                      />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="w-full bg-[#EDE5DA] border border-[#9C846E] text-[#2C241E] placeholder-[#B3A293] rounded-none px-3.5 py-2.5 text-sm outline-none focus:border-[#6E4F2E] focus:bg-[#F3ECE2] transition-colors"
                      />
                    </div>
                  </div>

                  {/* 2. Phone & Email Row (2-col grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    {/* Phone with dial code */}
                    <div>
                      <label className="block text-[12.5px] font-sans font-medium text-[#3C3229] mb-1.5">
                        Phone Number
                      </label>
                      <div className="flex gap-2">
                        {/* Dial code select */}
                        <div className="relative shrink-0" ref={dialCodeRef}>
                          <button
                            type="button"
                            onClick={() => {
                              setIsDialCodeOpen(!isDialCodeOpen);
                              setIsSubjectOpen(false);
                            }}
                            className="h-full bg-[#EDE5DA] border border-[#9C846E] text-[#2C241E] rounded-none px-3 py-2.5 flex items-center gap-1.5 text-sm focus:border-[#6E4F2E] outline-none cursor-pointer"
                          >
                            <span className="font-medium text-[#2C241E]">{dialCode}</span>
                            <ChevronDown size={14} className={`text-[#6E5D4F] transition-transform ${isDialCodeOpen ? "rotate-180" : ""}`} />
                          </button>

                          {isDialCodeOpen && (
                            <div className="absolute left-0 top-full mt-1 w-44 bg-[#F8F4EE] border border-[#9C846E] rounded-none shadow-lg z-30 py-1 max-h-48 overflow-y-auto no-scrollbar">
                              {DIAL_CODES.map((dc) => (
                                <button
                                  key={dc.code}
                                  type="button"
                                  onClick={() => {
                                    setDialCode(dc.code);
                                    setIsDialCodeOpen(false);
                                  }}
                                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#EDE5DA] transition-colors cursor-pointer ${
                                    dialCode === dc.code ? "text-[#6E4F2E] font-semibold" : "text-[#2C241E]"
                                  }`}
                                >
                                  <span>{dc.label}</span>
                                  {dialCode === dc.code && <Check size={12} className="text-[#6E4F2E]" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Phone input */}
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Your Phone Number"
                          className="flex-1 min-w-0 bg-[#EDE5DA] border border-[#9C846E] text-[#2C241E] placeholder-[#B3A293] rounded-none px-3.5 py-2.5 text-sm outline-none focus:border-[#6E4F2E] focus:bg-[#F3ECE2] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[12.5px] font-sans font-medium text-[#3C3229] mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your Email"
                        className="w-full bg-[#EDE5DA] border border-[#9C846E] text-[#2C241E] placeholder-[#B3A293] rounded-none px-3.5 py-2.5 text-sm outline-none focus:border-[#6E4F2E] focus:bg-[#F3ECE2] transition-colors"
                      />
                    </div>
                  </div>

                  {/* 3. Subject Custom Dropdown (matching reference label) */}
                  <div className="relative z-20" ref={subjectRef}>
                    <label className="block text-[12.5px] font-sans font-medium text-[#3C3229] mb-1.5">
                      Your Full Name
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubjectOpen(!isSubjectOpen);
                        setIsDialCodeOpen(false);
                      }}
                      className={`w-full bg-[#EDE5DA] border text-[#2C241E] rounded-none px-3.5 py-2.5 flex items-center justify-between text-sm transition-all cursor-pointer ${
                        isSubjectOpen
                          ? "border-[#6E4F2E] ring-1 ring-[#6E4F2E]/25 bg-[#F3ECE2]"
                          : "border-[#9C846E] hover:border-[#6E4F2E]"
                      }`}
                    >
                      <span className={subject ? "text-[#2C241E] font-medium" : "text-[#B3A293]"}>
                        {subject || "Select a Subject"}
                      </span>
                      <ChevronDown
                        size={15}
                        className={`text-[#6E5D4F] transition-transform duration-200 ${
                          isSubjectOpen ? "rotate-180 text-[#6E4F2E]" : ""
                        }`}
                      />
                    </button>

                    {isSubjectOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-[#F8F4EE] border border-[#9C846E] rounded-none shadow-lg py-1 max-h-60 overflow-y-auto no-scrollbar animate-in fade-in duration-150">
                        {SUBJECT_OPTIONS.map((opt) => {
                          const isSelected = subject === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setSubject(opt);
                                setIsSubjectOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-[#EDE5DA] text-[#6E4F2E] font-medium"
                                  : "text-[#2C241E] hover:bg-[#EDE5DA]/70 hover:text-[#6E4F2E]"
                              }`}
                            >
                              <span>{opt}</span>
                              {isSelected && <Check size={14} className="text-[#6E4F2E]" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 4. Message Textarea */}
                  <div>
                    <label className="block text-[12.5px] font-sans font-medium text-[#3C3229] mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here...."
                      className="w-full bg-[#EDE5DA] border border-[#9C846E] text-[#2C241E] placeholder-[#B3A293] rounded-none p-3.5 text-sm outline-none resize-none focus:border-[#6E4F2E] focus:bg-[#F3ECE2] transition-colors"
                    />
                  </div>

                  {/* 5. Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#6E4F2E] hover:bg-[#5C4124] text-[#FAF5EE] py-3 sm:py-3.5 text-sm font-sans font-normal tracking-wide rounded-none transition-colors shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span>TRANSMITTING MESSAGE...</span>
                    ) : (
                      <>
                        <span>Submit</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>

              </div>

              {/* ------------------------------------------------------------------- */}
              {/* B. Right Column: "CONTACT INFORMATION" Directory (~5 cols)          */}
              {/* ------------------------------------------------------------------- */}
              <div className="lg:col-span-5 rounded-none p-2 sm:p-4 lg:p-0 flex flex-col justify-start">
                
                {/* Header */}
                <div className="mb-6">
                  <h2 className="font-serif text-[22px] sm:text-[24px] tracking-[0.14em] uppercase text-[#A08261] mb-2 font-normal">
                    Contact Information
                  </h2>
                  <p className="text-[#3C3229] text-[13px] leading-relaxed font-sans">
                    Every timepiece is carefully examined before it finds its place in our collection.
                  </p>
                </div>

                {/* Directory List */}
                <div className="space-y-5">
                  
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-[6px] bg-[#6E4F2E] flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                      <Phone size={17} />
                    </div>
                    <div>
                      <span className="block text-[12px] font-sans font-medium text-[#7A6E63] mb-0.5">
                        Phone Number
                      </span>
                      <a
                        href="tel:+971504321170"
                        className="text-sm sm:text-[14.5px] font-medium text-[#2C241E] hover:text-[#6E4F2E] transition-colors"
                      >
                        +971 50 432 1170
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-[6px] bg-[#6E4F2E] flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                      <MessageCircle size={17} />
                    </div>
                    <div>
                      <span className="block text-[12px] font-sans font-medium text-[#7A6E63] mb-0.5">
                        Whatsapp Number
                      </span>
                      <a
                        href="https://wa.me/971504321170"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-[14.5px] font-medium text-[#2C241E] hover:text-[#6E4F2E] transition-colors"
                      >
                        +971 50 432 1170
                      </a>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-[6px] bg-[#6E4F2E] flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-[12px] font-sans font-medium text-[#7A6E63] mb-0.5">
                        Follow Us on Instagram
                      </span>
                      <a
                        href="https://instagram.com/horologeroyal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-[14.5px] font-medium text-[#2C241E] hover:text-[#6E4F2E] transition-colors"
                      >
                        @horologeroyal
                      </a>
                    </div>
                  </div>

                  {/* Mail */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-[6px] bg-[#6E4F2E] flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                      <Mail size={17} />
                    </div>
                    <div>
                      <span className="block text-[12px] font-sans font-medium text-[#7A6E63] mb-0.5">
                        Mail Us
                      </span>
                      <a
                        href="mailto:horologeroyal@gmail.com"
                        className="text-sm sm:text-[14.5px] font-medium text-[#2C241E] hover:text-[#6E4F2E] transition-colors"
                      >
                        horologeroyal@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Visit Us Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-[6px] bg-[#6E4F2E] flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                      <MapPin size={17} />
                    </div>
                    <div>
                      <span className="block text-[12px] font-sans font-medium text-[#7A6E63] mb-0.5">
                        Visit Us
                      </span>
                      <p className="text-xs sm:text-[13px] leading-relaxed text-[#2C241E] font-medium max-w-sm">
                        Shop No 7A, Oriental Building, Old, Mahatma Gandhi Road, opposite HSBC Bank, Kala Ghoda, Fort,, Mumbai, Maharashtra 400001
                      </p>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: "VISIT OUR BOUTIQUE" (KALA GHODA SHOWCASE)                     */}
        {/* ========================================================================= */}
        <section id="boutique" className="w-full bg-[#E5D9CC] border-b border-[#D8C7B3] overflow-hidden">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[540px] lg:h-[620px] xl:h-[680px] items-stretch">
            
            {/* 1. Left Block: Scaled Title, Narrative & CTA (~5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-center pl-6 sm:pl-12 lg:pl-16 xl:pl-24 pr-6 sm:pr-8 py-12 lg:py-0">
              <h2 className="font-serif text-[42px] sm:text-[54px] lg:text-[62px] xl:text-[72px] leading-[0.98] tracking-tight uppercase text-[#2C241E] mb-6">
                Visit <span className="text-[#8C6D46]">Our<br />Boutique</span>
              </h2>
              
              <p className="font-sans text-lg sm:text-xl lg:text-[22px] xl:text-[24px] leading-[1.38] text-[#3D332A] max-w-md">
                We prioritise transparency,<br />
                provenance, and complete<br />
                confidence with every<br />
                acquisition.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("inquiry-form");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mt-6 sm:mt-8 w-full sm:w-[380px] lg:w-[440px] xl:w-[480px] max-w-full py-4 sm:py-4.5 bg-[#6E4F2E] hover:bg-[#5C4124] text-[#FAF5EE] text-sm sm:text-[15px] font-sans font-normal tracking-[0.02em] rounded-none transition-colors shadow-sm active:scale-[0.99] cursor-pointer block text-center"
                >
                  Get in Touch
                </button>
              </div>
            </div>

            {/* 2. Middle Block: Professional Architectural Map Card with NO rounded corners (~4 cols) */}
            <div className="lg:col-span-4 p-6 sm:p-8 lg:p-6 xl:p-8 flex items-center justify-center">
              <div className="relative w-full h-[380px] sm:h-[440px] lg:h-full max-h-[540px] rounded-none overflow-hidden border border-[#D5C5B2] shadow-sm bg-[#F8F4EE]">
                {/* Grayscale/warm-toned styled map embed */}
                <iframe
                  title="Horologe Royale Kala Ghoda Boutique Location"
                  src="https://maps.google.com/maps?q=Oriental+Building+Old+Mahatma+Gandhi+Road+Kala+Ghoda+Fort+Mumbai+400001&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full filter grayscale-[75%] sepia-[20%] contrast-[1.12] brightness-[0.97]"
                />

                {/* Top Floating Badge & Directions Action */}
                <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
                  <div className="bg-[#FAF7F2]/95 backdrop-blur-md px-3 py-1.5 rounded-none border border-[#DFCFC0] shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#725433]" />
                    <span className="font-serif text-[11px] uppercase tracking-wider text-[#725433] font-medium">
                      Flagship Boutique
                    </span>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Oriental+Building+Old+Mahatma+Gandhi+Road+Kala+Ghoda+Fort+Mumbai+400001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto bg-[#FAF7F2]/95 hover:bg-[#725433] hover:text-[#FAF7F2] text-[#2C241E] px-3 py-1.5 rounded-none border border-[#DFCFC0] shadow-sm text-[11px] font-medium uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Directions</span>
                    <ArrowRight size={12} />
                  </a>
                </div>

                {/* Center Custom Marker Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center -mt-6">
                  <div className="w-9 h-9 rounded-full bg-[#725433] border-2 border-white text-white flex items-center justify-center shadow-lg">
                    <MapPin size={17} />
                  </div>
                  <div className="w-2.5 h-1 bg-black/35 rounded-full blur-[1px] mt-0.5" />
                </div>

                {/* Bottom Floating Location Badge */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 bg-[#FAF7F2]/95 backdrop-blur-md p-3.5 rounded-none border border-[#DFCFC0] shadow-md pointer-events-none">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-none bg-[#725433] text-[#FAF6F0] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin size={14} />
                    </div>
                    <div className="min-w-0">
                      <span className="font-serif text-xs uppercase tracking-wide text-[#2C241E] font-medium block truncate">
                        Oriental Building • Kala Ghoda
                      </span>
                      <span className="text-[11px] text-[#7A6E63] leading-snug block truncate">
                        Old MG Road, opp. HSBC Bank, Fort, Mumbai 400001
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Right Block: Boutique Storefront Facade Photo Touching the Right Edge (~3 cols) */}
            <div className="lg:col-span-3 relative h-[380px] sm:h-[460px] lg:h-full w-full overflow-hidden">
              <Image
                src="/assets/horologe store 1.png"
                alt="Horologe Royale Luxury Storefront at Kala Ghoda, Mumbai"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 25vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-[#FAF6F0] pointer-events-none">
                <span className="font-serif text-xs sm:text-sm uppercase tracking-[0.16em] block">
                  HOROLOGE ROYALE BOUTIQUE
                </span>
                <span className="text-[11px] tracking-widest text-[#E5D5C5] uppercase block mt-0.5">
                  MUMBAI • PRIVATE SUITE
                </span>
              </div>
            </div>

          </div>
        </section>

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
              CONCIERGE COMMUNICATIONS DESK
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#2C241E] font-normal mb-2">
              Message Transmitted
            </h3>

            <p className="text-xs text-[#7C7064] font-mono mb-4 bg-[#EFE8DD] px-3 py-1 rounded-full border border-[#DFCFC0]">
              Inquiry Ref: {referenceId}
            </p>

            <p className="text-[#6C5E52] text-xs sm:text-sm leading-relaxed mb-6 font-sans">
              Thank you, <strong className="text-[#2C241E]">{firstName} {lastName}</strong>. Your inquiry regarding <strong className="text-[#2C241E]">{subject}</strong> has been prioritized. Our private client concierge will respond to <strong className="text-[#2C241E]">{email}</strong> or <strong className="text-[#2C241E]">{dialCode} {phoneNumber}</strong> shortly.
            </p>

            <div className="w-full flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="flex-1 py-3 px-4 rounded-xl border border-[#DFCFC0] text-[#2C241E] hover:bg-[#EFE8DD] text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
              <Link
                href="/collections"
                className="flex-1 py-3 px-4 rounded-xl bg-[#5C4529] hover:bg-[#47341D] text-[#FAF6F0] text-xs uppercase tracking-wider font-medium transition-colors flex items-center justify-center cursor-pointer shadow-sm"
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
