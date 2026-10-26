"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function FloatingBar() {
  const [time, setTime] = useState("00:00:00");
  const [watchIndex, setWatchIndex] = useState(0);

  const [isVisible, setIsVisible] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const lastScrollY = useRef(0);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 3500); // 3.5 seconds of inactivity reappears
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const currentScroll = currentScrollY + windowHeight;

      // Within 120px of the page bottom
      const atBottom = currentScroll >= documentHeight - 120;
      setIsAtBottom(atBottom);

      if (atBottom) {
        setIsVisible(true);
      } else if (currentScrollY > 60) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down -> hide
          setIsVisible(false);
        } else {
          // Scrolling up -> show
          setIsVisible(true);
        }
      } else {
        // At top of page -> always show
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
      resetIdleTimer();
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', resetIdleTimer, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', resetIdleTimer);
      window.removeEventListener('resize', handleScroll);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000).toString().padStart(2, "0");
      const minutes = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, "0");
      const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleWatchAdvance = (e: CustomEvent) => {
      setWatchIndex(e.detail);
    };
    window.addEventListener("watchAdvance", handleWatchAdvance as EventListener);
    return () => {
      window.removeEventListener("watchAdvance", handleWatchAdvance as EventListener);
    };
  }, []);

  const handleScrollAction = () => {
    if (isAtBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ y: isVisible ? '0%' : '125%' }}
      transition={{ type: 'spring', stiffness: 110, damping: 24, mass: 1.1 }}
      className={`fixed bottom-0 left-0 right-0 w-full z-40 bg-gradient-to-r from-white/[0.15] via-white/[0.05] to-black/[0.15] backdrop-blur-[6px] border-t border-white/20 shadow-[0_-1px_0_0_rgba(255,255,255,0.2)] py-4 md:py-5 px-8 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between will-change-transform ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Force-visible Flagship Optical Glint */}
      <div
        key={watchIndex}
        className="comet-spark flex items-center"
        style={{
          position: 'absolute',
          top: '-1px', // aligned directly to the top edge
          left: 0,
          width: '520px',
          height: '4px',
          zIndex: 9999,
          pointerEvents: 'none',
          animation: 'sweepLeft 4.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        }}
      >
        {/* Diffused Ambient Bloom (Background) */}
        <div
          className="w-full h-[4px] absolute top-0 left-[2px] z-0 blur-[2px] opacity-60"
          style={{
            background: 'linear-gradient(to right, rgba(226, 192, 141, 0.8) 0%, rgba(212, 175, 55, 0.3) 50%, transparent 100%)'
          }}
        />

        {/* The Primary Laser Sheen (Core) */}
        <div
          className="w-full h-[2px] absolute top-[1px] left-[2px] z-10"
          style={{
            background: 'linear-gradient(to right, #FFFFFF 0%, rgba(255, 235, 195, 0.95) 25%, rgba(212, 175, 55, 0.6) 60%, transparent 100%)'
          }}
        />

        {/* Hotspot / Star Lens Flare (Leading Head) */}
        <div
          className="w-[3px] h-[3px] bg-white rounded-full shrink-0 relative z-20"
          style={{
            boxShadow: '0 0 12px 2px rgba(255, 255, 255, 0.9), 0 0 24px 4px rgba(212, 175, 55, 0.6)'
          }}
        />
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes sweepLeft {
          0% {
            transform: translateX(100vw);
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateX(-520px);
            opacity: 0;
          }
        }
      `}} />

      <div className="flex flex-col relative z-10">
        <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#4A4641]/80">
          TIME SPENT WITH US
        </span>
        <span className="font-mono tabular-nums text-sm lg:text-base tracking-widest text-[#1E1B18] font-normal mt-0.5">
          {time}
        </span>
      </div>
      <button
        type="button"
        onClick={handleScrollAction}
        className="flex items-center gap-3 cursor-pointer group relative z-10 bg-transparent border-0 outline-none text-left"
        aria-label={isAtBottom ? "Scroll to top" : "Scroll to explore"}
      >
        <span className="text-[11px] lg:text-xs tracking-[0.22em] uppercase font-medium text-white/90 drop-shadow-sm select-none transition-colors group-hover:text-white">
          {isAtBottom ? "SCROLL TO TOP" : "SCROLL TO EXPLORE"}
        </span>
        <div className={`w-6 h-6 flex items-center justify-center rounded-full border border-white/70 text-white ${isAtBottom ? '' : 'animate-bounce'}`}>
          <ArrowDown
            size={14}
            className={`transform transition-transform duration-500 ease-out ${
              isAtBottom ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </div>
      </button>
    </motion.div>
  );
}
