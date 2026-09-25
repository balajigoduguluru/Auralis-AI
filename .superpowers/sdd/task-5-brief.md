## Task 5: Enhance color contrast for WCAG AA compliance

**Goal:** Adjust text opacity classes to meet WCAG AA contrast ratio (≥ 4.5:1) against the `bg-accent` background.

**Files to modify:**
- `src/components/Footer.tsx`

**Task Details:**
Per design spec, set:
- Primary text: `text-white/90`
- Secondary text: `text-white/60`
- Muted text: `text-white/40`

Mapping:
- Main brand name (`AURALIS AI`) → primary → `text-white/90`
- Tagline → primary → `text-white/90`
- Section headers → secondary → `text-white/60`
- Navigation links → secondary → `text-white/60`
- Subscribe form placeholder → muted → `text-white/40`
- Small copyright text → muted → `text-white/40`
- Status text → secondary → `text-white/60`
- Separator dots → adjust to be slightly more visible (e.g., `bg-white/30`)

We'll update the relevant classNames accordingly.

**Exact values to use verbatim:**
- `text-white/90` for primary
- `text-white/60` for secondary
- `text-white/40` for muted
- For separator: `bg-white/30` (adjusted from `bg-white/20`)

**Interfaces:**
- Consumes: Text and interactive elements
- Produces: Updated opacity classes for sufficient contrast

**Context from earlier tasks:**
- Task 1: Backup completed
- Task 2: Grid layout implemented
- Task 3: Accessibility improvements (focus outlines, touch targets)
- Task 4: Typography updated

**Report file:**
- Write implementer report to: .superpowers/sdd/task-5-report.md

**After completion, I will run the review package and dispatch a task reviewer.**