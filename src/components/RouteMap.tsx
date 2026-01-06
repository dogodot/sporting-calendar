"use client";

import { useState } from "react";
import { Map, ExternalLink } from "lucide-react";

interface RouteMapProps {
  polyline: string;
  activityId: string;
  themeColor: string;
}

// Encode polyline for URL (handle special chars)
function encodePolylineForUrl(polyline: string): string {
  return encodeURIComponent(polyline);
}

export default function RouteMap({ polyline, activityId, themeColor }: RouteMapProps) {
  const [imageError, setImageError] = useState(false);

  // Get Mapbox token from environment
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Fallback if no token or image error
  if (!mapboxToken || imageError) {
    return (
      <a
        href={`https://www.strava.com/activities/${activityId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors group"
      >
        <div className="text-center text-gray-500 group-hover:text-gray-700">
          <Map className="mx-auto mb-2" size={32} />
          <span className="text-sm">View route on Strava</span>
          <ExternalLink className="inline-block ml-1" size={14} />
        </div>
      </a>
    );
  }

  // Build Mapbox Static Images URL
  // Using satellite-streets style for aerial imagery with labels
  const strokeColor = themeColor.replace("#", "");
  const encodedPolyline = encodePolylineForUrl(polyline);

  // Mapbox Static API URL - satellite imagery with route overlay
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/path-5+${strokeColor}-1(${encodedPolyline})/auto/600x600@2x?padding=60&access_token=${mapboxToken}`;

  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden group">
      <a
        href={`https://www.strava.com/activities/${activityId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <img
          src={mapUrl}
          alt="Activity route map"
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white flex items-center gap-2">
            <span className="text-sm font-medium">View on Strava</span>
            <ExternalLink size={16} />
          </div>
        </div>
      </a>
    </div>
  );
}
