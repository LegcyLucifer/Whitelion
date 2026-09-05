import React, { useState } from 'react';
import { Users, Car, Gift, Utensils, Send, CheckCircle, Sparkles, Phone } from 'lucide-react';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';

export default function PartyVenuePage({ showToast }) {
  const { title, subtitle, desc, stats, packages } = siteData.partyVenue;
  useSEO({
    title: 'Private Party Venue & Event Hire Amersham',
    description: 'Host your next event at The White Lion Amersham. Private venue hire for up to 320 guests, free parking, tailored Indian buffets and pub food. No hire fee for up to 50 guests.',
    path: '/party-venue',
  });
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    eventType: 'Birthday Party',
    guests: '50',
    date: '',
    package: 'Authentic Indian Feast',
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const venueImages = [
    { title: "Event Buffet Platters", src: "/assets/venue_party_1.jpg" },
    { title: "Outdoor Terrace & Patio", src: "/assets/pub_patio_garden.jpg" },
    { title: "The White Lion Exterior & Grounds", src: "/assets/interior_dining_2.webp" },
    { title: "Main Lounge & Screen Area", src: "/assets/interior_dining_3.webp" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      showToast('Please provide your name, email, and phone number.');
      return;
    }
    setSubmitted(true);
    showToast('Your party enquiry has been submitted. Our event coordinator will contact you shortly!');
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-dark-navy text-white py-16 px-6 text-center shadow-inner relative border-b border-black">
        <div className="absolute inset-0 bg-gradient-to-b from-[#002e5d]/60 to-[#232f3c]/90" />
        <div className="w-full max-w-[1240px] mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-[14px] py-[5px] text-[0.76rem] font-bold tracking-[0.08em] uppercase rounded-full bg-sage-subtle text-[#4b7349] border border-sage/45 mb-3">
            Private Hire & Celebrations
          </span>
          <h1 className="text-white text-[clamp(2.4rem,4.5vw,3.2rem)] font-bold mb-4 drop-shadow-md">{title}</h1>
          <p className="text-[#cbd5e1] text-[1.1rem] max-w-[700px] mx-auto leading-[1.6]">
            {subtitle} — {desc}
          </p>
        </div>
      </section>

      <div className="w-full max-w-[1240px] mx-auto px-6 py-[60px] pb-20">
        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-[60px]">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#e5e7eb] rounded-[12px] p-7 px-5 text-center shadow-sm transition-transform duration-250 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-[1.75rem] font-serif font-bold text-[#4b7349] mb-1.5">
                {s.value}
              </div>
              <div className="text-[0.9rem] text-[#656b73] font-semibold">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="mb-[60px]">
          <div className="text-center max-w-[640px] mx-auto mb-9">
            <span className="inline-flex items-center gap-1.5 px-[14px] py-[5px] text-[0.76rem] font-bold tracking-[0.08em] uppercase rounded-full bg-[#5d8091]/15 text-divider-teal border border-[#5d8091]/35 mb-2">
              Catering Options
            </span>
            <h2 className="text-[2.2rem] mb-2 font-bold font-serif text-black">Pre-Bookable Event Packages</h2>
            <p className="text-[#656b73]">
              Whether you want a casual buffet, full sit-down service, or canapés with champagne.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#edf0f2] rounded-[12px] p-8 px-6 shadow-sm flex flex-col transition-all hover:border-sage hover:shadow-md group"
              >
                <div className="w-12 h-12 rounded-[8px] bg-sage-subtle text-[#4b7349] flex items-center justify-center mb-4.5 transition-transform group-hover:scale-110">
                  <Utensils size={24} />
                </div>
                <h3 className="text-[1.45rem] mb-2.5 font-bold text-black">{pkg.title}</h3>
                <p className="text-[#555e69] text-[0.92rem] leading-[1.6] flex-1">{pkg.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Event Enquiry Form & Real Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
          {/* Form */}
          <div className="bg-white rounded-[12px] p-8 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-black/5">
            <h3 className="text-[1.8rem] mb-2 font-bold text-black">Make a Venue Hire Enquiry</h3>
            <p className="text-[#656b73] text-[0.92rem] mb-6">
              Fill in your event details and our events team will get back to you with availability and a custom quote.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.88rem] font-semibold text-slate-navy">Event Type</label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-book-table focus:bg-white"
                    >
                      <option value="Birthday Party">Birthday Party</option>
                      <option value="Wedding Reception / Engagement">Wedding Reception / Engagement</option>
                      <option value="Corporate / Work Event">Corporate / Work Event</option>
                      <option value="Christmas Party">Christmas Party</option>
                      <option value="Anniversary / Family Gathering">Anniversary / Family Gathering</option>
                      <option value="Other Occasion">Other Occasion</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.88rem] font-semibold text-slate-navy">Expected Guest Count</label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-book-table focus:bg-white"
                    >
                      <option value="20-50">Up to 50 Guests (No Hire Fee)</option>
                      <option value="50-100">50 - 100 Guests</option>
                      <option value="100-180">100 - 180 Guests</option>
                      <option value="180-320">180 - 320 Guests (Full Pub Takeover)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.88rem] font-semibold text-slate-navy">Desired Date</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-book-table focus:bg-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.88rem] font-semibold text-slate-navy">Preferred Catering</label>
                    <select
                      value={formData.package}
                      onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-book-table focus:bg-white"
                    >
                      <option value="Traditional Pub Buffet">Traditional Pub Buffet</option>
                      <option value="Authentic Indian Feast">Authentic Indian Feast</option>
                      <option value="Canapé & Drinks Reception">Canapé & Drinks Reception</option>
                      <option value="Drinks Only / Bar Tab">Drinks Only / Bar Tab</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.88rem] font-semibold text-slate-navy">Your Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Marcus Thorne"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.88rem] font-semibold text-slate-navy">Email *</label>
                    <input
                      type="email"
                      placeholder="e.g. marcus@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-book-table focus:bg-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.88rem] font-semibold text-slate-navy">Phone *</label>
                    <input
                      type="tel"
                      placeholder="e.g. 07123 456789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-book-table focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.88rem] font-semibold text-slate-navy">Additional Requirements or Ideas</label>
                  <textarea
                    placeholder="Tell us about entertainment, music, DJ requirements, dietary notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white min-h-[100px] resize-y"
                  />
                </div>

                <button
                  type="submit"
                  aria-label="Send party venue enquiry"
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 bg-maroon text-white rounded-[5px] text-[0.94rem] font-semibold tracking-[0.03em] cursor-pointer transition-all border border-white/70 shadow-[0_4px_14px_rgba(158,52,56,0.35)] hover:bg-maroon-hover hover:border-white hover:-translate-y-[1px]">
                  <Send size={16} />
                  <span>Send Venue Enquiry</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-7 px-2.5">
                <CheckCircle size={48} className="text-[#2e7d32] mx-auto mb-4" />
                <h3 className="text-[1.8rem] mb-2 font-bold text-black">Enquiry Received!</h3>
                <p className="text-[#4b5563] mb-5 text-base">
                  Thank you, <strong>{formData.name}</strong>. Our events manager will review your date and requirements and reach out via phone/email within 24 hours.
                </p>
                <button
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[0.86rem] font-semibold tracking-[0.03em] rounded-[5px] transition-all bg-maroon text-white border border-white/70 shadow-[0_4px_14px_rgba(158,52,56,0.35)] hover:bg-maroon-hover hover:border-white hover:-translate-y-[1px] cursor-pointer"
                  onClick={() => setSubmitted(false)}
                >
                  Submit Another Enquiry
                </button>
              </div>
            )}
          </div>

          {/* Real Photo Gallery */}
          <div>
            <h4 className="text-[1.3rem] mb-3.5 font-bold text-black">Venue Spaces & Setups</h4>
            <div className="grid grid-cols-2 gap-3.5">
              {venueImages.map((img, idx) => (
                <div key={idx} className="relative rounded-[8px] overflow-hidden group">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-[180px] object-cover block transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 inset-x-0 px-2.5 py-2 bg-gradient-to-t from-black/75 to-transparent text-white text-[0.78rem] font-semibold z-10 pointer-events-none">
                    {img.title}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-6 bg-[#fbf9f5] rounded-[8px] border border-[#e7e4de]">
              <h5 className="text-[1.1rem] mb-1.5 font-bold text-black">Need Urgent Venue Assistance?</h5>
              <p className="text-[0.9rem] text-[#656b73] mb-3.5">
                For short-notice bookings or immediate walkthrough viewings, call our team directly.
              </p>
              <a href={siteData.info.phoneHref} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[0.86rem] font-semibold tracking-[0.03em] rounded-[5px] transition-all bg-transparent text-black border border-black hover:bg-black hover:text-white cursor-pointer no-underline">
                <Phone size={14} />
                <span>Call 01494 766 849</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
