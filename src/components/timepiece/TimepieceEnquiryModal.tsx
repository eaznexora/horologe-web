"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, CheckCircle2, ArrowRight, ShieldCheck, Clock, Send, Loader2 } from "lucide-react";

// INR currency formatter
function formatINR(val: number): string {
  return "₹" + Math.round(val).toLocaleString("en-IN");
}

export interface TimepieceEnquiryData {
  timepieceId?: string;
  slug: string;
  title: string;
  brand?: string;
  reference?: string;
  price?: number;
  image?: string;
}

interface TimepieceEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  timepiece: TimepieceEnquiryData;
}

const QUICK_TOPICS = [
  "Request Private Salon Viewing",
  "Verify Provenance, Box & Original Papers",
  "Discuss Insured Armored Delivery",
];

export default function TimepieceEnquiryModal({
  isOpen,
  onClose,
  timepiece,
}: TimepieceEnquiryModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  // 1. Auto-hydrate if user has active session
  useEffect(() => {
    if (!isOpen) return;
    setIsSuccess(false);
    setFormError(null);

    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            if (data.user.name && !name) setName(data.user.name);
            if (data.user.email && !email) setEmail(data.user.email);
            if (data.user.phone && !phone) setPhone(data.user.phone);
          }
        }
      } catch {
        // Guest user
      }
    }
    loadUser();
  }, [isOpen]);

  if (!isOpen) return null;

  // Strict Phone KeyDown Validator
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) return;
    if (!/[0-9+\s-]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleTopicClick = (topic: string) => {
    setSelectedTopic(topic);
    const prefix = `[Topic: ${topic}]`;
    if (!message) {
      setMessage(`${prefix} Greetings, I would like to inquire about the ${timepiece.title} (Ref. ${timepiece.reference || "HR-VAULT"}). Specifically regarding: ${topic.toLowerCase()}.`);
    } else if (!message.includes(prefix)) {
      setMessage(`${prefix}\n${message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("Please enter your full legal name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setFormError("Please enter a valid collector email address.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setFormError("Please enter a valid telephone number with country code.");
      return;
    }
    if (!message.trim()) {
      setFormError("Please enter your bespoke inquiry or viewing request details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "watch",
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          subject: selectedTopic
            ? `${selectedTopic}: ${timepiece.title}`
            : `Timepiece Inquiry: ${timepiece.title}`,
          message: message.trim(),
          timepiece: {
            timepieceId: timepiece.timepieceId,
            slug: timepiece.slug,
            title: timepiece.title,
            brand: timepiece.brand,
            reference: timepiece.reference,
            price: timepiece.price,
            image: timepiece.image,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit timepiece inquiry.");
      }

      const generatedRef = data.inquiry?._id
        ? `HR-ENQ-${String(data.inquiry._id).slice(-6).toUpperCase()}`
        : `HR-ENQ-${Math.floor(100000 + Math.random() * 900000)}`;

      setReferenceId(generatedRef);
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error transmitting inquiry";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF6F0] border border-[#DFCFC0] rounded-none max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-auto animate-in zoom-in-95">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-[#8C7A6B] hover:text-[#2C241E] p-1.5 transition-colors cursor-pointer"
          aria-label="Close Inquiry Modal"
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          /* Confirmation Receipt View */
          <div className="text-center py-6 sm:py-8 space-y-4">
            <div className="w-12 h-12 bg-[#2C241E] text-[#FAF6F0] rounded-none flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={24} className="text-[#9D7E50]" />
            </div>

            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#8C6D46] block">
              INQUIRY RECORDED IN VAULT
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#2C241E] font-medium uppercase tracking-wide">
              Concierge Request Logged
            </h3>

            <p className="text-xs sm:text-sm text-[#5C4F42] max-w-md mx-auto leading-relaxed font-light">
              Your inquiry for the <span className="font-medium text-[#2C241E]">{timepiece.title}</span> has been dispatched to our Salon Directorate. A senior horological concierge will contact you shortly.
            </p>

            <div className="bg-[#EFE8DD]/80 border border-[#DFCFC0] p-3 max-w-xs mx-auto rounded-none text-xs font-['Times_New_Roman',serif]">
              <span className="block text-[10px] uppercase tracking-wider text-[#8C7A6B] font-sans">
                Vault Reference Code
              </span>
              <span className="font-semibold text-base text-[#2C241E]">{referenceId}</span>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#5C4529] hover:bg-[#47341D] text-[#FAF6F0] rounded-none text-xs tracking-[0.2em] uppercase font-semibold transition-all cursor-pointer shadow-xs"
              >
                Return to Timepiece
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <div className="space-y-5">
            {/* Modal Eyebrow & Title */}
            <div>
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#8C6D46] block mb-1">
                ATELIER CONCIERGE DESK
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2C241E] font-medium uppercase tracking-wide">
                Private Timepiece Enquiry
              </h2>
            </div>

            {/* Watch Dossier Header inside Modal */}
            <div className="flex items-center gap-3.5 p-3 bg-[#EFE8DD]/70 border border-[#DFCFC0] rounded-none">
              <div className="relative w-16 h-16 rounded-none border border-[#DFCFC0] bg-white overflow-hidden shrink-0 shadow-2xs">
                <Image
                  src={timepiece.image || "/assets/Rolex Daytona.png"}
                  alt={timepiece.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-[#7A6C5E] font-medium block truncate">
                  {timepiece.brand || "Horologe Royale"}
                </span>
                <h4 className="font-serif text-sm sm:text-base text-[#2C241E] font-medium truncate">
                  {timepiece.title}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-[#7A6C5E] truncate">
                    Ref. {timepiece.reference || "HR-VAULT"}
                  </span>
                  {timepiece.price ? (
                    <span className="font-['Times_New_Roman',serif] text-sm sm:text-base font-semibold text-[#5C4529]">
                      {formatINR(timepiece.price)}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Quick-Select Topic Pills */}
            <div>
              <label className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#7A6E63] mb-1.5">
                Inquiry Topic
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TOPICS.map((topic) => {
                  const isSelected = selectedTopic === topic;
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleTopicClick(topic)}
                      className={`px-3 py-1.5 text-xs rounded-none border transition-colors cursor-pointer text-left ${
                        isSelected
                          ? "bg-[#5C4529] text-[#FAF6F0] border-[#5C4529] font-medium"
                          : "bg-white/80 text-[#2C241E] border-[#DFCFC0] hover:bg-[#EFE8DD]"
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Notice */}
            {formError && (
              <div className="p-3 bg-[#EFE8DD] border border-[#DFCFC0] text-xs text-[#5C4529] rounded-none">
                {formError}
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#7A6E63] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lord Alistair Vance"
                    className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-3.5 py-2.5 text-xs outline-none focus:border-[#5C4529]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#7A6E63] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="collector@domain.com"
                    className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-3.5 py-2.5 text-xs outline-none focus:border-[#5C4529]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#7A6E63] mb-1.5">
                  Contact Telephone (with Country Code) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onKeyDown={handlePhoneKeyDown}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s-]/g, ""))}
                  placeholder="+91 98200 12345"
                  className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-3.5 py-2.5 text-xs font-['Times_New_Roman',serif] text-sm outline-none focus:border-[#5C4529]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#7A6E63] mb-1.5">
                  Bespoke Inquiry or Viewing Request *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your request regarding private salon presentation, certified paperwork, or armored courier requirements..."
                  className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none p-3 text-xs outline-none focus:border-[#5C4529] resize-none leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#5C4529] hover:bg-[#47341D] text-[#FAF6F0] rounded-none py-3.5 px-6 text-xs tracking-[0.2em] uppercase font-semibold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Transmitting to Concierge...</span>
                    </>
                  ) : (
                    <>
                      <span>Transmit Private Inquiry</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

