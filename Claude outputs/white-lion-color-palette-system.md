# Color Palette System — Anchored at `navy-700` (`#2E3D4E`)
**The White Lion, Amersham** — the full, math-verified palette built out from the one token you specified, formalizing what's already been used across the earlier color audit and the menu rebuild into one documented system, now with the secondary accent moved from maroon to teal per your revision request.

---

## 1. Intake

- **Anchor token**: `navy-700 = #2E3D4E`, already in use as a structural navy in `white-lion-menu.html`.
- **Revision**: the maroon secondary accent (`#9E3438`) has been removed at your request and replaced with a teal — see §2 for the color and the reasoning behind picking that specific hue over a plain green.
- **Fixed input kept, not re-litigated**: the gold decorative accent `#8A6D2F` was already established and justified in the earlier color audit and carried through the menu build — this exercise builds the *system* around it rather than replacing it, except where the math below finds an actual problem (it finds one — see §3, Critical).
- **What was missing before this**: the original color audit's own finding was "no semantic color system at all... no success/error/warning/info colors were found anywhere." This palette adds that missing layer for the first time, rather than leaving it undefined the next time a form or a status message needs one.
- **Audience/differentiation**: unchanged from the earlier audit — UK pub-and-Indian-kitchen audience, and the deliberate move away from the sage-green "generic modern pub" look toward the warmer navy/maroon system that differentiates from the direct local competitor's own confident single-accent approach.

---

## 2. Palette Token Table

### Primary — Navy scale (derived from the `navy-700` anchor)

All six navy steps share the anchor's exact hue and saturation (`H 212°, S 26%`) and vary only in lightness — a proper tonal ramp, not six unrelated blues picked by eye (which was the original site's problem: five near-duplicate, undocumented navy values).

| Token | Hex | RGB | HSL | Intended usage |
|---|---|---|---|---|
| `navy-900` | `#181F28` | 24, 31, 40 | 212°, 26%, 12.5% | Darkest structural panel (footer) |
| `navy-800` | `#212C38` | 33, 44, 56 | 212°, 26%, 17.5% | Header / brand bar background |
| `navy-700` | `#2E3D4E` | 46, 61, 78 | 212°, 26%, 24.3% | **Anchor.** Secondary structural surface, section dividers |
| `navy-600` | `#384A5F` | 56, 74, 95 | 212°, 26%, 29.5% | Sticky nav bar, tertiary panels |
| `navy-500` | `#475E78` | 71, 94, 120 | 212°, 26%, 37.5% | Body links, mid-emphasis interactive text on white |
| `navy-400` | `#597697` | 89, 118, 151 | 212°, 26%, 47% | Placeholder/disabled-adjacent text on white (large text or UI only — see §3) |
| `navy-100` | `#E5EAF0` | 229, 234, 240 | 212°, 26%, 92% | Tint background **on white surfaces only** — not for use on cream (see §4, Medium) |

### Secondary accent — Peacock teal (replaces maroon, at your request)

**Why teal, not plain green, and not another warm color:** you asked for green or a complementing variant. Plain green is already spoken for on this site — it's the vegetarian/vegan indicator color throughout the menu (`success` below reuses that exact green intentionally). Making the *brand* accent the same hue as "this dish is vegetarian" would mean a user glancing at a green button or badge can't tell which meaning it carries without reading the label — a real, avoidable ambiguity on a menu-heavy site, not a nitpick. So the brief becomes: find the closest color to "green" that still reads as its own distinct hue family.

