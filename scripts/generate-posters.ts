import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Configuration
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.0-flash-exp"; // Image generation model

if (!API_KEY) {
  console.error("❌ Error: GEMINI_API_KEY is missing from .env.local");
  console.error("   Please add: GEMINI_API_KEY=your_api_key_here");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Event data for poster generation
interface PosterEvent {
  id: string;
  month: string;
  title: string;
  location: string;
  vibe: string;
  themeColor: string;
}

const posterEvents: PosterEvent[] = [
  {
    id: "january",
    month: "January",
    title: "New Year's Day Marathon",
    location: "Sydney, Australia",
    vibe: "Sunrise over harbour, summer heat, celebration, fresh start",
    themeColor: "#FF6B35",
  },
  {
    id: "february",
    month: "February",
    title: "Alpine Ski Challenge",
    location: "Zermatt, Switzerland",
    vibe: "Snowy peaks, crisp alpine air, powder snow, Matterhorn silhouette",
    themeColor: "#4ECDC4",
  },
  {
    id: "march",
    month: "March",
    title: "Tokyo City Cycling Tour",
    location: "Tokyo, Japan",
    vibe: "Cherry blossoms, neon lights, urban cycling, modern meets traditional",
    themeColor: "#FF1744",
  },
  {
    id: "april",
    month: "April",
    title: "Paris Marathon",
    location: "Paris, France",
    vibe: "Springtime elegance, historic monuments, romantic cityscape, morning mist",
    themeColor: "#7B68EE",
  },
  {
    id: "may",
    month: "May",
    title: "Scottish Highlands Ultra",
    location: "Highlands, Scotland",
    vibe: "Rugged terrain, misty glens, ancient castles, wild untamed nature",
    themeColor: "#2E8B57",
  },
  {
    id: "june",
    month: "June",
    title: "Midnight Sun Triathlon",
    location: "Tromsø, Norway",
    vibe: "Endless daylight, arctic waters, fjords, surreal golden hour",
    themeColor: "#FFD700",
  },
  {
    id: "july",
    month: "July",
    title: "Tour de Mont Blanc",
    location: "Chamonix, France",
    vibe: "Towering peaks, glacial valleys, alpine meadows, extreme elevation",
    themeColor: "#1E90FF",
  },
  {
    id: "august",
    month: "August",
    title: "Open Water Swimming Championship",
    location: "Santorini, Greece",
    vibe: "Crystal blue waters, white cliffs, volcanic caldera, Mediterranean heat",
    themeColor: "#00CED1",
  },
  {
    id: "september",
    month: "September",
    title: "Berlin Marathon",
    location: "Berlin, Germany",
    vibe: "Historic streets, Brandenburg Gate, urban energy, autumn leaves",
    themeColor: "#FF4500",
  },
  {
    id: "october",
    month: "October",
    title: "Great Wall Adventure Run",
    location: "Beijing, China",
    vibe: "Ancient stone steps, misty mountains, fall colors, epic scale",
    themeColor: "#DC143C",
  },
  {
    id: "november",
    month: "November",
    title: "New York City Marathon",
    location: "New York, USA",
    vibe: "Five boroughs, iconic skyline, crowd energy, urban grit",
    themeColor: "#4169E1",
  },
  {
    id: "december",
    month: "December",
    title: "Cape Town Cycle Tour",
    location: "Cape Town, South Africa",
    vibe: "Table Mountain, coastal roads, summer sun, diverse landscapes",
    themeColor: "#32CD32",
  },
];

async function generatePoster(event: PosterEvent): Promise<boolean> {
  const prompt = `Create a cinematic, minimalist sporting event poster for "${event.title}" in ${event.location}.

Style requirements:
- Swiss International Style graphic design
- Bold geometric composition
- High contrast with matte texture
- Primary color accent: ${event.themeColor}
- Atmospheric mood: ${event.vibe}
- No text overlays - purely visual composition
- Aspect ratio: portrait (2:3)
- Professional sports photography aesthetic meets graphic design

The image should evoke the spirit of the location and sport, creating anticipation for the event.`;

  console.log(`\n🎨 Generating poster for: ${event.month} - ${event.title}...`);

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseModalities: ["image", "text"],
      },
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const imagePart = candidate.content.parts.find((p: any) => p.inlineData);

      if (imagePart?.inlineData?.data) {
        const buffer = Buffer.from(imagePart.inlineData.data, "base64");
        const outputPath = path.join(
          process.cwd(),
          "public",
          "posters",
          `${event.id}.png`
        );

        // Ensure directory exists
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });

        fs.writeFileSync(outputPath, buffer);
        console.log(`   ✅ Saved: ${outputPath}`);
        return true;
      }
    }

    console.log(`   ⚠️  No image data in response for ${event.title}`);
    return false;
  } catch (error) {
    console.error(`   ❌ Failed to generate for ${event.title}:`, error);
    return false;
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  🏃 2026 Sporting Odyssey - Poster Generator");
  console.log("  Using Gemini AI for Swiss-style poster art");
  console.log("═══════════════════════════════════════════════════════════");

  const args = process.argv.slice(2);
  let eventsToGenerate = posterEvents;

  // Allow generating specific month(s)
  if (args.length > 0) {
    const monthFilter = args.map((a) => a.toLowerCase());
    eventsToGenerate = posterEvents.filter((e) =>
      monthFilter.includes(e.id.toLowerCase()) ||
      monthFilter.includes(e.month.toLowerCase())
    );

    if (eventsToGenerate.length === 0) {
      console.error(`\n❌ No matching months found for: ${args.join(", ")}`);
      console.log("\nAvailable months:");
      posterEvents.forEach((e) => console.log(`  - ${e.month} (${e.id})`));
      process.exit(1);
    }
  }

  console.log(`\n📅 Generating ${eventsToGenerate.length} poster(s)...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const event of eventsToGenerate) {
    const success = await generatePoster(event);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Rate limiting - wait between requests
    if (eventsToGenerate.indexOf(event) < eventsToGenerate.length - 1) {
      console.log("   ⏳ Waiting before next request...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log(`  ✨ Generation complete!`);
  console.log(`     Success: ${successCount} | Failed: ${failCount}`);
  console.log("═══════════════════════════════════════════════════════════\n");
}

main().catch(console.error);
