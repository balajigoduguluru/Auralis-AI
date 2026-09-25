# Contributing to Auralis AI

Thank you for your interest in contributing. This document outlines the standards and workflows for contributing to the Auralis AI repository.

---

## Branch Naming Convention

All branches must follow the pattern:

```
<type>/<short-description>
```

| Type     | Purpose                            | Example                               |
|----------|------------------------------------|---------------------------------------|
| `feat/`  | New feature or enhancement         | `feat/uv-index-threshold-alert`       |
| `fix/`   | Bug fix                            | `fix/map-zoom-iframe-reload`          |
| `refactor/` | Code restructuring without behavior change | `refactor/extract-weather-hook`  |
| `docs/`  | Documentation-only changes         | `docs/api-service-readme`             |
| `chore/` | Tooling, CI, dependencies          | `chore/upgrade-vite-to-v6`            |
| `perf/`  | Performance optimization           | `perf/memoize-metric-module`          |

Descriptions use **kebab-case** and should be concise but descriptive.

---

## Commit Message Convention

Use conventional commits:

```
<type>(<scope>): <present-tense description>
```

**Examples:**

```
feat(weather): add UV index threshold alert
fix(map): prevent iframe reload on zoom change
refactor(hooks): extract useWeather custom hook
docs(readme): add architectural data-flow diagram
chore(deps): upgrade vite to v6.4
```

---

## Pull Request Process

1. **Create a branch** from `main` using the naming convention above.
2. **Make your changes** following the existing code style (TypeScript, functional components, Tailwind classes).
3. **Run validation locally** before pushing:
   ```bash
   npm run lint        # TypeScript type-check
   npm run build       # Production build
   ```
4. **Open a Pull Request** against the `main` branch.
   - Title must match the conventional commit format.
   - Description must include:
     - What changed
     - Why it changed
     - Screenshots (for UI changes)
     - Testing steps
5. **CI checks** must pass (lint, build) before merge.
6. **At least one approving review** is required.
7. **Squash merge** is the default strategy &mdash; all commits in the PR become a single conventional commit on `main`.

---

## Code Standards

- **TypeScript** &mdash; Strict mode is encouraged. Avoid `any` types; prefer proper interfaces from `src/types/`.
- **React** &mdash; Use functional components with hooks. Extract reusable logic into custom hooks under `src/hooks/`.
- **Tailwind** &mdash; Follow the existing `@theme` tokens in `index.css`. Avoid inline styles.
- **Imports** &mdash; Group by: 1) external libs, 2) internal components, 3) hooks, 4) services, 5) types.
- **No commented-out code** &mdash; Delete dead code instead of commenting it out.

---

## Questions?

Open a [GitHub Discussion](https://github.com/<your-org>/auralis-ai/discussions) for questions or proposals before starting work.
