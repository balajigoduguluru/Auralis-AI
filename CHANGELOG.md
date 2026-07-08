# Changelog

All notable changes to the Auralis AI project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-07-07 — Stable Production Baseline

### Added

- **Hero section** with animated scanning line, search form, and satellite image overlay
- **Geospatial Map** (Google Maps embed) with zoom controls, search bar, and coordinate intercept
- **Satellite imagery feed** with Wikipedia/Wikimedia-sourced live images for scanned locations
- **Variance analytics chart** (Recharts AreaChart) with metric toggles (all/temp/humidity/rainfall) and 24H/7D range selection
- **Historical telemetry table** with CSV export functionality
- **Live metrics dashboard** with 8 MetricModule cards (temp, humidity, wind speed/direction, pressure, visibility, UV, precipitation) and neural risk engine summary
- **Agent analysis panel** with animated Gemini AI report, model stability progress bar, and diagnostics modal
- **Signal log panel** with real-time filter and AnimatePresence transitions
- **Predictive timeline** with 4 forward projections and risk-colored progress bars
- **Weather alert subscription** (WeatherWatcher) with email input, sensitivity calibration, and confetti confirmation
- **Satellite authentication modal** with animated 5-step handshake sequence
- **High-risk alert banner** with animated scanning overlay
- **Notification toast system** with auto-dismiss and click-to-dismiss
- **Network status banner** that monitors online/offline state
- **Responsive navigation** with desktop links and mobile hamburger menu
- **Dark green/light theme** with Tailwind CSS v4 custom theme tokens
- **Custom hooks** `useAuth` and `useNotifications` with proper cleanup
- **Shared TypeScript types** in `src/types/index.ts`
- **Comprehensive .gitignore**, .env.example, CONTRIBUTING.md, CHANGELOG.md
- **CI/CD pipeline** (`.github/workflows/ci.yml`) with linting, type-checking, and build validation
- **Live image fetching** via Wikipedia/Wikimedia Commons API with fallback chain
- **`prefers-reduced-motion`** support across all animations

### Changed

- Refactored monolithic `App.tsx` (~1377 lines) into modular components under `src/components/`
- Consolidated duplicate risk logic into `calculateRisk()` helper function
- Improved footer text contrast and readability
- Relocated `NetworkStatusBanner` to the bottom of the footer
- Upgraded all dependencies to latest compatible versions

### Fixed

- Missing `NetworkStatus.tsx` component (created from scratch)
- Invalid Gemini model name (`gemini-3-flash-preview` → `gemini-2.0-flash`)
- `geoResponse` unused variable in `weatherService.ts`
- Missing `date`, `windSpeed`, and `pressure` fields in initial chart history state
- Satellite section showing "Satelite" typo
- "Export CSV" button was a no-op (now exports real telemetry data)
- Initial load searched "Paris" instead of "Nellore"
- Timer leak in auth sequence (timers now properly cleared on unmount)

### Removed

- `useWeather` hook (logic kept inline in App.tsx for simplicity)
- Duplicate `NetworkStatus` and `LiveImages` imports
- Google Maps iframe from satellite section (replaced with LiveImages component)
- "crafted by" signature from footer

---

## [0.1.0] — 2026-06-15 — Initial Prototype

### Added

- Initial project scaffold with Vite + React + TypeScript
- Basic weather fetching from Open-Meteo API
- Gemini AI integration for environmental report generation
- Proof-of-concept dashboard layout with static metric cards
- LoremFlickr-backed satellite imagery placeholders
- Tailwind CSS v4 integration with custom theme

[1.0.0]: https://github.com/<your-org>/auralis-ai/releases/tag/v1.0.0
[0.1.0]: https://github.com/<your-org>/auralis-ai/releases/tag/v0.1.0
