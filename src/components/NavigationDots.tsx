"use client";

import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SportingEvent } from "@/lib/data";

interface NavigationDotsProps {
  events: SportingEvent[];
  activeIndex: number;
  onNavigate: (index: number) => void;
  onHome: () => void;
  showSplash: boolean;
}

export default function NavigationDots({ events, activeIndex, onNavigate, onHome, showSplash }: NavigationDotsProps) {
  return (
    <nav className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
      {/* Home button */}
      <button
        onClick={onHome}
        className="group relative flex items-center justify-end mb-2"
        aria-label="Return to splash screen"
      >
        {/* Label - shows on hover */}
        <span
          className={cn(
            "absolute right-8 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            "whitespace-nowrap pointer-events-none",
            showSplash
              ? "bg-white text-black"
              : "bg-black/50 text-white backdrop-blur-sm"
          )}
        >
          Home
        </span>

        {/* Home icon */}
        <motion.div
          className={cn(
            "w-3 h-3 flex items-center justify-center transition-all duration-300",
            showSplash
              ? "text-white scale-125"
              : "text-white/40 hover:text-white/80"
          )}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
        >
          <Home size={12} strokeWidth={2.5} />
        </motion.div>
      </button>

      {/* Separator line */}
      <div className="w-3 h-px bg-white/20 mb-1" />

      {events.map((event, index) => (
        <button
          key={event.id}
          onClick={() => onNavigate(index)}
          className="group relative flex items-center justify-end"
          aria-label={`Navigate to ${event.month}`}
        >
          {/* Month label - shows on hover */}
          <span
            className={cn(
              "absolute right-8 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              "whitespace-nowrap pointer-events-none",
              activeIndex === index
                ? "bg-white text-black"
                : "bg-black/50 text-white backdrop-blur-sm"
            )}
          >
            {event.month.slice(0, 3)}
          </span>

          {/* Dot */}
          <motion.div
            className={cn(
              "w-3 h-3 rounded-full border-2 transition-all duration-300",
              activeIndex === index
                ? "border-white bg-white scale-125"
                : event.status === "completed"
                ? "border-white/60 bg-white/40"
                : "border-white/40 bg-transparent hover:border-white/80"
            )}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            style={{
              boxShadow: activeIndex === index ? `0 0 12px ${event.themeColor}` : "none",
            }}
          />

          {/* Active indicator line */}
          {activeIndex === index && (
            <motion.div
              layoutId="activeLine"
              className="absolute right-6 w-4 h-0.5 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </button>
      ))}
    </nav>
  );
}
