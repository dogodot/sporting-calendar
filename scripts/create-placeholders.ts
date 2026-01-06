import * as fs from "fs";
import * as path from "path";

interface PlaceholderEvent {
  id: string;
  month: string;
  color: string;
}

const events: PlaceholderEvent[] = [
  { id: "january", month: "JAN", color: "#FF6B35" },
  { id: "february", month: "FEB", color: "#4ECDC4" },
  { id: "march", month: "MAR", color: "#FF1744" },
  { id: "april", month: "APR", color: "#7B68EE" },
  { id: "may", month: "MAY", color: "#2E8B57" },
  { id: "june", month: "JUN", color: "#FFD700" },
  { id: "july", month: "JUL", color: "#1E90FF" },
  { id: "august", month: "AUG", color: "#00CED1" },
  { id: "september", month: "SEP", color: "#FF4500" },
  { id: "october", month: "OCT", color: "#DC143C" },
  { id: "november", month: "NOV", color: "#4169E1" },
  { id: "december", month: "DEC", color: "#32CD32" },
];

function createPlaceholderSVG(event: PlaceholderEvent): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200">
  <defs>
    <linearGradient id="bg-${event.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="50%" style="stop-color:#16213e"/>
      <stop offset="100%" style="stop-color:#0f3460"/>
    </linearGradient>
    <linearGradient id="accent-${event.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${event.color};stop-opacity:0.8"/>
      <stop offset="100%" style="stop-color:${event.color};stop-opacity:0.4"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="1200" fill="url(#bg-${event.id})"/>

  <!-- Geometric shapes -->
  <circle cx="600" cy="200" r="150" fill="${event.color}" opacity="0.1"/>
  <circle cx="200" cy="1000" r="200" fill="${event.color}" opacity="0.08"/>
  <rect x="0" y="500" width="800" height="4" fill="url(#accent-${event.id})"/>
  <rect x="0" y="700" width="600" height="2" fill="${event.color}" opacity="0.3"/>

  <!-- Month text -->
  <text x="400" y="620" font-family="Inter, Arial, sans-serif" font-size="180" font-weight="900" fill="none" stroke="${event.color}" stroke-width="2" text-anchor="middle" opacity="0.6">
    ${event.month}
  </text>

  <!-- Year -->
  <text x="400" y="720" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="300" fill="white" text-anchor="middle" opacity="0.4">
    2026
  </text>

  <!-- Decorative lines -->
  <line x1="100" y1="100" x2="200" y2="100" stroke="${event.color}" stroke-width="3"/>
  <line x1="100" y1="100" x2="100" y2="200" stroke="${event.color}" stroke-width="3"/>
  <line x1="700" y1="1100" x2="600" y2="1100" stroke="${event.color}" stroke-width="3"/>
  <line x1="700" y1="1100" x2="700" y2="1000" stroke="${event.color}" stroke-width="3"/>
</svg>`;
}

function main() {
  const postersDir = path.join(process.cwd(), "public", "posters");

  // Ensure directory exists
  fs.mkdirSync(postersDir, { recursive: true });

  console.log("Creating placeholder posters...\n");

  for (const event of events) {
    const svg = createPlaceholderSVG(event);
    const outputPath = path.join(postersDir, `${event.id}.svg`);
    fs.writeFileSync(outputPath, svg);
    console.log(`✅ Created: ${outputPath}`);
  }

  console.log("\n✨ All placeholder posters created!");
  console.log("   Run 'npm run generate-posters' to replace with AI-generated images.");
}

main();
