# 2026 Sporting Odyssey

A high-performance web application that behaves like a digital coffee-table book, showcasing the major sporting events of 2026.

## Overview

This project presents the 2026 sporting calendar as an elegant, magazine-style digital experience with smooth animations, scroll snapping, and a Swiss design aesthetic. Each month features a full-screen card that transforms from an "upcoming" preview into a rich retrospective once the event is completed.

## Tech Stack

- **Framework:** Next.js 16 (App Router) – robust routing and performance
- **Styling:** Tailwind CSS v4 – utility-first styling with Inter font family
- **Animation:** Framer Motion – smooth transitions and magazine-feel interactions
- **Icons:** Lucide React
- **Data Source:** Local TypeScript file (`lib/data.ts`) – no database required
- **Asset Generation:** Custom Node.js script using Google Gemini AI SDK

## Features

- **Snap-scrolling timeline** – Full-screen cards for each month with smooth scroll snapping
- **Dual card states:**
  - **Upcoming:** Large hollow-outlined month text, countdown timer, target pill
  - **Completed:** Split layout with stats grid, story text, and photo gallery
- **Navigation dots** – Fixed right-side navigation with month labels on hover
- **Keyboard navigation** – Arrow keys and j/k for vim-style navigation
- **Progress indicator** – Visual progress bar showing position in the year
- **AI-generated posters** – Swiss-style poster art via Gemini AI
- **Responsive design** – Works on mobile and desktop

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Gemini API key (for poster generation)

### Installation

```bash
# Clone the repository
git clone https://github.com/dogodot/sporting-calendar.git
cd sporting-calendar

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Generate placeholder posters
npm run create-placeholders

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Create a `.env.local` file with:

```
GEMINI_API_KEY=your_api_key_here
```

Get your API key at: https://makersuite.google.com/app/apikey

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with Inter font
│   ├── page.tsx         # Main timeline page
│   └── globals.css      # Global styles and Tailwind config
├── components/
│   ├── EventCard.tsx    # Main card component (upcoming/completed states)
│   └── NavigationDots.tsx # Right-side navigation
├── lib/
│   ├── data.ts          # Event data and TypeScript interfaces
│   └── utils.ts         # cn() helper for classNames
scripts/
├── generate-posters.ts  # AI poster generation script
└── create-placeholders.ts # SVG placeholder generation
public/
└── posters/             # Generated poster images
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run dev -- -p 5000` | Start dev server on port 5000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run create-placeholders` | Generate SVG placeholder posters |
| `npm run generate-posters` | Generate all AI posters |
| `npm run generate-posters march` | Generate poster for specific month |

## Updating Events

### Marking an Event as Completed

1. Open `src/lib/data.ts`
2. Find the event and update:
   ```typescript
   {
     id: "jan-2026",
     status: "completed",  // Change from "upcoming"
     stats: {
       distance: "42.195 km",
       time: "3:45:22",
       elevation: "324 m",
     },
     story: "Your retrospective story here...",
     images: ["/images/january/photo1.jpg", "/images/january/photo2.jpg"],
   }
   ```
3. Add your photos to `public/images/[month]/`

### Adding Custom Photos

For completed events, add photos to the `images` array:
```typescript
images: [
  "/images/january/hero.jpg",
  "/images/january/finish-line.jpg",
  "/images/january/medal.jpg"
]
```

## Design Philosophy

The application follows Swiss International Style principles:
- **Clean typography** – Inter font family with bold weights
- **Generous whitespace** – Breathing room for content
- **Grid-based layouts** – Structured, predictable layouts
- **Minimal color palette** – Each event has a single accent color
- **High contrast** – Dark backgrounds with bright accents
- **Focus on content hierarchy** – Large headlines, clear visual flow

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↓` / `j` | Next month |
| `↑` / `k` | Previous month |

## License

MIT
