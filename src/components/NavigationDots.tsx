"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SportingEvent } from "@/lib/data";

interface NavigationDotsProps {
  events: SportingEvent[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export default function NavigationDots({ events, activeIndex, onNavigate }: NavigationDotsProps) {
  return (
    <nav className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
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
