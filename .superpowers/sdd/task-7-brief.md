## Task 7: Final review and manual testing checklist

**Goal:** Perform a final review of the footer component to ensure all requirements from the design spec are met and perform manual testing.

**Files to modify:**
- `src/components/Footer.tsx` (if any issues are found and need fixing)

**Task Details:**
We will perform the following verification steps (as listed in the plan):

1. Compile and ensure no TypeScript errors.
2. Run linter.
3. Manual verification checklist:
   - Page loads without errors.
   - Footer visible at bottom.
   - On wide screen (≥ md): three columns visible left-to-right: Logo/Tagline | Navigation | Subscribe/Status.
   - On narrow screen (< md): columns stack vertically in same order.
   - All text meets contrast ratios (can use DevTools contrast checker).
   - Interactive elements have visible focus outline when tabbing.
   - Touch targets are at least 44×44px (verify via devtools).
   - Clicking logo scrolls to top smoothly.
   - Enter key on focused logo button triggers scroll.
   - Nav links work and are keyboard navigable.
   - Subscribe button shows notification on click.
   - Enter key in email field submits form.
   - Email input shows appropriate validation UI.
   - Schema/background schematic still visible behind footer.
   - No horizontal overflow on any breakpoint.

If any issues are found, we will fix them and repeat verification.

**Exact values to use verbatim:**
- No specific values; we are verifying the implementation.

**Interfaces:**
- None

**Context from earlier tasks:**
- All previous tasks (1-6) have been completed.

**Report file:**
- Write implementer report to: .superpowers/sdd/task-7-report.md

**After completion, if no issues are found, we will proceed to the final commit and then task 8 (cleanup). If issues are found, we will fix and re-verify.**