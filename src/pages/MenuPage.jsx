import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { Search, CalendarCheck, Clock, ChevronRight, Flame, Info } from 'lucide-react';
import { siteData } from '../data/siteData';
import { menuData, computeToday, ALLERGEN_LEGEND } from '../data/menuData';
import { useSEO } from '../hooks/useSEO';
import Button from '../components/Button';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const DIETARY_FILTERS = [
  { id: 'all',   label: 'All Items' },
  { id: 'veg',   label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gf',    label: 'No gluten listed' },
  { id: 'spicy', label: 'Contains chilli' },
];

// Was three copies of the same predicate (SectionBlock, StandardMenuTab,
// PrivateDiningTab) — one definition now.
function matchesFilters(dish, filter, query) {
  const qMatch = !query ||
    dish.name.toLowerCase().includes(query.toLowerCase()) ||
    (dish.desc || '').toLowerCase().includes(query.toLowerCase());
  if (!qMatch) return false;
  if (filter === 'veg')   return dish.isVeg || dish.isVegan;
  if (filter === 'vegan') return dish.isVegan;
  if (filter === 'gf')    return !dish.hasGluten;
  if (filter === 'spicy') return dish.isChilli;
  return true;
}

// A menu line, not a card — name and price share a baseline the way they
// would on a printed menu, dietary tags are a quiet tracked caption rather
// than a row of coloured pills, and there's no box, shadow, or hover-lift
// implying these are clickable. Matches the printed-menu convention this
// page's earlier card-grid treatment (shadow-sm, rounded corners, hover
// translate) had drifted away from — the rest of the site had already
// moved off that "SaaS card grid" shape (see Home's highlights strip,
// Party Venue's numbered packages) but this page hadn't.
function DishRow({ dish }) {
  return (
    <div className="break-inside-avoid border-b border-dashed border-neutral-200 py-4 first:pt-0 last:border-b-0">
      {/* flex-wrap + a floor on the name — most dishes have a short single
          price ("£12.95") that always fits inline, but multi-tier prices
          ("125ml £4.80 / 175ml £6.20 / 250ml £8.20", or "Pint £4.80 / Half
          £2.60") are wide enough to squeeze a multi-word name like "House
          White (VG)" down to near-zero width, wrapping it word-by-word and
          overlapping the price. The floor keeps the name on one line and
          lets the price wrap to its own line underneath instead — and the
          price drops `whitespace-nowrap` AND `shrink-0`. `shrink-0` alone
          was the real culprit for the overflow: it pins a flex item to its
          max-content (fully unwrapped) width no matter what `white-space`
          says, so the long price rendered at its full single-line width
          and ran off the edge instead of wrapping. Default flex-shrink
          lets it shrink and wrap at the " / " boundaries when needed,
          while short single-tier prices ("£12.95") never get close to
          needing to shrink, so their layout is unaffected. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <h3 className="font-brand text-lg font-bold text-black leading-snug flex items-center gap-1.5 min-w-[140px]">
          <span>{dish.name}</span>
          {dish.isChilli && <Flame size={13} className="text-maroon/60 shrink-0" title="Contains chilli" />}
        </h3>
        <span className="font-brand text-lg font-bold text-maroon">{dish.price}</span>
      </div>
      {dish.desc && (
        <p className="text-sm text-text-muted leading-[1.5] mt-1 pr-2">{dish.desc}</p>
      )}
      {dish.tags && dish.tags.length > 0 && (
        <p className="text-xs font-semibold tracking-[0.09em] uppercase text-navy-700/60 mt-1.5">
          {dish.tags.join(' · ')}
        </p>
      )}
      {dish.allergens && dish.allergens.length > 0 && (
        <p className="text-xs text-text-muted mt-1">Contains: {dish.allergens.join(', ')}</p>
      )}
    </div>
  );
}

// `getDish` lets PrivateDiningTab reuse this exact section renderer with a
// per-item price swap (dine-in vs takeaway) instead of duplicating the
// heading + column-list markup a second time.
function SectionBlock({ section, filter, query, getDish }) {
  const dishes = useMemo(() => {
    return section.items.filter(d => matchesFilters(d, filter, query));
  }, [section, filter, query]);

  if (dishes.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="font-brand text-xl font-bold text-black mb-1.5">
        {section.name}
      </h2>
      <div className="w-10 h-[2px] bg-maroon/50 mb-5" />
      {/* CSS columns, not a grid of cards — dishes flow down one column
          then the next, the way a printed two-column menu sets type,
          instead of pairing items into equal-height rows regardless of
          how long each description runs. */}
      <div className="columns-1 md:columns-2 gap-x-12">
        {dishes.map((d, i) => <DishRow key={i} dish={getDish ? getDish(d) : d} />)}
      </div>
    </div>
  );
}

function AllergenLegend() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-10 pt-6 border-t border-neutral-200">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 cursor-pointer hover:text-maroon transition-colors"
        aria-expanded={open}
      >
        <Info size={14} />
        <span>Allergen key</span>
        <span className="text-text-muted">{open ? '−' : '+'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-text-muted">
                {ALLERGEN_LEGEND.map(a => (
                  <span key={a.code}><strong className="text-black">{a.code}</strong> — {a.label}</span>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-3 leading-[1.4] max-w-[640px]">
                Absence of a code does not guarantee the dish is free from that allergen. Please inform your server of any allergy before ordering.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── TODAY TAB ────────────────────────────────────────────────────────────── */
function TodayTab({ onOpenBooking, onNavigateTab }) {
  const today = useMemo(() => computeToday(), []);

  return (
    <div className="max-w-[840px] mx-auto">
      {/* Live status — a plain status line with a status dot, not a
          coloured alert box. The dot still tells you open/closed at a
          glance; it no longer looks like a dashboard warning banner. */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-neutral-200">
        <span className={clsx('w-2.5 h-2.5 rounded-full shrink-0 animate-pulse', today.kitchenOpen ? 'bg-success' : 'bg-caution')} />
        <div>
          <p className="font-brand font-bold text-lg text-black">
            {today.kitchenOpen ? `Kitchen open — closes ${today.closesAt}` : `Kitchen closed — opens ${today.opensAt}`}
          </p>
          <p className="text-sm text-text-muted">{today.dayLabel}, {today.timeLabel}</p>
        </div>
      </div>

      {/* What's on now */}
      <h2 className="font-brand text-xl font-bold mb-6">What can I order right now?</h2>
      {today.available.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-neutral-200">
          <Clock size={28} className="mx-auto mb-3 text-neutral-400" />
          <p className="font-brand font-bold text-black mb-1">The kitchen is currently closed.</p>
          <p className="text-sm text-text-muted">Opening hours: Sun 12–8pm · Mon–Thu 12–9pm · Fri–Sat 12–10pm</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {today.available.map((item) => (
            <button
              key={item.tabId}
              onClick={() => onNavigateTab(item.tabId)}
              className="flex items-center justify-between p-5 bg-white border border-neutral-200 hover:border-maroon/40 hover:bg-warm-cream/50 transition-[border-color,background-color] text-left group cursor-pointer"
            >
              <div>
                <div className="font-brand text-lg font-bold text-black mb-0.5">{item.name}</div>
                <div className="text-xs text-text-muted">{item.until}</div>
              </div>
              <ChevronRight size={18} className="text-maroon shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      )}

      {/* Availability schedule */}
      <div className="bg-warm-cream border border-neutral-200 p-6">
        <h3 className="font-brand text-lg font-bold mb-4">Full week schedule</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-sm">
          {today.schedule.map((row, i) => (
            <div key={i} className="flex justify-between border-b border-neutral-200 pb-2 last:border-0">
              <span className="text-text-muted">{row.label}</span>
              <span className="font-semibold text-black">{row.hours}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button variant="primary" icon={CalendarCheck} onClick={onOpenBooking}>
          Book a Table
        </Button>
      </div>
    </div>
  );
}

/* ─── STANDARD MENU TAB ─────────────────────────────────────────────────────  */
function StandardMenuTab({ sections, filter, query }) {
  const hasResults = sections.some(s => s.items.some(d => matchesFilters(d, filter, query)));

  if (!hasResults) {
    return (
      <div className="text-center py-16 px-5">
        <Search size={32} className="text-neutral-400 mb-3 mx-auto" />
        <h3 className="font-brand text-lg font-bold mb-1">No dishes match your filters</h3>
        <p className="text-text-muted text-md">Try clearing your search or changing the dietary filter.</p>
      </div>
    );
  }

  return (
    <div>
      {sections.map((s, i) => (
        <SectionBlock key={i} section={s} filter={filter} query={query} />
      ))}
    </div>
  );
}

/* ─── PRIVATE DINING TAB ─────────────────────────────────────────────────── */
function PrivateDiningTab({ filter, query, onOpenBooking }) {
  const [mode, setMode] = useState('dine-in'); // 'dine-in' | 'takeaway'
  const data = menuData.privateDining;
  const getDish = (dish) => ({
    ...dish,
    price: (mode === 'dine-in' ? dish.priceDineIn : dish.priceTakeaway) || dish.price,
  });

  return (
    <div>
      {/* Mode toggle */}
      <div className="flex gap-2 mb-8 p-1 bg-neutral-100 w-fit">
        {[
          { id: 'dine-in',   label: 'Dine-In' },
          { id: 'takeaway',  label: 'Takeaway' }
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={clsx(
              'px-5 py-2 text-sm font-semibold rounded-control transition-colors cursor-pointer',
              mode === m.id ? 'bg-white text-black shadow-control' : 'text-text-muted hover:text-black'
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Pricing note */}
      <div className="bg-warm-cream border border-neutral-200 p-4 mb-8 text-sm text-text-muted">
        {mode === 'dine-in' ? (
          <span>Dine-in party food is available à la carte. Minimum 48 hours' notice required. <strong>Please call to pre-book:</strong> 01494 766 849.</span>
        ) : (
          <span>Takeaway bundles: <strong>3 starters + 3 mains + 1 dessert = £18pp</strong> · <strong>4 + 4 + 1 = £21pp</strong>. Minimum 48 hours' notice. Call to order: 01494 766 849.</span>
        )}
      </div>

      {data.sections.map((section, i) => (
        <SectionBlock key={i} section={section} filter={filter} query={query} getDish={getDish} />
      ))}

      <div className="mt-10 text-center">
        <Button variant="primary" icon={CalendarCheck} onClick={onOpenBooking}>
          Enquire About Private Dining
        </Button>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────────────────────────────  */
const TABS = [
  { id: 'today',          label: 'Today' },
  { id: 'all-day',        label: 'All Day' },
  { id: 'breakfast',      label: 'Breakfast & Brunch' },
  { id: 'lunch',          label: 'Lunch' },
  { id: 'sunday-roast',   label: 'Sunday Roast' },
  { id: 'junior',         label: 'Junior Menu' },
  { id: 'drinks',         label: 'Drinks' },
  { id: 'private-dining', label: 'Private Dining' },
];

export default function MenuPage({ onOpenBooking }) {
  const [activeTab, setActiveTab] = useState('today');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const today = useMemo(() => computeToday(), []);

  useSEO({
    title: 'Food & Drink Menu — Indian & British Cuisine',
    description: 'Explore The White Lion Amersham’s full menu: authentic Indian curries, British pub classics, handmade pizzas and burgers, Sunday roasts, junior menu, drinks, and private dining.',
    path: '/menu',
  });

  // Reset filter/query on tab change
  useEffect(() => {
    setFilter('all');
    setQuery('');
  }, [activeTab]);

  const sections = menuData[activeTab]?.sections || [];

  return (
    <div>
      {/* Page Header — the live kitchen-status pill is this page's one
          genuinely distinctive feature, so it leads instead of sitting
          below a generic "Handcrafted with Passion" kicker (which also
          repeated the failing maroon-on-dark-navy contrast pattern
          found elsewhere on this page's original badge). */}
      <section className="bg-navy-800 text-white py-10 px-6 text-center relative border-b border-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 to-navy-800/90" />
        <div className="w-full max-w-[1240px] mx-auto relative z-10">
          <div className={clsx(
            'inline-flex items-center gap-2 mb-4 px-4 py-1.5 text-sm font-semibold',
            today.kitchenOpen
              ? 'bg-success/20 text-success-tint-dark border border-success/30'
              : 'bg-caution/20 text-caution-tint-dark border border-caution/30'
          )}>
            <span className={clsx('w-2 h-2 rounded-full', today.kitchenOpen ? 'bg-success' : 'bg-caution')} />
            {today.kitchenOpen ? `Kitchen open now · closes ${today.closesAt}` : `Kitchen closed · opens ${today.opensAt}`}
          </div>
          <h1 className="text-white text-[clamp(2.4rem,4.5vw,3.2rem)] font-bold mb-3 drop-shadow-md tracking-[-0.015em]">
            Food &amp; Drink at The White Lion
          </h1>
          <p className="text-text-muted-on-dark text-lg max-w-[680px] mx-auto leading-[1.6]">
            Authentic Indian cuisine and traditional British pub classics — all under one roof in Amersham.
          </p>
        </div>
      </section>

      <div className="w-full max-w-[1240px] mx-auto px-6 py-10 pb-20">
        {/* Tab Navigation — plain tracked text with an underline on the
            active tab, not solid pill buttons. Matches how Dishoom and
            Rules set their own menu-section tabs; the previous filled
            navy-capsule pills read as app UI on a page that's otherwise
            gone editorial. */}
        <nav aria-label="Menu sections" className="flex flex-wrap gap-x-7 gap-y-3 mb-8 border-b border-neutral-200">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'relative pb-3 text-md font-semibold tracking-[0.01em] cursor-pointer transition-colors',
                activeTab === tab.id ? 'text-maroon' : 'text-text-muted hover:text-black'
              )}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-maroon" />
              )}
            </button>
          ))}
        </nav>

        {/* Search & Filter Bar — shown on all tabs except Today. Field
            styling now matches every form on the site (warm-cream field,
            maroon focus) via the same tokens as Contact/Party Venue/
            Reservations, instead of a generic white/grey input. */}
        {activeTab !== 'today' && (
          <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative w-full md:max-w-[320px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-maroon/50" />
              <label htmlFor="menu-search" className="sr-only">Search dishes</label>
              <input
                id="menu-search"
                type="search"
                placeholder="Search dishes…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-maroon/25 bg-warm-cream font-brand text-md text-black transition-colors focus:outline-none focus:border-maroon focus:bg-white"
              />
            </div>
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Dietary filters">
              {DIETARY_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  aria-pressed={filter === f.id}
                  className={clsx(
                    'px-3.5 py-1.5 text-xs font-semibold tracking-[0.02em] rounded-control transition-colors border cursor-pointer',
                    filter === f.id
                      ? 'bg-maroon text-white border-maroon'
                      : 'bg-transparent text-text-muted border-neutral-300 hover:border-maroon/50 hover:text-maroon'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Allergen disclaimer (shown on all menu tabs except Today) */}
        {activeTab !== 'today' && (
          <p className="text-xs text-text-muted mb-8 flex items-center gap-1.5">
            <Info size={13} className="shrink-0" />
            Dietary filters are for browsing only — please always inform your server of any allergy before ordering.
          </p>
        )}

        {/* Tab content — crossfades on switch rather than hard-cutting, since
            this is the main content-swap on the page's busiest surface.
            mode="wait" so the outgoing panel fully clears before the next
            one fades in (no overlap of two menus' worth of text). */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {activeTab === 'today' && (
              <TodayTab onOpenBooking={onOpenBooking} onNavigateTab={setActiveTab} />
            )}
            {activeTab === 'all-day' && (
              <StandardMenuTab sections={menuData.allDay.sections} filter={filter} query={query} />
            )}
            {activeTab === 'breakfast' && (
              <StandardMenuTab sections={menuData.breakfast.sections} filter={filter} query={query} />
            )}
            {activeTab === 'lunch' && (
              <StandardMenuTab sections={menuData.lunch.sections} filter={filter} query={query} />
            )}
            {activeTab === 'sunday-roast' && (
              <StandardMenuTab sections={menuData.sundayRoast.sections} filter={filter} query={query} />
            )}
            {activeTab === 'junior' && (
              <StandardMenuTab sections={menuData.junior.sections} filter={filter} query={query} />
            )}
            {activeTab === 'drinks' && (
              <StandardMenuTab sections={menuData.drinks.sections} filter={filter} query={query} />
            )}
            {activeTab === 'private-dining' && (
              <PrivateDiningTab filter={filter} query={query} onOpenBooking={onOpenBooking} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Allergen legend accordion (all tabs except Today) */}
        {activeTab !== 'today' && <AllergenLegend />}

        {/* No bottom CTA banner here — this page already leads with a
            live "book a table" path (Today tab) and booking is one click
            away from every tab via the sticky Navbar, so a third
            copy of the site-wide gradient CTA box would be redundant
            chrome, not a missing conversion path. */}
      </div>
    </div>
  );
}
