import React from 'react';
import { Phone } from 'lucide-react';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';
import Button from '../components/Button';
import Badge from '../components/Badge';

// This whole page is one board, not a hero-plus-photo-grid — the deals
// are set out the way they'd actually be chalked up behind the bar: a
// day, a name, a line about it, a price, no photography at all. That's
// also the honest fix for a problem the photo-card version of this page
// ran into: the supplied offer graphics carry their own baked-in
// lettering, so overlaying more text on them read as noise, not editorial
// polish. A board that was never going to have photos on it sidesteps
// that entirely instead of working around it.
export default function OffersPage({ onOpenBooking }) {
  useSEO({
    title: 'Daily Deals & Special Offers',
    description: 'Discover daily deals at The White Lion Amersham — Cask Ale Mondays, Fizz Fridays, 2-for-£15 cocktails, and more. Great value food and drink offers every day of the week.',
    path: '/offers',
  });

  return (
    <div className="bg-navy-900">
      {/* Header — no photo, no split grid; the board starts right here */}
      <section className="border-b border-white/10 py-16 px-6 text-center">
        <Badge variant="plain" tone="neutral" onDark className="mb-3">
          Chalked Up Behind The Bar
        </Badge>
        <h1 className="text-white text-[clamp(2.2rem,4vw,2.9rem)] font-bold mb-4">
          This Week's Board
        </h1>
        <p className="text-text-muted-on-dark text-lg max-w-[560px] mx-auto leading-[1.6]">
          Same six deals, every week, rain or shine. Nothing rotates off unless we run out of chalk.
        </p>
      </section>

      <div className="w-full max-w-[860px] mx-auto px-6 py-20">
        {/* The ledger — day, name, one line, price. Dashed rules stand in
            for a chalk line drawn under each entry. */}
        <div className="flex flex-col">
          {siteData.offers.map((offer, idx) => (
            <div
              key={offer.id}
              className={`flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 py-6 border-b border-dashed border-white/20 ${idx === 0 ? 'pt-0' : ''}`}
            >
              <div className="sm:flex-1">
                <span className="text-gold-text-dark text-xs font-bold uppercase tracking-[0.1em]">{offer.day}</span>
                <h2 className="font-brand text-2xl text-white font-bold leading-tight mt-0.5">{offer.title}</h2>
                <p className="text-white/70 text-md leading-[1.5] mt-1 max-w-[440px]">{offer.desc}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0 sm:pl-6">
                <span className="font-brand text-xl font-bold text-white whitespace-nowrap">{offer.badge}</span>
                <Button variant="primary" size="sm" onClick={onOpenBooking} className="whitespace-nowrap">
                  Book
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Closing note — a paper docket pinned to the board, echoing
            What's On's noticeboard motif in a lighter touch (one card, not
            a whole page of them) so the two pages feel like the same
            place without repeating the same layout. */}
        <div className="mt-16 bg-white shadow-panel p-8 md:p-10 text-center rotate-[-0.6deg]">
          <h3 className="font-brand text-2xl font-bold text-black mb-2">Have a Large Party or Celebration?</h3>
          <p className="text-text-muted mb-6 max-w-[480px] mx-auto">
            We offer bespoke packages for groups of 10 or more, including bottomless brunch and private dining.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="navy" onClick={onOpenBooking}>Reserve Group Table</Button>
            <a
              href={siteData.info.phoneHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-[0.03em] rounded-control transition-colors bg-transparent text-black border-2 border-black hover:bg-black hover:text-white no-underline"
            >
              <Phone size={14} />
              <span>Call Us Direct</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
