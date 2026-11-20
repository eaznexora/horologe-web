"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BannerLink from "@/components/BannerLink";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type AuthMode = "signin" | "signup";

export interface AuthCardBannerData {
  desktopUrl?: string;
  mobileUrl?: string;
  linkUrl?: string;
  mediaType?: "image" | "video" | string;
}

export interface AuthCardProps {
  initialMode?: AuthMode;
  banners?: Record<string, AuthCardBannerData>;
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="16" height="16">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function AuthCardContent({ initialMode = "signin", banners = {} }: AuthCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Resolve initial mode: query parameter overrides initialMode if present
  const queryMode = searchParams.get("mode");
  const redirectParam = searchParams.get("redirect");
  const targetDestination = redirectParam && redirectParam.startsWith("/") ? redirectParam : "/account";

  const [mode, setMode] = useState<AuthMode>(() => {
    if (queryMode === "signup" || queryMode === "register") return "signup";
    if (queryMode === "signin" || queryMode === "login") return "signin";
    return initialMode;
  });

  // Dynamic Banners State & Viewport Detection
  const [bannersState, setBannersState] = useState<Record<string, AuthCardBannerData>>(banners);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (banners && Object.keys(banners).length > 0) {
      setBannersState(banners);
    }
  }, [banners]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Client-side fallback fetch if banners were not provided via SSR
  useEffect(() => {
    if (bannersState && Object.keys(bannersState).length > 0) return;
    let isMounted = true;
    fetch("/api/banners?page=auth")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.banners) {
          setBannersState(data.banners);
        }
      })
      .catch((err) => {
        console.error("Client banner fetch error:", err);
      });
    return () => {
      isMounted = false;
    };
  }, [bannersState]);

  // Form Fields State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register Fields State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Interaction State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Sync mode with URL if query parameter changes
  useEffect(() => {
    if (queryMode === "signup" || queryMode === "register") {
      setMode("signup");
    } else if (queryMode === "signin" || queryMode === "login") {
      setMode("signin");
    }
  }, [queryMode]);

  // Mode switch handler with graceful client pushState and redirect preservation
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
    setStatusNotice(null);
    setApiError(null);
    if (typeof window !== "undefined") {
      const base = newMode === "signin" ? "/login" : "/register";
      const targetPath = redirectParam ? `${base}?redirect=${encodeURIComponent(redirectParam)}` : base;
      window.history.pushState(null, "", targetPath);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!email.trim()) {
      errs.email = "Please provide your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please provide a valid email address";
    }

    if (!password) {
      errs.password = "Please enter your password";
    } else if (mode === "signup" && password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }

    if (mode === "signup") {
      if (!firstName.trim()) {
        errs.firstName = "Please provide your first name";
      }
      if (!lastName.trim()) {
        errs.lastName = "Please provide your last name";
      }
      if (password !== confirmPassword) {
        errs.confirmPassword = "Passwords do not match";
      }
      if (!agreeTerms) {
        errs.terms = "You must agree to the Terms & Conditions";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusNotice(null);
    setApiError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Invalid email or password");
        }

        setStatusNotice("Welcome back. Access granted to your private vault...");
        setTimeout(() => {
          router.push(targetDestination);
          router.refresh();
        }, 800);
      } else {
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName,
            email: email.trim(),
            password,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to create membership account");
        }

        setStatusNotice("Your membership account has been created. Preparing your vault...");
        setTimeout(() => {
          router.push(targetDestination);
          router.refresh();
        }, 800);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = (provider: "Google") => {
    setStatusNotice(`Connecting with ${provider}... Please wait.`);
    setTimeout(() => {
      setStatusNotice(`Authenticated via ${provider}. Preparing your account...`);
      setTimeout(() => {
        router.push(targetDestination);
      }, 1000);
    }, 800);
  };

  // Resolve Active Media Slot
  const activeSlotKey = mode === "signin" ? "auth-signin" : "auth-signup";
  const activeSlot = bannersState?.[activeSlotKey];
  const defaultVideo = mode === "signin" ? "/assets/login%20page.mp4" : "/assets/account%20creation.mp4";
  const activeVideoSrc =
    (isMobile && activeSlot?.mobileUrl?.trim()) ||
    activeSlot?.desktopUrl?.trim() ||
    defaultVideo;

  const isImageMedia =
    activeSlot?.mediaType === "image" ||
    /\.(jpg|jpeg|png|webp|avif)$/i.test(activeVideoSrc);

  const activeLink = activeSlot?.linkUrl?.trim();

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#FAF6F0] border border-[#DFCFC0] shadow-sm rounded-none overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch transition-all duration-300">
      {/* ============================================================= */}
      {/* LEFT COLUMN: HIGH-CRAFT MEDIA SHOWCASE (lg:col-span-5)        */}
      {/* ============================================================= */}
      <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full w-full bg-black rounded-none overflow-hidden flex flex-col justify-end">
        {/* Dynamic Video / Image Showcase with poster fallback */}
        <div className="absolute inset-0 w-full h-full">
          {isImageMedia ? (
            <img
              src={activeVideoSrc}
              alt="Horologe Royale Authentication"
              className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02] transition-transform duration-700 ease-out"
            />
          ) : (
            <video
              key={`${mode}-${activeVideoSrc}`}
              autoPlay
              loop
              muted
              playsInline
              poster="/assets/admin-hero-watch.jpg"
              className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02] transition-transform duration-700 ease-out"
            >
              <source
                src={activeVideoSrc}
                type={activeVideoSrc.toLowerCase().endsWith(".webm") ? "video/webm" : "video/mp4"}
              />
            </video>
          )}
          {/* Rich cinematic gradient vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 pointer-events-none" />
        </div>

        {/* Bottom Editorial Copy Overlay */}
        <div className="relative z-10 p-7 sm:p-9 lg:p-10 text-white">
          <motion.div
            key={`media-text-${mode}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] text-[#E0D5C7] uppercase">
              {mode === "signin" ? "A WORLD OF" : "JOIN A WORLD OF"}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FAF6F0] font-normal tracking-[0.08em] uppercase leading-tight mt-1.5 drop-shadow-sm">
              EXCEPTIONAL
              <br />
              TIMEPIECES
            </h2>
            <p className="text-[10px] sm:text-[11px] tracking-[0.18em] text-[#D2C3B4] uppercase font-light mt-3 max-w-sm leading-relaxed">
              {mode === "signin"
                ? "SIGN IN TO ACCESS YOUR ACCOUNT AND EXPLORE MORE."
                : "CREATE AN ACCOUNT TO EXPLORE EXCLUSIVE COLLECTIONS AND MORE."}
            </p>
          </motion.div>
        </div>

        {/* Optional Redirect Link (only active if linkUrl is configured) */}
        {activeLink && (
          <BannerLink
            href={activeLink}
            className="absolute inset-0 z-20 cursor-pointer"
            aria-label="Visit destination"
          />
        )}
      </div>

      {/* ============================================================= */}
      {/* RIGHT COLUMN: REFINED AUTHENTICATION ENGINE (lg:col-span-7)   */}
      {/* ============================================================= */}
      <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 bg-[#FAF6F0] flex flex-col justify-center rounded-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
          >
            {/* Header Titles */}
            <div className="mb-5 sm:mb-6">
              <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.22em] uppercase text-[#8C7A6B] mb-1.5 block">
                {mode === "signin" ? "WELCOME BACK" : "CREATE ACCOUNT"}
              </span>
              <h1 className="font-serif text-3xl sm:text-[34px] text-[#2C241E] font-normal tracking-tight mb-1.5">
                {mode === "signin" ? "Sign In" : "Join Horologe Royale"}
              </h1>
              <p className="text-xs sm:text-[13px] text-[#7A6B5D] font-light leading-relaxed">
                {mode === "signin"
                  ? "Access your account to manage orders, wishlist and more."
                  : "Create an account to enjoy a seamless shopping experience, save your favourites and more."}
              </p>
            </div>

            {/* Status Notice (Strict Luxury Bronze - Zero Red Policy) */}
            {statusNotice && (
              <div className="mb-4 p-3 rounded-none bg-[#EFE8DD]/70 border border-[#DFCFC0] text-xs text-[#5C4529] font-medium tracking-wide flex items-center gap-2">
                <Check size={14} className="shrink-0 text-[#5C4529]" />
                <span>{statusNotice}</span>
              </div>
            )}

            {/* API Error Notice (Strict Luxury Bronze - Zero Red Policy) */}
            {apiError && (
              <div className="mb-4 p-3 rounded-none bg-[#EFE8DD]/80 border border-[#DFCFC0] text-xs text-[#5C4529] font-medium tracking-wide flex items-center gap-2">
                <span className="font-serif text-sm font-bold text-[#5C4529]">•</span>
                <span>{apiError}</span>
              </div>
            )}

            {/* Main Form - Pure Sharp Corners (Zero Radius) with Labels on Top */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full Name Fields (Create Account Only) */}
              {mode === "signup" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-medium tracking-[0.16em] uppercase text-[#7A6E63] mb-1.5">
                      FIRST NAME
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: "" }));
                      }}
                      placeholder="Enter your first name"
                      className="w-full bg-[#FAF7F2] border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-4 py-3 focus:border-[#5C4529] focus:ring-1 focus:ring-[#5C4529] text-xs sm:text-sm outline-none transition-all"
                    />
                    {errors.firstName && (
                      <p className="text-[11px] text-[#5C4529] mt-1 font-medium tracking-wide">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-medium tracking-[0.16em] uppercase text-[#7A6E63] mb-1.5">
                      LAST NAME
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: "" }));
                      }}
                      placeholder="Enter your last name"
                      className="w-full bg-[#FAF7F2] border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-4 py-3 focus:border-[#5C4529] focus:ring-1 focus:ring-[#5C4529] text-xs sm:text-sm outline-none transition-all"
                    />
                    {errors.lastName && (
                      <p className="text-[11px] text-[#5C4529] mt-1 font-medium tracking-wide">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-[10px] sm:text-[11px] font-medium tracking-[0.16em] uppercase text-[#7A6E63] mb-1.5">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="Enter your email"
                  className="w-full bg-[#FAF7F2] border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-4 py-3 focus:border-[#5C4529] focus:ring-1 focus:ring-[#5C4529] text-xs sm:text-sm outline-none transition-all"
                />
                {errors.email && (
                  <p className="text-[11px] text-[#5C4529] mt-1 font-medium tracking-wide">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] sm:text-[11px] font-medium tracking-[0.16em] uppercase text-[#7A6E63]">
                    PASSWORD
                  </label>
                  {mode === "signin" && (
                    <Link
                      href="/forgot-password"
                      className="text-xs text-[#7A6B5D] hover:text-[#5C4529] transition-colors underline-offset-2 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </Link>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    placeholder={mode === "signin" ? "Enter your password" : "Create a password"}
                    className="w-full bg-[#FAF7F2] border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-4 pr-11 py-3 focus:border-[#5C4529] focus:ring-1 focus:ring-[#5C4529] text-xs sm:text-sm outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 text-[#9C8A79] hover:text-[#5C4529] p-1 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-[#5C4529] mt-1 font-medium tracking-wide">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password (Create Account Only) */}
              {mode === "signup" && (
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-medium tracking-[0.16em] uppercase text-[#7A6E63] mb-1.5">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                        }
                      }}
                      placeholder="Confirm your password"
                      className="w-full bg-[#FAF7F2] border border-[#DFCFC0] text-[#2C241E] placeholder:text-[#A89887] rounded-none px-4 pr-11 py-3 focus:border-[#5C4529] focus:ring-1 focus:ring-[#5C4529] text-xs sm:text-sm outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      className="absolute right-3 text-[#9C8A79] hover:text-[#5C4529] p-1 transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[11px] text-[#5C4529] mt-1 font-medium tracking-wide">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Terms and Conditions Checkbox (Create Account Only) */}
              {mode === "signup" && (
                <div>
                  <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none group">
                    <div
                      role="checkbox"
                      aria-checked={agreeTerms}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                          e.preventDefault();
                          setAgreeTerms(!agreeTerms);
                          if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
                        }
                      }}
                      onClick={() => {
                        setAgreeTerms(!agreeTerms);
                        if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
                      }}
                      className={`w-4 h-4 mt-0.5 rounded-none border transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
                        agreeTerms
                          ? "bg-[#5C4529] border-[#5C4529] text-[#FAF6F0]"
                          : "bg-[#FAF7F2] border-[#C5B7A8] group-hover:border-[#5C4529]"
                      }`}
                    >
                      {agreeTerms && <Check size={11} strokeWidth={3} />}
                    </div>
                    <span className="text-xs text-[#7A6B5D] leading-relaxed">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="underline text-[#2C241E] hover:text-[#5C4529] transition-colors"
                      >
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="underline text-[#2C241E] hover:text-[#5C4529] transition-colors"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-[11px] text-[#5C4529] mt-1 font-medium tracking-wide">
                      {errors.terms}
                    </p>
                  )}
                </div>
              )}

              {/* Primary CTA Submit Button - Zero Radius Luxury Bronze */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#5C4529] hover:bg-[#48361F] text-[#FAF6F0] rounded-none py-3.5 sm:py-4 px-6 text-xs sm:text-[13px] tracking-[0.16em] uppercase font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-none active:scale-[0.99] mt-5 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-[#FAF6F0]" />
                    <span>{mode === "signin" ? "Signing In..." : "Creating Account..."}</span>
                  </>
                ) : (
                  <>
                    <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Divider: OR CONTINUE WITH */}
            <div className="relative flex items-center justify-center my-6">
              <div className="w-full border-t border-[#DFCFC0]" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8C7A6B] bg-[#FAF6F0] px-3 absolute">
                OR CONTINUE WITH
              </span>
            </div>

            {/* Social Login Options: ONLY ONE FULL-WIDTH GOOGLE BUTTON (Zero Radius, Pure Sharp) */}
            <div>
              <button
                type="button"
                onClick={() => handleSocialAuth("Google")}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#DFCFC0] rounded-none text-xs font-semibold tracking-wider uppercase text-[#2C241E] transition-all cursor-pointer shadow-none active:scale-[0.99]"
              >
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Mode Switch Footer */}
            <div className="text-center mt-6">
              {mode === "signin" ? (
                <p className="text-xs text-[#7A6B5D] font-light">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="font-semibold text-[#2C241E] hover:text-[#5C4529] underline underline-offset-2 cursor-pointer transition-colors ml-1 uppercase text-xs tracking-wider"
                  >
                    Create Account
                  </button>
                </p>
              ) : (
                <p className="text-xs text-[#7A6B5D] font-light">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="font-semibold text-[#2C241E] hover:text-[#5C4529] underline underline-offset-2 cursor-pointer transition-colors ml-1 uppercase text-xs tracking-wider"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AuthCard(props: AuthCardProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-5xl mx-auto min-h-[580px] bg-[#FAF6F0] rounded-none border border-[#DFCFC0] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#5C4529]" />
        </div>
      }
    >
      <AuthCardContent {...props} />
    </Suspense>
  );
}
