# Atmos Stealth Instrumentation

> **Tactical Meteorological Telemetry Console & Micro-Climate Observation System**  
> High-density atmospheric data visualization with real-time Google Search Grounding via Gemini 3.5 Flash.

---

## Overview

**Atmos Stealth Instrumentation** is a high-discipline meteorological observation dashboard inspired by defense-grade tactical telemetry terminals and coastal maritime monitoring stations. Designed with an obsidian-titanium aesthetic, strict 0px border radii, hairline borders, and high-contrast tabular lining figures, it delivers real-time weather analytics, radar monitoring, and synoptic intelligence.

---

## Core Capabilities

### 1. Analytics & Observation Matrix
* **Thermal Oscillation & Dew Point**: Interactive SVG thermal matrix tracking ambient temperature curves, dew point baselines, peak/trough anomaly nodes, and standard deviation against 30-year climatic norms.
* **Barometric Tendency // Isobaric Gradient**: Dynamic pressure charts plotting cyclonic thresholds (1004 hPa) and sea-level baselines (1012 hPa), 3-hour delta calculations, diurnal tide tracking, and frontal velocity vectors.
* **Hydrometeor Accumulation (7-Day)**: Daily precipitation histogram featuring peak convective highlights, maximum hourly precipitation rates, and relative humidity span meters.
* **Wind Vector & Gust Profile**: Polar cardinal compass dial with concentric range rings, secondary directional scatter polygons, and sustained/gust velocity breakdowns.
* **Sensor Health Telemetry**: NIST calibration matrix, quartz oscillator drift monitor, solar UV index flux, and PM2.5 / AQI air purity indices.

### 2. Google Search Grounding (Gemini 3.5 Flash)
* **Real-Time Web Telemetry**: Queries live web data via `gemini-3.5-flash` using the native `googleSearch` tool.
* **Grounding Citations**: Extracts and presents verified web sources (such as IMD, NOAA, and regional maritime authorities) with clickable citation links.
* **Custom Coastal Search**: Allows ad-hoc search queries for any port, buoy, or maritime zone (e.g., *Haldia Port*, *Paradip*, *Sagar Island Estuary*, *Visakhapatnam Deep*).

### 3. Tactical Forecast & Synoptic Sounding
* **Hourly Stepped Cards**: 24-hour stepped thermal, barometric, and precipitation probability cards.
* **Synoptic Sounding Indices**: Live calculation of Convective Available Potential Energy (CAPE), Lifted Index (LI), sea surface temperature anomaly (SST), wave swell heights, and tidal surges.
* **7-Day Outlook Matrix**: Tabular synoptic projection detailing sky cover, temperature envelopes, wind speed, and maritime safety flags.

### 4. Doppler Radar Sweep
* **Rotational Sweep Scope**: Real-time simulated radar sweep beam with range rings (25 NM to 100 NM).
* **Storm Cell Tracking**: Clickable convective cells with dBZ reflectivity, echo tops, and hail probability telemetry.
* **Timeline Controls**: Playback scrubber for historical echo loop analysis.

### 5. Mission-Critical Alerts & Tripwires
* **Gale & Cyclonic Warnings**: Categorized bulletins with severity rankings (Critical, Warning, Advisory).
* **Interactive Acknowledgment**: Operator toggle to mark tripwires as reviewed.

### 6. Telemetry Export & Calibration
* **Downloadable Archives**: Generates client-side `.CSV`, `.JSON`, and raw `.GRIB2` telemetry archives.
* **Unit Switching**: Full support for metric and imperial standards (°C/°F, hPa/inHg, km/h/kt).
* **Operator Profiles**: Tactical credential verification and NIST sensor drift matrix view.

---

## Tech Stack

* **Frontend**: React 19, TypeScript, Tailwind CSS 4, Motion (`motion/react`), Lucide React
* **Backend**: Express 4, Node.js (Full-stack architecture with server-side API proxy)
* **AI & Grounding**: `@google/genai` TypeScript SDK (`gemini-3.5-flash` with `googleSearch` tool)
* **Build System**: Vite 8, `tsx`, `esbuild` (Bundled CJS for production Cloud Run deployment)
* **Typography**: Geist, Hanken Grotesk, Material Symbols Outlined

---

## Getting Started

### Prerequisites
* Node.js (v20 or higher)
* npm (v10 or higher)

### Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```bash
# Required for live Google Search Grounding via Gemini
GEMINI_API_KEY=your_gemini_api_key_here
```

### Installation
```bash
npm install
```

### Development Mode
Runs the Express backend server with Vite middleware on port 3000:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
Compiles the Vite client app into `dist/` and bundles the server into `dist/server.cjs`:
```bash
npm run build
npm start
```

---

## Security & Architecture Guidelines

* **API Key Security**: The Gemini API key is managed server-side inside `server.ts` and is never exposed to the client browser.
* **Telemetry User-Agent**: The backend sets `User-Agent: aistudio-build` in the `@google/genai` HTTP client options as per platform standards.
* **Port Ingress**: The dev server and production server bind strictly to `0.0.0.0:3000` to support container reverse-proxy architectures.
