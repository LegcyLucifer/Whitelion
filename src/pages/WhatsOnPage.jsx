import React from 'react';
import { CalendarCheck, Tv, Trophy, Target, Clock, Users } from 'lucide-react';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function WhatsOnPage({ onOpenBooking }) {
  const { quiz, sports, darts } = siteData.whatsOn;
  useSEO({
    title: "What's On — Quiz Nights, Live Sports & Darts",
    description: "Amersham's best Thursday quiz night, live Premier League and Champions League football on Sky & TNT Sports, and darts at The White Lion Amersham. Join the fun!",
    path: '/whats-on',
  });

  return (
    <div>
      {/* Page Header — image+text split, matching Offers' hero treatment
          rather than the shared full-width centered navy block. */}
      <section className="bg-dark-navy text-white border-b border-black overflow-hidden">
        <div className="w-full max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center py-14 lg:py-0">
          <div>
            <Badge variant="plain" tone="gold" onDark className="mb-3">
              Live Entertainment &amp; Sports
            </Badge>
            <h1 className="text-white text-[clamp(2.2rem,4vw,2.9rem)] font-bold mb-4">
              Join The Action: See What's Coming Up
            </h1>
            <p className="text-[#cbd5e1] text-lg max-w-[520px] leading-[1.6]">
              From Amersham's favourite Thursday Quiz Night to live Premier League football on
              Sky &amp; TNT Sports, there is always something happening at The White Lion.
            </p>
          </div>
          <div className="relative hidden sm:block h-[220px] lg:h-[320px] rounded-card overflow-hidden">
            <img src="/assets/interior_dining_3.webp" alt="" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent" />
          </div>
        </div>
      </section>

      <div className="w-full max-w-[1240px] mx-auto px-6 py-[60px] pb-20">
        {/* Quiz Night Featured Block */}
        <div className="bg-white rounded-[16px] border border-[#e5e7eb] shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] mb-[60px] items-center">
          <div className="p-8 lg:p-12">
            <Badge tone="maroon" className="mb-4">Weekly Event</Badge>
            <h2 className="text-[2.5rem] mb-4 text-black font-bold">{quiz.title}</h2>
            <p className="text-[1.05rem] text-[#4b5563] leading-[1.7] mb-6">
              {quiz.desc}
            </p>

            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center gap-3 text-[#1f2428] font-semibold">
                <Clock size={20} className="text-maroon" />
                <span>Starts: 8:00 PM sharp every Thursday</span>
              </div>
              <div className="flex items-center gap-3 text-[#1f2428] font-semibold">
                <Users size={20} className="text-maroon" />
                <span>Teams: Big or small — all are warmly welcome!</span>
              </div>
              <div className="flex items-center gap-3 text-[#1f2428] font-semibold">
                <Trophy size={20} className="text-[#c5a059]" />
                <span>Prizes: Cash jackpot, bar tabs &amp; spot round surprises</span>
              </div>
            </div>

            <Button variant="primary" icon={CalendarCheck} onClick={onOpenBooking}>
              Book Quiz Night Table
            </Button>
          </div>

          <div className="bg-[#f5f5f5] h-full flex items-center justify-center p-6 lg:p-8">
            <img
              src={quiz.image}
              alt="Thursday Quiz Night Poster"
              className="w-full max-w-[380px] max-h-[480px] object-contain rounded-card shadow-md"
              loading="lazy"
            />
          </div>
        </div>

        {/* Sports & Darts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-[60px]">
          {/* Live Sports Card */}
          <div className="bg-white rounded-card p-9 border border-[#e5e7eb] shadow-sm flex flex-col h-full transition-shadow hover:shadow-md group">
            <div className="w-14 h-14 rounded-control bg-[#193852]/10 text-slate-navy flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
              <Tv size={28} />
            </div>
            <h3 className="text-[1.75rem] mb-3 text-black font-bold">{sports.title}</h3>
            <p className="text-[#4b5563] leading-[1.6] mb-5 flex-1">
              {sports.desc}
            </p>
            <ul className="list-none flex flex-col gap-2 text-[#374151] text-sm mb-6">
              <li>✓ Premier League &amp; UEFA Champions League</li>
              <li>✓ Six Nations Rugby Championship</li>
              <li>✓ Formula 1 Grand Prix Weekends</li>
              <li>✓ Cricket Internationals &amp; The Ashes</li>
            </ul>
            <Button variant="outline" size="sm" className="mt-auto" onClick={onOpenBooking}>
              Reserve a Table for the Match
            </Button>
          </div>

          {/* Darts Card */}
          <div className="bg-white rounded-card p-9 border border-[#e5e7eb] shadow-sm flex flex-col h-full transition-shadow hover:shadow-md group">
            <div className="w-14 h-14 rounded-control bg-[#c5a059]/15 text-[#9e7b30] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
              <Target size={28} />
            </div>
            <h3 className="text-[1.75rem] mb-3 text-black font-bold">{darts.title}</h3>
            <p className="text-[#4b5563] leading-[1.6] mb-5 flex-1">
              {darts.desc}
            </p>
            <ul className="list-none flex flex-col gap-2 text-[#374151] text-sm mb-6">
              <li>✓ Tournament-spec Winmau dartboards</li>
              <li>✓ Dedicated throwing area with seating</li>
              <li>✓ Local league matches &amp; social throw-downs</li>
              <li>✓ Darts and flights available behind the bar</li>
            </ul>
            <a href={siteData.info.phoneHref} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-[0.03em] rounded-control transition-all bg-transparent text-black border border-black hover:bg-black hover:text-white no-underline mt-auto text-center">
              <span>Inquire About Darts Nights</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
