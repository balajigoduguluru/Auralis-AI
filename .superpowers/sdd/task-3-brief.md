## Task 3: Apply accessibility improvements (ARIA labels, focus outlines)

**Goal:** Improve accessibility by ensuring proper ARIA labels, visible focus outlines, and adequate touch targets (≥ 44×44px).

**Files to modify:**
- `src/components/Footer.tsx`

**Task Details:**
1. Verify existing ARIA labels are present (Zap logo button already has aria-label="Scroll to top")
2. Ensure all buttons have accessible names (Neural Privacy and Agent Ethics buttons have visible text; Subscribe button uses aria-label="Subscribe")
3. Add focus-visible outline style via Tailwind for keyboard focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70`
4. Ensure touch targets meet 44×44 minimum:
   - Adjust Subscribe button from `w-10 h-10` to `h-11 w-11` (≈44px)
   - Consider increasing Zap logo container if needed (currently `w-14 h-14` = 56px, which is sufficient)
5. Run linting to ensure no JSX errors
6. Commit accessibility updates

**Exact values to use verbatim:**
- Focus utility classes: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70`
- Subscribe button size: `h-11 w-11` (increase from `w-10 h-10`)
- Separator size adjustment: `w-1.5 h-1.5` (increase from `w-1 h-1`)
- Status dot size: `w-2.5 h-2.5` (increase from `w-2 h-2`)
- Status text size: `text-xs` (increase from `text-[10px]`)
- Copyright text size: `text-xs` (increase from `text-[11px]`)

**Interfaces:**
- Consumes: Existing interactive elements
- Produces: Same elements with proper ARIA attributes and visible focus styles

**Context from earlier tasks:**
- Task 1 completed: Backed up original Footer.tsx to Footer.tsx.bak
- Task 2 completed: Implemented new grid layout structure

**Report file:**
- Write implementer report to: .superpowers/sdd/task-3-report.md

**After completion, I will run the review package and dispatch a task reviewer.**