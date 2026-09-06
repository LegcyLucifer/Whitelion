# 003 — Global `prefers-reduced-motion` guard for non-Framer CSS motion

- **Status:** DONE
- **Commit at audit time:** d48bba7
- **Severity:** HIGH
- **Category:** Accessibility
- **File:** `src/styles/index.css`

## Problem

`src/App.jsx` wraps the app in `<MotionConfig reducedMotion="user">`, which
correctly suppresses *Framer Motion* animation for users with
`prefers-reduced-motion: reduce`. But the majority of this site's motion is
plain Tailwind `transition-*`/`hover:*`/`animate-pulse` utilities —
`MotionConfig` has no effect on those. There is no `@media
(prefers-reduced-motion: reduce)` rule anywhere in `src/styles/index.css`.

Concretely, a reduced-motion user still gets, unfiltered:
- Every button press-scale (`active:scale-[0.97]` in `Button.jsx`)
- Every card hover-lift/zoom across Menu, Offers, Reservations, Party
  Venue, Home (`hover:-translate-y-*`, `hover:scale-*`)
- The kitchen-status dot in `src/pages/MenuPage.jsx` (`animate-pulse`),
  which loops **continuously and indefinitely** while the Menu page is
  open — not triggered by interaction at all. This is exactly the class of
  ambient, non-essential looping animation reduced-motion settings exist
  to suppress.

## Target fix

Add a global reduced-motion guard to `src/styles/index.css`, inside the
existing `@layer base` block (after the `:focus-visible` rule, before the
closing `}`):

```css
  /* Respect OS-level reduced-motion preference for every plain-CSS
     transition/animation on the site (Framer Motion's own animations are
     already covered by <MotionConfig reducedMotion="user"> in App.jsx —
     this rule covers everything that isn't Framer Motion: hover/press
     transitions, and looping @keyframes like animate-pulse). */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
```

This is the standard, widely-used pattern (near-zero duration rather than
`none`, so `transitionend`/`animationend` event listeners some components
may rely on still fire). It also neutralizes the `html { scroll-behavior:
smooth; }` rule declared earlier in the same file for reduced-motion users.

## Steps

1. Open `src/styles/index.css`.
2. Locate the `:focus-visible { ... }` rule at the end of the `@layer base`
   block (currently the last rule before that block's closing `}`).
3. Insert the `@media (prefers-reduced-motion: reduce) { ... }` block shown
   above immediately after it, still inside `@layer base`.
4. Do not touch anything else in the file.

## Scope boundaries

- Do not remove or modify `MotionConfig reducedMotion="user"` in
  `App.jsx` — the two mechanisms are complementary (Framer Motion vs.
  everything else), not redundant.
- Do not add per-component `prefers-reduced-motion` overrides in this pass
  — the global rule is intentionally blunt and covers 100% of the current
  plain-CSS motion inventory from the audit. A future component with a
  legitimate reason to animate even under reduced-motion (rare, and none
  identified in this audit) would need an explicit, documented exception —
  don't invent one speculatively here.

## Verification

1. `npm run build` — must compile with no errors (pure CSS addition).
2. In-browser: enable reduced-motion (Chrome DevTools → Rendering tab →
   "Emulate CSS media feature prefers-reduced-motion: reduce", or OS-level
   setting).
3. Confirm the Menu page's kitchen-status dot ([MenuPage.jsx:123](../src/pages/MenuPage.jsx#L123))
   is static, not pulsing.
4. Confirm button press (`active:scale-[0.97]`) and card hover-lift effects
   no longer visibly animate (should snap instantly, not glide).
5. Confirm the Framer-Motion-driven interactions (page transitions, the
   BookingModal/Navbar drawer animations from plans 001–002, the scroll-
   linked hero) are unaffected by this CSS change and still respect
   reduced-motion via their own existing `MotionConfig` mechanism.
6. With reduced-motion *off* (normal setting), confirm nothing changed —
   this media query must have zero effect on default behavior.
