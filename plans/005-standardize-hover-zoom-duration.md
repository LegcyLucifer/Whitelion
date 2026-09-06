# 005 — Standardize photo hover-zoom duration (250ms → 500ms)

- **Status:** DONE
- **Commit at audit time:** d48bba7
- **Severity:** MEDIUM
- **Category:** Cohesion / Easing & Duration
- **File:** `src/pages/HomePage.jsx`

## Problem

The same interaction — a photo scaling up slightly on hover
(`group-hover:scale-*` / `hover:scale-*` with `transition-transform`) —
runs at two different speeds across the site with no stated reason:

- `duration-500` (500ms): `src/pages/OffersPage.jsx:50`,
  `src/pages/ReservationsPage.jsx:76`, `src/pages/PartyVenuePage.jsx:293`,
  `src/pages/HomePage.jsx:213` (gallery grid) — **4 instances**.
- `duration-250` (250ms): `src/pages/HomePage.jsx:149` and `:155` (the two
  "Our Story" section photos) — **2 instances**.

500ms is the established convention (4 of 6 instances); the two 250ms
outliers are both in the same section of the same file, most likely a
one-off that was never reconciled with the rest of the site.

## Target fix

In `src/pages/HomePage.jsx`, change both occurrences of `duration-250` to
`duration-500`:

```jsx
// Before (appears twice, ~lines 149 and 155):
className="rounded-[8px] object-cover w-full h-[280px] shadow-md transition-transform duration-250 hover:scale-[1.02]"

// After:
className="rounded-[8px] object-cover w-full h-[280px] shadow-md transition-transform duration-500 hover:scale-[1.02]"
```

Only the duration number changes. The scale amount (`scale-[1.02]`, deliberately
smaller than the gallery's `scale-105` since these are larger, more
prominent images) is correct as-is and must not change.

## Steps

1. Open `src/pages/HomePage.jsx`.
2. In the "Our Story" section (two `<img>` elements for the beer garden
   patio and the sage-green lounge photos), find both instances of
   `transition-transform duration-250 hover:scale-[1.02]`.
3. Change `duration-250` to `duration-500` in both.
4. Do not touch any other `duration-*` value in the file (the hero's
   scroll-linked `transition-opacity duration-500 ease-out` cross-fade and
   the gallery grid's `duration-500` are already correct/consistent).

## Scope boundaries

- This plan is scoped to the one confirmed inconsistency found in the
  audit. Do not go looking for other duration values to "improve" — if you
  spot something else, note it as a new finding rather than folding it into
  this plan.
- Do not add new `--duration-*` design tokens to `src/styles/index.css` as
  part of this plan. Tailwind v4's built-in `duration-*` scale (which
  includes 500) already covers this value with zero config; introducing a
  custom theme token for a single reused number is unjustified scope
  creep, and Tailwind v4's `@theme` duration-namespace behavior wasn't
  verified during this audit — don't add config you haven't confirmed
  actually generates the expected utility.

## Verification

1. `npm run build` — must compile with no errors (this is a plain string
   change to an existing, already-valid Tailwind class).
2. In-browser: hover each of the two "Our Story" photos on the homepage.
   Confirm the zoom now takes the same visible time as hovering a card in
   the "Around The Pub" gallery grid directly below it, the Offers page
   cards, or the Reservations/Party Venue photo galleries — all should now
   feel identical in speed.
3. Feel-check side-by-side: hover a Story photo, then immediately hover a
   gallery tile. There should be no perceptible difference in zoom speed.
