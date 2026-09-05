import React from 'react';
import { CalendarCheck, Phone, Clock } from 'lucide-react';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';

export default function OffersPage({ onOpenBooking }) {
  useSEO({
    title: 'Daily Deals & Special Offers',
    description: 'Discover daily deals at The White Lion Amersham — Cask Ale Mondays, Fizz Fridays, 2-for-£15 cocktails, and more. Great value food and drink offers every day of the week.',
    path: '/offers',
  });
  return (
    <div>
      {/* Page Header */}
      <section className="bg-dark-navy text-white py-16 px-6 text-center shadow-inner relative border-b border-black">
        <div className="absolute inset-0 bg-gradient-to-b from-[#002e5d]/60 to-[#232f3c]/90" />
        <div className="w-full max-w-[1240px] mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-[14px] py-[5px] text-[0.76rem] font-bold tracking-[0.08em] uppercase rounded-full bg-sage-subtle text-[#4b7349] border border-sage/45 mb-3">
            Exclusive Deals & Specials
          </span>
          <h1 className="text-white text-[clamp(2.4rem,4.5vw,3.2rem)] font-bold mb-4 drop-shadow-md">Delicious Deals For Every Day</h1>
          <p className="text-[#cbd5e1] text-[1.1rem] max-w-[700px] mx-auto leading-[1.6]">
            From mid-week treats to weekend celebrations, there is always a reason to gather at
            The White Lion Amersham. Explore our latest food and drink offers below.
          </p>
        </div>
      </section>

      <div className="w-full max-w-[1240px] mx-auto px-6 py-[60px] pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteData.offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-[12px] overflow-hidden shadow-md border border-[#f3f4f6] transition-all hover:-translate-y-1.5 hover:shadow-lg flex flex-col group">
              <div className="relative h-[220px] overflow-hidden">
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <span className="absolute top-4 right-4 bg-book-table text-white px-3 py-1 rounded-[4px] text-[0.75rem] font-bold tracking-[0.05em] uppercase shadow-md">
                  {offer.badge}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock size={14} className="text-maroon" />
                  <span className="text-[0.82rem] font-bold text-maroon uppercase">
                    {offer.day}
                  </span>
                </div>
                <h3 className="text-[1.4rem] mb-2 text-black font-bold">{offer.title}</h3>
                <p className="text-[0.95rem] text-[#656b73] mb-6 flex-1 leading-[1.5]">{offer.desc}</p>
                <div className="mt-auto">
                  <button
                    className="inline-flex items-center justify-center gap-2 px-[26px] py-[11px] text-[0.94rem] font-semibold tracking-[0.03em] rounded-[5px] transition-all bg-maroon text-white border border-white/70 shadow-[0_4px_14px_rgba(158,52,56,0.35)] hover:bg-maroon-hover hover:border-white hover:-translate-y-[1px] cursor-pointer w-full"
                    onClick={onOpenBooking}
                  >
                    <CalendarCheck size={16} />
                    <span>Book Your Table</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Callout */}
        <div className="bg-[#111417] rounded-[16px] p-10 text-white flex items-center justify-between gap-7 flex-wrap mt-10 border border-white/10 shadow-lg">
          <div className="max-w-[600px]">
            <h3 className="text-white text-[1.8rem] mb-2 font-bold">
              Have a Large Party or Celebration?
            </h3>
            <p className="text-[#cbd5e1] text-[0.98rem] leading-[1.6]">
              We offer bespoke packages for groups of 10 or more, including bottomless brunch and private dining.
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <button className="inline-flex items-center justify-center gap-2 px-[26px] py-[11px] text-[0.94rem] font-semibold tracking-[0.03em] rounded-[5px] transition-all bg-book-table text-white border border-book-table shadow-[0_2px_6px_rgba(0,0,0,0.15)] hover:bg-book-table-hover hover:shadow-[0_4px_12px_rgba(50,65,88,0.3)] hover:-translate-y-[1px] cursor-pointer" onClick={onOpenBooking}>
              <span>Reserve Group Table</span>
            </button>
            <a href={siteData.info.phoneHref} className="inline-flex items-center justify-center gap-2 px-[26px] py-[11px] text-[0.94rem] font-semibold tracking-[0.03em] rounded-[5px] transition-all bg-transparent text-white border border-white/75 hover:bg-white/10 hover:border-white hover:-translate-y-[1px] cursor-pointer no-underline">
              <Phone size={14} />
              <span>Call Us Direct</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
