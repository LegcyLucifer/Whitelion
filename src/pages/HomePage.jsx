import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import {
  Dog,
  Tv,
  HelpCircle,
  Target,
  ArrowRight,
  CalendarCheck,
  UtensilsCrossed,
  Star,
  Phone
} from 'lucide-react';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';
import Button from '../components/Button';
import Badge from '../components/Badge';
import CtaBanner from '../components/CtaBanner';
import LionMark from '../components/LionMark';

export default function HomePage({ onOpenBooking }) {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  // Frame starts as a clearly-inset photo panel (~18% margin, matching the
  // proportions of Dishoom's own boxed hero) and expands edge-to-edge well
  // before the sticky pin itself releases — built around our own video
  // instead of a static photo. The quiet opening line cross-fades into the
  // full headline right as the frame finishes expanding.
  //
  // The pin only holds for part of the section's scroll range (this section
  // is 160vh tall so the 100vh sticky frame has 60vh of "room" to ride
  // along before it must resume scrolling with the page). Measured in real
  // scroll pixels (not an assumed fraction — a first attempt at this fix
  // used scrollY/sectionHeight as a stand-in for the real motion-value
  // progress and got the scale wrong by a wide margin): the pin releases
  // at heroProgress ≈0.36, and the whole block then slides up under the
  // fixed header. Both animations below used to finish around 0.55/0.6 —
  // well *after* that release point — so the headline only ever reached
  // full visibility while it was already sliding away and getting cut off
  // under the header, never during a stable pinned moment. Finishing both
  // by ~0.18–0.26 leaves a real ~0.10 progress cushion (confirmed against
  // the measured 0.36 release point, not estimated) where the fully-
  // revealed photo and headline just sit still, fully pinned and readable,
  // before any release-driven movement begins.
  //
  // Scaled via `transform` (compositor-only) rather than animating
  // inset/top/left/right/bottom — those are layout properties and force a
  // synchronous reflow on every scroll tick.
  const frameScale = useTransform(heroProgress, [0, 0.18], [0.64, 1]);
  // The text cross-fade is bound directly to scroll progress, not a
  // threshold flip plus a fixed-duration CSS transition. That first version
  // triggered a real 500ms opacity transition the instant progress crossed
  // a threshold — independent wall-clock time, not scroll position, unlike
  // frameScale above. Scrolling through that 500ms window (the ordinary
  // way anyone scrolls past a hero) caught the crossfade mid-flight with
  // both the quiet line and the full headline simultaneously ~50% opaque,
  // double-exposing two unrelated sentences on top of each other — measured
  // directly: 0.43/0.57 opacity at 240ms in. Setting opacity imperatively
  // inside the same scroll callback that already drives frameScale keeps
  // both properties locked to the identical input at all times, so there's
  // no independent timer left to fall out of sync with continued scrolling.
  // (Framer's own style-prop binding for `opacity` was tried first and
  // confirmed not to repaint reliably in this setup — direct DOM mutation
  // sidesteps that rather than fighting it.)
  const quietLineRef = useRef(null);
  const mainHeadlineRef = useRef(null);
  useMotionValueEvent(heroProgress, 'change', (v) => {
    const fadeStart = 0.16, fadeEnd = 0.26;
    const t = Math.min(1, Math.max(0, (v - fadeStart) / (fadeEnd - fadeStart)));
    if (quietLineRef.current) {
      quietLineRef.current.style.opacity = String(1 - t);
      quietLineRef.current.style.pointerEvents = t > 0.5 ? 'none' : 'auto';
    }
    if (mainHeadlineRef.current) {
      mainHeadlineRef.current.style.opacity = String(t);
      mainHeadlineRef.current.style.pointerEvents = t > 0.5 ? 'auto' : 'none';
    }
  });

  // hero.mp4 is a 10MB autoplay loop — the single heaviest asset on the
  // site by an order of magnitude. Skip it (fall back to the poster photo,
  // which the video would show anyway while loading) on narrow viewports
  // and whenever the browser reports the user has data-saving enabled.
  // `navigator.connection` is Chromium/Android-only; unsupported browsers
  // just skip that check and fall through to the viewport test.
  const [skipVideo, setSkipVideo] = useState(false);
  useEffect(() => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const savesData = conn?.saveData || ['slow-2g', '2g'].includes(conn?.effectiveType);
    // Guard against an unmeasured (0px) viewport reporting a false-positive
    // "narrow" match on first paint — only trust a real, positive width.
    const width = window.innerWidth;
    const isNarrow = width > 0 && width < 768;
    setSkipVideo(Boolean(savesData || isNarrow));
  }, []);
  useSEO({
    title: 'Pub, Restaurant & Indian Cuisine in Amersham',
    description: 'The White Lion Amersham — a unique fusion of authentic Indian cuisine and traditional British pub classics. Live sports, quiz nights, Sunday roasts, beer garden, and private hire in Little Chalfont.',
    path: '/',
  });

  const iconMap = {
    Dog: <Dog size={22} />,
    Tv: <Tv size={22} />,
    HelpCircle: <HelpCircle size={22} />,
    Target: <Target size={22} />
  };

  const handleNav = (path) => {
    navigate(`/${path === 'home' ? '' : path}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main>
      {/* SECTION 1: HERO — pinned frame that expands to full-bleed as you
          scroll, cross-fading a quiet opening line into the full headline.
          The extra scroll height (160vh) is the "runway" the effect plays
          out over; the inner panel is what actually pins. This is the only
          place the fusion concept is stated as a *promise* — everything
          after it either proves the promise or adds a new fact, never
          restates it. */}
      <section ref={heroRef} className="relative h-[160vh]">
        {/* bg-navy-900 — flat, no texture, no gradient, and matched to the
            "Not Inherited. Chosen." section immediately below (also
            navy-900) rather than navy-950, so the hero hands off into it
            on one continuous surface instead of a visible seam between two
            close-but-different darks. At rest the photo panel is
            deliberately inset to 64% width (see frameScale below), which
            exposes this container's own background in the margin around
            it — left unset, that margin fell through to the page's plain
            white; this closes that gap and a legibility edge case besides,
            since the hero's white italic text sits near this margin and
            white-on-navy can never disappear the way white-on-white could. */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-navy-900">
          {/* Expanding video frame */}
          <motion.div
            className="absolute inset-0 overflow-hidden bg-black"
            style={{ scale: frameScale }}
          >
            {skipVideo ? (
              <img
                src="/assets/pub_exterior_or_hero.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover z-0"
                aria-hidden="true"
              />
            ) : (
              <video
                className="absolute inset-0 w-full h-full object-cover z-0"
                src="/assets/hero.mp4"
                autoPlay
                muted
                loop
                playsInline
                poster="/assets/pub_exterior_or_hero.jpg"
                aria-hidden="true"
              />
            )}
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/20 via-black/10 to-black/50" />
          </motion.div>

          {/* Content — quiet opening line and full headline share one grid
              cell so they cross-fade in place; CTAs stay outside the fade
              so they're always visible and in the normal tab order. */}
          <div className="relative z-[2] h-full flex flex-col items-center justify-center text-center text-white px-6">
            <div className="grid w-full max-w-[760px]">
              {/* Width-capped at 60% — not a fixed px value — because the
                  photo frame behind this text is itself scaled to 64% of
                  the viewport at rest (`frameScale` starts at 0.64). A
                  fixed max-width worked at the desktop size this was
                  authored on but let the text run past the frame's own
                  right edge on narrow phones, where white text then sits
                  on the plain page background and disappears. 60% tracks
                  the frame at any viewport width, with a small margin
                  since the frame only ever grows from here as the visitor
                  scrolls (never shrinks below 64%). */}
              <div
                ref={quietLineRef}
                className="[grid-area:1/1] flex flex-col items-center max-w-[60%] mx-auto"
                style={{ opacity: 1 }}
              >
                <span className="font-brand italic text-[clamp(0.95rem,3vw,1.125rem)] text-white/80 mb-4 drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]">
                  A Modern Classic. A Local Soul
                </span>
                <p className="font-brand text-[clamp(1.3rem,3.4vw,2.5rem)] leading-[1.35] drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]">
                  "A proper pint. A proper curry. Under one roof in Amersham."
                </p>
              </div>

              <div
                ref={mainHeadlineRef}
                className="[grid-area:1/1] flex flex-col items-center"
                style={{ opacity: 0, pointerEvents: 'none' }}
              >
                {/* h1 describes the page, not the newsletter widget further down.
                    Floor stays 1.375rem (fixed the 5-line mobile wrap earlier);
                    ceiling brought down from 3.75rem to 2.75rem and the growth
                    rate slowed (5vw→3.6vw) — at 81 characters this was reading
                    as oversized/dominant at wider widths once it had genuine
                    dwell time to actually be looked at. */}
                <h1 className="text-white text-[clamp(1.375rem,3.6vw,2.75rem)] font-bold tracking-[-0.015em] leading-[1.15] mb-5 drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]">
                  Serving up the perfect pour and locally-sourced plates in the heart of Amersham
                </h1>
                {/* Was text-text-muted-on-dark (navy-300) — a colour tuned for
                    flat navy-800/900 surfaces (5.9-6.5:1) that disappeared
                    over this section's actual background: a live photo/video
                    with bright, unpredictable patches (pale beer glass, taps)
                    the fixed navy-900 gradient overlay doesn't reliably cover.
                    Switched to white/85 + the same drop-shadow as the h1
                    above, which is proven to hold up against this exact
                    image. */}
                <p className="text-white/85 text-lg leading-[1.6] max-w-[640px] drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]">
                  A unique fusion of authentic Indian cuisine and traditional British pub classics,
                  accompanied by local cask ales, cold draught lagers, and fine wines.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Button variant="navy" icon={CalendarCheck} onClick={onOpenBooking}>
                Book a Table
              </Button>
              <Button variant="primary" icon={UtensilsCrossed} onClick={() => handleNav('menu')}>
                Our Food &amp; Drinks
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: OUR STORY — moved up to sit directly after the hero.
          This is the "why us" a first-time visitor is actually looking
          for, so it now leads instead of following an amenities strip and
          a photo gallery. Copy is rewritten to add new, concrete detail
          (named dishes, sourcing, texture) rather than repeat the hero's
          "unique fusion" line a second time — each section should tell the
          reader something they didn't already know. Only one CTA here
          (View Menus): "Book a Table" was already offered seconds ago in
          the hero, so repeating it here trained readers to skim past both. */}
      <section className="relative py-24 bg-navy-900 text-white overflow-hidden">
        {/* The lion's one big moment: a large, quiet watermark rather than
            a repeated logo — the kind of thing you only really notice once
            you've read the text next to it. No photography in this
            section at all, on purpose — the gallery directly below this
            is the photographic proof; this one is pure record, deliberately
            the one section on the site that isn't selling a visit, it's
            just stating what's true. */}
        <LionMark
          size={520}
          color="#ffffff"
          strokeWidth={0.6}
          className="absolute -right-24 top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none hidden md:block"
        />
        <div className="w-full max-w-[1240px] mx-auto px-6 relative">
          <div className="max-w-[640px]">
            <span className="text-gold-text-dark font-brand italic text-lg">{siteData.history.age} on White Lion Road</span>
            <h2 className="text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.2] font-bold mt-2 mb-8">
              Not Inherited. Chosen.
            </h2>

            {/* A short record, not a paragraph of marketing copy — each
                line is independently true and independently checkable,
                which is the point. */}
            <div className="flex flex-col divide-y divide-white/12 border-y border-white/12">
              <p className="py-5 text-lg text-white/85 leading-[1.7]">
                {siteData.history.legend}
              </p>
              <p className="py-5 text-lg text-white/85 leading-[1.7]">
                {siteData.history.repaint}
              </p>
              <p className="py-5 text-lg text-white/85 leading-[1.7]">
                {siteData.history.fusion}
              </p>
              <p className="py-5 text-lg text-white/85 leading-[1.7]">
                {siteData.history.locale}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <Button variant="primary" icon={UtensilsCrossed} onClick={() => handleNav('menu')}>
                See What That Choice Looks Like
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PRO-GALLERY ATMOSPHERE STRIP — now the visual proof of
          the story just told, instead of appearing before any context for
          it. */}
      <section className="py-24 bg-warm-cream border-y border-neutral-200">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <span className="block font-brand italic text-lg text-navy-700 mb-2.5">
              Around The Pub
            </span>
            <h2 className="text-3xl mb-2.5 font-bold">
              Inside The White Lion Amersham
            </h2>
            <p className="text-text-muted text-lg max-w-[640px] mx-auto">
              From our whitewashed cottage facade and floral beer garden to copper draft pumps and authentic tandoori plates.
            </p>
          </div>

          {/* Bento layout — one featured tile instead of a perfectly
              uniform grid (the "stock card grid" pattern repeated
              elsewhere on this page's own review/offer sections). Purely
              a photo showcase (no click target), so cursor-pointer was
              removed — it previously implied an interaction that didn't
              exist. */}
          <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[140px] sm:auto-rows-[180px] lg:auto-rows-[200px] gap-4">
            {siteData.venueGallery.map((item, idx) => (
              <div key={idx} className={`relative rounded-card overflow-hidden group ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-5">
                  <span className="text-white font-semibold text-sm tracking-[0.02em]">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: GOOGLE REVIEWS TESTIMONIALS SHOWCASE — third-party
          proof, right after our own photo proof. */}
      <section className="py-24 bg-white">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <div className="inline-flex items-center gap-2.5 px-[14px] py-1.5 bg-white border-2 border-neutral-200 mb-4">
              <div className="flex text-gold gap-[3px]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="font-bold text-md text-black">
                {siteData.googleReviews.rating} / 5.0
              </span>
              <span className="text-text-muted text-sm">
                on Google Reviews ({siteData.googleReviews.totalReviews})
              </span>
            </div>
            {/* Fluid floor (28px) instead of the flat text-3xl (36px) —
                36 characters at a static 36px wrapped to 3 lines on a
                phone; 28px fits it in 2. */}
            <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] mb-3 font-bold">
              What Locals &amp; Visitors Say About Us
            </h2>
            <p className="text-text-muted text-lg">
              Loved for our welcoming dog-friendly atmosphere, unbeatable Indian &amp; British fusion food, and sunny beer garden.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteData.googleReviews.reviews.slice(0, 3).map((rev) => (
              <div key={rev.id} className="bg-white p-8 border-2 border-neutral-200 flex flex-col justify-between">
                <div>
                  <div className="flex gap-[3px] mb-4 text-gold">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-md leading-[1.6] text-black italic mb-6">"{rev.text}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-[42px] h-[42px] bg-book-table text-white flex items-center justify-center font-bold text-lg">
                    {rev.initial}
                  </div>
                  <div>
                    <div className="text-md font-semibold">{rev.author}</div>
                    <div className="text-xs text-text-muted">
                      Google Review • {rev.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: 4 FEATURE HIGHLIGHTS STRIP — moved below the food
          story and proof sections. These are bonus reasons to visit
          ("also, we're dog-friendly and show live sport"), not the main
          reason, so they now read as a bridge into the offers below
          rather than the reader's first impression of the pub. A thin
          top rule per item instead of a white card with an
          icon-in-a-tinted-square, the same "SaaS feature grid" shape this
          audit flagged on Contact's methods, Party Venue's packages, and
          Christmas's course cards. No card chrome at all here: the icon
          sits inline with the heading, the rule does the separating. */}
      <section className="py-16 bg-warm-cream border-y border-neutral-200">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <div className="text-center max-w-[720px] mx-auto mb-10">
            <span className="block font-brand italic text-lg text-navy-700 mb-2">
              While You're Here
            </span>
            <h2 className="text-2xl font-bold">More Reasons to Make Us Your Local</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {siteData.highlights.map((item) => (
              <div key={item.id} className="border-t-2 border-maroon/25 pt-5 flex flex-col gap-2">
                <div className="flex items-center gap-2.5 text-navy-800">
                  {iconMap[item.icon]}
                  <h3 className="text-lg text-black font-bold">{item.title}</h3>
                </div>
                <p className="text-sm text-text-muted leading-[1.55]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: WEEKLY DEALS TEASER — the full Offers page (photos,
          full descriptions, a "Book Your Table" button per card) already
          exists at /offers. Re-running three of those same cards here
          duplicated that page's content and its lead-capture button
          almost verbatim. This is now a single compact index of all six
          deals — name and day only — with one CTA into the dedicated
          page, the way Dishoom's homepage teases Menus/Reservations/Store
          as three short lines rather than restating their content. */}
      <section className="bg-white py-20">
        <div className="w-full max-w-[820px] mx-auto px-6 text-center">
          <span className="block font-brand italic text-lg text-navy-700 mb-3">
            Weekly Deals
          </span>
          <h2 className="text-3xl mb-3.5 font-bold">Delicious Deals For Every Day</h2>
          <p className="text-text-muted text-lg mb-10">
            From Cask Ale Mondays to Fizz Fridays, there is always an occasion to celebrate at The White Lion.
          </p>

          <ul className="list-none border-y border-neutral-200 mb-10 text-left">
            {siteData.offers.map((offer) => (
              <li key={offer.id} className="flex items-center justify-between gap-4 py-4 border-b border-neutral-200 last:border-b-0">
                <div>
                  <span className="text-xs text-maroon font-bold uppercase tracking-[0.04em]">{offer.day}</span>
                  <h3 className="text-lg font-bold text-black">{offer.title}</h3>
                </div>
                <Badge variant="solid" tone="navy" className="shrink-0">
                  {offer.badge}
                </Badge>
              </li>
            ))}
          </ul>

          <Button variant="outline" onClick={() => handleNav('offers')}>
            <span>See Full Details &amp; Book</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      {/* SECTION 7: PRIVATE EVENTS & VENUE HIRE CALLOUT */}
      <section className="py-20 bg-warm-cream border-t border-neutral-200">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <CtaBanner
            eyebrow={<Badge variant="plain" tone="neutral" onDark className="mb-4">Private Events &amp; Celebrations</Badge>}
            title="Planning an Event or Private Party?"
            description="Guest capacity of 180 to 320 people, free parking for 60 cars, and no venue hire fee for up to 50 guests. We provide tailored buffets, authentic Indian banquets, and canapés."
          >
            <Button variant="primary" onClick={() => handleNav('party-venue')}>
              <span>Discover Venue Hire</span>
              <ArrowRight size={16} />
            </Button>
            <a
              href={siteData.info.phoneHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-[0.03em] rounded-control transition-colors bg-transparent text-white border-2 border-white/70 hover:bg-white/10 hover:border-white no-underline"
            >
              <Phone size={16} />
              <span>Call 01494 766 849</span>
            </a>
          </CtaBanner>
        </div>
      </section>

      {/* Newsletter signup lives once, in the Footer — this page no longer
          duplicates that widget with a second copy competing for the same
          email address. */}

      {/* SECTION 8: FULL-WIDTH ATMOSPHERE BANNER — the closing beat, with
          its own distinct CTA copy rather than a fourth "Book a Table". */}
      <section
        className="relative min-h-[460px] flex items-center justify-center bg-cover bg-center text-center"
        style={{ backgroundImage: `url(/assets/interior_dining_2.webp)` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="w-full max-w-[800px] mx-auto px-6 relative z-10 flex flex-col items-center">
          <Badge variant="plain" tone="neutral" onDark className="mb-3">Your Little Chalfont Local</Badge>
          {/* Fluid, not a flat text-4xl — every other heading on the site
              scales via clamp(); this one didn't, so at 375px width "Steeped
              in History, Serving Modern Flavours" had no room to do
              anything but stack one or two words per line for five lines.
              Same 28px floor / 44px ceiling as the rest of the h2 scale,
              interpolated properly for the viewport range in between
              rather than guessed. */}
          <h2 className="text-white text-[clamp(1.75rem,1.3rem+1.9vw,2.75rem)] mb-4 font-bold">Steeped in History, Serving Modern Flavours</h2>
          <p className="text-white text-lg leading-[1.6] max-w-[640px] mx-auto mb-8">
            Amersham's favourite pub and Indian dining room. Warm fires in winter, a sunny floral garden in summer.
          </p>
          <Button variant="navy" icon={CalendarCheck} onClick={onOpenBooking}>
            Book Your Experience
          </Button>
        </div>
      </section>
    </main>
  );
}
