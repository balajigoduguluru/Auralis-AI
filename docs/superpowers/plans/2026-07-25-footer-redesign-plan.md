# Footer Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the footer component to implement a minimalist grid layout with improved accessibility, modern typography, enhanced color contrast, and responsive behavior.

**Architecture:** Replace the existing footer layout with a responsive 3‑column grid on desktop that stacks to a single column on mobile. Use Tailwind utility classes for spacing, typography, and colors while preserving the existing component API (`showNotification` prop). All interactive elements receive proper ARIA labels and visible focus outlines.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide icons.

## Global Constraints
- Maintain existing component signature: `Footer({ showNotification })`
- Use only Tailwind CSS utilities (no custom CSS)
- Ensure WCAG AA contrast ratio (≥ 4.5:1) for text against `bg-accent`
- Touch targets ≥ 44×44px
- Preserve existing animation and background schematic
- Keep all existing functionality (notification callbacks, smooth scroll to top)

---
### Task 1: Backup original Footer.tsx

**Files:**
- Read: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: None
- Produces: Backup of original component for reference

- [ ] **Step 1: Copy the existing Footer.tsx to a backup**

```bash
cp src/components/Footer.tsx src/components/Footer.tsx.bak
```

- [ ] **Step 2: Verify backup exists**

```bash
ls -l src/components/Footer.tsx.bak
```

- [ ] **Step 3: Commit backup**

```bash
git add src/components/Footer.tsx.bak
git commit -m "chore: backup original Footer.tsx before redesign"
```

### Task 2: Implement new markup structure with grid layout

**Files:**
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `showNotification` prop, `navLinks` array
- Produces: Updated JSX with grid container and three sections

- [ ] **Step 1: Replace the inner div structure with a grid container**

```diff
-       <div className="max-w-7xl mx-auto relative">
-         {/* Main grid: 3-column inspired layout */}
-         <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
-           {/* Left: Logo + Tagline + Links */}
-           <div className="md:col-span-5 space-y-8">
-             ...
-           </div>
-
-           {/* Middle: Network Architecture */}
-           <div className="md:col-span-3 space-y-8">
-             ...
-           </div>
-
-           {/* Right: Subscribe + Status */}
-           <div className="md:col-span-4 space-y-10">
-             ...
-           </div>
-         </div>
-       </div>
+       <div className="max-w-7xl mx-auto relative">
+         {/* Main grid: 3-column layout */}
+         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
+           {/* Left: Logo + Tagline */}
+           <div className="space-y-6">
+             ...
+           </div>
+
+           {/* Middle: Navigation */}
+           <div className="space-y-6">
+             ...
+           </div>
+
+           {/* Right: Subscribe + Status */}
+           <div className="space-y-6">
+             ...
+           </div>
+         </div>
+       </div>
```

- [ ] **Step 2: Move existing inner content into the appropriate sections (Left, Middle, Right) as per design**

```diff
            <div className="md:col-span-5 space-y-8">
              <div
                className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity group"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Scroll to top"
              >
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl group-hover:bg-white/20 transition-colors">
                  <Zap className="w-7 h-7" aria-hidden="true" />
                </div>
                <span className="text-3xl font-bold tracking-tighter">AURALIS AI</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-serif leading-relaxed text-white/70 max-w-sm">
                Designing the <span className="italic text-white/90">intelligence</span> of tomorrow.
              </h2>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <button
                  onClick={() => showNotification('Loading privacy terms...', 'info')}
                  className="text-[11px] uppercase font-bold tracking-[0.2em] text-white/50 hover:text-white/90 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60 cursor-pointer"
                  aria-label="View neural privacy terms"
                >
                  Neural Privacy
                </button>
                <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
                <button
                  onClick={() => showNotification('Accessing ethical disclosure...', 'info')}
                  className="text-[11px] uppercase font-bold tracking-[0.2em] text-white/50 hover:text-white/90 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60 cursor-pointer"
                  aria-label="View agent ethics"
                >
                  Agent Ethics
                </button>
              </div>
            </div>

            <div className="md:col-span-3 space-y-8">
              <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40">Network</h4>
              <nav className="flex flex-col gap-5" aria-label="Footer navigation">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all flex items-center justify-between group/link"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover/link:text-white/70 group-hover/link:translate-x-0.5 transition-all" aria-hidden="true" />
                  </a>
                ))}
              </nav>
            </div>

            <div className="md:col-span-4 space-y-10">
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40">Signal Feed</h4>
                <form
                  onSubmit={(e) => { e.preventDefault(); showNotification('Subscribed to Auralis Feed!', 'success'); (e.target as HTMLFormElement).reset(); }}
                  className="relative group"
                  aria-label="Subscribe to updates"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your intelligence stream"
                    className="w-full bg-white/5 border border-white/20 rounded-xl py-4 px-5 pr-14 outline-none focus:border-white/50 focus:bg-white/10 transition-all text-sm font-medium tracking-wider placeholder:text-white/30"
                    aria-label="Email address"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all cursor-pointer" aria-label="Subscribe">
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </form>
              </div>
            </div>
```

