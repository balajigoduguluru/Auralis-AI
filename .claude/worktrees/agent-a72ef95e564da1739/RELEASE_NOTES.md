# Auralis-AI v1.0.0 — Stable Production Baseline

> Advanced environmental intelligence and climate risk analytics platform.  
> *"Telemetry. Variance. Bio-signature."*

---

## 🚀 Key Features

- **Agentic AI Narrative Pipeline** — Google Gemini 2.0 Flash generates real-time environmental reports styled as in-world sentinel status updates.
- **Live Weather Telemetry** — Open-Meteo API provides temperature, humidity, wind speed/direction, pressure, visibility, UV index, and precipitation for any scanned location.
- **Geospatial Intelligence Map** — Interactive Google Maps embed with zoom controls, coordinate search, and orbital intercept overlay.
- **Visual Intelligence Profile** — Live satellite imagery sourced from Wikipedia/Wikimedia Commons and LoremFlickr, matched to scanned coordinates.
- **Variance Analytics** — Recharts area chart with metric toggles (all / temp / humidity / rainfall) and 24-hour or 7-day range selection.
- **Sentinel Auth Theater** — Premium 5-step satellite-style authentication modal with animated handshake sequence.
- **Predictive Timeline** — Forward-looking risk projections with color-coded progress bars.
- **Signal Archive** — Real-time filterable event log with AnimatePresence transitions.
- **Weather Alert Subscriptions** — Email-based alert system with sensitivity calibration and confetti confirmation.
- **Notification Toast System** — Auto-dismissing toast queue with click-to-dismiss and severity levels.
- **Network Status Monitoring** — Online/offline detection with persistent banner.
- **Responsive Dark Theme** — Tailwind CSS v4 custom dark-green palette with full mobile support.
- **CSV Telemetry Export** — One-click export of historical data.
- **CI/CD Pipeline** — GitHub Actions workflow with linting, type-checking, and production build validation.

---

## 🛠️ Architecture & Data Flow

```
User Input (city/coords)
       │
       ▼
┌──────────────────┐
│  Open-Meteo API   │  ← Real-time weather telemetry (temp, humidity, wind, etc.)
│  (REST / no-auth) │
└────────┬─────────┘
         │ weather + history
         ▼
┌──────────────────┐
│  Risk Engine      │  ← calculateRisk() → LOW / MODERATE / HIGH
│  (client-side)    │
└────────┬─────────┘
         │ risk + metrics
         ▼
┌──────────────────┐
│  Gemini 2.0 Flash │  ← Agentic narrative: "Telemetry stream consistent…"
│  (via VITE_ key)  │
└────────┬─────────┘
         │ report text
         ▼
┌──────────────────────┐
│  React 19 Dashboard  │  ← 8 metric cards, chart, map, satellite image,
│  (SPA, client-side)  │     agent panel, signal log, timeline
└──────────────────────┘
```

**Key design decisions:**
- Fully client-side SPA — no backend server required.
- Weather data fetched from Open-Meteo (free, no API key).
- Gemini AI key is a `VITE_` environment variable inlined at build time.
- Risk calculation performed locally via deterministic logic.
- Satellite imagery fetched from public Wikimedia / LoremFlickr APIs.

---

## 🔒 Security & Safe Handling

| Concern | Mitigation |
|---|---|
| **API key exposure** | `VITE_GEMINI_API_KEY` follows Vite's `VITE_*` convention — inlined at build time. Key is present in the JS bundle (unavoidable for a client-side app). For production requiring secrecy, add a serverless proxy. |
| **No server-side persistence** | Zero user data stored. No database, no session store, no cookies. All state is ephemeral React state. |
| **Environment file safety** | `.env` / `.env.local` are in `.gitignore` — never committed. `.env.example` shows required keys with placeholders. |
| **CORS & third-party APIs** | Open-Meteo and Wikimedia endpoints are public and CORS-enabled. |
| **Build-time protection** | Vite 6 statically replaces `import.meta.env.VITE_*` references during bundling. No runtime `.env` file access on production. |
| **Dependency hygiene** | `npm audit` clean. TypeScript strict-mode with `skipLibCheck: true`. |

---

## 📦 Getting Started

```bash
# Clone
git clone https://github.com/balajigoduguluru/Auralis-AI.git
cd Auralis-AI

# Install
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local and set VITE_GEMINI_API_KEY=<your key from https://aistudio.google.com/app/apikey>

# Development
npm run dev        # → http://localhost:3000

# Production build
npm run build      # → dist/
npm run preview    # preview production build locally
```

---

## 🌐 Deploy to Production

**Vercel / Netlify / Cloudflare Pages:**

1. Connect your GitHub repository.
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable in hosting dashboard:
   - `VITE_GEMINI_API_KEY` = your Gemini API key

---

## 📁 Project Structure

```
src/
├── App.tsx                        # Main application shell
├── components/
│   ├── AuthModal.tsx              # 5-step satellite authentication
│   ├── Footer.tsx                 # Site footer with subscription
│   ├── LiveImages.tsx             # Satellite image feed
│   ├── MapVisualization.tsx       # Google Maps embed
│   ├── MetricModule.tsx           # Metric display card
│   ├── Navbar.tsx                 # Responsive navigation
│   ├── NetworkStatus.tsx          # Online/offline banner
│   ├── NotificationToast.tsx      # Toast notification component
│   ├── Schematic.tsx              # Orbital system diagram
│   └── WeatherWatcher.tsx         # Alert subscription form
├── services/
│   ├── geminiService.ts           # Gemini AI integration
│   └── weatherService.ts          # Open-Meteo API client
├── hooks/
│   ├── useAuth.ts                 # Authentication state machine
│   └── useNotifications.ts        # Notification queue management
├── types/
│   └── index.ts                   # Shared TypeScript types
├── vite-env.d.ts                  # Vite client type declarations
├── main.tsx                       # React entry point
└── index.css                      # Tailwind CSS v4 entry
```

---

## 📋 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_GEMINI_API_KEY` | Yes | Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey)) |
| `VITE_DEBUG_MODE` | No | Set to `"true"` for console debug logging |

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.

---

<p align="center">
  <sub>Built with React 19 · Vite 6 · Tailwind CSS v4 · TypeScript</sub>
  <br />
  <sub>Developed by Balaji Goduguluru</sub>
</p>
