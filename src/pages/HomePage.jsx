import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dog,
  Tv,
  HelpCircle,
  Target,
  ArrowRight,
  Sparkles,
  CalendarCheck,
  UtensilsCrossed,
  Star,
  Mail,
  Send,
  Phone,
  Check
} from 'lucide-react';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';
import Button from '../components/Button';
import Badge from '../components/Badge';
import CtaBanner from '../components/CtaBanner';

export default function HomePage({ onOpenBooking, showToast }) {
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  useSEO({
    title: 'Pub, Restaurant & Indian Cuisine in Amersham',
    description: 'Welcome to The White Lion Amersham — a unique fusion of authentic Indian cuisine and traditional British pub classics. Live sports, quiz nights, Sunday roasts, beer garden, and private hire in Little Chalfont.',
    path: '/',
  });
  // ✅ FIXED: default is false — pre-ticked consent boxes are a UK PECR red flag
  const [consentChecked, setConsentChecked] = useState(false);
  const [joined, setJoined] = useState(false);

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

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    if (!consentChecked) {
      showToast('Please check the box to subscribe.');
      return;
    }
    setJoined(true);
    showToast('Thank you for subscribing to The White Lion newsletter!');
    setNewsletterEmail('');
    setTimeout(() => setJoined(false), 5000);
  };

  return (
    <main>
      {/* SECTION 1: HERO STRIP — video background */}
      <section
        className="relative min-h-[85vh] flex items-center text-white overflow-hidden"
      >
        {/* ── Video background ─────────────────────────────────────────── */}
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

        {/* ── Subtle scrim — light at top, slightly darker only at bottom where text sits */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/20 via-black/10 to-black/50" />

        {/* ── Content ────────────────────────────────────────────────── */}
        <div className="w-full max-w-[1240px] mx-auto px-6 relative z-[2] max-w-[840px] py-10">
          <Badge variant="plain" tone="gold" onDark className="mb-4">
            A Modern Classic. A Local Soul
          </Badge>
          {/* ✅ h1 describes the page — not the newsletter popup */}
          <h1 className="text-white text-[clamp(2.4rem,4.8vw,4rem)] font-bold tracking-[-0.015em] leading-[1.15] mb-5 drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]">
            Serving up the perfect pour and locally-sourced plates in the heart of Amersham
          </h1>
          <p className="text-[#f1f5f9] text-lg leading-[1.6] mb-8 max-w-[700px]">
            A unique fusion of authentic Indian cuisine and traditional British pub classics,
            accompanied by local cask ales, cold draught lagers, and fine wines.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="navy" icon={CalendarCheck} onClick={onOpenBooking}>
              Book a Table
            </Button>
            <Button variant="primary" icon={UtensilsCrossed} onClick={() => handleNav('menu')}>
              Our Food &amp; Drinks
            </Button>
          </div>
        </div>
      </section>


      {/* SECTION 2: CHRISTMAS FEATURE STRIP */}
      <section className="relative bg-gradient-to-br from-[#172534] to-[#232f3c] bg-cover bg-center py-7 text-white border-y border-white/12 overflow-hidden" style={{ backgroundImage: `url(/assets/pub_building_or_interior.jpg)` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#172534]/95 to-[#232f3c]/90" />
        <div className="w-full max-w-[1240px] mx-auto px-6 relative z-[2] flex items-center justify-between gap-6 flex-wrap">
          <div className="max-w-[680px]">
            <Sparkles size={24} className="text-maroon mb-1.5" />
            <h2 className="font-brand text-[clamp(1.4rem,2.5vw,1.85rem)] text-white leading-[1.25] mb-1.5 font-bold">Celebrate the Festive Season at The White Lion</h2>
            <p className="text-[#cbd5e1] text-[0.95rem] leading-[1.5]">
              Festive banquets, corporate holiday lunches, and Christmas Eve dining in Little Chalfont.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 px-[26px] py-[11px] text-[0.94rem] font-semibold tracking-[0.03em] transition-all bg-maroon text-white border border-maroon rounded-full hover:bg-maroon-hover hover:shadow-[0_4px_14px_rgba(158,52,56,0.45)] hover:-translate-y-[1px] cursor-pointer"
            onClick={() => handleNav('christmas')}
          >
            <span>View Christmas Menus</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* SECTION 3: 4 FEATURE HIGHLIGHTS STRIP — horizontal cards, not the
          centered-icon-circle formula reused for Contact's methods, Party
          Venue's packages, and Christmas's course cards. These are static
          amenities, not links, so no hover-lift (that idiom is reserved
          for tiles that actually navigate). */}
      <section className="py-16 bg-warm-cream border-b border-[#eee8dc]">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {siteData.highlights.map((item) => (
              <div key={item.id} className="bg-white rounded-card p-6 shadow-card border border-black/5 flex flex-col gap-4 transition-colors hover:border-maroon/30">
                <div className="w-11 h-11 rounded-control bg-sage-subtle text-[#4b7349] flex items-center justify-center shrink-0">
                  {iconMap[item.icon]}
                </div>
                <div>
                  <h3 className="text-xl mb-1.5 text-black font-bold">{item.title}</h3>
                  <p className="text-sm text-[#555e69] leading-[1.55]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: PRO-GALLERY ATMOSPHERE STRIP */}
      <section className="py-[100px] bg-white">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <span className="block text-xs font-bold tracking-[0.2em] uppercase text-slate-navy mb-2.5">
              Real Place Photography
            </span>
            <h2 className="text-[2.4rem] mb-2.5 font-bold">
              Inside The White Lion Amersham
            </h2>
            <p className="text-[#555e69] text-lg max-w-[640px] mx-auto">
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

      {/* SECTION 5: OUR STORY STRIP */}
      <section className="py-[100px] bg-white">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 items-center">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/assets/pub_patio_garden.jpg"
                alt="The White Lion Sunny Beer Garden Patio"
                className="rounded-[8px] object-cover w-full h-[280px] shadow-md transition-transform duration-250 hover:scale-[1.02]"
                loading="lazy"
              />
              <img
                src="/assets/interior_dining_3.webp"
                alt="The White Lion Warm Sage Green Lounge"
                className="rounded-[8px] object-cover w-full h-[280px] shadow-md transition-transform duration-250 hover:scale-[1.02]"
                loading="lazy"
              />
            </div>

            <div className="flex flex-col gap-5">
              <span className="text-slate-navy font-bold uppercase tracking-[0.12em] text-[0.85rem]">Authentic Hospitality in Buckinghamshire</span>
              <h2 className="text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.2] font-bold">
                Our Story, Your Local<br />The White Lion Amersham
              </h2>
              <p className="text-[1.05rem] text-black leading-[1.8]">
                Welcome to The White Lion Amersham, your local destination for an extraordinary
                dining experience. We take pride in offering a unique fusion of authentic Indian
                cuisine and traditional British pub classics. From our signature Chicken Tikka Masala
                and Goat Curry to our hand-battered Fish &amp; Chips and hearty Sunday Roasts, our menu
                is crafted to satisfy every craving. Whether you're looking for a relaxing pint of
                local real ale or a vibrant spice-filled dinner, we bring the best of both worlds
                to the heart of Buckinghamshire.
              </p>
              <div className="flex flex-wrap gap-4 mt-2.5">
                <Button variant="primary" icon={UtensilsCrossed} onClick={() => handleNav('menu')}>
                  View Menus
                </Button>
                <Button variant="outline" icon={CalendarCheck} onClick={onOpenBooking}>
                  Book a Table
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: GOOGLE REVIEWS TESTIMONIALS SHOWCASE */}
      <section className="py-[100px] bg-[#f9fafb] border-t border-[#f3f4f6]">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <div className="inline-flex items-center gap-2.5 px-[14px] py-1.5 rounded-full bg-white border border-[#e5e7eb] shadow-sm mb-4">
              <div className="flex text-[#f59e0b] gap-[3px]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" />
                ))}
              </div>
              <span className="font-bold text-[0.95rem] text-[#111]">
                {siteData.googleReviews.rating} / 5.0
              </span>
              <span className="text-[#666] text-[0.85rem]">
                on Google Reviews ({siteData.googleReviews.totalReviews})
              </span>
            </div>
            <h2 className="text-[2.4rem] mb-3 font-bold">
              What Locals &amp; Visitors Say About Us
            </h2>
            <p className="text-[#555e69] text-[1.05rem]">
              Loved for our welcoming dog-friendly atmosphere, unbeatable Indian &amp; British fusion food, and sunny beer garden.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteData.googleReviews.reviews.slice(0, 3).map((rev) => (
              <div key={rev.id} className="bg-white p-8 rounded-[8px] shadow-sm border border-[#e5e7eb] flex flex-col justify-between">
                <div>
                  <div className="flex gap-[3px] mb-4 text-[#f59e0b]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" />
                    ))}
                  </div>
                  <p className="text-[0.96rem] leading-[1.6] text-black italic mb-6">"{rev.text}"</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* ✅ FIXED: reviewer avatar bg-sage → bg-book-table (sage is decorative only) */}
                  <div className="w-[42px] h-[42px] rounded-full bg-book-table text-white flex items-center justify-center font-bold text-[1.1rem]">
                    {rev.initial}
                  </div>
                  <div>
                    <div className="text-[0.92rem] font-semibold">{rev.author}</div>
                    <div className="text-[0.78rem] text-[#888]">
                      Google Review • {rev.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: FEATURED PUB DEALS TEASER */}
      <section className="bg-white py-20">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <div className="text-center max-w-[720px] mx-auto mb-12">
            <span className="block text-xs font-bold tracking-[0.2em] uppercase text-slate-navy mb-3">
              Everyday Value
            </span>
            <h2 className="text-[2.4rem] mb-3.5 font-bold">Delicious Deals For Every Day</h2>
            <p className="text-[#555e69] text-lg">
              From Cask Ale Mondays to Fizz Fridays and 2 for £15 cocktails, there is always an occasion to celebrate at The White Lion.
            </p>
          </div>

          {/* Cards aren't links themselves (only the button is) — shadow
              deepens on hover but doesn't lift, so hover doesn't imply a
              click target that isn't there. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {siteData.offers.slice(0, 3).map((offer) => (
              <div key={offer.id} className="bg-white rounded-card overflow-hidden shadow-card transition-shadow hover:shadow-lg border border-[#f3f4f6] flex flex-col group">
                <div className="relative h-[220px] overflow-hidden">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <span className="absolute top-4 right-4 bg-book-table text-white px-3 py-1 rounded text-xs font-bold tracking-[0.05em] uppercase shadow-control">
                    {offer.badge}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs text-maroon font-bold uppercase mb-1.5">
                    {offer.day}
                  </span>
                  <h3 className="text-[1.4rem] mb-2 text-black font-bold">{offer.title}</h3>
                  <p className="text-sm text-[#656b73] mb-6 flex-1 leading-[1.5]">{offer.desc}</p>
                  <Button variant="primary" size="sm" className="w-full" onClick={onOpenBooking}>
                    Book Your Table
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" onClick={() => handleNav('offers')}>
              <span>Explore All 6 Special Offers</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 8: PRIVATE EVENTS & VENUE HIRE CALLOUT */}
      <section className="py-20 bg-warm-cream border-t border-[#eee8dc]">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <CtaBanner
            eyebrow={<Badge variant="plain" tone="gold" onDark className="mb-4">Private Events &amp; Celebrations</Badge>}
            title="Planning an Event or Private Party?"
            description="Guest capacity of 180 to 320 people, free parking for 60 cars, and no venue hire fee for up to 50 guests. We provide tailored buffets, authentic Indian banquets, and canapés."
          >
            <Button variant="primary" onClick={() => handleNav('party-venue')}>
              <span>Discover Venue Hire</span>
              <ArrowRight size={16} />
            </Button>
            <a
              href={siteData.info.phoneHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-[0.03em] rounded-control transition-all bg-transparent text-white border border-white/70 hover:bg-white/10 hover:border-white no-underline"
            >
              <Phone size={16} />
              <span>Call 01494 766 849</span>
            </a>
          </CtaBanner>
        </div>
      </section>

      {/* SECTION 9: DEDICATED NEWSLETTER STRIP */}
      <section className="py-[100px] bg-[#f9fafb]">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <div className="max-w-[700px] mx-auto bg-white rounded-[12px] p-8 md:p-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-black/5">
            {/* ✅ h2 scoped to this newsletter widget — not the page's primary heading */}
            <h2 className="text-[2.1rem] mb-4 text-slate-navy font-bold">
              Subscribe to our newsletter
            </h2>
            <p className="text-[1.05rem] text-[#656b73] mb-8 leading-[1.5]">
              Get notified of Thursday quiz nights, live music fixtures, seasonal chef specials, and exclusive discount nights.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col items-center gap-4">
              <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-0 max-w-[500px]">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Email address *"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-3 sm:rounded-l-[6px] sm:rounded-r-none rounded-[6px] border border-black/20 text-[1rem] bg-off-white focus:outline-none focus:border-book-table focus:bg-white transition-colors"
                  required
                />
                {/* ✅ FIXED: was bg-sage (WCAG fail) → bg-maroon */}
                <button
                  type="submit"
                  aria-label="Subscribe to The White Lion newsletter"
                  className="inline-flex items-center justify-center gap-2 px-[26px] py-[11px] text-[0.94rem] font-semibold tracking-[0.03em] transition-all bg-maroon text-white sm:rounded-r-[6px] sm:rounded-l-none rounded-[6px] cursor-pointer hover:bg-maroon-hover"
                >
                  {joined ? <Check size={18} /> : <Send size={18} />}
                  <span>{joined ? 'Joined!' : 'Join'}</span>
                </button>
              </div>
              {/* ✅ FIXED: consent checkbox default is unchecked (was pre-ticked — UK PECR concern) */}
              <label htmlFor="newsletter-consent" className="flex items-center justify-center gap-2 mt-2 text-[#555e69] text-[0.92rem] cursor-pointer">
                <input
                  id="newsletter-consent"
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-maroon"
                />
                <span>I want to subscribe to The White Lion mailing list.</span>
              </label>
            </form>
          </div>
        </div>
      </section>

      {/* SECTION 10: FULL-WIDTH ATMOSPHERE BANNER */}
      <section
        className="relative min-h-[460px] flex items-center justify-center bg-cover bg-center bg-fixed text-center"
        style={{ backgroundImage: `url(/assets/interior_dining_2.webp)` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="w-full max-w-[1240px] mx-auto px-6 relative z-10 max-w-[800px] flex flex-col items-center">
          <Badge variant="plain" tone="gold" onDark className="mb-3">Your Little Chalfont Local</Badge>
          <h2 className="text-white text-[2.8rem] mb-4 font-bold">Steeped in History, Serving Modern Flavours</h2>
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
