# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Been-there is a web application for visualizing travel journeys on an interactive map. It displays route animations between cities with different transport modes (airplane, train, car).

**Product Design Philosophy:**

1. **Memory Product, Not Travel Tool**: This is a "回忆型产品" (memory/retrospective product) for cherishing past journeys, not a utility for trip planning or navigation.

2. **No Real-Time Features**: Intentionally does NOT include real-time location tracking, automatic recording, or live updates. All journey data is manually entered after the fact.

3. **Manual & Ritualistic Recording**: Adding trips should be deliberate and meaningful—a conscious act of preserving memories, not passive data collection.

4. **Map Presentation is Core**: The map visualization is the primary experience. Routes are styled with time-based opacity (older trips fade away) to evoke nostalgia.

5. **Minimum Viable Product**: Focus on essential functionality only. Reject over-engineering and feature creep.

6. **Minimalist Aesthetic**: Clean, restrained design that lets the journeys tell the story.

**Tech Stack:**
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript with strict mode
- **UI**: React 19 with client components
- **Styling**: Tailwind CSS v4
- **Maps**: AMap (AutoNavi/Aliyun) JavaScript API - uses GCJ-02 coordinate system

## Development Commands

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Environment Setup

The app requires AMap API credentials. Set these in `.env.local`:
```
NEXT_PUBLIC_AMAP_KEY=your_amap_key
NEXT_PUBLIC_AMAP_SECRET_KEY=your_secret_code
```

## Architecture

### Component Structure

```
app/
├── page.tsx           # Main entry - dynamic imports with SSR disabled
├── layout.tsx         # Root layout with Geist font
└── globals.css        # Tailwind global styles

components/
├── map/               # Map components (client-only)
│   ├── AMapView.tsx           # Map container, loads AMap API
│   ├── JourneyPolyline.tsx    # Renders route polylines per trip
│   └── CityLabelLayer.tsx     # Custom city labels overlay
└── ui/
    └── AddTripButton.tsx      # Floating action button

lib/
├── amap-loader.ts      # AMap API loader with security config
├── route-service.ts    # Singleton service for path planning
├── constants.ts        # AMap config (center, zoom, style)
├── curve-utils.ts      # Bezier curve calculations
├── map-style-config.ts # Transport mode styling
├── time-utils.ts       # Time-based opacity calculations
└── city-label-data.ts  # Static city label data

types/
├── trip.ts             # Trip types and MOCK_TRIPS data
├── map-styles.ts       # TransportMode enum and style types
└── amap.d.ts           # AMap type definitions
```

### Key Patterns

1. **Client-Side Map Rendering**: All map components use `'use client'` and are dynamically imported with `ssr: false` because AMap API only works in browser context.

2. **Route Planning Strategy**:
   - **Car**: Uses AMap.Driving API for real routes (async)
   - **Train**: Uses smooth curve calculation (synchronous)
   - **Airplane**: Uses Bezier curve calculation (synchronous)
   - The `routeService` singleton caches driving routes and handles fallback to straight lines on API failure.

3. **Map Initialization Flow**:
   - `AMapView` loads AMap API and creates map instance
   - Map instance is passed via props to child components
   - `JourneyPolyline` notifies parent when route is loaded
   - `useStartupView` hook waits for all routes, then calls `map.setFitView()` once

4. **Polylines with Time-Based Styling**: Route opacity varies by trip date (older trips are more faded), calculated in `time-utils.ts`.

5. **Train Routes Halo Effect**: Train polylines use a double-layer rendering (halo + main) to create a border effect similar to Google Maps.

### Coordinates

The app uses GCJ-02 coordinate system (Chinese standard). Coordinates are defined as `{ lng, lat }` matching AMap's expected format `[lng, lat]`.

### Map Configuration

- Default view: Center of China, zoom 4
- Zoom range: 3-7.8 (macro view focused on China)
- Style: `amap://styles/whitesmoke` (minimalist)
- 2D view mode only
- Features: bg, road, boundary (no POI, no building labels)
