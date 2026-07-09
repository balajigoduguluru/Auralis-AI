<div align="center">
  <br/>
  <img src="https://img.shields.io/badge/status-production-1B4332?style=for-the-badge&labelColor=0a0a0a" alt="Production Ready"/>
  <img src="https://img.shields.io/badge/license-MIT-1B4332?style=for-the-badge&labelColor=0a0a0a" alt="MIT License"/>
  <br/><br/>
  <h1 align="center" style="border-bottom: none; font-size: 3.5rem; font-weight: 800; letter-spacing: -2px;">
    AURALIS <span style="font-weight: 300; font-style: italic; opacity: 0.6;">AI</span>
  </h1>
  <p align="center" style="font-size: 1.2rem; max-width: 600px; margin: 0 auto;">
    Environmental Intelligence &bull; Climate Risk Analytics &bull; Agentic AI
  </p>
  <br/>
</div>

---

## Enterprise Capabilities

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + TypeScript + Vite 6 | High-throughput SPA with sub-second hydration |
| **Styling** | Tailwind CSS v4 + Motion | Reactive design system with GPU-accelerated transitions |
| **AI Engine** | Google Gemini 2.0 Flash | Real-time environmental narrative generation |
| **Telemetry** | Open-Meteo API | Live weather data ingestion across 10+ metrics |
| **Maps** | Google Maps Embed + Leaflet | Geospatial visualization and coordinate intercept |
| **Charts** | Recharts | Multi-variant area/chart analytics with 24H/7D windows |
| **Email** | EmailJS | Client-side email dispatch for observation notifications |
| **Persistence** | Browser localStorage | User observation storage across sessions |

### Core Differentiators

- **Agentic AI Pipeline** &mdash; Asynchronous Gemini inference with automatic fallback to cached heuristics ensures zero-burst failures.
- **Real-Time Telemetry** &mdash; Open-Meteo integration streams temperature, humidity, wind, pressure, UV, and precipitation on every query.
- **Geospatial Intercept** &mdash; Click-to-analyze anywhere on the map; coordinates are resolved via reverse geocoding and immediately processed.
- **Predictive Timeline** &mdash; Risk-propagated forward projection across 4, 8, 12, and 24-hour windows.
- **Multi-Spectral Imaging** &mdash; Live image aggregation from Wikipedia/Wikimedia Commons for every scanned location.
- **Sentinel Auth Theater** &mdash; Immersive satellite-login UX demonstrating secured-node handshake patterns.
- **Community Observation Submission** &mdash; Users can submit localized observations that persist in browser storage and optionally trigger email notifications.
- **Admin Observation Panel** &mdash; Centralized view of all community submissions with delivery status tracking and bulk purge.

---

## Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (SPA)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Navbar  │  │   Hero   │  │   Map    │  │  Analytics  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬─────┘  │
│       └──────────────┼─────────────┼────────────────┘        │
│                      ▼             ▼                         │
│            ┌────────────────────────────┐                    │
│            │     useNotifications()     │                    │
│            │         useAuth()          │                    │
│            └────────────┬───────────────┘                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                      Service Layer                           │
│  ┌────────────────────┐  ┌────────────────────────────────┐  │
│  │   weatherService   │  │         geminiService          │  │
│  │   Open-Meteo API   │  │   Google GenAI SDK (Gemini)    │  │
│  └─────────┬──────────┘  └──────────────┬─────────────────┘  │
│            │                            │                    │
│            ▼                            ▼                    │
│    open-meteo.com              generativeai.googleapis.com   │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  emailService                            │  │
│  │              EmailJS (client-side)                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Request flow:**
1. User submits a location &rarr; `weatherService.fetchWeather()` fetches live data from Open-Meteo
2. Risk engine calculates severity from temperature, wind, and precipitation thresholds
3. `geminiService.generateEnvironmentalReport()` streams an AI narrative via Gemini 2.0 Flash
4. State is committed: metrics, charts, logs, predictions, and imagery all update simultaneously
5. Map intercept (click) flows through the same pipeline via `fetchWeatherByCoords()`

---

## Local Provisioning

### Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | &ge;18 | Required for Vite 6 and React 19 |
| npm | &ge;9 | Ships with Node.js |

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/auralis-ai.git
cd auralis-ai

# 2. Create and activate a clean environment
#    (Node.js equivalent of Python venv isolation)
npm ci                   # Clean install from lockfile

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local and set your GEMINI_API_KEY

# 4. Start the development engine
npm run dev
```

The application is now available at **`http://localhost:3000`**.

### Validation Commands

```bash
# TypeScript compilation check (no emit)
npm run lint

# Production build
npm run build

# Preview production build locally
npm run preview

# Clean build artifacts
npm run clean
```

---

## Project Structure

```
auralis-ai/
├── .github/workflows/ci.yml    # CI/CD pipeline
├── public/                      # Static assets
├── src/
│   ├── components/              # UI components
│   │   ├── AdminModal.tsx       # Admin observation panel
│   │   ├── AuthModal.tsx        # Satellite login theater
│   │   ├── DiagnosticModal.tsx  # AI diagnostics panel
│   │   ├── Footer.tsx           # App footer with links
│   │   ├── LiveImages.tsx       # Wikipedia-sourced imagery
│   │   ├── MapVisualization.tsx # Google Maps + Leaflet
│   │   ├── Navbar.tsx           # Navigation (desktop + mobile)
│   │   ├── NetworkStatus.tsx    # Online/offline banner
│   │   ├── NotificationToast.tsx# Toast notifications
│   │   ├── RiskBanner.tsx       # High-risk alert bar
│   │   ├── Schematic.tsx        # Animated SVG topology
│   │   └── WeatherWatcher.tsx   # Alert subscription sidebar
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts           # Auth state machine
│   │   └── useNotifications.ts  # Notification queue
│   ├── services/                # API service layer
│   │   ├── emailService.ts      # EmailJS integration
│   │   ├── geminiService.ts     # Google GenAI client
│   │   └── weatherService.ts    # Open-Meteo client
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx                  # Root application component
│   ├── index.css                # Tailwind + global styles
│   └── main.tsx                 # React entry point
├── .env.example                 # Environment configuration
├── .gitignore                   # Version control exclusions
├── CONTRIBUTING.md              # Contribution guidelines
├── CHANGELOG.md                 # Version history
├── package.json                 # Dependency manifest
├── tsconfig.json                # TypeScript configuration
├── USER_GUIDE.md                # Comprehensive user documentation
└── vite.config.ts               # Vite build configuration
```

---

## Documentation

For a complete walkthrough of all features, including the Admin Panel, Observation Submission, EmailJS setup, and every user-facing component, see the **[USER_GUIDE.md](./USER_GUIDE.md)**.

---

## Security & Compliance

- **API keys** are injected at build time via Vite `define` and never stored in the bundle as plaintext constants.
- **CORS** is enforced by the upstream APIs (Open-Meteo, Google Maps, Wikipedia).
- **Content Security Policy** is configurable via the hosting platform.
- **No user data** is persisted server-side; all state is client-local.

---

<div align="center">
  <br/>
  <sub>Built with React 19, TypeScript, Vite 6, and Google Gemini.</sub>
  <br/>
  <sub>&copy; 2026 Developed by Balaji Goduguluru</sub>
</div>
