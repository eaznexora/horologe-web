"use client";

import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CollectionsMegaMenu from "./CollectionsMegaMenu";
import MobileNavDrawer from "./MobileNavDrawer";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full flex items-center justify-between py-4 px-6 lg:px-12 absolute top-0 z-50">
        <Link href="/" className="relative block ml-2 sm:ml-4 md:ml-8 lg:ml-12 xl:ml-16 w-64 h-16 md:w-80 md:h-20 lg:w-[360px] lg:h-24">
          <Image
            src="/assets/logo.png"
            alt="Horologe Royale Logo"
            fill
            sizes="(max-width: 768px) 260px, 360px"
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-xs lg:text-[13px] tracking-[0.16em] uppercase font-medium text-[#2C241E]">
          <CollectionsMegaMenu />
          <Link href="#about" className="hover:text-[#9D7E50] transition-colors cursor-pointer">
            ABOUT US
          </Link>
          <Link href="#insights" className="hover:text-[#9D7E50] transition-colors cursor-pointer">
            INSIGHTS
          </Link>
          <Link className="hover:text-[#9D7E50] transition-colors cursor-pointer whitespace-nowrap" href="/sell-your-luxury">
            SELL YOUR LUXURY
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="h-10 flex items-center justify-center cursor-pointer select-none">
            <img 
              src="/assets/logo-button.png" 
              alt="Logo Button" 
              className="h-10 w-auto object-contain cursor-pointer hover:opacity-95 transition-opacity" 
            />
          </div>

          <Link href="/account">
            <button 
              type="button"
              className="bg-[#6D5333] hover:bg-[#574227] text-[#FAF6F0] px-6 py-2.5 text-xs lg:text-[13px] font-medium tracking-[0.12em] transition-colors duration-300 shadow-sm cursor-pointer whitespace-nowrap"
            >
              My Account
            </button>
          </Link>
        </div>

        {/* Mobile Header: Preserved appearance with Account icon and tactile Menu button */}
        <div className="md:hidden flex items-center gap-3">
          <Link
            href="/account"
            aria-label="Account"
            className="text-[#2C241E] p-1 active:scale-90 transition-transform duration-150 cursor-pointer select-none"
          >
            <User size={24} />
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="text-[#2C241E] active:scale-90 transition-transform duration-150 cursor-pointer select-none p-1"
            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Full-Width Luxury Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}

