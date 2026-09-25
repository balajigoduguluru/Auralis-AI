# Auralis AI — User Guide

**Version:** 1.1.0  
**Author:** Balaji Goduguluru  
**Repository:** [github.com/balajigoduguluru/Auralis-AI](https://github.com/balajigoduguluru/Auralis-AI)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Getting Started](#2-getting-started)
3. [Location Search & Analysis](#3-location-search--analysis)
4. [Geospatial Intelligence Map](#4-geospatial-intelligence-map)
5. [Multi-Spectral Satellite Imagery](#5-multi-spectral-satellite-imagery)
6. [Live Metrics Dashboard](#6-live-metrics-dashboard)
7. [Neural Risk Engine](#7-neural-risk-engine)
8. [AI Diagnostic Modal](#8-ai-diagnostic-modal)
9. [Agent Analysis Panel](#9-agent-analysis-panel)
10. [Variance Analytics Chart](#10-variance-analytics-chart)
11. [Historical Signal Archive](#11-historical-signal-archive)
12. [Signal Log & Intelligence Panel](#12-signal-log--intelligence-panel)
13. [Predictive Timeline](#13-predictive-timeline)
14. [Weather Alert Subscriptions](#14-weather-alert-subscriptions)
15. [High-Risk Alert Banner](#15-high-risk-alert-banner)
16. [Community Observation Submission](#16-community-observation-submission)
17. [Notification System](#17-notification-system)
18. [Network Status Monitoring](#18-network-status-monitoring)
19. [Authentication (Themed)](#19-authentication-themed)
20. [Admin Panel](#20-admin-panel)
21. [EmailJS Configuration](#21-emailjs-configuration)
22. [Newsletter & Footer](#22-newsletter--footer)
23. [Navigation](#23-navigation)
24. [Running Locally](#24-running-locally)
25. [Environment Variables](#25-environment-variables)
26. [CI/CD Pipeline](#26-cicd-pipeline)

---

## 1. Overview

Auralis AI is a **client-side Single-Page Application (SPA)** for environmental intelligence and climate risk analytics. It provides real-time weather telemetry, AI-generated environmental narratives, geospatial mapping, satellite imagery, historical data analysis, predictive projections, and community observation submission — all within a dark-themed, futuristic UI.

**Key characteristics:**
- 100% client-side — no backend server required
- All state is ephemeral (resets on page refresh) except observations, which persist in `localStorage`
- Data is fetched directly from public APIs (Open-Meteo, Google Gemini, Wikipedia, LoremFlickr)

---

## 2. Getting Started

1. Open the application in a browser at `http://localhost:3000` (development) or the deployed URL
2. Optionally configure a `VITE_GEMINI_API_KEY` in `.env.local` for AI-generated environmental reports
3. Optionally configure EmailJS credentials to receive email notifications when users submit observations

---

## 3. Location Search & Analysis

- **Search bar** in the hero section — type a city name or coordinates and press Enter
- A **search button** (right side of input) triggers the analysis
- Fetches real-time weather data from the **Open-Meteo API**
- Runs a **client-side risk calculation** based on temperature, wind speed, and precipitation thresholds
- Generates an **AI narrative** via Google Gemini 2.0 Flash (if API key is configured)
- Updates all dashboard panels simultaneously with fresh data

---

## 4. Geospatial Intelligence Map

- Embedded **Google Maps** overlay at the scanned location's coordinates
- Grayscale/contrast filter for thematic styling
- **Search bar** overlay to search cities or coordinates directly on the map
- **Zoom in/out** controls
- **Share button** — copies the current page URL to clipboard
- **Coordinate display** — shows latitude/longitude
- **Risk status indicator** — color-coded dot (green/yellow/red)
- **Click-to-analyze** — clicking the activity button triggers a new analysis for selected coordinates

---

## 5. Multi-Spectral Satellite Imagery

- Fetches live images from **Wikipedia/Wikimedia Commons** API for the scanned location
- Falls back to **LoremFlickr** if no Wikipedia image is available
- **Animated transitions** between locations
- **Grayscale effect** with hover-to-reveal-color interaction
- Info overlay showing location name and capture type

---

## 6. Live Metrics Dashboard

Eight metric cards displaying real-time environmental telemetry:

| Metric | Unit | Behavior |
|--------|------|----------|
| Atmosphere Temperature | °C | Color-coded trend (red for high, green for normal) |
| Relative Humidity | % | Trend indicator |
| Wind Speed | km/h | Nominal status |
| Wind Direction | ° | Steady status |
| Barometric Pressure | hPa | Calibrated status |
| Optical Visibility | km | Clear status |
| UV Intensity | index | Color-coded warning (high/low) |
| Precipitation | mm | Observed status |

Each card includes an animated progress bar at the bottom.

---

## 7. Neural Risk Engine

- Full-width banner card showing the **overall risk level** (LOW / MODERATE / HIGH / PENDING)
- **Color-coded severity** indicator
- **Model stability confidence** — animated progress bar with percentage
- **"Logic Feed"** button — opens the AI Diagnostic Modal
- **"Re-sync API"** button — re-runs the analysis for the current location

---

## 8. AI Diagnostic Modal

- Opened from the "Logic Feed" button on the Neural Risk Engine card
- Displays a mock AI diagnosis text for the current location
- Shows **Confidence Score** (98.4%) and **Node Latency** (14ms)
- Close button to dismiss

---

## 9. Agent Analysis Panel

- Displays the environmental report generated by **Google Gemini 2.0 Flash**
- Animated text transitions when new analysis arrives
- Tags: **Neural Diagnostic**, **Climate Modelling**, **Recursive Logic**
- **Model stability confidence** progress bar
- Fallback text displays when no Gemini API key is configured

---

## 10. Variance Analytics Chart

- **Recharts AreaChart** displaying historical telemetry data
- **Metric toggle buttons:** All / Temp / Humidity / Rainfall
- **Time range toggle:** 24H or 7D
- Custom dark-themed tooltip styling
- Animated gradient fills
- Legend with metric names

---

## 11. Historical Signal Archive

- Tabular display of up to **10 historical data points**
- Columns: Time Marker, Temperature, Humidity, Wind Speed, Pressure, Precipitation, Status
- Status badges: **"High Variance"** (red) or **"Nominal"** (green)
- **CSV Export** button to download telemetry data as a `.csv` file

---

## 12. Signal Log & Intelligence Panel

- Real-time **filterable event log** with a search input
- Animated list of signal events with timestamps and descriptions
- Each analysis run adds a new log entry
- **"View Full Logs"** button (displays a notification)

---

## 13. Predictive Timeline

- **4 forward-looking projections:** +4h, +8h, +12h, +24h
- Each shows risk level (LOW / MODERATE / HIGH) with color-coded labels
- Labels: Monitoring, Normalizing, Stabilizing, Projected, Clearance, Recovery
- Animated progress bars proportional to risk level

---

## 14. Weather Alert Subscriptions

- **Floating bell button** (bottom-right corner) opens the Weather Watcher sidebar
- **Email input** for alert subscription
- **Sensitivity calibration** dropdown: LOW / MEDIUM / HIGH
- **Logic Engine Status** — shows current alert threshold status
- **"Dispatch Emergency Test"** button — enabled when threshold is exceeded (temp > 35°C or wind > 50 km/h)
- **"Synchronize Profile"** button — saves subscription with confetti celebration
- End-to-end encryption badge

---

## 15. High-Risk Alert Banner

- When risk is **HIGH**, a red animated banner appears at the top of the page
- Displays: *"High Alert Protocol: Anomalous Climate Signature Detected in [location]"*
- Scanning line animation across the banner

---

## 16. Community Observation Submission

- **Text area** in the community section for user feedback and observations
- **Email input field** (required) — users must provide their email to submit
- Displays **Protocol Trust Score** (99.82%)
- **"Submit Observation"** button with hover animation
- On submission:
  1. Observation is saved to **localStorage** for persistence
  2. An **admin notification email** is sent to `balugoduguluri189@gmail.com` via EmailJS
  3. An **auto-reply confirmation email** is sent back to the user
  4. Both emails are sent in parallel; status is tracked per entry
  5. A success notification toast is displayed: *"Thank you for your observation!"*
  6. The text area and email field are cleared

---

## 17. Notification System

- Auto-dismissing toast notifications (4 seconds timeout)
- Two types: **success** (green shield) and **info** (info icon)
- **Click to dismiss** manually
- Animated entrance and exit transitions

---

## 18. Network Status Monitoring

- Detects browser **online/offline** state
- Shows a red banner when offline: *"Network connection lost. Some features may be unavailable."*
- Automatically hides when the connection is restored

---

## 19. Authentication (Themed)

- **"Auth Auralis"** button in the navbar triggers a 5-step animated "satellite handshake":
  1. Initiating Link
  2. Secure Handshake
  3. Satellite Sync
  4. Authenticating
  5. Access Granted
- Each step auto-advances with timers
- On completion, the navbar shows **"Agent-Alpha7"** with a shield icon
- **Logout** returns to the unauthenticated state
- **Note:** This is a themed UX simulation — no real authentication, database, or session persistence

---

## 20. Admin Panel

- **Hidden by default** — the Admin button is only visible after authenticating as admin
- To access: set `VITE_ADMIN_SECRET` in `.env.local`, then click **Auth Auralis** in the navbar
- After logging in, the **Admin** button (lock icon) appears in the navigation bar
- Clicking Admin prompts for the **admin passcode** (set via `VITE_ADMIN_SECRET`)
- Once authenticated, the admin session persists across page refreshes
- Opens a modal showing all submitted community observations
- Each entry displays:
  - Observation message
  - User's email address
  - Timestamp of submission
  - Location (city/coordinates) when submitted
  - Email delivery status: **Notified** (admin notified) / **Replied** (auto-reply sent)
- Observations are listed in **reverse chronological order**
- **"Purge All"** button to clear all observations (requires confirmation, auto-cancels after 3 seconds)
- Empty state message when no observations exist

---

## 21. EmailJS Configuration

Auralis AI sends two emails when a user submits an observation:

| Email | Recipient | Template |
|-------|-----------|----------|
| **Admin Notification** | `balugoduguluri189@gmail.com` | Notifies you of new observation |
| **Auto-Reply** | The submitting user | Sends a thank-you confirmation |

### Setup Steps

1. Sign up at [emailjs.com](https://www.emailjs.com/) (free tier: 200 emails/month)
2. Create an **Email Service** (e.g., Gmail) and note the **Service ID**
3. Create **two Email Templates**:

   **Template 1 — Notification** (admin alert):
   - Variables: `{{to_email}}`, `{{from_name}}`, `{{user_email}}`, `{{message}}`, `{{location}}`, `{{timestamp}}`

   **Template 2 — Auto-Reply** (user confirmation):
   - Variables: `{{to_email}}`, `{{from_name}}`, `{{message}}`, `{{location}}`, `{{reply_message}}`

4. Copy your **Account Public Key** from the EmailJS Dashboard
5. Add the following to your `.env.local` file:
   ```
   VITE_EMAILJS_SERVICE_ID="your_service_id"
   VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID="your_notification_template_id"
   VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID="your_auto_reply_template_id"
   VITE_EMAILJS_PUBLIC_KEY="your_public_key"
   ```
6. Optionally set `VITE_ADMIN_SECRET` in `.env.local` to password-protect the admin panel

**Important:** `VITE_*` variables are inlined into the JavaScript bundle at build time and are visible in browser dev tools. For production, consider using a server-side proxy.

---

## 22. Newsletter & Footer

- **Email input** in the footer for "Auralis Updates" subscription
- Shows a success notification on subscribe
- Footer navigation links:
  - **Neural Privacy** — placeholder for privacy terms
  - **Agent Ethics** — placeholder for ethical disclosure
  - **Repository** — link to GitHub source
  - **Risk Indices**, **Telemetry Feed**, **Neural API**, **Global Sync** — quick navigation
- **Scroll-to-top** on logo click
- Animated SVG topology (Schematic) as a decorative background

---

## 23. Navigation

- **Fixed top navbar** with scroll-to-top on logo click
- Desktop links: Neural Risk, Geospatial, Satellite, Telemetry, Core API, GitHub Source
- **Admin** button (lock icon) — opens the Admin Observation Panel
- **Auth Auralis** button — triggers themed authentication
- **Mobile hamburger menu** with the same links plus Admin Panel and Auth

---

## 24. Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev          # Serves at http://localhost:3000

# Production build
npm run build        # Outputs to dist/

# Preview production build
npm run preview

# Type-check
npm run typecheck

# Lint
npm run lint
```

---

## 25. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | No | Google Gemini API key for AI reports |
| `APP_URL` | No | Public URL for the instance |
| `VITE_DEBUG_MODE` | No | Enable debug logging (`true`/`false`) |
| `DISABLE_HMR` | No | Disable Hot Module Replacement |
| `VITE_EMAILJS_SERVICE_ID` | No* | EmailJS Service ID |
| `VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID` | No* | EmailJS template for admin notifications |
| `VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID` | No* | EmailJS template for user auto-replies |
| `VITE_EMAILJS_PUBLIC_KEY` | No* | EmailJS Account Public Key |
| `VITE_ADMIN_SECRET` | No | Password to access the admin panel |

*\*Required only for email functionality.*

---

## 26. CI/CD Pipeline

- **GitHub Actions** workflow (`.github/workflows/ci.yml`)
- Triggers on pull requests and pushes to `main`
- Steps: Checkout → Setup Node.js 20 → Install dependencies → TypeScript type-check → Production build → Build output verification

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 + Motion (Framer Motion) |
| AI Engine | Google Gemini 2.0 Flash |
| Weather Data | Open-Meteo API |
| Geocoding | Open-Meteo Geocoding API |
| Maps | Google Maps Embed + Leaflet |
| Charts | Recharts |
| Icons | Lucide React + Canvas Confetti |
| Imagery | Wikipedia/Wikimedia Commons + LoremFlickr |
| Email | EmailJS |
| Persistence | Browser localStorage |
| Linting | TypeScript `tsc --noEmit` |
