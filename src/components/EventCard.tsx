"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Target, Clock, Route, Mountain, Images } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SportingEvent } from "@/lib/data";

interface EventCardProps {
  event: SportingEvent;
  index: number;
}

function calculateTimeRemaining(targetDate: string) {
  const target = new Date(targetDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, passed: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, passed: false };
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeRemaining.passed) {
    return <span className="text-sm uppercase tracking-widest">Event Started</span>;
  }

  return (
    <div className="flex gap-6 font-mono">
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold">{timeRemaining.days}</div>
        <div className="text-xs uppercase tracking-widest opacity-70">Days</div>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold">{timeRemaining.hours}</div>
        <div className="text-xs uppercase tracking-widest opacity-70">Hours</div>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold">{timeRemaining.minutes}</div>
        <div className="text-xs uppercase tracking-widest opacity-70">Min</div>
      </div>
    </div>
  );
}

function UpcomingCard({ event }: { event: SportingEvent }) {
  return (
    <div
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${event.images[0]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Content */}
      <div className="relative z-10 text-white text-center px-6 max-w-4xl">
        {/* Large hollow month text */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[15vw] md:text-[12vw] font-black uppercase leading-none tracking-tighter"
          style={{
            WebkitTextStroke: "2px white",
            WebkitTextFillColor: "transparent",
          }}
        >
          {event.month}
        </motion.h1>

        {/* Event title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl md:text-4xl font-bold mt-4 mb-2"
        >
          {event.title}
        </motion.h2>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-2 text-white/80 mb-8"
        >
          <MapPin size={18} />
          <span className="text-lg">{event.location}</span>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <CountdownTimer targetDate={event.date} />
        </motion.div>

        {/* Target pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/30 backdrop-blur-sm"
          style={{ backgroundColor: `${event.themeColor}33` }}
        >
          <Target size={18} />
          <span className="uppercase tracking-widest text-sm font-semibold">Upcoming Challenge</span>
        </motion.div>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-center gap-2 mt-6 text-white/60"
        >
          <Calendar size={16} />
          <span className="text-sm">{event.date}</span>
        </motion.div>
      </div>
    </div>
  );
}

function CompletedCard({ event }: { event: SportingEvent }) {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <>
      <div className="relative h-screen w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left side - Image */}
        <div
          className="relative h-[50vh] md:h-full"
          style={{
            backgroundImage: `url(${event.images[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 md:bg-gradient-to-r md:from-transparent md:to-white/10" />

          {/* Month overlay on image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-[20vw] md:text-[10vw] font-black uppercase text-white/20 leading-none tracking-tighter"
            >
              {event.month.slice(0, 3)}
            </motion.span>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="h-[50vh] md:h-full bg-white text-black flex flex-col justify-center px-8 md:px-12 lg:px-16 py-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Completed badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs uppercase tracking-widest font-semibold mb-6"
              style={{ backgroundColor: event.themeColor }}
            >
              <span>Completed</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-2 tracking-tight">
              {event.title}
            </h2>

            {/* Location & Date */}
            <div className="flex flex-wrap gap-4 text-gray-600 mb-8">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{event.date}</span>
              </div>
            </div>

            {/* Stats Grid */}
            {event.stats && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {event.stats.distance && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Route className="mx-auto mb-2 text-gray-400" size={20} />
                    <div className="text-2xl md:text-3xl font-bold" style={{ color: event.themeColor }}>
                      {event.stats.distance}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-gray-500">Distance</div>
                  </div>
                )}
                {event.stats.time && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="mx-auto mb-2 text-gray-400" size={20} />
                    <div className="text-2xl md:text-3xl font-bold" style={{ color: event.themeColor }}>
                      {event.stats.time}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-gray-500">Time</div>
                  </div>
                )}
                {event.stats.elevation && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Mountain className="mx-auto mb-2 text-gray-400" size={20} />
                    <div className="text-2xl md:text-3xl font-bold" style={{ color: event.themeColor }}>
                      {event.stats.elevation}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-gray-500">Elevation</div>
                  </div>
                )}
              </div>
            )}

            {/* Story */}
            {event.story && (
              <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base">
                {event.story}
              </p>
            )}

            {/* Gallery button */}
            {event.images.length > 1 && (
              <button
                onClick={() => setShowGallery(true)}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-full",
                  "border-2 border-gray-200 hover:border-gray-400",
                  "transition-colors duration-200"
                )}
              >
                <Images size={18} />
                <span className="text-sm font-semibold">View Gallery ({event.images.length - 1} more)</span>
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowGallery(false)}
        >
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {event.images.map((image, idx) => (
                <motion.img
                  key={idx}
                  src={image}
                  alt={`${event.title} - Image ${idx + 1}`}
                  className="w-full aspect-square object-cover rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                />
              ))}
            </div>
            <p className="text-white/60 text-center mt-4 text-sm">Click anywhere to close</p>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default function EventCard({ event, index }: EventCardProps) {
  return (
    <section
      id={event.id}
      className="snap-start h-screen w-full"
      style={{ "--theme-color": event.themeColor } as React.CSSProperties}
    >
      {event.status === "completed" ? (
        <CompletedCard event={event} />
      ) : (
        <UpcomingCard event={event} />
      )}
    </section>
  );
}