After moving content, ensure each section is wrapped in its respective `<div>` under the grid.

- [ ] **Step 3: Verify the JSX structure matches the design (three columns, correct content placement)**

- [ ] **Step 4: Run TypeScript check to catch any syntax errors**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit the structural changes**

```bash
git add src/components/Footer.tsx
git commit -m "feat: implement new grid layout structure for footer"
```

### Task 3: Apply accessibility improvements (ARIA labels, focus outlines)

**Files:**
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: Existing interactive elements
- Produces: Same elements with proper ARIA attributes and visible focus styles

- [ ] **Step 1: Add `aria-label` to icon-only buttons (already present but verify)**

Check the Zap logo button already has `aria-label="Scroll to top"`.

- [ ] **Step 2: Ensure all buttons have accessible names**

The Neural Privacy and Agent Ethics buttons have visible text; they are fine.

The Subscribe button uses `aria-label="Subscribe"`.

- [ ] **Step 3: Add `focus-visible` outline style via Tailwind for keyboard focus**

Update interactive elements to include `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70`.

Example for the Zap logo button:

```diff
-              <div
-                className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity group"
-                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
-                role="button"
-                tabIndex={0}
-                onKeyDown={(e) => e.key === 'Enter' && window.scrollTo({ top: 0, behavior: 'smooth' })}
-                aria-label="Scroll to top"
-              >
+              <div
+                className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
+                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
+                role="button"
+                tabIndex={0}
+                onKeyDown={(e) => e.key === 'Enter' && window.scrollTo({ top: 0, behavior: 'smooth' })}
+                aria-label="Scroll to top"
+              >
```

