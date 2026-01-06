import * as fs from "fs";
import * as path from "path";

const STRAVA_API_BASE = "https://www.strava.com/api/v3";
const TOKEN_URL = "https://www.strava.com/oauth/token";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
}

interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  map: {
    id: string;
    polyline?: string;
    summary_polyline?: string;
  };
  start_latlng?: [number, number];
  end_latlng?: [number, number];
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  photos?: {
    primary?: {
      urls?: {
        [key: string]: string;
      };
    };
    count: number;
  };
}

interface StravaPhotoResponse {
  unique_id: string;
  urls: {
    [key: string]: string;
  };
  caption?: string;
  activity_id: number;
}

// Token storage file path
const TOKEN_FILE = path.join(process.cwd(), ".strava-tokens.json");

function loadTokens(): { accessToken: string; refreshToken: string; expiresAt: number } | null {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const data = JSON.parse(fs.readFileSync(TOKEN_FILE, "utf-8"));
      return data;
    }
  } catch {
    // Ignore errors
  }
  return null;
}

function saveTokens(accessToken: string, refreshToken: string, expiresAt: number) {
  fs.writeFileSync(
    TOKEN_FILE,
    JSON.stringify({ accessToken, refreshToken, expiresAt }, null, 2)
  );
}

async function refreshAccessToken(): Promise<string> {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  let refreshToken = process.env.STRAVA_REFRESH_TOKEN;

  // Check for cached tokens
  const cached = loadTokens();
  if (cached) {
    refreshToken = cached.refreshToken;

    // If token is still valid (with 5 min buffer), return it
    if (cached.expiresAt > Date.now() / 1000 + 300) {
      return cached.accessToken;
    }
  }

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Strava credentials in environment variables");
  }

  console.log("Refreshing Strava access token...");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${response.status} - ${error}`);
  }

  const data: TokenResponse = await response.json();

  // Save new tokens
  saveTokens(data.access_token, data.refresh_token, data.expires_at);

  console.log("Token refreshed successfully");
  return data.access_token;
}

export async function getAccessToken(): Promise<string> {
  // First, try to use cached token
  const cached = loadTokens();
  if (cached && cached.expiresAt > Date.now() / 1000 + 300) {
    return cached.accessToken;
  }

  // Otherwise refresh
  return refreshAccessToken();
}

export async function getActivity(activityId: string): Promise<StravaActivity> {
  const accessToken = await getAccessToken();

  const response = await fetch(`${STRAVA_API_BASE}/activities/${activityId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch activity ${activityId}: ${response.status} - ${error}`);
  }

  return response.json();
}

export async function getActivityPhotos(activityId: string): Promise<StravaPhotoResponse[]> {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${STRAVA_API_BASE}/activities/${activityId}/photos?size=1024`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    // Photos endpoint might fail, return empty array
    console.warn(`Failed to fetch photos for activity ${activityId}`);
    return [];
  }

  return response.json();
}

// Fetch detailed GPS stream for high-resolution route
interface StravaStream {
  type: string;
  data: number[] | [number, number][];
  series_type: string;
  original_size: number;
  resolution: string;
}

export async function getActivityStreams(activityId: string): Promise<[number, number][] | null> {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${STRAVA_API_BASE}/activities/${activityId}/streams?keys=latlng&key_by_type=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    console.warn(`Failed to fetch streams for activity ${activityId}`);
    return null;
  }

  const data = await response.json();
  return data.latlng?.data || null;
}

// Encode lat/lng array to polyline format
// Using Google's polyline encoding algorithm
function encodePolyline(coordinates: [number, number][]): string {
  let encoded = "";
  let prevLat = 0;
  let prevLng = 0;

  for (const [lat, lng] of coordinates) {
    // Round to 5 decimal places and convert to integer
    const latInt = Math.round(lat * 1e5);
    const lngInt = Math.round(lng * 1e5);

    // Calculate deltas
    const dLat = latInt - prevLat;
    const dLng = lngInt - prevLng;

    prevLat = latInt;
    prevLng = lngInt;

    // Encode each delta
    encoded += encodeSignedNumber(dLat);
    encoded += encodeSignedNumber(dLng);
  }

  return encoded;
}

function encodeSignedNumber(num: number): string {
  // Left-shift and invert if negative
  let sgn_num = num << 1;
  if (num < 0) {
    sgn_num = ~sgn_num;
  }

  return encodeNumber(sgn_num);
}

function encodeNumber(num: number): string {
  let encoded = "";

  while (num >= 0x20) {
    encoded += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
    num >>= 5;
  }

  encoded += String.fromCharCode(num + 63);
  return encoded;
}

export interface ProcessedStravaData {
  activityId: string;
  distance: number;
  movingTime: number;
  elapsedTime: number;
  elevationGain: number;
  mapPolyline?: string;
  startLatlng?: [number, number];
  photos?: { url: string; caption?: string }[];
}

export async function fetchStravaData(activityId: string): Promise<ProcessedStravaData> {
  console.log(`Fetching Strava activity: ${activityId}`);

  // Fetch activity details, photos, and high-res GPS streams in parallel
  const [activity, photos, streams] = await Promise.all([
    getActivity(activityId),
    getActivityPhotos(activityId),
    getActivityStreams(activityId),
  ]);

  const processedPhotos = photos.map((photo) => ({
    url: photo.urls["1024"] || photo.urls["600"] || Object.values(photo.urls)[0],
    caption: photo.caption,
  }));

  // Use high-resolution stream data if available, otherwise fall back to summary polyline
  let mapPolyline: string | undefined;
  if (streams && streams.length > 0) {
    console.log(`Encoding ${streams.length} GPS points from streams API`);
    mapPolyline = encodePolyline(streams);
  } else {
    console.log("Using summary polyline (streams not available)");
    mapPolyline = activity.map?.polyline || activity.map?.summary_polyline;
  }

  return {
    activityId,
    distance: activity.distance,
    movingTime: activity.moving_time,
    elapsedTime: activity.elapsed_time,
    elevationGain: activity.total_elevation_gain,
    mapPolyline,
    startLatlng: activity.start_latlng,
    photos: processedPhotos.length > 0 ? processedPhotos : undefined,
  };
}
