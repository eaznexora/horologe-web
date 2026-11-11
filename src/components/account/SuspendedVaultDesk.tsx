"use client";

import React, { useState } from "react";
import { ShieldAlert, CheckCircle2, Loader2, ArrowRight, LogOut, MessageSquare, Clock } from "lucide-react";

interface AppealMessage {
  message: string;
  submittedAt?: string | null;
  status: "none" | "pending" | "reviewed";
}

interface SuspendedVaultDeskProps {
  user: {
    _id?: string;
    name?: string;
    email?: string;
    blockReason?: string;
    blockedAt?: string | null;
    appealMessage?: AppealMessage | null;
  };
  onLogOut: () => void;
  onAppealSubmitted?: (appeal: AppealMessage) => void;
}

export default function SuspendedVaultDesk({
  user,
  onLogOut,
  onAppealSubmitted,
}: SuspendedVaultDeskProps) {
  const [appealText, setAppealText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentAppeal, setCurrentAppeal] = useState<AppealMessage | null>(
    user.appealMessage?.message ? user.appealMessage : null
  );
  const [showAppealForm, setShowAppealForm] = useState(!user.appealMessage?.message);

  const handleSubmitAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!appealText.trim()) {
      setErrorMsg("Please enter a message for the Salon Director.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/account/appeal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: appealText.trim(),
          email: user.email,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to transmit appeal to directorate.");
      }

      const newAppeal: AppealMessage = data.appeal || {
        message: appealText.trim(),
        submittedAt: new Date().toISOString(),
        status: "pending",
      };

      setCurrentAppeal(newAppeal);
      setShowAppealForm(false);
      setAppealText("");
      if (onAppealSubmitted) {
        onAppealSubmitted(newAppeal);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting appeal.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 sm:py-16">
      {/* Primary Suspended Card */}
      <div className="bg-[#FAF6F0] border border-[#DFCFC0] rounded-none p-6 sm:p-10 shadow-xs relative">
        {/* Top Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-none bg-[#2C241E] text-[#FAF6F0] flex items-center justify-center shrink-0">
            <ShieldAlert size={16} />
          </div>
          <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#8C6D46] block">
            VAULT PRIVILEGES SUSPENDED
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#2C241E] uppercase tracking-wide mb-3">
          Private Access on Hold
        </h1>

        <p className="text-xs sm:text-sm text-[#7A6C5E] leading-relaxed font-light mb-6">
          Your collector privileges have been temporarily suspended by the Salon Directorate. While suspended, direct timepiece acquisitions, ledger reservations, and address edits are locked.
        </p>

        {/* Reason Box */}
        <div className="bg-[#EFE8DD]/70 border border-[#DFCFC0] rounded-none p-4 sm:p-5 mb-8">
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8C7A6B] block mb-1">
            Directorate Directive Notice
          </span>
          <p className="font-serif text-sm sm:text-base text-[#2C241E] italic leading-relaxed">
            &ldquo;{user.blockReason || "Administrative hold pending collector verification and portfolio review."}&rdquo;
          </p>
          {user.blockedAt && (
            <p className="text-[11px] text-[#7A6C5E] mt-2 font-['Times_New_Roman',serif]">
              Enacted:{" "}
              {new Date(user.blockedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Existing Appeal Card if already submitted */}
        {currentAppeal && (
          <div className="mb-8 border border-[#DFCFC0] bg-[#EFE8DD]/40 rounded-none p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-[#DFCFC0] pb-3 mb-4">
              <div className="flex items-center gap-2 text-[#5C4529]">
                <MessageSquare size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Active Appeal On File
                </span>
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-none ${
                  currentAppeal.status === "pending"
                    ? "bg-[#9D7E50] text-[#FAF6F0] animate-pulse"
                    : "bg-[#2C241E] text-[#FAF6F0]"
                }`}
              >
                {currentAppeal.status === "pending" ? "Pending Review" : "Reviewed"}
              </span>
            </div>

            <p className="text-xs text-[#6C5E52] uppercase tracking-wider mb-1 text-[10px]">
              Transmitted Message:
            </p>
            <blockquote className="font-serif text-sm text-[#2C241E] italic border-l-2 border-[#5C4529] pl-3 py-1 mb-3">
              &ldquo;{currentAppeal.message}&rdquo;
            </blockquote>

            {currentAppeal.submittedAt && (
              <div className="flex items-center gap-1.5 text-xs text-[#7A6C5E] font-['Times_New_Roman',serif]">
                <Clock size={12} className="text-[#8C7A6B]" />
                <span>
                  Submitted on{" "}
                  {new Date(currentAppeal.submittedAt).toLocaleString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-[#DFCFC0] flex items-center justify-between">
              <span className="text-xs text-[#7A6C5E] font-light">
                Under review by the Horologe Royale Directorate.
              </span>
              {!showAppealForm && (
                <button
                  type="button"
                  onClick={() => setShowAppealForm(true)}
                  className="text-xs uppercase tracking-wider font-semibold text-[#5C4529] hover:underline cursor-pointer"
                >
                  Send Additional Note →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Appeal Submission Form */}
        {showAppealForm && (
          <form onSubmit={handleSubmitAppeal} className="space-y-4 border-t border-[#DFCFC0] pt-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-medium tracking-[0.18em] uppercase text-[#7A6E63]">
                  DIRECT APPEAL TO SALON DIRECTOR *
                </label>
                {currentAppeal && (
                  <button
                    type="button"
                    onClick={() => setShowAppealForm(false)}
                    className="text-xs text-[#7A6C5E] hover:text-[#2C241E] cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <textarea
                rows={4}
                required
                value={appealText}
                onChange={(e) => setAppealText(e.target.value)}
                placeholder="Transmit a private message or inquiry to the Salon Director..."
                className="w-full bg-[#EFE8DD]/70 border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none p-4 text-sm outline-none focus:border-[#5C4529] focus:ring-1 focus:ring-[#5C4529] transition-all resize-none font-sans"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-[#EFE8DD] border border-[#5C4529] text-xs text-[#5C4529] font-medium flex items-center gap-2 rounded-none">
                <span>•</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#5C4529] hover:bg-[#47341D] text-[#FAF6F0] rounded-none py-4 px-8 text-xs tracking-[0.2em] uppercase font-semibold transition-all cursor-pointer shadow-none active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin text-[#FAF6F0]" />
                  <span>TRANSMITTING APPEAL...</span>
                </>
              ) : (
                <>
                  <span>TRANSMIT APPEAL TO CONCIERGE</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Logout Action */}
        <div className="mt-8 pt-6 border-t border-[#DFCFC0] flex items-center justify-between text-xs text-[#7A6C5E]">
          <span>Logged in as {user.email}</span>
          <button
            type="button"
            onClick={onLogOut}
            className="flex items-center gap-1.5 text-[#5C4529] hover:underline font-medium uppercase tracking-wider text-[11px] cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out / Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}

