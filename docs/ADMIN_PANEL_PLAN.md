# Admin Panel — Architecture & Build Plan

**Status:** Planning only. Nothing in this document has been built.
**Written:** September 2026
**Scope:** A content & information management system for thewhitelionamersham.co.uk, plus the backend the public site currently lacks entirely.

---

## 1. Why this document exists

Right now every piece of content on this site is hardcoded in two JavaScript files. Changing a dish price means editing code, committing, and redeploying. That is fine for a developer and impossible for a pub manager.

This plan covers what to build so that a non-technical person can run the site's content, what to deliberately *not* build, which stack to use and why, and what it costs (spoiler: realistically £0/month).

---

## 2. Current state — the honest baseline

| Fact | Detail |
|---|---|
| Frontend | React 18 + Vite 6 + Tailwind v4 + Framer Motion, client-rendered SPA |
| Routing | `react-router-dom` v7, 8 public routes + 404 |
| Content storage | `src/data/siteData.js` (276 lines), `src/data/menuData.js` (523 lines) |
| Content volume | **132 dishes** across 7 menus, 6 offers, 3 What's On items, 3 Christmas packages, 3 party packages, 4 gallery images, opening + kitchen hours |
| Images | 32 files, **13 MB**, committed to `public/assets/` |
| Backend | **None.** No database, no API, no auth |
| Forms | **All four are fake.** Reservation, Contact, Party Venue enquiry, and Newsletter all `setTimeout` and discard the data |
| Build output | Static files, ~465 KB JS (146 KB gzip) |

### 2.1 The thing to fix before anything else

The reservation form shows the customer **"Reservation Confirmed — Booking ref WL-12345"** and then throws the data away. Nobody at the pub ever sees it. Same for the contact form, the party-venue enquiry (a high-value lead), and the newsletter signup.

This is worse than having no form at all, because a customer believes they have a table. **Phase 0 below fixes this, and it should ship before any admin UI work starts.**

---

## 3. The core architectural insight

The site has two completely different data needs, and conflating them is the main way this project could go wrong:

| | **Content** | **Transactions** |
|---|---|---|
| Examples | Menu, prices, offers, hours, gallery | Bookings, enquiries, newsletter signups |
| Written by | Pub staff, ~weekly | The public, continuously |
| Read by | Every visitor, constantly | Pub staff only |
| Needs | Fast, cached, SEO-indexable, resilient | Persistent, real-time, private, secure |
| Best served by | **Build-time** (baked into the bundle) | **Runtime** (live database read/write) |

Treat these differently. Content should keep being static files that Google can index and that load instantly — just *generated* rather than hand-written. Transactions need a real database from day one.

---

## 4. Recommended architecture

```
┌─────────────────────────────────────────────────────────────┐
│  PUBLIC SITE (unchanged, still static)                      │
│  Cloudflare Pages · React/Vite · £0                         │
│                                                              │
│  Content ──reads──> src/data/generated/*.json (build-time)  │
│  Forms  ───writes──────────────────────────┐                │
└────────────────────────────────────────────┼────────────────┘
                                             │
┌────────────────────────────────────────────▼────────────────┐
│  SUPABASE (Postgres + Auth + Storage) · £0 free tier         │
│                                                              │
│   content tables ──┐        bookings / enquiries / signups  │
│   (menu, offers…)  │                    │                    │
└────────────────────┼────────────────────┼───────────────────┘
                     │                    │
        "Publish" ───┤                    └──> Resend email ──> pub inbox
        deploy hook  │
                     ▼
        Cloudflare rebuild → prebuild script pulls content
        → writes JSON → static site redeployed (~90s)

┌─────────────────────────────────────────────────────────────┐
│  ADMIN PANEL  — /admin/* routes in the SAME React app        │
│  Lazy-loaded, auth-gated, reuses the existing design system  │
└─────────────────────────────────────────────────────────────┘
```

### 4.1 Why the admin panel lives in the same app