The candidates and why they lose to teal:
- **A warm complement to navy** (rust/terracotta, ≈32° hue) is only ~9–11° away from the existing `gold` decorative accent (41°) and the `warning` amber (43°) — it would visually collide with two tokens the site already relies on, and sitting that close to `error` red's neighborhood on a food-and-drink site risks a "danger" reading on what's meant to be an inviting CTA.
- **A different warm red** (i.e., a lighter maroon) reintroduces the exact hue family you asked to remove.
- **Peacock teal** (`H 177°`) sits 46° from the vegetarian green, 34° from navy (close enough to feel like a deliberate cool-palette family with navy, far enough to never be mistaken for it), and 134°+ from gold/warning — no collision with anything already in the system. It's also the closest color to "green" that clears all of that: teal is a blue-green, so it answers "green or a complementing variant" literally, just rotated far enough toward blue to dodge the vegetarian-tag collision.
- **Cultural/psychological fit** (Step 2 of this exercise): peacock teal is a genuine, recurring motif in Indian textiles, art, and wedding palettes — it reads as authentically "Anglo-Indian pub" rather than a generic corporate teal, while deep teal/bottle-green tones are also a long-standing convention on traditional British pub signage and frontages. It fits both halves of "The White Lion" better than a generic warm accent would.

| Token | Hex | RGB | Intended usage |
|---|---|---|---|
| `accent` | `#206562` | 32, 101, 98 | Primary CTA fill, price emphasis, focus rings |
| `accent-hover` | `#184E4C` | 24, 78, 76 | Button hover state |
| `accent-active` / `accent-dark` | `#103C3B` | 16, 60, 59 | Button pressed state, and text-on-tint use |
| `accent-tint` | `#E7F3F3` | 231, 243, 243 | Light background for callouts/notes using `accent-dark` text |

### Tertiary decorative — Gold (split into two tokens — this is the one real fix this exercise found)

| Token | Hex | RGB | Intended usage |
|---|---|---|---|
| `gold` | `#8A6D2F` | 138, 109, 47 | **Decorative only**: motif bands, icon strokes, large-scale ornament — never body text |
| `gold-text` | `#725A27` | 114, 90, 39 | **New.** Use whenever gold appears as small text (ribbon badges, labels) — the original `gold` value fails contrast at that size (§3, Critical) |
| `gold-tint` | `#FBF3E4` | existing | Ribbon/badge background, paired only with `gold-text`, never `gold` |

### Semantic — new, previously entirely absent from the system

| Token | Hex | RGB | Intended usage | Non-color backup (colorblind-safe) |
|---|---|---|---|---|
| `success` | `#2F6B3A` | 47, 107, 58 | Confirmation states, "available now" | Reuses the existing vegetarian-tag green intentionally — both are "positive/good" signals; pair with a ✓ or check icon, never color alone |
| `error` | `#C0392B` | 192, 57, 43 | Form errors, validation failures | 172° of hue distance from the teal `accent` (see below) — an error state can never be mistaken for brand styling; pair with an ⚠ icon and inline text, not a red border alone |
| `warning-bg` | `#F5C344` | 245, 195, 68 | Warning banner background | Pair with a ⚠ icon; never pair `warning-bg` with white text — see §3 |
| `warning-text` | `#7A5B00` | 122, 91, 0 | Text/icon color on `warning-bg` | — |
| `info` | `#2B6CB0` | 43, 108, 176 | Informational banners, tooltips | Distinct blue from the `navy` structural scale — pair with an ⓘ icon |

**A deliberate note on `error` vs `accent`**: now that the brand accent is teal rather than a red-maroon, `error` red and `accent` teal sit almost exactly opposite each other on the color wheel (172° apart) — there's no realistic way to mistake one for the other, which removes a risk the old maroon-accent system genuinely had (a form error reading as "just the theme"). Even so, every semantic color here still carries a non-color backup (icon/label), per the accessibility step's colorblind requirement — that protection shouldn't depend on how far apart two hues happen to be.

### Neutrals (unchanged from the menu build, included here for completeness)

| Token | Hex | Intended usage |
|---|---|---|
| `cream` | `#FAF7F2` | Page background |
| `white` | `#FFFFFF` | Card/surface background |
| `ink` | `#1E1E1E` | Primary body text |
| `muted` | `#4A5568` | Secondary/caption text |
| `line` | `#E4DFD6` | Decorative dividers on cream (non-text, no contrast requirement — see §3) |

---

## 3. Contrast Audit Table

Every pairing below is calculated from WCAG 2.x relative luminance, not estimated.

