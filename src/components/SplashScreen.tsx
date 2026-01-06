"use client";

import { motion } from "framer-motion";

interface SplashScreenProps {
  onEnter: () => void;
}

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 cursor-pointer"
      onClick={onEnter}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/JG1.jpeg)" }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-white text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl leading-tight"
        >
          Jacki & Graeme&apos;s 2026 Sporting Odyssey
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="mt-6 text-lg md:text-xl lg:text-2xl text-white/80 max-w-2xl leading-relaxed"
        >
          It&apos;s a big year - so we decided to have a big year. At least one sporting event every month. Follow along with us..
        </motion.p>

        {/* Tap hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.span
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-sm uppercase tracking-[0.3em] text-white/60"
          >
            Tap anywhere to begin
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
