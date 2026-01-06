"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Target, Clock, Route, Mountain, Images, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistance, formatTime, formatElevation } from "@/lib/data";
import type { SportingEvent } from "@/lib/data";
import RouteMap from "./RouteMap";

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
  const isTBC = event.title === "TBC";

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
          className={cn(
            "text-2xl md:text-4xl font-bold mt-4 mb-2",
            isTBC && "text-white/50 italic"
          )}
        >
          {isTBC ? "To Be Confirmed" : event.title}
        </motion.h2>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-2 text-white/80 mb-4"
        >
          <MapPin size={18} />
          <span className="text-lg">{isTBC ? "Location TBC" : event.location}</span>
        </motion.div>

        {/* Stats for confirmed events */}
        {!isTBC && event.stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex justify-center gap-8 mb-6"
          >
            {event.stats.distance && (
              <div>
                <div className="text-2xl md:text-3xl font-black" style={{ color: event.themeColor }}>
                  {event.stats.distance}
                </div>
                <div className="text-xs uppercase tracking-widest text-white/60">Distance</div>
              </div>
            )}
            {event.stats.elevation && (
              <div>
                <div className="text-2xl md:text-3xl font-black" style={{ color: event.themeColor }}>
                  {event.stats.elevation}
                </div>
                <div className="text-xs uppercase tracking-widest text-white/60">Elevation</div>
              </div>
            )}
          </motion.div>
        )}

        {/* Story for confirmed events */}
        {!isTBC && event.story && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/70 text-sm md:text-base max-w-2xl mx-auto mb-6 leading-relaxed"
          >
            {event.story}
          </motion.p>
        )}

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-6"
        >
          <CountdownTimer targetDate={event.date} />
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/30 backdrop-blur-sm"
            style={{ backgroundColor: `${event.themeColor}33` }}
          >
            <Target size={18} />
            <span className="uppercase tracking-widest text-sm font-semibold">
              {isTBC ? "Planning" : "Upcoming Challenge"}
            </span>
          </div>

          {/* Website link(s) for confirmed events */}
          {!isTBC && event.website && (
            <a
              href={event.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: event.themeColor }}
            >
              <span>Event Info</span>
              <ExternalLink size={14} />
            </a>
          )}
          {/* Multiple website links */}
          {!isTBC && event.websites && event.websites.map((site, idx) => (
            <a
              key={idx}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: event.themeColor }}
            >
              <span>{site.name}</span>
              <ExternalLink size={12} />
            </a>
          ))}
        </motion.div>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center justify-center gap-2 mt-6 text-white/60"
        >
          <Calendar size={16} />
          <span className="text-sm">{isTBC ? `${event.month} 2026` : event.date}</span>
        </motion.div>
      </div>
    </div>
  );
}

