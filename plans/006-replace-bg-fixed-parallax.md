# 006 — Drop `bg-fixed` on the closing atmosphere banner

- **Status:** DONE
- **Commit at audit time:** d48bba7
- **Severity:** MEDIUM
- **Category:** Performance
- **File:** `src/pages/HomePage.jsx`

## Problem

```jsx
// src/pages/HomePage.jsx — SECTION 8: FULL-WIDTH ATMOSPHERE BANNER
<section
  className="relative min-h-[460px] flex items-center justify-center bg-cover bg-center bg-fixed text-center"
  style={{ backgroundImage: `url(/assets/interior_dining_2.webp)` }}
>
```

`background-attachment: fixed` (Tailwind's `bg-fixed`) is not
compositor-accelerated — the browser has to repaint the background on
every scroll tick rather than compositing a transform, which is the exact
trap the hero section two screens above this one explicitly avoids (see
that section's own code comments: it uses `useTransform`-driven `scale`/
`borderRadius` specifically to stay compositor-only). `background-attachment:
fixed` is also well-documented as unreliable on iOS Safari, where it is
frequently disabled or renders incorrectly, meaning mobile users — a large
share of traffic for a local pub site — likely don't even see the intended
parallax effect, only pay its cost.

This section is a single closing banner (low interaction frequency, no
repeated per-visit cost), so this is MEDIUM severity, not HIGH — but it's
a straightforward, low-risk fix.

## Target fix

Drop `bg-fixed`, keeping the section visually identical when not
scrolling (a static full-bleed cover photo) but removing the scroll-time
repaint cost and the iOS Safari inconsistency entirely:

```jsx
<section
  className="relative min-h-[460px] flex items-center justify-center bg-cover bg-center text-center"
  style={{ backgroundImage: `url(/assets/interior_dining_2.webp)` }}
>
```

This plan deliberately does **not** replace the effect with a
transform-based parallax (e.g. wrapping the image in its own scaled/
translated layer driven by `useScroll`/`useTransform`, matching the hero's
pattern). That would be a reasonable *enhancement* for a future pass, but
it requires restructuring this section (an inner absolutely-positioned
image layer, a taller wrapping container, and either a `ref`-scoped
`useScroll` or the page-level scroll progress) — real additional surface
area for a rarely-lingered-on closing banner. If you want that instead of
the simple removal, treat it as a new, separate plan rather than expanding
this one's scope.

## Steps

1. Open `src/pages/HomePage.jsx`.
2. Find the `<section>` for "SECTION 8: FULL-WIDTH ATMOSPHERE BANNER".
3. Remove `bg-fixed` from its `className` string (leave `bg-cover
   bg-center` and everything else unchanged).

## Scope boundaries

- Do not touch the hero section's existing scroll-linked `useTransform`
  animation — it's already correct and is the reference this plan is
  measured against, not something to extend into this section.
- Do not add a new parallax implementation as part of this plan (see
  "Target fix" above).
- Do not change the background image, overlay (`bg-black/60`), or any
  text content in this section.

## Verification

1. `npm run build` — must compile with no errors (pure class removal).
2. In-browser: scroll past this section at normal speed and confirm no
   visual regression — the photo should still fill the section edge-to-edge
   with the dark overlay and text exactly as before; the only difference is
   the (now-absent) fixed-attachment scroll effect.
3. Open DevTools Performance panel, record a scroll through this section
   before/after — confirm no "paint" entries attributable to the
   background on every scroll frame after the fix (a sanity check on a
   site this size, not a strict gate).
4. If feasible, check on an iOS Safari device or simulator: confirm the
   section now renders identically to desktop (previously, `bg-fixed`
   would have been unreliable there).
