import React from 'react';
import { CalendarCheck, Tv, Trophy, Target, Clock, Users } from 'lucide-react';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';
import Button from '../components/Button';
import Badge from '../components/Badge';

// A pinned notice, not a card — white "paper," a maroon pushpin, and a
// slight rotation so the board reads as assembled by hand rather than
// laid out in a grid. The rotation is the whole point: perfectly aligned
// cards is the one thing a real corkboard never is.
function PinnedNotice({ rotate = 0, children, className = '' }) {
  return (
    <div
      className={`relative bg-white shadow-[0_14px_34px_rgba(0,0,0,0.28)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span
        className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-maroon z-10"
        style={{ boxShadow: '0 3px 6px rgba(0,0,0,0.5), inset 0 -2px 3px rgba(0,0,0,0.3), inset 0 2px 2px rgba(255,255,255,0.4)' }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

export default function WhatsOnPage({ onOpenBooking }) {
  const { quiz, sports, darts } = siteData.whatsOn;
  useSEO({
    title: "What's On — Quiz Nights, Live Sports & Darts",
    description: "Amersham's best Thursday quiz night, live Premier League and Champions League football on Sky & TNT Sports, and darts at The White Lion Amersham. Join the fun!",
    path: '/whats-on',
  });

  return (
    <div>
      {/* Page Header */}
      <section className="bg-navy-800 text-white border-b border-black overflow-hidden">
        <div className="w-full max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center py-14 lg:py-0">
          <div>
            <Badge variant="plain" tone="neutral" onDark className="mb-3">
              Live Entertainment &amp; Sports
            </Badge>
            <h1 className="text-white text-[clamp(2.2rem,4vw,2.9rem)] font-bold mb-4">
              Join The Action: See What's Coming Up
            </h1>
            <p className="text-text-muted-on-dark text-lg max-w-[520px] leading-[1.6]">
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

      {/* The Board — a navy backdrop standing in for the corkboard behind
          the bar, with each event pinned to it rather than filed into a
          matching set of cards. This is the one page on the site built
          around a real, physical object instead of a layout convention. */}
      <div className="bg-navy-900 py-20">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <span className="block font-brand italic text-lg text-gold-text-dark mb-2">
              Pinned Behind The Bar
            </span>
            <h2 className="text-white text-2xl font-bold">What's Actually Happening This Week</h2>
          </div>

          {/* Quiz Night — the big, featured notice */}
          <PinnedNotice rotate={-1.3} className="max-w-[900px] mx-auto mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-center">
              <div className="p-8 lg:p-12">
                <Badge variant="plain" tone="maroon" className="mb-4">Weekly Event</Badge>
                <h3 className="text-3xl mb-4 text-black font-bold leading-[1.1]">{quiz.title}</h3>
                <p className="text-lg text-text-muted leading-[1.7] mb-6">
                  {quiz.desc}
                </p>
                <div className="flex flex-col gap-3 mb-8">
                  <div className="flex items-center gap-3 text-black font-semibold">
                    <Clock size={20} className="text-maroon shrink-0" />
                    <span>Starts: 8:00 PM sharp every Thursday</span>
                  </div>
                  <div className="flex items-center gap-3 text-black font-semibold">
                    <Users size={20} className="text-maroon shrink-0" />
                    <span>Teams: Big or small — all are warmly welcome!</span>
                  </div>
                  <div className="flex items-center gap-3 text-black font-semibold">
                    <Trophy size={20} className="text-gold shrink-0" />
                    <span>Prizes: Cash jackpot, bar tabs &amp; spot round surprises</span>
                  </div>
                </div>
                <Button variant="primary" icon={CalendarCheck} onClick={onOpenBooking}>
                  Book Quiz Night Table
                </Button>
              </div>
              <div className="bg-neutral-100 h-full flex items-center justify-center p-6 lg:p-8">
                <img
                  src={quiz.image}
                  alt="Thursday Quiz Night Poster"
                  className="w-full max-w-[320px] max-h-[420px] object-contain border border-black/10"
                  loading="lazy"
                />
              </div>
            </div>
          </PinnedNotice>

          {/* Sports & Darts — two smaller notices, pinned at a slight
              counter-rotation to the quiz notice above so the board reads
              as assembled over time, not placed by a grid system. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 max-w-[900px] mx-auto">
            <PinnedNotice rotate={1.6} className="p-8">
              <div className="flex items-center gap-2.5 mb-3 text-navy-800">
                <Tv size={22} />
                <h3 className="font-brand text-xl text-black font-bold">{sports.title}</h3>
              </div>
              <p className="text-text-muted leading-[1.6] mb-5 text-md">
                {sports.desc}
              </p>
              <ul className="list-none flex flex-col gap-2 text-text-muted text-sm mb-6">
                <li>✓ Premier League &amp; UEFA Champions League</li>
                <li>✓ Six Nations Rugby Championship</li>
                <li>✓ Formula 1 Grand Prix Weekends</li>
                <li>✓ Cricket Internationals &amp; The Ashes</li>
              </ul>
              <Button variant="outline" size="sm" className="w-fit" onClick={onOpenBooking}>
                Reserve a Table for the Match
              </Button>
            </PinnedNotice>

            <PinnedNotice rotate={-1.8} className="p-8">
              <div className="flex items-center gap-2.5 mb-3 text-navy-800">
                <Target size={22} />
                <h3 className="font-brand text-xl text-black font-bold">{darts.title}</h3>
              </div>
              <p className="text-text-muted leading-[1.6] mb-5 text-md">
                {darts.desc}
              </p>
              <ul className="list-none flex flex-col gap-2 text-text-muted text-sm mb-6">
                <li>✓ Tournament-spec Winmau dartboards</li>
                <li>✓ Dedicated throwing area with seating</li>
                <li>✓ Local league matches &amp; social throw-downs</li>
                <li>✓ Darts and flights available behind the bar</li>
              </ul>
              <a href={siteData.info.phoneHref} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-[0.03em] rounded-control transition-colors bg-transparent text-black border-2 border-black hover:bg-black hover:text-white no-underline w-fit text-center">
                <span>Inquire About Darts Nights</span>
              </a>
            </PinnedNotice>
          </div>
        </div>
      </div>
    </div>
  );
}