Apply similar focus-visible classes to:
- Neural Privacy button
- Agent Ethics button
- Subscribe form button
- Each navigation link (`<a>`) – add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70`

- [ ] **Step 4: Ensure touch targets meet 44×44 minimum**

Increase padding where needed; already have reasonable sizes (e.g., buttons are `w-10 h-10` = 2.5rem ≈ 40px; adjust to `h-11 w-11` or add `p-2` to increase hit area). We'll adjust the Subscribe button to `h-11 w-11`.

```diff
-                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all cursor-pointer" aria-label="Subscribe">
+                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-11 w-11 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70" aria-label="Subscribe">
```

Similarly, increase the Zap logo container to `h-16 w-16` (4rem ≈ 64px) if needed; it's already large.

- [ ] **Step 5: Run linting to ensure no JSX errors**

```bash
npm run lint
```

- [ ] **Step 6: Commit accessibility updates**

```bash
git add src/components/Footer.tsx
git commit -m "feat: improve accessibility with ARIA labels, focus outlines, and adequate touch targets"
```

### Task 4: Update typography classes per design spec

**Files:**
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consists: Text elements
- Produces: Updated font sizes using Tailwind's scale (base 1rem, heading via utilities)

- [ ] **Step 1: Set base text to `text-[1rem]` (Tailwind's default is `text-base` which is 1rem; we can keep as is but ensure consistency). We'll explicitly set body text to `text-base`.**

Find all `<span>`, `<p>`, `<div>` containing body copy and ensure they have `text-base` (or no size class if inheriting). The footer currently uses classes like `text-sm`, `text-[11px]`. We'll adjust to follow a scale: body `text-base`, small text `text-sm`, label-like text `text-xs`.

- [ ] **Step 2: Update heading sizes**

- Tagline (`<h2>`): change from `text-2xl md:text-3xl` to `text-xl md:text-2xl` (or keep as design). Per spec: base 1rem, heading via Tailwind utilities. We'll set `text-base` for body, headings use `text-xl`, `text-2xl`, `text-3xl`.

Let's decide:
- Logo brand name stays `text-3xl font-bold` (as per existing, acceptable as brand heading).
- Tagline (`<h2>`): change to `text-xl md:text-2xl`.
- Section headers (`<h4>`): change to `text-sm font-bold` (they are already `text-[10px]` uppercase; we'll replace with `text-xs font-bold uppercase` for consistency).
- Navigation links: keep `text-sm font-bold uppercase` (already).
- Subscribe header (`<h4>`): same as section header.
- Form placeholder and button text: `text-sm`.

We'll implement changes:

```diff
-              <h2 className="text-2xl md:text-3xl font-serif leading-relaxed text-white/70 max-w-sm">
+              <h2 className="text-xl md:text-2xl font-serif leading-relaxed text-white/70 max-w-sm">
```

```diff
-              <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40">Network</h4>
+              <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">Network</h4>
```

Apply similar to other `<h4>` elements.

- [ ] **Step 3: Ensure body text uses `text-base` (or inherits). The paragraph tagline already uses font-serif and size; we'll leave as is because it's heading. The small copyright text at bottom currently is `text-[11px]`; change to `text-xs`.**

```diff
-            <span>&copy; 2026 Developed by <span className="text-white/70">Balaji Goduguluru</span></span>
+            <span className="text-xs">&copy; 2026 Developed by <span className="text-white/70">Balaji Goduguluru</span></span>
```

- [ ] **Step 4: Run TypeScript check to ensure no errors**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit typography updates**

```bash
git add src/components/Footer.tsx
git commit -m "feat: update typography to use base 1rem and appropriate heading scales"
```

### Task 5: Enhance color contrast for WCAG AA compliance

**Files:**
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: Text and interactive elements
- Produces: Updated opacity classes to meet 4.5:1 contrast on `bg-accent`

- [ ] **Step 1: Determine current background** – The footer uses `bg-accent`. We need to ensure text colors have sufficient contrast. We'll adjust the text-white/* values.

Per design spec:
- Primary text: `text-white/90`
- Secondary text: `text-white/60`
- Muted text: `text-white/40`

We'll map:
- Main brand name (`AURALIS AI`) – primary → `text-white/90`
- Tagline – primary → `text-white/90`
- Secondary buttons (Neutral buttons) – secondary → `text-white/60`
- Navigation links – secondary → `text-white/60`
- Section headers – secondary → `text-white/60`
- Subscribe form placeholder – muted → `text-white/40`
- Small copyright – muted → `text-white/40`
- Status text – secondary → `text-white/60`

Let's apply.

```diff
-              <span className="text-3xl font-bold tracking-tighter">AURALIS AI</span>
+              <span className="text-3xl font-bold tracking-tighter text-white/90">AURALIS AI</span>
```

```diff
-              <h2 className="text-xl md:text-2xl font-serif leading-relaxed text-white/70 max-w-sm">
+              <h2 className="text-xl md:text-2xl font-serif leading-relaxed text-white/90 max-w-sm">
                Designing the <span className="italic text-white/90">intelligence</span> of tomorrow.
              </h2>
```

Note: The italic "intelligence" already has `text-white/90`; good.

```diff
-              <button
-                onClick={() => showNotification('Loading privacy terms...', 'info')}
-                className="text-[11px] uppercase font-bold tracking-[0.2em] text-white/50 hover:text-white/90 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60 cursor-pointer"
-                aria-label="View neural privacy terms"
-              >
+              <button
+                onClick={() => showNotification('Loading privacy terms...', 'info')}
+                className="text-xs uppercase font-bold tracking-[0.2em] text-white/60 hover:text-white/90 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
+                aria-label="View neural privacy terms"
+              >
                Neural Privacy
              </button>
```

Similarly for Agent Ethics button.

```diff
-              <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
+              <span className="w-1.5 h-1.5 rounded-full bg-white/30" aria-hidden="true" />
```
(Adjust separator to be slightly more visible.)

```diff
              <button
                onClick={() => showNotification('Accessing ethical disclosure...', 'info')}
                className="text-[11px] uppercase font-bold tracking-[0.2em] text-white/50 hover:text-white/90 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60 cursor-pointer"
                aria-label="View agent ethics"
              >
+              <button
+                onClick={() => showNotification('Accessing ethical disclosure...', 'info')}
+                className="text-xs uppercase font-bold tracking-[0.2em] text-white/60 hover:text-white/90 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
+                aria-label="View agent ethics"
+              >
                Agent Ethics
              </button>
```

Navigation links:

```diff
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all flex items-center justify-between group/link"
                  >