This is a deliberate call. The codebase has a strongly opinionated design system — zero border radius, hard "stamp" shadows, Fraunces/Libre Franklin, a specific navy/teal palette, shared `Button`, `Select`, `DatePicker`, `Badge`, `FieldError`, and `lib/formStyles.js`. A third-party CMS admin UI (Strapi, Sanity Studio, Pocketbase's built-in panel) would look nothing like it and would need its own auth, its own hosting, and its own learning curve.

Building `/admin` routes inside the existing app means:
- Every form control already exists and is already accessible and validated
- One deploy, one domain, one auth system, one codebase
- The pub manager learns one interface that looks like their own website

**Non-negotiable:** the admin bundle must be lazy-loaded via `React.lazy()` so that a customer looking at the menu never downloads admin code. Verify with `npx vite build` that the admin chunk is separate.

### 4.2 Why build-time content, not runtime fetch

| | Build-time (recommended) | Runtime fetch |
|---|---|---|
| First paint | Instant, content in bundle | Loading spinners on every page |
| SEO | Content in the HTML payload | Worse — this is already a client-rendered SPA with meta injected in `useEffect`; adding a *second* async hop for the menu makes indexing meaningfully riskier |
| If Supabase is down/paused | Site fully works | Menu page is empty |
| Update latency | ~90 seconds after "Publish" | Instant |
| Complexity | One prebuild script | Loading/error states in every component |

A 90-second delay on a menu price change is completely acceptable for a pub. An empty menu page because a free-tier database paused is not. **Choose build-time.**

Use runtime fetch only for genuinely live data — if you later add "today's specials" or real-time table availability.

---

## 5. Tech stack

### 5.1 Recommended

| Layer | Choice | Why |
|---|---|---|
| **Database + Auth + Storage** | **Supabase** | Postgres (real SQL, real constraints, real backups), Row Level Security for auth rules, built-in auth, S3-compatible storage, generous free tier, no vendor-proprietary query language. One service covers content, transactions, login, and images. |
| **Frontend hosting** | **Cloudflare Pages** | Free, **unlimited bandwidth**, global CDN, free SSL, supports `_redirects` (needed for the Wix URL migration — see §9), 500 builds/month. |
| **Transactional email** | **Resend** | Free tier 3,000/month · 100/day. Clean API, good deliverability, simple domain verification. |
| **Admin UI** | React routes in this repo, lazy-loaded | Reuses the existing design system (§4.1) |
| **Forms/validation** | Existing `lib/validation.js` + `lib/formStyles.js` | Already written, already consistent |
| **Image processing** | `sharp` at build time (already a devDependency) or client-side resize before upload | Supabase image *transformations* are a paid feature — do not design around them |

### 5.2 Alternatives considered and rejected

| Option | Verdict |
|---|---|
| **Git-based CMS** (Sveltia CMS, Decap, TinaCMS) | Genuinely tempting: content stays as JSON in the repo, edits become git commits, £0, no backend for content at all. **Rejected as primary** because it cannot handle bookings/enquiries, so the manager would need two separate admin systems. **Reconsider if** the pub adopts a third-party booking platform (§11, Open Decision 1) — then content is the only need and this becomes the simplest possible answer. |
| **Pocketbase** | Single Go binary, SQLite, admin UI included. Very appealing, but needs a VPS (~£4/month), someone to patch and back it up, and its admin UI is developer-shaped (raw collection tables), not "update Tuesday's offer" shaped. Rejected for maintenance burden on a client with no ops person. |
| **Payload CMS 3** | Excellent, but is Next.js-native — adopting it means rewriting the entire frontend. Wildly disproportionate. |
| **Strapi** | Heavy (needs its own always-on Node host, ~£5-10/month), and its admin UI is another visual language to maintain. Over-engineered for 132 dishes. |
| **Sanity** | Great DX and a good free tier, but adds vendor lock-in via GROQ, and still leaves bookings unsolved. |
| **Firebase** | Would work, but NoSQL modelling for what is obviously relational data (menus → sections → dishes) is a downgrade from Postgres, and its pricing gets unpredictable. |
| **WordPress** | No. It would mean discarding this entire codebase. |

---

## 6. Hosting & cost — the cheapest realistic setup

### 6.1 Recommended: **£0/month**

| Service | Plan | Limits | Cost |
|---|---|---|---|
| Cloudflare Pages | Free | Unlimited bandwidth, 500 builds/mo | **£0** |
| Supabase | Free | ~500 MB database, ~1 GB storage, ~5 GB egress, 50k MAU | **£0** |
| Resend | Free | 3,000 emails/mo, 100/day | **£0** |
| Domain | Already owned | — | (existing) |
| **Total** | | | **£0/month** |

To put the free tiers in perspective for this site: 132 dishes is well under a megabyte of text. A busy pub might take 50 bookings a week — that's ~2,600 rows a year. You would need to be several orders of magnitude larger before any of these limits mattered.

> ⚠️ **Verify current limits before committing.** Free-tier terms change; the numbers above are indicative, not a guarantee. Check each provider's pricing page at build time.

### 6.2 Known free-tier gotchas

- **Supabase pauses projects after ~7 days of zero activity.** A live website with real traffic will never hit this — but a staging project might. Either accept it, or ping it weekly with a Cloudflare cron trigger.
- **Vercel's Hobby plan prohibits commercial use.** A pub's website is commercial. If you deploy to Vercel you technically need Pro (~$20/month). This is the single biggest reason to choose Cloudflare Pages.
- **Supabase image transformations are paid.** Resize images before upload (client-side canvas, or `sharp` in a build step), don't plan on on-the-fly resizing.
- **GitHub Pages can't do proper 301 redirects**, which the Wix migration needs. Another reason for Cloudflare Pages.

### 6.3 If you outgrow free (unlikely, but for reference)

| | Cost |
|---|---|
| Supabase Pro | $25/month — only needed for daily backups, no pausing, and image transforms |
| Cloudflare Pages | Stays free essentially forever for a site this size |
| **Realistic ceiling for this business** | **~£20/month**, and only if you want managed daily backups |

### 6.4 A cost that is easy to forget

**ICO data protection fee.** A UK business processing personal data (names, emails, phone numbers from booking forms) generally must register with the Information Commissioner's Office — around **£52/year** for a small organisation. Verify the current fee and whether this business qualifies for an exemption. This is a legal cost, not a hosting cost, but it belongs in the budget.

---

## 7. Data model

### 7.1 Mapping current files to tables

| Current location | Proposed table | Notes |
|---|---|---|
| `siteData.info` | `site_settings` (single row) | Phone, email, address, socials, maps URL |
| `siteData.openingHours` | `opening_hours` | 7 rows, day + open/close |
| `siteData.foodServingHours` | `kitchen_hours` | Separate from bar hours — drives the live "kitchen open now" logic in `computeToday()` |
| `siteData.offers` | `offers` | day, title, desc, badge, image, active flag, sort order |
| `siteData.whatsOn` | `events` | quiz / sports / darts; add optional start & end dates |
| `siteData.christmas` | `seasonal_content` | Keyed by campaign so future seasons reuse it |
| `siteData.partyVenue` | `venue_packages` + `venue_stats` | |
| `siteData.venueGallery` + `highlights` | `gallery_images`, `highlights` | |
| `siteData.googleReviews` | *(leave hardcoded or pull from Google API later)* | Not worth an admin screen |
| `siteData.history` | `site_settings` | Rarely changes |
| `menuData` sections | `menu_sections` | menu_id, name, sort order |
| `menuData` dishes (132) | `dishes` | See §7.2 |
| `ALLERGEN_LEGEND` | `allergens` (reference table) | The UK 14. Seed once, never user-editable |
| `KITCHEN_HOURS_BY_DAY` / `computeToday()` | Stays in code | It's logic, not content |
| — | `bookings` | **New** |
| — | `enquiries` | **New** — contact + party venue |
| — | `newsletter_subscribers` | **New** |
| — | `audit_log` | **New** — who changed what, when (see §10) |

### 7.2 The `dishes` table

Mirror the existing `dish()` helper in `menuData.js:174` exactly — it is already a well-designed schema:

```
dishes
  id, section_id (fk), name, price (text — "£8.50", "125ml £4.80 / 175ml £6.20"),
  description, sort_order, is_active,
  is_veg (bool), is_vegan (bool), has_gluten (bool default TRUE),
  is_chilli (bool), allergens (text[] or join table),
  allergens_confirmed_by (text), allergens_confirmed_at (timestamptz)
```

Two deliberate details:

1. **`price` stays free text, not a number.** The wine entries are `"125ml £4.80 / 175ml £6.20 / 250ml £8.20"`. Forcing decimals would break the menu you already have.
2. **`has_gluten` defaults to TRUE.** Never default to allergen-free. See §10.

---

## 8. Phased build plan

Estimates are rough dev-days for one developer already familiar with this codebase.

### Phase 0 — Make the forms real ⚠️ *Do this first, independent of the admin panel* — ~2 days
- Supabase project, `bookings` / `enquiries` / `newsletter_subscribers` tables
- Wire the four existing forms to actually insert (no UI redesign needed — the forms are done)
- Resend email notification to the pub on every submission
- Confirmation email to the customer
- **Add a privacy policy page and link it from every form** (the site currently has none, and these forms collect personal data)
- Rewrite the reservation success copy: it currently says "Reservation Confirmed", which the pub cannot actually guarantee. "Request received — we'll confirm by phone/email" is honest; the current wording is not.

### Phase 1 — Auth + read-only inbox — ~2 days
- Supabase Auth, email + password, one or two staff accounts. **No public signup.**
- `/admin` route group, lazy-loaded, protected
- Bookings inbox: list, filter by date, mark confirmed/cancelled, view details
- Enquiries inbox
- This alone replaces "check the email inbox" and is immediately useful

### Phase 2 — Menu management — ~4-5 days
The highest-churn content, and the biggest win.
- Migrate the 132 dishes from `menuData.js` into the database (write a one-off script; do not retype them)
- CRUD for sections and dishes, drag-to-reorder, activate/deactivate
- Allergen editing with the safeguards in §10
- Prebuild script: fetch → write `src/data/generated/menu.json`
- "Publish changes" button → Cloudflare deploy hook, with a visible "last published" timestamp

### Phase 3 — The rest of the content — ~3-4 days
Offers, events, opening/kitchen hours, seasonal content, venue packages, site settings.

### Phase 4 — Images — ~2 days
- Upload to Supabase Storage with **client-side resize before upload** (do not rely on paid transforms)
- Convert to WebP, cap dimensions, enforce a size limit
- Gallery reordering and alt-text fields (alt text should be **required** — accessibility)

### Phase 5 — Polish — ~2 days
- Audit log view
- Preview-before-publish
- Basic dashboard: this week's bookings, unread enquiries

**Total: roughly 15-17 dev-days.** Phase 0 delivers most of the immediate business value; Phase 2 delivers most of the admin value.

---

## 9. Interaction with the pending Wix migration

The live site is still on Wix and this React build is intended to replace it on the same domain. Three of the eight URLs differ (`/what-s-on` → `/whats-on`, `/partyvenue` → `/party-venue`, `/contact-us` → `/contact`), and there is an indexed duplicate at `/menu-1`.

**Do the migration and the redirects before or alongside Phase 0**, not after. Cloudflare Pages handles this with a `_redirects` file. Launching an admin panel on a domain that just lost its search rankings would be solving the wrong problem first.

---

## 10. What NOT to do

### Architecture
- ❌ **Don't rewrite the frontend to Next.js** just to get a CMS. The current stack is fine and the rewrite cost is enormous.
- ❌ **Don't put the admin panel on a separate app/subdomain.** Two deploys, two auth setups, two design systems, double the maintenance.
- ❌ **Don't ship admin code in the public bundle.** Lazy-load `/admin`. Check the build output.
- ❌ **Don't move content to runtime fetching** "because it's simpler". It costs you SEO and resilience — see §4.2.
- ❌ **Don't delete the static data files until the generated ones are proven in production.** Keep a fallback.
- ❌ **Don't self-host** (Pocketbase/Strapi on a VPS) unless someone has genuinely committed to patching and backing it up. An unpatched server is a liability, not a saving.

### Security
- ❌ **Don't build custom auth.** Use Supabase Auth.
- ❌ **Don't skip Row Level Security.** Without RLS, the anon key in your frontend can read and write everything. Public role: `INSERT` on bookings/enquiries/newsletter only, `SELECT` on nothing sensitive. Authenticated staff: full access.
- ❌ **Don't put secrets in `VITE_` env vars.** Everything prefixed `VITE_` is compiled into the public bundle and readable by anyone. The Supabase *anon* key is designed to be public; the *service role* key must never touch the frontend.
- ❌ **Don't allow public signup.** Create staff accounts manually.
- ❌ **Don't trust client-side validation alone.** Re-validate in database constraints and RLS policies.
- ❌ **Don't email booking data over unencrypted channels or to personal Gmail accounts** without thinking through §10's data-protection points.

### Data & content
- ❌ **Don't let staff freely tick allergen boxes.** `menuData.js` already carries an explicit data policy: allergens come from source documents, never inferred from ingredients, and absence is never a guarantee. Under UK food-information law, getting this wrong is a genuine safety and legal risk. The admin UI must: default `has_gluten` to TRUE, require an explicit "I confirmed this against the kitchen's allergen matrix" checkbox with the editor's name and a timestamp, and show a persistent warning on the allergen fields. **This is the single most safety-critical screen in the whole panel.**
- ❌ **Don't convert `price` to a numeric column.** The wine list breaks (§7.2).
- ❌ **Don't add a rich-text/WYSIWYG editor for dishes.** They're structured fields, not prose. A WYSIWYG invites pasted Word formatting and broken layout.
- ❌ **Don't over-model.** No multi-language, no versioning workflow, no role hierarchy, no A/B testing. One pub, two staff accounts.
- ❌ **Don't store images in the database.** Storage buckets, with the URL in the row.
- ❌ **Don't let unresized images through.** 13 MB of assets already exist; an admin uploading phone photos straight from a modern camera will add 5 MB each.

### Process
- ❌ **Don't build Phases 2-5 before Phase 0.** A beautiful menu editor on a site that silently discards bookings is the wrong priority order.
- ❌ **Don't hand it over without a written one-page "how to update the menu" guide** and a 20-minute screen recording. The best admin panel in the world fails if the manager is afraid of it.
- ❌ **Don't skip a staging environment** for content changes, once real money depends on the menu being right.

---

## 11. Compliance checklist (UK)

This is a real business collecting real personal data. Before Phase 0 ships:

- [ ] **Privacy policy page** — currently missing entirely. Must cover what's collected, why, retention, and rights.
- [ ] **Lawful basis** documented for bookings (contract/legitimate interest) and newsletter (consent — the existing consent checkbox is good, keep it).
- [ ] **Retention policy** — don't keep booking records forever. Decide a period (e.g. 12 months) and automate deletion.
- [ ] **Right to erasure** — a documented way to delete someone's data on request.
- [ ] **ICO registration fee** (~£52/year) — verify whether required.
- [ ] **Cookie/consent banner** — only if analytics or non-essential cookies are added. Currently the site uses none, which is a genuine advantage; think carefully before giving it up.
- [ ] **Allergen data governance** — see §10. Written process for who confirms allergen data and how often.

---

## 12. Open decisions — need the owner's input

1. **Third-party booking system?** Many pubs use ResDiary, OpenTable, Quandoo or SevenRooms. If the pub already uses one, or plans to, the DIY `bookings` table becomes redundant — and a git-based CMS (§5.2) becomes the simplest content answer. **Ask before building Phase 0.**
2. **Who edits content?** One manager, or several staff? Determines whether roles/audit logging matter.
3. **How often does the menu really change?** Weekly price tweaks vs. a seasonal reprint changes how much the publish flow needs to be optimised.
4. **Is the phone number discrepancy resolved?** A third-party listing shows `01494 762579`; this codebase uses `01494 766 849`. Whichever is correct must be the one that goes into `site_settings` as the single source of truth.
5. **Who owns the Supabase and Cloudflare accounts?** These should be in the *business's* name, not the developer's. Get this right at signup; migrating later is painful.

---

## 13. Recommended next action

Do **Phase 0** (§8) and the **Wix redirects** (§9) first, as one piece of work. That fixes the actively-harmful behaviour of forms that silently discard customer bookings, and protects the existing search visibility during the platform switch.

Everything else in this document can follow at whatever pace suits.
