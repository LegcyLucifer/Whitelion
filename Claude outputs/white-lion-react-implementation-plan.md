# The White Lion — React Implementation Plan (Reviewed & Revised)
Your pasted plan, checked against the real codebase where I could, and rebuilt to fully carry the menu redesign work (Part 4) through — not just reference it in passing.

---

## Verification note — read this before trusting the file-specific claims below

I got folder access to `D:\Whitelion` and confirmed the codebase structure is real and matches your plan exactly: `App.jsx`, `main.jsx`, `src/components/{BookingModal,Footer,Navbar,PageTransition,TopBar}.jsx`, `src/data/siteData.js`, `src/pages/{ChristmasPage,ContactPage,HomePage,MenuPage,OffersPage,PartyVenuePage,ReservationsPage,WhatsOnPage}.jsx`, and `src/styles/index.css` all exist with file sizes consistent with real, built-out components (HomePage.jsx is 23KB, ReservationsPage.jsx 16.6KB, siteData.js 21.9KB — these aren't stubs). So the plan is grounded in something real, not invented.

What I couldn't do: actually open and read those files. The tool that transfers file content from your machine into my workspace (and the one that runs commands on it) both failed with the same kind of error — "HTTP 401" / "isolated Linux environment failed to start" — while just listing folder contents worked fine. That pattern points at a local sandbox on your machine needing a restart (most likely the Claude desktop app), not a permissions problem, since you'd already granted me access to the folder. **If you want me to actually verify the plan's specific code claims line-by-line — the exact Tailwind classes, the `useState(true)` default, whether a country dropdown exists — restart the desktop app and ask me to check again.** Until then, everything below that touches existing-code specifics is a review of your plan's *text*, not an independent confirmation against the source. I've flagged the load-bearing ones explicitly.

---

## 1. Is this the right way ahead? Mostly yes — three changes first

The overall shape is sound: grouping by file, ordering by the audits' own severity, an Open Questions section up front instead of silently guessing, and a verification plan at the end instead of "looks done." Keep all of that. Three things I'd change before treating it as ready to execute:

**1. Check for a shared button/CTA component before editing ten pages by hand.** The plan lists `bg-sage` → `bg-maroon` migrations separately in `Navbar.jsx`, `Footer.jsx`, `BookingModal.jsx`, `HomePage.jsx`, `ReservationsPage.jsx`, `MenuPage.jsx`, `PartyVenuePage.jsx`, `OffersPage.jsx`, `WhatsOnPage.jsx`, and `ContactPage.jsx` — ten separate edits for what is conceptually one decision ("the primary CTA colour is now maroon"). If there's already a shared `Button.jsx` or similar, that's a one-file fix and the per-page items become "swap this page's button to use the shared component" instead of "change this class name here too." If there genuinely isn't a shared component, now — while every CTA is being touched anyway — is the moment to introduce one, otherwise this React rebuild reproduces in component form the exact problem the color audit found in the Wix site: the same visual decision made independently in ten places, guaranteed to drift the next time someone changes it in nine of them and forgets the tenth. I'd normally check this myself via a quick grep across `src/` for `bg-sage` and `<button`, but the file-read tool is down (see above) — do that grep first, before starting the per-page edits.

**2. Confirm the Tailwind v4 token mechanics before assuming `bg-maroon` will just work.** Tailwind v4 generates utility classes like `bg-sage` from tokens declared inside an `@theme { }` block in CSS — not from a plain `:root` custom property. Since `bg-sage` already works somewhere in this codebase, the fix is mechanical: find wherever `--color-sage` (or however it's named) is declared, and add `--color-maroon`, `--color-navy-900/700/600`, and `--color-link-navy` in the exact same block using the exact same naming convention. This is a two-minute check that avoids a frustrating "why isn't `bg-maroon` generating a class" debugging session later.

**3. Treat every "already correct, no fix needed" line as unverified, not confirmed.** Your plan states specific implementation facts I have no way to check right now — the newsletter checkbox's `useState(true)`, the phone field having no country dropdown, the modal not containing the consent checkbox. These may well be exactly right (whoever wrote this plan presumably read the real files), but a plan that silently skips a fix because of a wrong assumption is worse than one that re-checks a five-second thing. Have whoever executes this re-open each file the plan says "no change needed" on, and confirm before moving past it.

---

## 2. Folding in the menu redesign rationale properly

This is the part your original plan under-carries — Section 4 references "the 8-tab system described in Part 4" but doesn't actually bring along the two things that made that system trustworthy: the *exact, already-verified* data, and the *reasoning* for why it's structured the way it is. Re-deriving either one from scratch in the React port risks reintroducing mistakes that were already found and fixed once.

### 2.1 Port the data verbatim — don't re-author it from the PDFs

`white-lion-menu.html` (delivered earlier in this project) already contains a fully verified data model: every dish as one object (`name, price, description, allergen tags, isVeg, isVegan`), built with a helper function and organized into per-tab arrays (`ALL_DAY`, `BREAKFAST_ITEMS`, `LUNCH_SANDWICH`, `DRINKS_WHITE`, `PARTY_STARTERS_V`, and so on — the full list is in that file). **The right move for `siteData.js` is to copy these arrays across with only syntactic changes (the `it(...)` helper's shape, converted to whatever object shape `siteData.js` already uses), not to re-derive dietary tags or descriptions from the source PDFs a second time.**

The reason this matters more than it might sound: getting the Vegetarian/Vegan tags right took a full audit pass and several rounds of correction (documented in the rationale doc, Part 4 §6) — several dishes were initially tagged from ingredient inference ("this dessert doesn't mention meat, so V") rather than the source PDFs' own explicit `(V)`/`(VG)` marks, and had to be stripped back out once that was caught. If `siteData.js` currently has its own, independently-derived dietary tags (which the original implementation plan doesn't mention checking), **that data should be audited against the same rule before shipping**: a V/VG tag is correct only if the source PDF prints `(V)`/`(VG)` next to that exact dish, with exactly two deliberate exceptions (Gajar Halwa and Malai Kulfi — vegetarian by unambiguous Indian-dessert convention). If `siteData.js`'s existing tags don't trace back to this rule, they need the same re-audit `white-lion-menu.html` already went through — not a fresh guess.

Also carry over: the standardization on **"Sulphites"** (not "Sulphur," a labelling slip on two of the eleven source PDFs) in the shared allergen legend — your Open Questions section already flags this correctly, just make sure the legend data itself uses it consistently.

### 2.2 Port `computeToday()` verbatim — the thresholds are already validated

Your plan's bullet on this is directionally right but doesn't carry the exact values, which matters because these were cross-checked against the source PDFs' own small print, not estimated:

```js
// Kitchen hours by day (0=Sun..6=Sat)
{0:[12*60,20*60], 1:[12*60,21*60], 2:[12*60,21*60], 3:[12*60,21*60],
 4:[12*60,21*60], 5:[12*60,22*60], 6:[12*60,22*60]}
// Breakfast: Sat/Sun only, 8:30–11:30am
// Brunch:    Sat/Sun only, 8:30am–5:00pm
// Lunch:     weekdays only, 12:00–4:00pm
// Set Menu:  weekdays 12:00–4:00pm, OR all day Thursday (day===4)
// Sunday Roast: Sundays only (day===0)
```

Reimplementing this as a `useMemo`/custom hook (`useTodayStatus()`) rather than a plain function is the natural React translation, recomputed on an interval (every minute is plenty) so the "Today" tab and header pill stay live without a page refresh — the vanilla version only computed this once on load, which was fine for a static HTML file but would read as stale in a React app left open on a till or a phone for a while.

### 2.3 Bring the graphic design layer across as real components, not just data/logic

Section 9 of the rationale doc — the pass that took the menu from "accurate but bland" to something that actually sells the food — isn't mentioned anywhere in your plan's Section 4. These need to exist as React pieces, not just be implied by "rebuild the menu page":

- **A `<CategoryIcon>` component** that takes a section title and returns the matching inline SVG (starter plate, dome for grills, pizza slice, wine glass, wheat stalk, and so on), using the same keyword-matching approach as `categoryIcon()` in `white-lion-menu.html` — port that function's logic directly, it's already tuned against every section name actually in use across all eight tabs.
- **A `<SignatureRibbon>` component** — the small "House Favourite" / "Signature Dish" badge, shown only when a section name matches `/signature|favourite/i` or a dish's own description contains "signature dish" (pulled from the All Day Menu's own text for the Goat Curry, not invented enthusiasm).
- **A `<ChiliIcon>` inline marker** shown next to any dish whose own name contains "Chilli"/"Chili."
- **The motif band** (the repeating gold-diamond decorative strip used under the header and every page title) as a small reusable component or a Tailwind arbitrary-background-image utility, not hand-copied CSS in multiple places.
- **The lion crest SVG itself.** This is worth calling out specifically because the color audit (Part 1) flagged the live Wix site's brand mark as purely typographic — "no graphic mark... given the name literally invites a heraldic device, this is a missed brand-recognition opportunity." The custom line-art lion crest already drawn for `white-lion-menu.html` is the answer to that exact finding — it should replace whatever mark (if any) `Navbar.jsx` currently renders, not live only inside the menu page. Confirm what `Navbar.jsx` currently shows once the file-read tool is back; if it's text-only like the live site, this is a straightforward, already-designed fix to drop in.
- **Deliberately no stock food photography.** Worth a one-line comment in the code and in whatever design brief guides this project: adding stock photos of dishes to fill the visual gap would be the fastest way to undercut trust the moment a regular notices the photo doesn't match what's served — this was a deliberate decision in the original build, not an oversight to "fix" later by someone who didn't see the reasoning.

---

## 3. What's in the later research (not requested this round, flagging so it's a choice, not a gap you didn't know about)

You asked specifically for the menu redesign rationale to be folded in, so I've kept this plan scoped to that plus reviewing your draft. Two other documents from this project aren't reflected here at all, and I'd rather name that than have it look accidentally forgotten:

- **The experience-strategy research doc** (Crown Amersham benchmarking, trust-signal placement, a reservation-stepper redesign inspired by the competitor next door, and a real animation-opportunity sweep of `white-lion-menu.html`) — none of its recommendations (embedding reviews, a party-size stepper control, sticky booking bar, tab-switch/press-feedback motion) are in this plan yet.
- **The combined reference doc's dependencies section** (image pipeline, font consolidation, analytics choice) — also not reflected here; this plan fixes colors/typography/menu structure but doesn't touch performance.

If you want either folded in as additional sections of this same implementation plan, say so and I'll add them with the same file-grouped, priority-ordered treatment as everything above — I didn't want to silently expand scope beyond what you asked for this time.

---

## 4. Everything else from your draft

Sections 1–3 and 5 of your original plan (design tokens, global components, page-by-page CTA migration, and the verification plan) stand as written, with the three caveats from §1 above applied, plus these additions to the verification plan specifically:

- **Dietary-tag spot check**: once `siteData.js` is updated, re-verify the Vegan filter on the All Day tab returns exactly one item (Side Salad) — that was the exact regression check used when this was first caught in the vanilla build, and it's a fast, concrete way to confirm the React port didn't quietly reintroduce inferred tags.
- **axe-core pass** (automated) alongside the manual keyboard tab-throughs already listed — catches the same class of issue faster and repeatably.
- **A before/after Lighthouse run** isn't in scope for this pass (no performance work is), but is worth doing once the font/image items from the dependencies doc are ever tackled, so there's a number to point at rather than a feeling.

---

## Open items carried over unchanged from Part 4 (still need your confirmation, not a guess from me or whoever builds this)

1. Which price is correct for the four dishes differing between All Day and Lunch (Margherita Pizza, Beef Burger with Cheese & Bacon, White Lion Bowl, Confit Duck).
2. Which wine list is current — the All Day Menu's or the standalone Drinks Menu's.
3. Whether "Sulphur" on the printed Party menus is a typo (this plan standardizes on "Sulphites" in the app regardless).
4. Whether a Christmas/festive menu should be folded into the same tab system once content exists.
