import React from 'react';
import { CalendarCheck, Phone, Gift, Sparkles } from 'lucide-react';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';
import Button from '../components/Button';
import Badge from '../components/Badge';

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
          <Badge variant="plain" tone="gold" onDark className="mb-3">
            Festive Season Celebrations
          </Badge>
          <h1 className="text-white text-[clamp(2.4rem,4.5vw,3.2rem)] font-bold mb-4 drop-shadow-md">{title}</h1>
          <p className="text-[#cbd5e1] text-[1.1rem] max-w-[700px] mx-auto leading-[1.6]">
            {subtitle} — {desc}
          </p>
        </div>
      </section>

      <div className="w-full max-w-[1240px] mx-auto px-6 py-[60px] pb-20">
        <div className="max-w-[840px] mx-auto text-center mb-[50px]">
          <Badge tone="gold" className="mb-3">
            Eat, Drink &amp; Be Merry
          </Badge>
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
              className="bg-white border border-[#edf0f2] rounded-card p-8 md:p-10 shadow-sm flex flex-col transition-shadow hover:shadow-md hover:border-maroon/40 group"
            >
              <div className="w-14 h-14 rounded-full bg-sage-subtle text-[#4b7349] flex items-center justify-center mb-5 transition-colors group-hover:bg-maroon/10 group-hover:text-maroon">
                <Gift size={28} />
              </div>
              <h3 className="text-[1.75rem] mb-3 text-black font-bold">{c.title}</h3>
              <p className="text-[#555e69] leading-[1.7] mb-6 flex-1">{c.desc}</p>
              <Button variant="primary" icon={CalendarCheck} onClick={onOpenBooking}>
                Reserve Festive Table
              </Button>
            </div>
          ))}
        </div>

        {/* Festive Callout Banner — the most differentiated CTA box on
            the site already (decorative blurred glows), so structure is
            kept as-is; only tokens/components migrated. */}
        <div className="bg-[#121517] rounded-panel p-10 py-12 text-center text-white border border-white/10 shadow-panel relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-maroon/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sage/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <Sparkles size={36} className="text-sage mx-auto mb-4" />
            <h3 className="text-white text-[2rem] mb-3 font-bold">
              Bookings Now Open for the Holiday Season
            </h3>
            <p className="text-[#cbd5e1] max-w-[640px] mx-auto mb-7 text-base">
              Key dates fill up rapidly. Contact our reservations team today to secure your preferred date and time slot.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button variant="primary" icon={CalendarCheck} onClick={onOpenBooking}>
                Book a Table Online
              </Button>
              <a
                href={siteData.info.phoneHref}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-[0.03em] rounded-control transition-all bg-transparent text-white border border-white/75 hover:bg-white/10 hover:border-white no-underline"
              >
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