| Pairing | Ratio | Normal text (4.5:1) | Large text/UI (3:1) |
|---|---|---|---|
| White on `navy-900` | 16.55:1 | Pass | Pass |
| White on `navy-800` | 14.18:1 | Pass | Pass |
| White on `navy-700` (anchor) | 11.09:1 | Pass | Pass |
| White on `navy-600` | 9.09:1 | Pass | Pass |
| White on `navy-500` | 6.68:1 | Pass | Pass |
| `navy-700` text on white | 11.09:1 | Pass | Pass |
| `navy-500` text on white (link color) | 6.68:1 | Pass | Pass |
| `navy-400` text on white | 4.71:1 | Pass | Pass |
| `navy-900` text on `navy-100` bg | 13.72:1 | Pass | Pass |
| `ink` on `cream` | 15.60:1 | Pass | Pass |
| `ink` on white | 16.67:1 | Pass | Pass |
| `muted` on `cream` | 7.04:1 | Pass | Pass |
| `muted` on white | 7.53:1 | Pass | Pass |
| White on `accent` (teal) | 6.78:1 | Pass | Pass |
| White on `accent-hover` | 9.40:1 | Pass | Pass |
| White on `accent-dark`/`accent-active` | 12.13:1 | Pass | Pass |
| `accent-dark` on `accent-tint` (callout text) | 10.69:1 | Pass | Pass |
| `accent` on `cream` (text use) | 6.34:1 | Pass | Pass |
| `accent` on white (text use) | 6.78:1 | Pass | Pass |
| `accent` focus ring vs. white / cream (non-text) | 6.78:1 / 6.34:1 | — | Pass |
| White on `gold` (large ornament only) | 4.87:1 | Pass | Pass |
| `ink` on `gold` (as a background) | 3.42:1 | Fail | Pass — large/UI only |
| **`gold` on `gold-tint` (small badge text, as originally shipped)** | **4.42:1** | **FAIL** | Pass |
| **`gold-text` on `gold-tint` (corrected token)** | **5.93:1** | **Pass** | Pass |
| `navy-500` as an input border on white (non-text) | 6.69:1 | — | Pass |
| **`navy-100` vs. `cream` (as a border/divider)** | **1.13:1** | — | **Fail even the 3:1 non-text minimum** |
| `line` vs. `cream` (decorative divider only) | 1.24:1 | — | N/A — see note below |
| White on `success` | 6.39:1 | Pass | Pass |
| `success` on `cream` (text) | 5.98:1 | Pass | Pass |
| White on `error` | 5.44:1 | Pass | Pass |
| `error` on `cream` (text) | 5.09:1 | Pass | Pass |
| `warning-text` on `warning-bg` | 3.84:1 | Fail | Pass — large/UI only |
| `ink` on `warning-bg` | 10.14:1 | Pass | Pass |
| White on `info` | 5.42:1 | Pass | Pass |
| `info` on `cream` (text) | 5.07:1 | Pass | Pass |

