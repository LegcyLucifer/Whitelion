import React from 'react';
import { Phone } from 'lucide-react';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';
import Badge from '../components/Badge';
import ReservationForm from '../components/ReservationForm';

export default function ReservationsPage({ showToast }) {
  useSEO({
    title: 'Book a Table Online',
    description: 'Reserve your table at The White Lion Amersham online. Instant confirmation for groups of 1–10. Perfect for date nights, family dinners, Sunday roasts, and celebrations.',
    path: '/reservations',
  });

  const galleryImages = [
    { title: "Exterior & Signpost", src: "/assets/interior_dining_2.webp" },
    { title: "Cozy Dining Lounge", src: "/assets/interior_dining_3.webp" },
    { title: "Floral Patio Garden", src: "/assets/pub_patio_garden.jpg" },
    { title: "Authentic Cuisine", src: "/assets/pub_building_or_interior.jpg" }
  ];

  return (
    <div>
      {/* Page Header — collapsed to a minimal strip. The old full hero
          (badge + h1 + paragraph) said "Make a Reservation" and then the
          form card immediately below said "Book Your Table" seconds
          later; this gets to the form faster instead of repeating itself. */}
      <section className="bg-navy-800 text-white py-6 px-6 text-center border-b border-black">
        {/* text-2xl md:text-2xl was a dead no-op (both sides identical) —
            a fossil left over from an earlier automated font-scale
            consolidation that collapsed two originally-different sizes
            onto the same token, silently erasing the size step-up this
            heading is meant to get at wider widths. */}
        <h1 className="text-white text-2xl md:text-3xl font-bold">Make a Reservation</h1>
      </section>

      <div className="w-full max-w-[1240px] mx-auto px-6 py-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
          {/* Booking Engine Form — a ledger page, not a floating white
              card: a thick maroon spine standing in for a bound diary's
              edge, cream page colour instead of stark white. Same
              ReservationForm used by the quick-booking modal everywhere
              else on the site, so this page and that modal can never
              drift out of sync. */}
          <div className="bg-warm-cream border-l-[6px] border-maroon p-8 md:p-10">
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <h2 className="text-2xl font-bold text-black font-brand">Book Your Table</h2>
              <span className="font-brand italic text-maroon/70 text-sm whitespace-nowrap hidden sm:inline">Est. {siteData.history.age}</span>
            </div>
            <p className="text-text-muted text-md mb-7">
              Please fill out the form below to secure your table at The White Lion.
            </p>
            <ReservationForm showToast={showToast} />
          </div>

          {/* Right Side: Direct Call & Real Ambiance Gallery */}
          <div className="flex flex-col gap-7">
            {/* Direct Call Card */}
            <div className="bg-navy-950 rounded-card p-8 text-white border border-white/10">
              <Badge variant="plain" tone="neutral" onDark className="mb-3.5">
                Direct Assistance
              </Badge>
              <h3 className="text-white text-2xl mb-2.5 font-bold">
                Prefer to just give us a call?
              </h3>
              <p className="text-text-muted-on-dark text-sm leading-[1.6] mb-5">
                If you have a complex reservation, a larger group (over 15 people), or would just prefer to speak directly with our team at The White Lion, feel free to give us a call.
              </p>
              <a
                href={siteData.info.phoneHref}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-[0.03em] rounded-control transition-[background-color,border-color,transform,box-shadow] bg-maroon text-white border-2 border-white/80 shadow-control hover:bg-maroon-hover hover:border-white no-underline"
              >
                <Phone size={16} />
                <span>Call 01494 766 849</span>
              </a>
            </div>

            {/* Gallery Grid with Real Photos */}
            <div>
              <h4 className="mb-3.5 font-bold text-black">Atmosphere & Dining</h4>
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.map((item, idx) => (
                  <div key={idx} className="relative overflow-hidden group border border-black/10">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-[140px] object-cover block transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 inset-x-0 px-2 py-1.5 bg-gradient-to-t from-black/75 to-transparent text-white text-xs font-semibold z-10 pointer-events-none">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
