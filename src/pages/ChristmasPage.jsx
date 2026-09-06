import React from 'react';
import { CalendarCheck, Phone, Sparkles } from 'lucide-react';
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
      {/* Page Header — same navy family as Menu/Offers/What's On (the
          previous teal gradient was off-palette with no documented reason
          for the one-off hue). Christmas still reads as its own occasion
          through the gold badge/accent below, not through a different
          background colour — gold is already the site's one reserved
          seasonal signal (see Badge.jsx). */}
      <section className="bg-gradient-to-br from-navy-900 to-navy-800 text-white py-16 px-6 text-center relative border-b border-black">
        <div className="absolute inset-0 bg-black/20" />
        <div className="w-full max-w-[1240px] mx-auto relative z-10">
          <Badge variant="plain" tone="gold" onDark className="mb-3">
            Festive Season Celebrations
          </Badge>
          <h1 className="text-white text-[clamp(2.4rem,4.5vw,3.2rem)] font-bold mb-4 drop-shadow-md">{title}</h1>
          <p className="text-text-muted-on-dark text-lg max-w-[700px] mx-auto leading-[1.6]">
            {subtitle} — {desc}
          </p>
        </div>
      </section>

      {/* The whole body sits on navy now, not white — the invitation card
          is the one light surface in the room, the way a printed menu
          card would be the one pale thing on a dressed dark table. */}
      <div className="bg-navy-900 py-20 pb-20 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-maroon/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1240px] mx-auto px-6 relative">
          <div className="text-center mb-12">
            <Sparkles size={28} className="text-gold mx-auto mb-4" />
            <h2 className="text-white text-3xl font-bold font-brand">Celebrate Christmas with Us</h2>
          </div>

          {/* The Invitation — a cream card with a gold double-rule border
              and simple corner brackets, set out like an actual printed
              festive menu card rather than a website section. */}
          <div className="relative bg-warm-cream max-w-[760px] mx-auto p-1">
            <div className="border-2 border-gold/70 p-8 md:p-14 relative">
              {/* corner brackets */}
              {[
                'top-3 left-3 border-t-2 border-l-2',
                'top-3 right-3 border-t-2 border-r-2',
                'bottom-3 left-3 border-b-2 border-l-2',
                'bottom-3 right-3 border-b-2 border-r-2',
              ].map((pos, i) => (
                <span key={i} className={`absolute ${pos} w-5 h-5 border-gold pointer-events-none`} aria-hidden="true" />
              ))}

              <div className="text-center mb-10">
                <span className="block font-brand italic text-lg text-maroon mb-2">Eat, Drink &amp; Be Merry</span>
                <p className="text-text-muted text-md leading-[1.7] max-w-[520px] mx-auto">
                  Whether it's the company Christmas party, an intimate dinner with loved ones, or drinks by
                  the fire, here's what's on the table this December.
                </p>
              </div>

              <div className="flex flex-col divide-y divide-gold/25">
                {courses.map((c, idx) => (
                  <div key={idx} className="py-7 first:pt-0 last:pb-0 text-center">
                    <h3 className="font-brand text-2xl mb-2 text-black font-bold">{c.title}</h3>
                    <p className="text-text-muted leading-[1.7] max-w-[480px] mx-auto">{c.desc}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <Button variant="primary" icon={CalendarCheck} onClick={onOpenBooking}>
                  Reserve Your Festive Table
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-16 relative z-10">
            <h3 className="text-white text-2xl mb-3 font-bold">
              Bookings Now Open for the Holiday Season
            </h3>
            <p className="text-text-muted-on-dark max-w-[560px] mx-auto mb-7 text-base">
              Key dates fill up rapidly. Contact our reservations team today to secure your preferred date and time slot.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button variant="primary" icon={CalendarCheck} onClick={onOpenBooking}>
                Book a Table Online
              </Button>
              <a
                href={siteData.info.phoneHref}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-[0.03em] rounded-control transition-colors bg-transparent text-white border-2 border-white/75 hover:bg-white/10 hover:border-white no-underline"
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