function CompletedCard({ event }: { event: SportingEvent }) {
  const [showGallery, setShowGallery] = useState(false);

  // Check if we have multiple participants or legacy single strava data
  const hasParticipants = event.participants && event.participants.length > 0;
  const hasLegacyStrava = !!event.strava;

  // For display purposes, get stats from first participant or legacy strava
  const primaryStrava = hasParticipants
    ? event.participants![0].strava
    : event.strava;

  // For single-person display (fallback)
  const distance = primaryStrava
    ? formatDistance(primaryStrava.distance)
    : event.stats?.distance;
  const elevation = primaryStrava
    ? formatElevation(primaryStrava.elevationGain)
    : event.stats?.elevation;

  // Get all Strava photos from all participants
  const stravaPhotos = hasParticipants
    ? event.participants!.flatMap((p) => p.strava.photos || [])
    : event.strava?.photos || [];

  // Combine local images with Strava photos for gallery
  const allImages = [
    ...event.images,
    ...stravaPhotos.map((p) => p.url),
  ];

  // Find the participant with a route map (for display)
  const participantWithMap = hasParticipants
    ? event.participants!.find((p) => p.strava.mapPolyline)
    : null;
  const mapPolyline = participantWithMap?.strava.mapPolyline || event.strava?.mapPolyline;
  const mapActivityId = participantWithMap?.strava.activityId || event.strava?.activityId;

  return (
    <>
      <div className="relative h-screen w-full overflow-hidden bg-white">
        {/* Background poster image with overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url(${event.images[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Main content grid */}
        <div className="relative h-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 md:p-10 lg:p-12">
          {/* Left column - Title, stats, story */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Month label */}
              <div
                className="text-xs uppercase tracking-[0.3em] font-semibold mb-2"
                style={{ color: event.themeColor }}
              >
                {event.month} 2026
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 tracking-tight text-gray-900">
                {event.title}
              </h2>

              {/* Location & Date */}
              <div className="flex flex-wrap gap-4 text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span className="text-sm">{event.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span className="text-sm">{event.date}</span>
                </div>
              </div>

              {/* Stats Row - Multiple Participants */}
              {hasParticipants ? (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  {/* Shared stats header */}
                  <div className="flex gap-6 mb-4">
                    <div>
                      <div className="text-2xl md:text-3xl font-black" style={{ color: event.themeColor }}>
                        {distance}
                      </div>
                      <div className="text-xs uppercase tracking-widest text-gray-400">Distance</div>
                    </div>
                    {elevation && (
                      <div>
                        <div className="text-2xl md:text-3xl font-black" style={{ color: event.themeColor }}>
                          {elevation}
                        </div>
                        <div className="text-xs uppercase tracking-widest text-gray-400">Elevation</div>
                      </div>
                    )}
                  </div>
                  {/* Individual participant times */}
                  <div className="space-y-2">
                    {event.participants!.map((participant, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-600 w-16">{participant.name}</span>
                        <div className="text-lg md:text-xl font-black" style={{ color: event.themeColor }}>
                          {formatTime(participant.strava.movingTime)}
                        </div>
                        <a
                          href={`https://www.strava.com/activities/${participant.strava.activityId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FC4C02] hover:text-[#e04400] transition-colors"
                          title={`View ${participant.name}'s activity on Strava`}
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (distance || elevation) && (
                <div className="flex gap-6 mb-6 pb-6 border-b border-gray-200">
                  {distance && (
                    <div>
                      <div className="text-2xl md:text-3xl font-black" style={{ color: event.themeColor }}>
                        {distance}
                      </div>
                      <div className="text-xs uppercase tracking-widest text-gray-400">Distance</div>
                    </div>
                  )}
                  {primaryStrava && (
                    <div>
                      <div className="text-2xl md:text-3xl font-black" style={{ color: event.themeColor }}>
                        {formatTime(primaryStrava.movingTime)}
                      </div>
                      <div className="text-xs uppercase tracking-widest text-gray-400">Time</div>
                    </div>
                  )}
                  {elevation && (
                    <div>
                      <div className="text-2xl md:text-3xl font-black" style={{ color: event.themeColor }}>
                        {elevation}
                      </div>
                      <div className="text-xs uppercase tracking-widest text-gray-400">Elevation</div>
                    </div>
                  )}
                </div>
              )}

              {/* Story */}
              {event.story && (
                <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">
                  {event.story}
                </p>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs uppercase tracking-widest font-semibold"
                  style={{ backgroundColor: event.themeColor }}
                >
                  <span>Completed</span>
                </div>
                {/* Legacy single Strava link */}
                {!hasParticipants && event.strava && (
                  <a
                    href={`https://www.strava.com/activities/${event.strava.activityId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#FC4C02] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#e04400] transition-colors"
                  >
                    <span>Strava</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right column - Map and Photos grid */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4 h-full"
            >
              {/* Route Map - large square */}
              {mapPolyline && mapActivityId && (
                <div className="col-span-1 row-span-2">
                  <RouteMap
                    polyline={mapPolyline}
                    activityId={mapActivityId}
                    themeColor={event.themeColor}
                  />
                </div>
              )}

              {/* Strava Photos */}
              {stravaPhotos.length > 0 ? (
                stravaPhotos.slice(0, mapPolyline ? 2 : 4).map((photo, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => setShowGallery(true)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || `Activity photo ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    {idx === (mapPolyline ? 1 : 3) && allImages.length > (mapPolyline ? 3 : 4) && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">+{allImages.length - (mapPolyline ? 3 : 4)}</span>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                /* Poster image if no Strava photos */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className={cn(
                    "relative rounded-lg overflow-hidden",
                    mapPolyline ? "col-span-1 row-span-2" : "col-span-2 row-span-2"
                  )}
                >
                  <img
                    src={event.images[0]}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}

              {/* If no map, show poster in the grid */}
              {!mapPolyline && stravaPhotos.length === 0 && (
                <div className="col-span-2 row-span-2 relative rounded-lg overflow-hidden">
                  <img
                    src={event.images[0]}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Month overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[15vw] lg:text-[8vw] font-black uppercase text-white/30 leading-none tracking-tighter">
                      {event.month.slice(0, 3)}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setShowGallery(false)}
        >
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-white text-sm uppercase tracking-widest"
            onClick={() => setShowGallery(false)}
          >
            Close
          </button>
          <div className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allImages.map((image, idx) => (
                <motion.img
                  key={idx}
                  src={image}
                  alt={`${event.title} - Image ${idx + 1}`}
                  className="w-full aspect-square object-cover rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                />
              ))}
            </div>
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
