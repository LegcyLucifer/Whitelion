import React from 'react';
import { CalendarCheck, Phone, Gift, Sparkles } from 'lucide-react';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';

export default function ChristmasPage({ onOpenBooking }) {
  const { title, subtitle, desc, courses } = siteData.christmas;
  useSEO({
    title: 'Christmas Dining & Festive Parties Amersham',
    description: 'Celebrate Christmas at The White Lion Amersham. Festive banquets, corporate holiday lunches, and Christmas Eve dining in Little Chalfont. Book your date early — tables fill fast.',
    path: '/christmas',
  });

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-[#1e3f45] to-[#152d31] text-white py-16 px-6 text-center shadow-inner relative border-b border-[#0f1f22]">
        <div className="absolute inset-0 bg-black/20" />
        <div className="w-full max-w-[1240px] mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-[14px] py-[5px] text-[0.76rem] font-bold tracking-[0.08em] uppercase rounded-full bg-[#c5a059]/15 text-[#e5c788] border border-[#c5a059]/40 mb-3">
            Festive Season Celebrations
          </span>
          <h1 className="text-white text-[clamp(2.4rem,4.5vw,3.2rem)] font-bold mb-4 drop-shadow-md">{title}</h1>
          <p className="text-[#cbd5e1] text-[1.1rem] max-w-[700px] mx-auto leading-[1.6]">
            {subtitle} — {desc}
          </p>
        </div>
      </section>

      <div className="w-full max-w-[1240px] mx-auto px-6 py-[60px] pb-20">
        <div className="max-w-[840px] mx-auto text-center mb-[50px]">
          <span className="inline-flex items-center gap-1.5 px-[14px] py-[5px] text-[0.76rem] font-bold tracking-[0.08em] uppercase rounded-full bg-sage-subtle text-[#4b7349] border border-sage/45 mb-3">
            Eat, Drink & Be Merry
          </span>
          <h2 className="text-[2.4rem] mb-4 font-bold text-black font-serif">Celebrate Christmas with Us</h2>
          <p className="text-[#4b5563] text-[1.05rem] leading-[1.7]">
            Whether you're organizing your company Christmas party, an intimate festive dinner with loved ones,
            or drinks with friends around a warm pub fireplace, The White Lion offers festive dining experiences combining classic British roasts and spiced festive favorites.
          </p>
        </div>

        {/* Festive Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-[60px]">
          {courses.map((c, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#edf0f2] rounded-[12px] p-8 md:p-10 shadow-sm flex flex-col transition-transform duration-250 hover:-translate-y-1 hover:shadow-md hover:border-maroon/40 group"
            >
              <div className="w-14 h-14 rounded-full bg-sage-subtle text-[#4b7349] flex items-center justify-center mb-5 transition-transform group-hover:scale-110 group-hover:bg-maroon/10 group-hover:text-maroon">
                <Gift size={28} />
              </div>
              <h3 className="text-[1.75rem] mb-3 text-black font-bold">{c.title}</h3>
              <p className="text-[#555e69] leading-[1.7] mb-6 flex-1">{c.desc}</p>
              <button className="inline-flex items-center justify-center gap-2 px-[26px] py-[11px] text-[0.94rem] font-semibold tracking-[0.03em] rounded-[5px] transition-all bg-maroon text-white border border-maroon hover:bg-maroon-hover hover:shadow-[0_4px_14px_rgba(158,52,56,0.45)] hover:-translate-y-[1px] cursor-pointer" onClick={onOpenBooking}>
                <CalendarCheck size={16} />
                <span>Reserve Festive Table</span>
              </button>
            </div>
          ))}
        </div>

        {/* Festive Callout Banner */}
        <div className="bg-[#121517] rounded-[16px] p-10 py-12 text-center text-white border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-maroon/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sage/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <Sparkles size={36} className="text-sage mx-auto mb-4" />
            <h3 className="text-white text-[2rem] mb-3 font-bold">
              Bookings Now Open for the Holiday Season
            </h3>
            <p className="text-[#cbd5e1] max-w-[640px] mx-auto mb-7 text-[1rem]">
              Key dates fill up rapidly. Contact our reservations team today to secure your preferred date and time slot.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button className="inline-flex items-center justify-center gap-2 px-[26px] py-[11px] text-[0.94rem] font-semibold tracking-[0.03em] rounded-[5px] transition-all bg-maroon text-white border border-maroon shadow-[0_2px_6px_rgba(158,52,56,0.25)] hover:bg-maroon-hover hover:shadow-[0_4px_14px_rgba(158,52,56,0.45)] hover:-translate-y-[1px] cursor-pointer" onClick={onOpenBooking}>
                <CalendarCheck size={18} />
                <span>Book a Table Online</span>
              </button>
              <a href={siteData.info.phoneHref} className="inline-flex items-center justify-center gap-2 px-[26px] py-[11px] text-[0.94rem] font-semibold tracking-[0.03em] rounded-[5px] transition-all bg-transparent text-white border border-white/75 hover:bg-white/10 hover:border-white hover:-translate-y-[1px] cursor-pointer no-underline">
                <Phone size={16} />
                <span>Call 01494 766 849</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
