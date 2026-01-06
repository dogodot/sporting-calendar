"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { events } from "@/lib/data";
import EventCard from "@/components/EventCard";
import NavigationDots from "@/components/NavigationDots";
import SplashScreen from "@/components/SplashScreen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  // Handle scroll to update active index
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const scrollPosition = container.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollPosition / windowHeight);

      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < events.length) {
        setActiveIndex(newIndex);
      }

      // Hide scroll hint after first scroll
      if (scrollPosition > 50) {
        setShowScrollHint(false);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex]);

  // Navigate to specific event
  const navigateToEvent = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;

    isScrollingRef.current = true;
    setActiveIndex(index);

    container.scrollTo({
      top: index * window.innerHeight,
      behavior: "smooth",
    });

    // Reset scrolling flag after animation
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable keyboard nav while splash is showing
      if (showSplash) return;

      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        if (activeIndex < events.length - 1) {
          navigateToEvent(activeIndex + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        if (activeIndex > 0) {
          navigateToEvent(activeIndex - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, navigateToEvent, showSplash]);

  return (
    <>
      {/* Splash screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onEnter={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* Main scrolling container */}
      <main
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      >
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </main>

      {/* Navigation dots */}
      <NavigationDots
        events={events}
        activeIndex={activeIndex}
        onNavigate={navigateToEvent}
        onHome={() => setShowSplash(true)}
        showSplash={showSplash}
      />

      {/* Scroll hint - shows on first load */}
      <AnimatePresence>
        {showScrollHint && activeIndex === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center text-white/60"
          >
            <span className="text-xs uppercase tracking-widest mb-2">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current month indicator */}
      <div className="fixed top-6 left-6 z-40">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: events[activeIndex].themeColor }}
          />
          <span className="text-white/80 text-sm font-medium uppercase tracking-widest">
            {events[activeIndex].month} 2026
          </span>
        </motion.div>
      </div>

      {/* Year progress indicator */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="flex items-center gap-3 text-white/60">
          <span className="text-xs font-mono">
            {String(activeIndex + 1).padStart(2, "0")} / {String(events.length).padStart(2, "0")}
          </span>
          <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((activeIndex + 1) / events.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