**On the two "fails" that aren't really failures**: `ink` on `gold`-as-background (3.42:1) and `warning-text` on `warning-bg` (3.84:1) both clear the 3:1 large-text/UI threshold — they're only unsuitable for small body text, which is exactly how they're scoped in §2 (large labels/banners, not paragraph text). The `line` vs. `cream` divider (1.24:1) is a deliberate, ultra-subtle decorative separator between menu rows — WCAG's non-text contrast rule (1.4.11) applies to UI components a user must perceive to operate the interface (an input's border, a focus ring), not to ornamental dividers, so this one isn't a defect. **`navy-100` vs. `cream` genuinely is a defect** — see below.

---

## 4. Prioritized Fix List

**Critical**
1. **The gold ribbon/badge text (`House Favourite`, `Signature Dish` in the current menu build) fails contrast at 4.42:1.** It's small (≈9.5px), bold, uppercase text using the raw `gold` token on the `gold-tint` background — normal text needs 4.5:1 and this misses it, narrowly but really. Fix: swap that one text color to the new `gold-text` token (`#725A27`), which passes at 5.93:1 while staying visually the same "bronze/gold" family. This is a real, previously unnoticed accessibility fail this exercise surfaced — not a style preference.

**High**
2. **Formalize the semantic color system** — the original color audit's own finding was that none existed. `success` / `error` / `warning` / `info` are now defined, contrast-checked, and each paired with a non-color backup (icon/label) so they don't rely on hue alone for colorblind users. Wire these in wherever a form validation state, a confirmation, or a status banner is ever added (the reservation form's error states, if rebuilt, are the obvious first user).
3. **`navy-100` is not usable as a border or divider on the site's `cream` background** — 1.13:1 means it's nearly invisible there, not "subtle," just wrong. Scope `navy-100` to tint backgrounds on **white** surfaces only (e.g., a light hover state on a white card); keep using the existing `line` token for dividers on cream, and use `navy-400` or `navy-500` for anything that functionally needs to read as a visible boundary (an input field outline, for instance) — both clear 3:1+ against white easily.

**Medium**
4. **`accent-hover` (`#184E4C`) and `accent-active`/`accent-dark` (`#103C3B`) are now documented as explicit tokens** alongside the new teal `accent`, so hover/pressed states are defined from the start rather than reverse-engineered from the stylesheet later. Every occurrence of the old maroon accent (`#9E3438`, `#8C2E32`, `#7E2A2D`, `#F4E7E6`) in `white-lion-menu.html` and any other build needs to be swapped to the new teal values — this is a find-and-replace across CTA buttons, price emphasis, and focus rings, not a partial restyle.
5. **Disabled-state convention**: no disabled interactive elements exist yet on the menu, but if one is ever added (a "sold out" dish, a disabled form submit), use a desaturated gray around `#A0A8B0` at roughly 2.4:1 against white — disabled elements are explicitly exempt from the 4.5:1 requirement (a user shouldn't be able to interact with them anyway), but this value keeps it clearly legible as "present but inactive" rather than invisible.

**Low**
6. No dark-mode-specific tokens are defined — consistent with the original color audit's finding that a pub/restaurant marketing site has no obligation to support one. The existing navy-900/800 panels already serve as intentional "dark surfaces" within an otherwise light design, which is a deliberate pattern, not a partial dark mode to finish.

---

## 5. Before/After Rationale

- **The navy scale is now a real tonal ramp, not five unrelated blues.** Every step shares the anchor's exact hue (212°) and saturation (26%), varying only lightness — this is the direct fix for the original color audit's "five distinct dark-navy values doing the job one or two should do" finding, now done properly from a single source of truth instead of picked by eye per Wix section.
- **`gold-text` was split from `gold` because the math demanded it, not because of taste.** This is the one place this exercise found an actual, previously-shipped contrast failure (4.42:1 on small bold text) — the fix keeps the same bronze/gold identity (identical hue and saturation) at a lightness that clears 4.5:1.
- **The secondary accent moved from maroon to a peacock teal because plain green was already taken.** Green is the site's established vegetarian/vegan signal — reusing it as the brand's CTA color would make every green element ambiguous on a menu-heavy site. Teal answers the brief literally (a green-family color that complements navy) while sitting far enough from every existing hue in the system — vegetarian green, gold, warning amber, error red — that nothing collides, and it carries a genuine cultural fit (peacock imagery in Indian design traditions, deep teal/bottle-green tones in British pub signage) that a generic accent swap wouldn't have.
- **`error` now sits almost exactly opposite `accent` on the color wheel (172°), by construction rather than luck.** The old maroon accent shared a hue family with `error` red, creating a real risk of a form error reading as "just the theme" — that risk is gone now, though both still carry icon backups regardless, per the accessibility step's colorblind requirement.
- **`success` deliberately reuses the existing vegetarian-tag green rather than introducing a new one.** Both meanings ("this dish is vegetarian," "this action succeeded") are positive/affirmative signals, so one well-tested, already-contrast-verified green serves both without adding a seventh color to track — documented here as an intentional shared token, not an accidental collision.
- **`navy-100` was scoped away from `cream` backgrounds specifically because the ratio (1.13:1) makes the boundary functionally invisible there** — a border or tint that can't be seen isn't "minimal," it's broken; the fix isn't a new color, it's using the right existing token (`line`) for that specific surface.
