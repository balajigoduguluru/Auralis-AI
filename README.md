<p align="center">
  <img src="https://github.com/balajigoduguluru/auralis-ai/blob/main/screenshots/01-hero.png?raw=true" alt="Auralis AI Hero" width="800"/>
</p>

<h1 align="center">Auralis AI</h1>
<h3 align="center">Advanced climate diagnostics and environmental risk modeling</h3>

<p align="center">
  <a href="https://github.com/balajigoduguluru/auralis-ai/actions/workflows/ci.yml">
    <img src="https://github.com/balajigoduguluru/auralis-ai/actions/workflows/ci.yml/badge.svg" alt="CI">
  </a>
  <a href="https://github.com/balajigoduguluru/auralis-ai/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/balajigoduguluru/auralis-ai" alt="License">
  </a>
  <a href="https://hub.docker.com/r/balajigoduguluru/auralis-ai">
    <img src="https://img.shields.io/docker/pulls/balajigoduguluru/auralis-ai" alt="Docker Pulls">
  </a>
  <a href="https://github.com/balajigoduguluru/auralis-ai/releases">
    <img src="https://img.shields.io/github/v/release/balajigoduguluru/auralis-ai" alt="Release Version">
  </a>
</p>

> **Advanced climate diagnostics and environmental risk modeling.** Powered by the Auralis Agentic Framework.

## Overview

Environmental professionals and emergency responders struggle with fragmented data sources when assessing climate risks. Auralis AI unifies real-time weather telemetry, satellite imagery, AI-driven risk analysis, and community verification into a single intuitive platform—turning complex environmental data into actionable intelligence in seconds.

## Architecture & Data Flow

```
User Location Input
           ↓
   Weather API (OpenWeatherMap)
           ↓
Risk Calculation Engine
           ↓
AI Report Generation (Gemini)
           ↓
State Update → UI Render
           ↓
Community Feedback → EmailJS Notifications
           ↓
Admin Panel Alerts
```

## Zero-Friction Quickstart

Get started in under 60 seconds:

### Option 1: Docker (Recommended)
```bash
# Clone and run
git clone https://github.com/balajigoduguluru/auralis-ai.git
cd auralis-ai
docker compose up --build
```
Visit `http://localhost:3000`

### Option 2: Local Development
```bash
# Prerequisites: Node.js >=18, npm >=9
git clone https://github.com/balajigoduguluru/auralis-ai.git
cd auralis-ai
npm ci
cp .env.example .env.local  # Add your API keys
npm run dev
```
Visit `http://localhost:3000`

## Core Features

- 🌍 **Geospatial Intelligence** — Interactive Leaflet maps with real-time risk overlays
- 🛰️ **Multi-Spectral Satellite Confirmation** — Live visual verification of climate signatures
- 📊 **Variance Analytics** — Recharts-powered climate signature visualization (24h/7d)
- 🤖 **AI Risk Engine** — Google GenAI (Gemini) generated environmental reports
- 📈 **Predictive Timeline** — 4h/8h/12h/24h forecast projections with confidence scoring
- 👥 **Community Verification** — Crowdsourced observations with EmailJS notifications
- 🔐 **Admin Panel** — Password-protected observation archive with email audit trail
- ♿ **Accessibility First** — Semantic HTML, ARIA labels, reduced-motion support

## Tech Stack

| Category      | Technology                          |
|---------------|-------------------------------------|
| Framework     | React 19 + TypeScript 5             |
| Build Tool    | Vite 6                              |
| Styling       | Tailwind CSS 4 (CSS-first config)   |
| Animation     | Motion (Framer Motion 12)           |
| Charts        | Recharts 3                          |
| Maps          | Leaflet 1.9 + React-Leaflet 5       |
| AI/ML         | `@google/genai` (Gemini)            |
| Weather Data  | OpenWeatherMap API                  |
| Email Service | EmailJS Browser SDK                 |
| Icons         | Lucide React                        |
| Utilities     | Canvas Confetti                     |

## Roadmap

| Quarter | Goals                                                                 |
|---------|-----------------------------------------------------------------------|
| Q1 2027 | Implement historical data analysis and trend visualization            |
| Q2 2027 | Add support for additional weather APIs (NOAA, Meteomatics)           |
| Q3 2027 | Introduce machine learning models for localized risk prediction       |
| Q4 2027 | Launch mobile companion app with offline capabilities                 |
| 2028    | Achieve SOC 2 compliance and enterprise-grade security certifications |

## Deployment

### Static Hosting (Recommended)
```bash
npm run build
# Deploy dist/ to Vercel, Netlify, Cloudflare Pages, etc.
```

### Docker
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting.

### Quick Contribution Flow

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make changes with tests
4. Run type-check: `npm run typecheck`
5. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
6. Push and open a Pull Request

## License

MIT License — see [LICENSE](LICENSE) for details.

## Author

**Balaji Goduguluru**  
🔗 [GitHub](https://github.com/balajigoduguluru) • [LinkedIn](https://linkedin.com/in/balajigoduguluru)

---

<div align="center">
  <sub>Built By Balaji Goduguluru for environmental intelligence</sub>
</div>