"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const watches = [
  "/assets/AP.png",
  "/assets/richard MIlle.png",
  "/assets/Rolex Daytona.png",
];

export default function WatchCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const CYCLE_DURATION = 5200;

    const advanceSlide = () => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % watches.length;
        if (typeof window !== "undefined") {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("watchAdvance", { detail: nextIndex }));
          }, 0);
        }
        return nextIndex;
      });
    };

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        // Restart cycle cleanly from the current active index without skipping
        timer = setInterval(advanceSlide, CYCLE_DURATION);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibility);
    timer = setInterval(advanceSlide, CYCLE_DURATION);
    
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const transitionConfig = {
    duration: 2.2,
    ease: [0.4, 0, 0.2, 1],
  };

  // The 'spoke' rotates the container
  const spokeVariants = {
    enter: {
      rotate: 60, // Reduced from 80 to ensure it appears in viewport faster
      opacity: 1,
    },
    center: {
      rotate: 0,
      opacity: 1,
      transition: {
        rotate: transitionConfig,
        opacity: { duration: 0.1 },
      },
    },
    exit: {
      rotate: -60, // Reduced from 80
      opacity: 0.99, // Changed slightly from 1 to force the extended duration
      transition: {
        rotate: transitionConfig,
        // Hold the mount for exactly 5.2s (the full loop cycle) 
        // so it stays at the bottom left and unmounts only when the next watch triggers its exit
        opacity: { duration: 5.2 }, 
      },
    },
  };

  // The 'seat' counter-rotates. 
  // Enter: -60 (spoke 60) -> perfectly upright (0 total).
  // Center: 0 (spoke 0) -> perfectly upright (0 total).
  // Exit: 40 (spoke -60) -> total rotation is -20deg (counter-clockwise tilt).
  const seatVariants = {
    enter: {
      rotate: -60,
    },
    center: {
      rotate: 0,
      transition: transitionConfig,
    },
    exit: {
      rotate: 40,
      transition: transitionConfig,
    },
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-visible">
      {/* mode="popLayout" guarantees they animate concurrently without delay */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          variants={spokeVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ transformOrigin: "50% 250%" }}
          className="absolute w-[280px] h-[380px] md:w-[400px] md:h-[500px] lg:w-[480px] lg:h-[600px] z-10"
        >
          <motion.div
            variants={seatVariants}
            className="w-full h-full relative drop-shadow-[0_45px_45px_rgba(0,0,0,0.35)]"
          >
            <Image
              src={watches[currentIndex]}
              alt="Luxury Watch"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
