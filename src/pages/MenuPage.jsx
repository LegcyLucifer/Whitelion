import React, { useState, useEffect, useMemo } from 'react';
import { Search, CalendarCheck, Clock, ChevronRight, Flame, Leaf, Wheat, Info, X } from 'lucide-react';
import { siteData } from '../data/siteData';
import { menuData, computeToday, ALLERGEN_LEGEND } from '../data/menuData';
import { useSEO } from '../hooks/useSEO';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const DIETARY_FILTERS = [
  { id: 'all',   label: 'All Items' },
  { id: 'veg',   label: '🌱 Vegetarian' },
  { id: 'vegan', label: '🌿 Vegan' },
  { id: 'gf',    label: '🌾 No gluten listed' },
  { id: 'spicy', label: '🌶️ Contains chilli' },
];

function TagPill({ tag }) {
  const lower = tag.toLowerCase();
  let cls = 'inline-block px-2.5 py-0.5 text-[0.72rem] font-bold tracking-[0.05em] uppercase rounded-[4px] border ';
  if (lower.includes('vegan'))       cls += 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]';
  else if (lower.includes('vegetarian')) cls += 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]';
  else if (lower.includes('chilli') || lower.includes('spicy')) cls += 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]';
  else if (lower.includes('gluten')) cls += 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]';
  else cls += 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]';
  return <span className={cls}>{tag}</span>;
}

function DishCard({ dish }) {
  return (
    <div className="bg-white rounded-[8px] p-5 shadow-sm border border-[#f3f4f6] transition-all hover:shadow-md hover:border-[#d1d5db] hover:-translate-y-[2px] flex flex-col h-full">
      <div className="flex justify-between items-start gap-3 border-b border-dashed border-[#e5e7eb] pb-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <h3 className="text-[1.05rem] text-slate-navy font-bold m-0 leading-tight">{dish.name}</h3>
            {dish.isChilli && <Flame size={13} className="text-[#dc2626] shrink-0" title="Contains chilli" />}
          </div>
        </div>
        <span className="text-[1rem] font-bold text-maroon whitespace-nowrap shrink-0">{dish.price}</span>
      </div>
      {dish.desc && (
        <p className="text-[0.9rem] text-[#656b73] mb-3 flex-1 leading-[1.55]">{dish.desc}</p>
      )}
      {dish.tags && dish.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {dish.tags.map((t, i) => <TagPill key={i} tag={t} />)}
        </div>
      )}
      {dish.allergens && dish.allergens.length > 0 && (
        <p className="text-[0.72rem] text-[#9ca3af] mt-2 leading-[1.4]">
          Contains: {dish.allergens.join(', ')}
        </p>
      )}
    </div>
  );
}

function SectionBlock({ section, filter, query }) {
  const dishes = useMemo(() => {
    return section.items.filter(d => {
      const qMatch = !query ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        (d.desc || '').toLowerCase().includes(query.toLowerCase());
      if (!qMatch) return false;
      if (filter === 'veg')   return d.isVeg || d.isVegan;
      if (filter === 'vegan') return d.isVegan;
      if (filter === 'gf')    return !d.hasGluten;
      if (filter === 'spicy') return d.isChilli;
      return true;
    });
  }, [section, filter, query]);

  if (dishes.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-[1.35rem] font-bold text-navy-800 mb-5 pb-2.5 border-b-2 border-maroon/20 flex items-center gap-2">
        {section.icon && <span className="text-[1.1rem]">{section.icon}</span>}
        {section.name}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dishes.map((d, i) => <DishCard key={i} dish={d} />)}
      </div>
    </div>
  );
}

