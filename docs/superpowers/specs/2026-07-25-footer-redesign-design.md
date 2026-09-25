# Footer Redesign Design Specification

## Project Context
- Redesigning the footer component for the Auralis AI website.
- Current footer is located at `src/components/Footer.tsx`.
- Goals: improve accessibility (WCAG contrast, keyboard nav), modern cleaner visual design, better mobile responsiveness.

## Approved Approach
Approach 1: Minimalist Grid
- Clean 3‑column layout on desktop (logo/tagline | navigation | subscribe/status)
- Stacks into a single column on mobile with ample spacing
- Improved typography scaling, increased touch targets, proper ARIA labels and focus outlines

## Section Architecture
- The footer maintains three main sections:
  1. Left: Logo + Tagline
  2. Middle: Navigation links (Risk Indices, Telemetry Feed, Neural API, Global Sync)
  3. Right: Subscribe form + Status indicator (Decentralized Node Active)
- On mobile (below md breakpoint), sections stack vertically in the same order (left → middle → right).

## Typography
- Base size: 1rem (16px (via Tailwind's default base.
- Headings: 16px for body text.
- Heading scaling via Tailwind utilities (text-xl, text-2xl, text-3xl, etc.).
- Retain existing Zap logo and brand name styling (text-3xl font-bold).
- Use semantic heading levels (h2 for tagline, h4 for section titles).

## Colors & Contrast
- Background: `bg-accent` (existing).
- Text contrast ratios (WCAG AA):
  - Primary text: `text-white/90` (≥ 4.5:1)
  - Secondary text: `text-white/60` (≥ 4.5:1)
  - Muted text: `text-white/40` (≥ 4.5:1)
- Interactive elements (buttons, links) provide clear hover/focus states with sufficient contrast.

## Accessibility Improvements
- All interactive elements have accessible names (aria-label or visible text).
- Focus outlines are visible and follow WCAG 2.1 standards.
- Touch targets are at least 44×44px.
- Form inputs have associated labels.
- ARIA labels for icon-only buttons (e.g., subscribe arrow).
- Navigation links are keyboard navigable.

## Responsive Behavior
- Desktop (≥ md breakpoint): 3‑column grid (`grid-cols-1 md:grid-cols-12`).
- Mobile (< md breakpoint): Single column (`grid-cols-1`).
- Vertical spacing between sections: `space-y-8` on desktop, `space-y-6` on mobile (adjusted via responsive utilities).
- Each section internally uses appropriate spacing (`space-y-6` etc.) that stacks well.

## Components & Variants
- No new components introduced; redesign uses existing primitives:
  - `logo` div (Zap icon + brand name)
  - `navLinks` array mapped to `<a>` elements
  - `subscribe` form (email input + submit button)
  - `status` indicator (dot` + text for decentralized node status
  - `Schematic` background decoration (unchanged)
- All interactive elements are native HTML (`<a>`, `<button>`, `<input>`, `<form>`) for maximum accessibility.

## Error Handling & Validation
- Email input uses `required` attribute and `type="email"` for basic client-side validation.
- Form submission is prevented via `onSubmit={(e) => { e.preventDefault(); ... }}`.
- Success/error feedback is handled via the existing `showNotification` callback prop.

## Testing Considerations
- Visual regression testing for layout changes.
- Keyboard navigation testing (Tab order, focus visibility).
- Screen reader testing (aria-label announcements, landmark regions).
- Responsive breakpoint testing (column collapse at md).
- Touch target size verification (minimum 44px).

## Implementation Notes
- Tailwind CSS utilities will be used for all styling changes.
- No custom CSS is required; changes are confined to className adjustments.
- The existing `showNotification` prop is retained for user feedback.
- No changes to component API; all props remain the same.

---
**Design Complete**