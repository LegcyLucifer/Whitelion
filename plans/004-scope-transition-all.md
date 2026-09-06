# 004 — Replace `transition-all` with the specific properties that change

- **Status:** DONE
- **Commit at audit time:** d48bba7
- **Severity:** MEDIUM
- **Category:** Performance
- **Files:** 8 files, 18 call sites (table below)

## Problem

`transition-all` sets `transition-property: all`, which makes the browser
watch every animatable CSS property on the element — including
`box-shadow` (paint-cost, not compositor-cost) and any future property a
later edit might add (`padding`, `width`, etc. would silently start
animating too, which is rarely intended). Kowalski's guidance here is
direct: scope transitions to what's actually changing. `Button.jsx` alone
is used on nearly every page, so this one file's fix has the widest reach
of any finding in this audit.

## Target fix

For each call site, replace `transition-all` with the minimal
`transition-*` (or Tailwind v4 arbitrary `transition-[prop1,prop2]`)
utility covering exactly the properties that change on `:hover`/`:focus`/
`:active` for that element. No other class on the line changes.

| # | File:line | Properties actually changing | Replace `transition-all` with |
|---|-----------|-------------------------------|-------------------------------|
| 1 | `src/components/Button.jsx:34` | `background-color`, `border-color`, `transform` (hover bg/border per variant + `active:scale`/`active:translate-y`) | `transition-[background-color,border-color,transform]` |
| 2 | `src/components/Navbar.jsx:45` (the `<header>`) | **none** — no `hover:`/state class exists on this element at all; the class is vestigial | remove `transition-all` entirely (delete the word from the className string) |
| 3 | `src/components/Navbar.jsx:81` (header "Book a Table") | `background-color`, `border-color`, `transform` | `transition-[background-color,border-color,transform]` |
| 4 | `src/components/Navbar.jsx:140` (drawer "Book a Table") | `background-color`, `border-color`, `transform` | `transition-[background-color,border-color,transform]` |
| 5 | `src/components/Navbar.jsx:151` (drawer "Call" link) | `background-color` only | `transition-colors` |
| 6 | `src/components/Footer.jsx:204` (newsletter Subscribe button) | `background-color`, `border-color`, `transform` | `transition-[background-color,border-color,transform]` |
| 7 | `src/pages/WhatsOnPage.jsx:118` | `background-color`, `color` | `transition-colors` |
| 8 | `src/pages/OffersPage.jsx:84` | `background-color`, `border-color` | `transition-colors` |
| 9 | `src/pages/HomePage.jsx:364` | `background-color`, `border-color` | `transition-colors` |
| 10 | `src/pages/ChristmasPage.jsx:85` | `background-color`, `border-color` | `transition-colors` |
| 11 | `src/pages/ContactPage.jsx:251` | `background-color`, `color` | `transition-colors` |
| 12 | `src/pages/ReservationsPage.jsx:60` | `background-color`, `border-color`, `transform` | `transition-[background-color,border-color,transform]` |
| 13 | `src/pages/PartyVenuePage.jsx:278` | `background-color`, `border-color`, `transform` | `transition-[background-color,border-color,transform]` |
| 14 | `src/pages/MenuPage.jsx:31` (`DishCard`) | `box-shadow`, `border-color`, `transform` | `transition-[box-shadow,border-color,transform]` |
| 15 | `src/pages/MenuPage.jsx:146` (Today-tab available item) | `box-shadow`, `border-color`, `transform` | `transition-[box-shadow,border-color,transform]` |
| 16 | `src/pages/MenuPage.jsx:358` (menu tab pill, template string) | `background-color`, `color`, `border-color` | `transition-colors` |
| 17 | `src/pages/MenuPage.jsx:382` (search input) | `border-color`, `box-shadow` (focus ring) | `transition-[border-color,box-shadow]` |
| 18 | `src/pages/MenuPage.jsx:392` (dietary filter pill, template string) | `background-color`, `color`, `border-color` | `transition-colors` |

`transition-colors` is Tailwind's built-in utility (covers `color`,
`background-color`, `border-color`, already exists, no new config needed).
`transition-[...]` is Tailwind v4's arbitrary-value syntax for
`transition-property` — also requires no config changes, just written
inline per call site as shown.

## Steps

1. Work through the table top to bottom, one file at a time.
2. In each file, find the exact `transition-all` occurrence at the given
   line (line numbers are current as of commit `d48bba7`; if the file has
   since changed, locate by the surrounding class string shown in the
   Problem/table context instead of trusting the line number blindly).
3. Replace only the token `transition-all` with the replacement in the
   table. Do not reorder or otherwise touch neighboring classes.
4. Row 2 (`Navbar.jsx:45`) is a deletion, not a replacement — remove
   `transition-all` and the extra space it leaves behind.

## Scope boundaries

- Do not change hover/focus/active behavior itself (colors, translate
  amounts, shadow values) — only the `transition-property` scoping.
- Do not touch `transition-colors`/`transition-shadow`/`transition-transform`
  /`transition-opacity` classes that already exist correctly elsewhere in
  the codebase (e.g. `WhatsOnPage.jsx`'s `transition-shadow` cards) — this
  plan only touches the 18 `transition-all` sites listed.
- If you find an additional `transition-all` occurrence not in this table
  (e.g. introduced after commit `d48bba7`), do not guess — leave it and
  note it for a follow-up pass rather than silently applying a pattern from
  this table without checking what actually changes on that element.

## Verification

1. `npm run build` — must compile with no errors (all replacement classes
   are valid Tailwind v4 syntax with no config changes required).
2. In-browser, spot-check at least one row from each replacement pattern:
   - A `Button` variant (row 1): hover and active-press still animate
     background/border/lift smoothly.
   - A card (row 14, Menu page `DishCard`): hover still lifts + shadows +
     border-color-shifts smoothly.
   - A tab pill (row 16): switching Menu page tabs still colors/backgrounds
     transition smoothly, not an instant snap.
   - The search input focus ring (row 17): focusing it still transitions
     border-color and the ring smoothly.
3. Confirm the `Navbar.jsx:45` header (row 2) behaves identically to
   before — it had no transition effect in practice, so removing the class
   should be visually undetectable.
4. Open DevTools Performance panel, record a hover interaction on a card
   grid (e.g. the Offers page), confirm no unexpected style recalculation
   on unrelated properties (a sanity check, not a hard pass/fail gate on a
   site this size).
