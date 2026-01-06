import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

import { fetchStravaData, ProcessedStravaData } from "../src/lib/strava";

// Read the data file to find events with stravaActivityId
const DATA_FILE = path.join(process.cwd(), "src", "lib", "data.ts");

interface EventToSync {
  eventId: string;
  stravaActivityId: string;
}

function findEventsToSync(): EventToSync[] {
  const content = fs.readFileSync(DATA_FILE, "utf-8");

  // Find all events with stravaActivityId
  const events: EventToSync[] = [];

  // Split by event objects in the array - each event starts with "{"
  // and look for id and stravaActivityId within each block
  const eventBlockRegex = /\{\s*id:\s*["']([^"']+)["'][\s\S]*?stravaActivityId:\s*["'](\d+)["'][\s\S]*?\n\s*\}/g;
  let match;

  while ((match = eventBlockRegex.exec(content)) !== null) {
    events.push({
      eventId: match[1],
      stravaActivityId: match[2],
    });
  }

  return events;
}

function updateDataFile(eventId: string, stravaData: ProcessedStravaData) {
  let content = fs.readFileSync(DATA_FILE, "utf-8");

  // Create the strava data object string
  const stravaDataStr = `strava: {
      activityId: "${stravaData.activityId}",
      distance: ${stravaData.distance},
      movingTime: ${stravaData.movingTime},
      elapsedTime: ${stravaData.elapsedTime},
      elevationGain: ${stravaData.elevationGain},${
        stravaData.mapPolyline
          ? `
      mapPolyline: "${stravaData.mapPolyline}",`
          : ""
      }${
        stravaData.startLatlng
          ? `
      startLatlng: [${stravaData.startLatlng[0]}, ${stravaData.startLatlng[1]}],`
          : ""
      }${
        stravaData.photos && stravaData.photos.length > 0
          ? `
      photos: [
        ${stravaData.photos.map((p) => `{ url: "${p.url}"${p.caption ? `, caption: "${p.caption.replace(/"/g, '\\"')}"` : ""} }`).join(",\n        ")}
      ],`
          : ""
      }
    }`;

  // Find the event block by looking for id and stravaActivityId
  // Use a different approach: find the line with stravaActivityId for this event
  const lines = content.split("\n");
  let eventStartLine = -1;
  let stravaActivityLine = -1;
  let eventEndLine = -1;
  let braceCount = 0;
  let inTargetEvent = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line starts an event with the target id
    if (line.includes(`id: "${eventId}"`) || line.includes(`id: '${eventId}'`)) {
      // Find the opening brace (might be on previous line or same line)
      for (let j = i; j >= 0; j--) {
        if (lines[j].includes("{")) {
          eventStartLine = j;
          break;
        }
      }
      inTargetEvent = true;
      // Count braces from the event start line to current position
      braceCount = 0;
      for (let j = eventStartLine; j <= i; j++) {
        for (const char of lines[j]) {
          if (char === "{") braceCount++;
          if (char === "}") braceCount--;
        }
      }
      // Check if stravaActivityId is on this same line
      if (line.includes("stravaActivityId:")) {
        stravaActivityLine = i;
      }
      continue;
    }

    if (inTargetEvent) {
      // Count braces to find event end
      for (const char of line) {
        if (char === "{") braceCount++;
        if (char === "}") braceCount--;
      }

      if (line.includes("stravaActivityId:")) {
        stravaActivityLine = i;
      }

      if (braceCount === 0) {
        eventEndLine = i;
        break;
      }
    }
  }

  if (eventStartLine === -1 || stravaActivityLine === -1 || eventEndLine === -1) {
    console.log(`   ⚠️  Could not find event ${eventId} with stravaActivityId in data.ts`);
    return;
  }

  // Check if strava data already exists (look for "strava:" between stravaActivityId and end)
  let hasExistingStrava = false;
  let stravaStartLine = -1;
  let stravaEndLine = -1;

  for (let i = stravaActivityLine + 1; i <= eventEndLine; i++) {
    if (lines[i].includes("strava:")) {
      hasExistingStrava = true;
      stravaStartLine = i;
      // Find the end of the strava object
      let stravaBraceCount = 0;
      for (let j = i; j <= eventEndLine; j++) {
        for (const char of lines[j]) {
          if (char === "{") stravaBraceCount++;
          if (char === "}") stravaBraceCount--;
        }
        if (stravaBraceCount === 0 && lines[j].includes("}")) {
          stravaEndLine = j;
          break;
        }
      }
      break;
    }
  }

  if (hasExistingStrava && stravaStartLine !== -1 && stravaEndLine !== -1) {
    // Replace existing strava data
    const newLines = [
      ...lines.slice(0, stravaStartLine),
      "    " + stravaDataStr,
      ...lines.slice(stravaEndLine + 1),
    ];
    content = newLines.join("\n");
  } else {
    // Add strava data after stravaActivityId line
    const newLines = [
      ...lines.slice(0, stravaActivityLine + 1),
      "    " + stravaDataStr + ",",
      ...lines.slice(stravaActivityLine + 1),
    ];
    content = newLines.join("\n");
  }

  fs.writeFileSync(DATA_FILE, content);
  console.log(`   ✅ Updated data.ts for event: ${eventId}`);
}

async function syncSingleActivity(activityId: string) {
  console.log(`\nFetching activity: ${activityId}`);

  try {
    const data = await fetchStravaData(activityId);

    console.log("\n📊 Activity Data:");
    console.log(`   Distance: ${(data.distance / 1000).toFixed(2)} km`);
    console.log(`   Moving Time: ${Math.floor(data.movingTime / 60)} min`);
    console.log(`   Elevation: ${Math.round(data.elevationGain)} m`);
    console.log(`   Has Map: ${data.mapPolyline ? "Yes" : "No"}`);
    console.log(`   Photos: ${data.photos?.length || 0}`);

    console.log("\n📋 JSON Output (for manual update):");
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error(`❌ Failed to fetch activity:`, error);
    throw error;
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  🏃 Strava Data Sync");
  console.log("═══════════════════════════════════════════════════════════");

  const args = process.argv.slice(2);

  // If an activity ID is provided directly, just fetch and display it
  if (args.length > 0 && /^\d+$/.test(args[0])) {
    await syncSingleActivity(args[0]);
    return;
  }

  // Otherwise, sync all events that have stravaActivityId
  const eventsToSync = findEventsToSync();

  if (eventsToSync.length === 0) {
    console.log("\n⚠️  No events found with stravaActivityId.");
    console.log("   Add stravaActivityId to an event in src/lib/data.ts first.");
    console.log("\n   Example:");
    console.log('   stravaActivityId: "1234567890",');
    return;
  }

  console.log(`\n📅 Found ${eventsToSync.length} event(s) to sync:\n`);
  eventsToSync.forEach((e) => console.log(`   - ${e.eventId}: ${e.stravaActivityId}`));

  let successCount = 0;
  let failCount = 0;

  for (const event of eventsToSync) {
    console.log(`\n🔄 Syncing: ${event.eventId}`);

    try {
      const stravaData = await fetchStravaData(event.stravaActivityId);

      console.log(`   Distance: ${(stravaData.distance / 1000).toFixed(2)} km`);
      console.log(`   Time: ${Math.floor(stravaData.movingTime / 60)} min`);
      console.log(`   Elevation: ${Math.round(stravaData.elevationGain)} m`);
      console.log(`   Photos: ${stravaData.photos?.length || 0}`);

      updateDataFile(event.eventId, stravaData);
      successCount++;
    } catch (error) {
      console.error(`   ❌ Failed:`, error);
      failCount++;
    }

    // Rate limiting - wait between requests
    if (eventsToSync.indexOf(event) < eventsToSync.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log(`  ✨ Sync complete!`);
  console.log(`     Success: ${successCount} | Failed: ${failCount}`);
  console.log("═══════════════════════════════════════════════════════════\n");
}

main().catch(console.error);
