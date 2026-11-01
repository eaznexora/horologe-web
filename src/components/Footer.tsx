"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Globe, ChevronDown } from "lucide-react";

interface FooterProps {
  hideTopStrip?: boolean;
}

export default function Footer({ hideTopStrip = false }: FooterProps = {}) {
  const [openExplore, setOpenExplore] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  const exploreLinks = [
    { label: "Home", href: "#" },
    { label: "About Us", href: "#" },
    { label: "Our Collection", href: "/collections" },
    { label: "Buying", href: "#" },
    { label: "Selling", href: "/sell-your-luxury" },
    { label: "Insights", href: "#" },
  ];

  const supportLinks = [
    { label: "FAQs", href: "#" },
    { label: "Shipping Information", href: "#" },
    { label: "Return Policy", href: "#" },
    { label: "Terms & Condition", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ];

  return (
    <footer className="w-full bg-[#E7DDD2] text-[#26221F] relative z-20 overflow-hidden font-sans pb-24 md:pb-28">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP CONTACT STRIP                                         */}
      {/* ------------------------------------------------------------- */}
      {!hideTopStrip && (
        <div className="w-full bg-[#C6B29A] text-[#3E342B]">
        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-around py-3.5 px-8 text-[15px] font-medium tracking-wide max-w-[1440px] w-[94%] mx-auto">
          {/* Phone */}
          <a
            href="tel:+919967589330"
            className="flex items-center gap-2 hover:text-[#1F1914] transition-colors"
          >
            <Phone size={15} className="fill-[#3E342B] text-[#3E342B]" />
            <span>+91 99675 89330</span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919967589330"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#1F1914] transition-colors"
          >
            <svg
              className="w-4 h-4 fill-[#3E342B]"
              viewBox="0 0 24 24"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-1.131-.065-.286-.091-.655-.213-1.131-.418-1.999-.861-3.3-2.884-3.4-3.018-.1-.133-.812-1.08-.812-2.06 0-.98.513-1.463.694-1.664.181-.202.397-.253.53-.253.133 0 .266.002.383.007.123.006.287-.046.45.344.164.39.562 1.365.61 1.465.048.1.08.217.016.35-.064.133-.096.216-.192.332-.096.116-.201.259-.288.348-.1.101-.204.212-.088.411.116.199.516.852 1.109 1.38.763.68 1.406.89 1.605.99.199.1.316.088.433-.047.117-.135.5-.583.633-.783.133-.2.266-.167.45-.1.184.067 1.168.551 1.368.651.2.1.333.15.383.234.05.083.05.483-.094.888z" />
            </svg>
            <span>+91 99675 89330</span>
          </a>

          {/* Email */}
          <a
            href="mailto:info@horologue.com"
            className="flex items-center gap-2 hover:text-[#1F1914] transition-colors"
          >
            <Globe size={15} className="text-[#3E342B]" />
            <span>info@horologue.com</span>
          </a>
        </div>

        {/* Mobile View */}
        <div className="flex md:hidden flex-col items-center py-3 px-4 text-[#765733]">
          <div className="flex justify-center items-center gap-5 sm:gap-6 py-0.5 text-[15.8px] font-normal tracking-wide">
            <a
              href="tel:+919967589330"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-[18px] h-[18px] fill-[#765733] shrink-0"
                viewBox="0 0 24 24"
              >
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <span>+91 99675 89330</span>
            </a>
            <a
              href="https://wa.me/919967589330"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-[18px] h-[18px] fill-[#765733] shrink-0"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.432 12.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.676.15-.2.301-.776.978-.951 1.178-.175.201-.351.226-.651.075-1.558-.78-2.586-1.391-3.627-3.18-.275-.472.275-.438.788-1.464.088-.175.044-.326-.022-.451-.066-.125-.676-1.63-.926-2.232-.244-.588-.492-.508-.676-.517-.175-.009-.375-.01-.575-.01s-.525.075-.8.375c-.275.3-.975.952-.975 2.325 0 1.373 1.001 2.7 1.14 2.885.14.185 1.968 3.007 4.77 4.218 1.204.519 2.144.828 2.877 1.06.809.256 1.546.22 2.129.133.65-.098 1.999-.817 2.282-1.606.283-.789.283-1.465.198-1.606-.084-.14-.284-.226-.584-.376z"
                />
              </svg>
              <span>+91 99675 89330</span>
            </a>
          </div>
          <a
            href="mailto:info@horologue.com"
            className="flex items-center justify-center gap-2.5 pt-1.5 pb-0.5 text-[15.8px] font-normal tracking-wide hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-[19px] h-[19px] fill-[#765733] shrink-0"
              viewBox="0 0 24 24"
            >
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 3.95-3.56c-.6 1.11-1.06 2.31-1.38 3.56zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-3.95 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
            </svg>
            <span>info@horologue.com</span>
          </a>
        </div>
      </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. DESKTOP VIEW                                              */}
      {/* ------------------------------------------------------------- */}
      <div className={`hidden md:block max-w-[1440px] w-[94%] mx-auto px-6 lg:px-12 ${hideTopStrip ? "pt-5 lg:pt-6" : "pt-10"} pb-6`}>
        {/* Top Sub-Header Line */}
        <div className="flex items-center justify-between text-[13px] text-[#5E5245] mb-8 font-sans max-w-[92%] mx-auto">
          <span className="tracking-wide">Horlogue Royal</span>
          <div className="border-t border-[#CDC3B5] flex-1 mx-4" />
          <span className="tracking-wide">A Higher Standard of Time</span>
        </div>

        {/* 4-Column Main Layout */}
        <div className="flex items-stretch w-full">
          {/* Column 1: Brand & Mission */}
          <div className="w-[34%] pl-6 pr-8 border-r border-[#CDC3B5] flex flex-col items-center">
            <div className="w-[250px] lg:w-[265px] h-auto mb-5 flex justify-center">
              <Image
                src="/assets/footer-logo.png"
                alt="Horologe Royale by Watch Care"
                width={265}
                height={180}
                className="w-[250px] lg:w-[265px] h-auto object-contain"
                priority
              />
            </div>
            <p className="text-[16px] leading-[1.65] text-[#3A342E] max-w-[310px] text-left">
              Horological expertise since 2010,<br />
              with authenticated timepieces<br />
              chosen for a lasting<br />
              legacy.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="w-[19%] px-7 border-r border-[#CDC3B5]">
            <h3
              style={{ fontFamily: "var(--font-sans), sans-serif" }}
              className="text-[22px] font-medium text-[#7A664E] mb-6 tracking-normal"
            >
              Explore
            </h3>
            <ul className="space-y-4 text-[17px] text-[#5C5247]">
              {exploreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-black transition-colors block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="w-[20%] px-7 border-r border-[#CDC3B5]">
            <h3
              style={{ fontFamily: "var(--font-sans), sans-serif" }}
              className="text-[22px] font-medium text-[#7A664E] mb-6 tracking-normal"
            >
              Support
            </h3>
            <ul className="space-y-4 text-[17px] text-[#5C5247]">
              <li>
                <Link
                  href="#"
                  className="hover:text-black transition-colors block"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-black transition-colors block leading-[1.38]"
                >
                  Shipping<br />Information
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-black transition-colors block"
                >
                  Return Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-black transition-colors block leading-[1.38]"
                >
                  Terms &<br />Condition
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-black transition-colors block"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Connected & Newsletter */}
          <div className="w-[27%] pl-8 pr-6">
            <h3
              style={{ fontFamily: "var(--font-sans), sans-serif" }}
              className="text-[22px] font-medium text-[#7A664E] mb-6 tracking-normal"
            >
              Stay Connected
            </h3>
            <p className="text-[14px] leading-normal text-[#5A4F44] mb-4 max-w-[280px]">
              Be the first to know about new arrivals, exclusive pieces and private offers
            </p>

            {/* Newsletter form */}
            <form onSubmit={handleSubmit} className="w-full max-w-[280px]">
              <div className="flex flex-col shadow-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="border border-[#BFAFA0] bg-[#E2D8CC] px-4 py-3 text-[15px] text-[#332E29] placeholder-[#8E8072] text-center w-full rounded-none outline-none focus:border-[#7A664E] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#6B5335] text-white text-[15px] font-normal py-3 px-4 w-full flex items-center justify-center gap-1.5 hover:bg-[#57432A] transition-colors rounded-none cursor-pointer"
                >
                  {isSubmitted ? "Thank you!" : "Submit →"}
                </button>
              </div>
            </form>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-5 mt-6 max-w-[280px]">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/assets/footer-facebook-icon.png"
                  alt="Facebook"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/assets/footer-instagram-icon.png"
                  alt="Instagram"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </a>
              <a
                href="https://wa.me/919967589330"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/assets/footer-whatsapp-icon.png"
                  alt="WhatsApp"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </a>
              <a
                href="tel:+919967589330"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/assets/footer-call-icon.png"
                  alt="Call"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="flex items-center justify-between text-[13px] text-[#5E5245] mt-8 pt-2 font-sans max-w-[92%] mx-auto">
          <span className="tracking-wide">Horologue Royal 2026. All Rights Reserved</span>
          <div className="border-t border-[#CDC3B5] flex-1 mx-4" />
          <span className="tracking-wide">Professionally Crafted by Eaz Nexora</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. MOBILE VIEW                                                */}
      {/* ------------------------------------------------------------- */}
      <div className={`block md:hidden px-6 ${hideTopStrip ? "pt-3" : "pt-5"} max-w-md mx-auto`}>
        {/* Sub-Header */}
        <div className="flex flex-col items-center w-full mb-6 font-sans">
          <span
            className="text-[19.8px] font-semibold text-[#5E5245] tracking-wide text-center"
            style={{ fontSize: '19.8px', fontWeight: 600 }}
          >
            Horlogue Royal
          </span>
          <div className="border-t border-[#CDC3B5] w-full my-2.5" />
          <span
            className="text-[19.8px] font-semibold text-[#5E5245] tracking-wide text-center"
            style={{ fontSize: '19.8px', fontWeight: 600 }}
          >
            A Higher Standard of Time
          </span>
        </div>

        {/* Brand Identity */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-[420px] sm:w-[460px] max-w-full w-full h-auto mb-5 flex justify-center">
            <Image
              src="/assets/footer-logo.png"
              alt="Horologe Royale by Watch Care"
              width={460}
              height={310}
              className="w-[420px] sm:w-[460px] max-w-full w-full h-auto object-contain mx-auto"
              priority
            />
          </div>
          <p
            className="text-[19px] font-medium leading-[1.28] text-[#332E29] max-w-[390px] w-full mx-auto text-center"
            style={{ fontSize: '19px', lineHeight: 1.28, fontWeight: 500 }}
          >
            Horological expertise since 2010,<br />
            with authenticated timepieces<br />
            chosen for a lasting legacy.
          </p>
        </div>

        {/* Collapsible Accordions (Explore & Support) */}
        <div className="w-full border-t border-[#CDC3B5]">
          {/* Explore Accordion */}
          <div className="border-b border-[#CDC3B5]">
            <button
              type="button"
              onClick={() => setOpenExplore(!openExplore)}
              className="py-4 w-full flex items-center justify-between text-[21px] font-sans font-normal text-[#765733] text-left cursor-pointer transition-colors"
            >
              <span>Explore</span>
              <ChevronDown
                size={20}
                strokeWidth={1.75}
                className={`text-[#765733] transform transition-transform duration-500 ease-out ${
                  openExplore ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.25,1,0.35,1)] ${
                openExplore ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pt-1.5 pb-4 pl-1 space-y-3 text-[15.5px] font-normal text-[#5C5247]">
                  {exploreLinks.map((item) => (
                    <div key={item.label}>
                      <Link
                        href={item.href}
                        className="hover:text-black transition-colors block py-0.5"
                      >
                        {item.label}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Support Accordion */}
          <div className="border-b border-[#CDC3B5]">
            <button
              type="button"
              onClick={() => setOpenSupport(!openSupport)}
              className="py-4 w-full flex items-center justify-between text-[21px] font-sans font-normal text-[#765733] text-left cursor-pointer transition-colors"
            >
              <span>Support</span>
              <ChevronDown
                size={20}
                strokeWidth={1.75}
                className={`text-[#765733] transform transition-transform duration-500 ease-out ${
                  openSupport ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.25,1,0.35,1)] ${
                openSupport ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pt-1.5 pb-4 pl-1 space-y-3 text-[15.5px] font-normal text-[#5C5247]">
                  {supportLinks.map((item) => (
                    <div key={item.label}>
                      <Link
                        href={item.href}
                        className="hover:text-black transition-colors block py-0.5"
                      >
                        {item.label}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stay Connected */}
        <div className="flex flex-col items-center text-center mt-7 mb-4">
          <h3
            style={{ fontFamily: "var(--font-sans), sans-serif" }}
            className="text-lg font-normal text-[#7A664E] mb-2 tracking-normal"
          >
            Stay Connected
          </h3>
          <p className="text-[13.8px] leading-normal text-[#5A4F44] max-w-[310px] mx-auto mb-4">
            Be the first to know about new arrivals, exclusive pieces and private offers
          </p>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col w-full shadow-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="border border-[#BFAFA0] bg-[#E2D8CC] px-4 py-2.5 text-xs text-[#332E29] placeholder-[#8E8072] w-full rounded-none outline-none text-center focus:border-[#7A664E] transition-colors"
              />
              <button
                type="submit"
                className="bg-[#6B5335] text-white text-xs font-normal py-2.5 px-4 w-full flex items-center justify-center gap-1.5 hover:bg-[#57432A] transition-colors rounded-none cursor-pointer mt-0"
              >
                {isSubmitted ? "Thank you!" : "Submit →"}
              </button>
            </div>
          </form>

          {/* Social Icons */}
          <div className="flex justify-center items-center gap-4 mt-6 mb-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/assets/footer-facebook-icon.png"
                alt="Facebook"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/assets/footer-instagram-icon.png"
                alt="Instagram"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
            </a>
            <a
              href="https://wa.me/919967589330"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/assets/footer-whatsapp-icon.png"
                alt="WhatsApp"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
            </a>
            <a
              href="tel:+919967589330"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/assets/footer-call-icon.png"
                alt="Call"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
            </a>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="flex flex-col items-center text-center mt-2 font-sans">
          <span className="text-[13px] text-[#5E5245] tracking-wide">
            Horologue Royal 2026. All Rights Reserved
          </span>
          <div className="border-t border-[#CDC3B5] w-full my-2.5" />
          <span className="text-[13px] text-[#5E5245] tracking-wide pb-2">
            Professionally Crafted by Eaz Nexora
          </span>
        </div>
      </div>
    </footer>
  );
}
