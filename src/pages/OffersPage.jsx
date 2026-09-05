import React from 'react';
import { CalendarCheck, Phone, Clock } from 'lucide-react';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';
import Button from '../components/Button';
import Badge from '../components/Badge';
import CtaBanner from '../components/CtaBanner';

export default function OffersPage({ onOpenBooking }) {
  useSEO({
    title: 'Daily Deals & Special Offers',
    description: 'Discover daily deals at The White Lion Amersham — Cask Ale Mondays, Fizz Fridays, 2-for-£15 cocktails, and more. Great value food and drink offers every day of the week.',
    path: '/offers',
  });
  return (
    <div>
      {/* Page Header — image+text split instead of another full centered
          navy block, using a real offer photo rather than a flat gradient. */}
      <section className="bg-dark-navy text-white border-b border-black overflow-hidden">
        <div className="w-full max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center py-14 lg:py-0">
          <div>
            <Badge variant="plain" tone="gold" onDark className="mb-3">
              Exclusive Deals &amp; Specials
            </Badge>
            <h1 className="text-white text-[clamp(2.2rem,4vw,2.9rem)] font-bold mb-4">
              Delicious Deals For Every Day
            </h1>
            <p className="text-[#cbd5e1] text-lg max-w-[520px] leading-[1.6]">
              From mid-week treats to weekend celebrations, there is always a reason to gather at
              The White Lion Amersham. Explore our latest food and drink offers below.
            </p>
          </div>
          <div className="relative hidden sm:block h-[220px] lg:h-[320px] rounded-card overflow-hidden">
            <img src={siteData.offers[0].image} alt="" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
          </div>
        </div>
      </section>

      <div className="w-full max-w-[1240px] mx-auto px-6 py-[60px] pb-20">
        {/* Bento: the first offer is featured at 2x width instead of a
            perfectly uniform 6-card grid. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteData.offers.map((offer, idx) => (
            <div
              key={offer.id}
              className={`bg-white rounded-card overflow-hidden shadow-card transition-shadow hover:shadow-lg border border-[#f3f4f6] flex flex-col group ${idx === 0 ? 'lg:col-span-2' : ''}`}
            >
              <div className={`relative overflow-hidden ${idx === 0 ? 'h-[220px] sm:h-[260px]' : 'h-[220px]'}`}>
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <span className="absolute top-4 right-4 bg-book-table text-white px-3 py-1 rounded text-xs font-bold tracking-[0.05em] uppercase shadow-control">
                  {offer.badge}
                </span>
              </div>
              <div className={`p-6 flex flex-col flex-1 ${idx === 0 ? 'sm:flex-row sm:items-center sm:gap-8' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock size={14} className="text-maroon" />
                    <span className="text-xs font-bold text-maroon uppercase">{offer.day}</span>
                  </div>
                  <h3 className="text-[1.4rem] mb-2 text-black font-bold">{offer.title}</h3>
                  <p className="text-sm text-[#656b73] leading-[1.5]">{offer.desc}</p>
                </div>
                <div className={idx === 0 ? 'sm:shrink-0 mt-4 sm:mt-0' : 'mt-auto pt-6'}>
                  <Button variant="primary" className={idx === 0 ? '' : 'w-full'} onClick={onOpenBooking}>
                    Book Your Table
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Callout */}
        <div className="mt-10">
          <CtaBanner
            variant="flat"
            title="Have a Large Party or Celebration?"
            description="We offer bespoke packages for groups of 10 or more, including bottomless brunch and private dining."
          >
            <Button variant="navy" onClick={onOpenBooking}>Reserve Group Table</Button>
            <a
              href={siteData.info.phoneHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-[0.03em] rounded-control transition-all bg-transparent text-white border border-white/75 hover:bg-white/10 hover:border-white no-underline"
            >
              <Phone size={14} />
              <span>Call Us Direct</span>
            </a>
          </CtaBanner>
        </div>
      </div>
    </div>
  );
}