function AllergenLegend() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-8 border border-[#e5e7eb] rounded-[8px] overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-[#f9fafb] text-[0.88rem] font-semibold text-[#374151] cursor-pointer hover:bg-[#f3f4f6] transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2"><Info size={15} className="text-[#6b7280]" /> Allergen Key</span>
        <span className="text-[#9ca3af]">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-5 py-4 bg-white">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.78rem] text-[#4b5563]">
            {ALLERGEN_LEGEND.map(a => (
              <span key={a.code}><strong className="text-black">{a.code}</strong> — {a.label}</span>
            ))}
          </div>
          <p className="text-[0.78rem] text-[#9ca3af] mt-3 leading-[1.4]">
            Absence of a code does not guarantee the dish is free from that allergen. Please inform your server of any allergy before ordering.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── TODAY TAB ────────────────────────────────────────────────────────────── */
function TodayTab({ onOpenBooking, onNavigateTab }) {
  const today = useMemo(() => computeToday(), []);

  return (
    <div className="max-w-[840px] mx-auto">
      {/* Live status banner */}
      <div className={`rounded-[10px] p-5 mb-8 flex items-start gap-4 ${today.kitchenOpen ? 'bg-[#f0fdf4] border border-[#bbf7d0]' : 'bg-[#fef2f2] border border-[#fecaca]'}`}>
        <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${today.kitchenOpen ? 'bg-[#22c55e]' : 'bg-[#ef4444]'} animate-pulse`} />
        <div>
          <p className="font-bold text-[0.95rem] mb-0.5">
            {today.kitchenOpen ? `Kitchen open — closes ${today.closesAt}` : `Kitchen closed — opens ${today.opensAt}`}
          </p>
          <p className="text-[0.88rem] text-[#4b5563]">{today.dayLabel}, {today.timeLabel}</p>
        </div>
      </div>

      {/* What's on now */}
      <h2 className="text-[1.6rem] font-bold mb-6">What can I order right now?</h2>
      {today.available.length === 0 ? (
        <div className="bg-[#f9fafb] rounded-[10px] p-8 text-center text-[#6b7280]">
          <Clock size={32} className="mx-auto mb-3 text-[#d1d5db]" />
          <p className="font-semibold text-black mb-1">The kitchen is currently closed.</p>
          <p className="text-[0.92rem]">Opening hours: Sun 12–8pm · Mon–Thu 12–9pm · Fri–Sat 12–10pm</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {today.available.map((item) => (
            <button
              key={item.tabId}
              onClick={() => onNavigateTab(item.tabId)}
              className="flex items-center justify-between p-5 bg-white rounded-[10px] border border-[#e5e7eb] shadow-sm hover:border-maroon/50 hover:shadow-md hover:-translate-y-[2px] transition-all text-left group cursor-pointer"
            >
              <div>
                <div className="text-[1.1rem] font-bold text-black mb-0.5">{item.name}</div>
                <div className="text-[0.84rem] text-[#6b7280]">{item.until}</div>
              </div>
              <ChevronRight size={18} className="text-maroon shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      )}

      {/* Availability schedule */}
      <div className="bg-warm-cream border border-[#eee8dc] rounded-[10px] p-6">
        <h3 className="text-[1.05rem] font-bold mb-4">Full week schedule</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-[0.88rem]">
          {today.schedule.map((row, i) => (
            <div key={i} className="flex justify-between border-b border-[#eee8dc] pb-2 last:border-0">
              <span className="text-[#6b7280]">{row.label}</span>
              <span className="font-semibold text-black">{row.hours}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onOpenBooking}
          className="inline-flex items-center gap-2 px-[26px] py-[11px] text-[0.94rem] font-semibold rounded-[5px] bg-maroon text-white border border-white/70 hover:bg-maroon-hover hover:border-white hover:-translate-y-[1px] transition-all cursor-pointer shadow-[0_4px_14px_rgba(158,52,56,0.3)]"
        >
          <CalendarCheck size={17} />
          <span>Book a Table</span>
        </button>
      </div>
    </div>
  );
}

/* ─── STANDARD MENU TAB ─────────────────────────────────────────────────────  */
function StandardMenuTab({ sections, filter, query }) {
  const hasResults = sections.some(s =>
    s.items.some(d => {
      const qMatch = !query ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        (d.desc || '').toLowerCase().includes(query.toLowerCase());
      if (!qMatch) return false;
      if (filter === 'veg')   return d.isVeg || d.isVegan;
      if (filter === 'vegan') return d.isVegan;
      if (filter === 'gf')    return !d.hasGluten;
      if (filter === 'spicy') return d.isChilli;
      return true;
    })
  );

  if (!hasResults) {
    return (
      <div className="text-center py-16 px-5 bg-[#fafafa] rounded-[12px] border border-[#e5e7eb]">
        <Search size={36} className="text-[#aaa] mb-3 mx-auto" />
        <h3 className="text-[1.2rem] font-bold mb-1">No dishes match your filters</h3>
        <p className="text-[#777] text-[0.92rem]">Try clearing your search or changing the dietary filter.</p>
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

  return (
    <div>
      {/* Mode toggle */}
      <div className="flex gap-2 mb-8 p-1 bg-[#f3f4f6] rounded-[8px] w-fit">
        {[
          { id: 'dine-in',   label: '🍽️ Dine-In' },
          { id: 'takeaway',  label: '🥡 Takeaway' }
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-5 py-2 text-[0.9rem] font-semibold rounded-[6px] transition-colors cursor-pointer ${
              mode === m.id ? 'bg-white text-black shadow-sm' : 'text-[#6b7280] hover:text-black'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Pricing note */}
      <div className="bg-warm-cream border border-[#eee8dc] rounded-[8px] p-4 mb-8 text-[0.88rem] text-[#4b5563]">
        {mode === 'dine-in' ? (
          <span>Dine-in party food is available à la carte. Minimum 48 hours' notice required. <strong>Please call to pre-book:</strong> 01494 766 849.</span>
        ) : (
          <span>Takeaway bundles: <strong>3 starters + 3 mains + 1 dessert = £18pp</strong> · <strong>4 + 4 + 1 = £21pp</strong>. Minimum 48 hours' notice. Call to order: 01494 766 849.</span>
        )}
      </div>

      {data.sections.map((section, i) => {
        const dishes = section.items.filter(d => {
          const qMatch = !query ||
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            (d.desc || '').toLowerCase().includes(query.toLowerCase());
          if (!qMatch) return false;
          if (filter === 'veg')   return d.isVeg || d.isVegan;
          if (filter === 'vegan') return d.isVegan;
          if (filter === 'gf')    return !d.hasGluten;
          if (filter === 'spicy') return d.isChilli;
          return true;
        });

        if (dishes.length === 0) return null;

        return (
          <div key={i} className="mb-10">
            <h2 className="text-[1.35rem] font-bold text-navy-800 mb-5 pb-2.5 border-b-2 border-maroon/20 flex items-center gap-2">
              {section.icon && <span>{section.icon}</span>}
              {section.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dishes.map((dish, j) => {
                const price = mode === 'dine-in' ? dish.priceDineIn : dish.priceTakeaway;
                return <DishCard key={j} dish={{ ...dish, price: price || dish.price }} />;
              })}
            </div>
          </div>
        );
      })}

      <div className="mt-10 text-center">
        <button
          onClick={onOpenBooking}
          className="inline-flex items-center gap-2 px-[26px] py-[11px] text-[0.94rem] font-semibold rounded-[5px] bg-maroon text-white border border-white/70 hover:bg-maroon-hover hover:border-white hover:-translate-y-[1px] transition-all cursor-pointer shadow-[0_4px_14px_rgba(158,52,56,0.3)]"
        >
          <CalendarCheck size={17} />
          <span>Enquire About Private Dining</span>
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────────────────────────────  */
const TABS = [
  { id: 'today',          label: 'Today',               emoji: '📍' },
  { id: 'all-day',        label: 'All Day',             emoji: '🍽️' },
  { id: 'breakfast',      label: 'Breakfast & Brunch',  emoji: '🥞' },
  { id: 'lunch',          label: 'Lunch',               emoji: '☀️' },
  { id: 'sunday-roast',   label: 'Sunday Roast',        emoji: '🍖' },
  { id: 'junior',         label: 'Junior Menu',         emoji: '⭐' },
  { id: 'drinks',         label: 'Drinks',              emoji: '🍺' },
  { id: 'private-dining', label: 'Private Dining',      emoji: '🎉' },
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

  const activeTabData = TABS.find(t => t.id === activeTab);
  const sections = menuData[activeTab]?.sections || [];

  return (
    <div>
      {/* Page Header */}
      <section className="bg-dark-navy text-white py-14 px-6 text-center relative border-b border-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#002e5d]/60 to-[#232f3c]/90" />
        <div className="w-full max-w-[1240px] mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-[14px] py-[5px] text-[0.76rem] font-bold tracking-[0.08em] uppercase rounded-full bg-maroon/10 text-maroon border border-maroon/30 mb-3">
            Handcrafted with Passion
          </span>
          <h1 className="text-white text-[clamp(2.4rem,4.5vw,3.2rem)] font-bold mb-3 drop-shadow-md tracking-[-0.015em]">
            Food &amp; Drink at The White Lion
          </h1>
          <p className="text-[#cbd5e1] text-[1.05rem] max-w-[680px] mx-auto leading-[1.6]">
            Authentic Indian cuisine and traditional British pub classics — all under one roof in Amersham.
          </p>
          {/* Live status pill */}
          <div className={`inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full text-[0.8rem] font-semibold ${today.kitchenOpen ? 'bg-[#22c55e]/20 text-[#bbf7d0] border border-[#22c55e]/30' : 'bg-[#ef4444]/20 text-[#fecaca] border border-[#ef4444]/30'}`}>
            <span className={`w-2 h-2 rounded-full ${today.kitchenOpen ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />
            {today.kitchenOpen ? `Kitchen open now · closes ${today.closesAt}` : `Kitchen closed · opens ${today.opensAt}`}
          </div>
        </div>
      </section>

      <div className="w-full max-w-[1240px] mx-auto px-6 py-8 pb-20">
        {/* Tab Navigation */}
        <nav aria-label="Menu sections" className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-[#e5e7eb]">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-[0.88rem] font-semibold rounded-full cursor-pointer transition-all border ${
                activeTab === tab.id
                  ? 'bg-navy-800 text-white border-navy-800 shadow-md'
                  : 'bg-white text-[#555e69] border-[#d1d5db] hover:bg-[#f3f4f6] hover:text-black'
              }`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Search & Filter Bar — shown on all tabs except Today */}
        {activeTab !== 'today' && (
          <div className="bg-[#f9fafb] p-4 rounded-[8px] border border-[#e5e7eb] mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-[380px]">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <label htmlFor="menu-search" className="sr-only">Search dishes</label>
              <input
                id="menu-search"
                type="search"
                placeholder="Search dishes…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-[6px] border border-[#d1d5db] text-[0.95rem] bg-white focus:outline-none focus:border-book-table focus:ring-1 focus:ring-book-table/30 transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Dietary filters">
              {DIETARY_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  aria-pressed={filter === f.id}
                  className={`px-[14px] py-[6px] text-[0.84rem] font-semibold rounded-[5px] transition-all border cursor-pointer ${
                    filter === f.id
                      ? 'bg-book-table text-white border-book-table shadow-sm'
                      : 'bg-transparent text-black border-black/30 hover:bg-black hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Allergen disclaimer (shown on all menu tabs except Today) */}
        {activeTab !== 'today' && (
          <p className="text-[0.8rem] text-[#9ca3af] mb-6 flex items-center gap-1.5">
            <Info size={13} className="shrink-0" />
            Dietary filters are for browsing only — please always inform your server of any allergy before ordering.
          </p>
        )}

        {/* Tab content */}
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

        {/* Allergen legend accordion (all tabs except Today) */}
        {activeTab !== 'today' && <AllergenLegend />}

        {/* Book CTA strip */}
        <div className="mt-14 bg-gradient-to-br from-[#172534] to-[#232f3c] rounded-[12px] p-8 text-white flex items-center justify-between gap-6 flex-wrap shadow-lg">
          <div>
            <h2 className="text-[1.5rem] font-bold mb-1">Like what you see?</h2>
            <p className="text-[#cbd5e1] text-[0.95rem]">Secure your table online in under 60 seconds.</p>
          </div>
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-[26px] py-[13px] text-[0.95rem] font-semibold rounded-[5px] bg-maroon text-white border border-white/70 hover:bg-maroon-hover hover:border-white hover:-translate-y-[1px] transition-all cursor-pointer shadow-[0_4px_14px_rgba(158,52,56,0.4)] whitespace-nowrap"
          >
            <CalendarCheck size={18} />
            <span>Book a Table</span>
          </button>
        </div>
      </div>
    </div>
  );
}
