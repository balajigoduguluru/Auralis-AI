## Task 4: Update typography classes per design spec

**Goal:** Update typography to use base 1rem (16px) for body text, with heading scaling via Tailwind utilities (text-xl, text-2xl, etc.) as per design spec.

**Files to modify:**
- `src/components/Footer.tsx`

**Task Details:**
1. Set base text to `text-base` (or inherit) for body copy; we'll explicitly set where needed.
2. Update heading sizes:
   - Tagline (`<h2>`): change from `text-2xl md:text-3xl` to `text-xl md:text-2xl`
   - Section headers (`<h4>`): change from `text-[10px]` to `text-xs font-bold uppercase` (keeping tracking and color)
   - Navigation links: keep `text-sm` (already)
   - Subscribe header (`<h4>`): same as section header
3. Update small text (copyright, etc.) from `text-[11px]` to `text-xs`
4. Ensure the brand name (`AURALIS AI`) remains `text-3xl font-bold` (acceptable as brand heading)
5. Verify TypeScript check passes
6. Commit the typography updates

**Exact values to use verbatim:**
- Tagline: `text-xl md:text-2xl`
- Section headers: `text-xs font-bold uppercase tracking-[0.3em]` (keep existing tracking and color classes)
- Copyright: `text-xs`
- Note: Keep existing color classes (e.g., `text-white/90`) as they will be updated in Task 5.

**Interfaces:**
- Consists: Text elements in footer
- Produces: Updated font sizes using Tailwind's scale

**Context from earlier tasks:**
- Task 1: Backup completed
- Task 2: Grid layout implemented
- Task 3: Accessibility improvements (focus outlines, touch targets) applied

**Report file:**
- Write implementer report to: .superpowers/sdd/task-4-report.md

**After completion, I will run the review package and dispatch a task reviewer.**