```

Subscribe form:

```diff
                  <input
                    type="email"
                    required
                    placeholder="Enter your intelligence stream"
                    className="w-full bg-white/5 border border-white/20 rounded-xl py-4 px-5 pr-14 outline-none focus:border-white/50 focus:bg-white/10 transition-all text-sm font-medium tracking-wider placeholder:text-white/40"
                    aria-label="Email address"
                  />
```

Status dot and text:

```diff
-              <div className="flex items-center gap-3">
-                <div className="w-2 h-2 bg-success rounded-full shadow-[0_0_8px_#52B788] animate-pulse motion-reduce:animate-none" aria-hidden="true" />
-                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">Decentralized Node Active</span>
-              </div>
+              <div className="flex items-center gap-3">
+                <div className="w-2.5 h-2.5 bg-success rounded-full shadow-[0_0_8px_#52B788] animate-pulse motion-reduce:animate-none" aria-hidden="true" />
+                <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">Decentralized Node Active</span>
+              </nd>
```

Copyright:

```diff
-            <span>&copy; 2026 Developed by <span className="text-white/70">Balaji Goduguluru</span></span>
+            <span className="text-xs">&copy; 2026 Developed by <span className="text-white/60">Balaji Goduguluru</span></span>
```

- [ ] **Step 2: Run linting to ensure no CSS issues**

```bash
npm run lint
```

- [ ] **Step 3: Commit color contrast updates**

```bash
git add src/components/Footer.tsx
git commit -m "feat: enhance color contrast to meet WCAG AA (≥4.5:1) on bg-accent"
```

### Task 6: Ensure responsive behavior (grid columns stack on mobile)

**Files:**
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: Grid container class
- Produces: Responsive column count (`grid-cols-1 md:grid-cols-3`)

- [ ] **Step 1: Verify the grid classes already set in Task 2**

We used `grid grid-cols-1 md:grid-cols-3 gap-8`. This gives 1 column on mobile, 3 columns on medium and up. That's correct.

Optionally adjust gaps: keep `gap-8` or use `gap-6` on smaller screens. We'll keep as is.

- [ ] **Step 2: Ensure internal spacing adapts**

We used `space-y-6` inside each column; that's fine for both mobile and desktop. Could add responsive spacing but not required.

- [ ] **Step 3: Test via browser resize (manual note)** – We'll note that manual testing is required.

- [ ] **Step 4: Commit responsive verification**

```bash
git add src/components/Footer.tsx
git commit -m "feat: verify responsive grid stacks correctly on mobile"
```

### Task 7: Final review and manual testing checklist

**Files:**
- Read: `src/components/Footer.tsx`

**Interfaces:**
- None

- [ ] **Step 1: Compile and ensure no TypeScript errors**

```bash
npm run typecheck
```

- [ ] **Step 2: Run linter**

```bash
npm run lint
```

- [ ] **Step 3: Manual verification checklist (perform locally)**

  - [ ] Page loads without errors.
  - [ ] Footer visible at bottom.
  - [ ] On wide screen (≥ md): three columns visible left-to-right: Logo/Tagline | Navigation | Subscribe/Status.
  - [ ] On narrow screen (< md): columns stack vertically in same order.
  - [ ] All text meets contrast ratios (can use DevTools contrast checker).
  - [ ] Interactive elements have visible focus outline when tabbing.
  - [ ] Touch targets are at least 44×44px (verify via devtools).
  - [ ] Clicking logo scrolls to top smoothly.
  - [ ] Enter key on focused logo button triggers scroll.
  - [ ] Nav links work and are keyboard navigable.
  - [ ] Subscribe button shows notification on click.
  - [ ] Enter key in email field submits form.
  - [ ] Email input shows appropriate validation UI.
  - [ ] Schema/background schematic still visible behind footer.
  - [ ] No horizontal overflow on any breakpoint.

- [ ] **Step 5: If any issues found, fix and repeat verification.**

- [ ] **Step 6: Final commit of ready component**

```bash
git add src/components/Footer.tsx
git commit -m "feat: complete footer redesign with accessibility, typography, contrast, and responsiveness"
```

### Task 8: Clean up backup file (optional)

**Files:**
- Delete: `src/components/Footer.tsx.bak`

- [ ] **Step 1: Remove backup**

```bash
rm src/components/Footer.tsx.bak
```

- [ ] **Step 2: Commit cleanup**

```bash
git add -u
git commit -m "chore: remove backup file after footer redesign"
```

---
**Plan complete and saved to** `docs/superpowers/plans/2026-07-25-footer-redesign-plan.md`. **Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**