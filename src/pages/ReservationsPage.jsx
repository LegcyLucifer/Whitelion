import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Phone, CheckCircle, Sparkles } from 'lucide-react';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';
import Badge from '../components/Badge';

export default function ReservationsPage({ showToast }) {
  useSEO({
    title: 'Book a Table Online',
    description: 'Reserve your table at The White Lion Amersham online. Instant confirmation for groups of 1–10. Perfect for date nights, family dinners, Sunday roasts, and celebrations.',
    path: '/reservations',
  });
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    guests: '2',
    area: 'Main Dining Room',
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const galleryImages = [
    { title: "Exterior & Signpost", src: "/assets/interior_dining_2.webp" },
    { title: "Cozy Dining Lounge", src: "/assets/interior_dining_3.webp" },
    { title: "Floral Patio Garden", src: "/assets/pub_patio_garden.jpg" },
    { title: "Authentic Cuisine", src: "/assets/pub_building_or_interior.jpg" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) {
      showToast('Please fill in your name, email, and phone number.');
      return;
    }

    const ref = `WL-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingRef(ref);
    setIsBooked(true);
    showToast(`Table reserved successfully! Ref: ${ref}`);
  };

  return (
    <div>
      {/* Page Header — collapsed to a minimal strip. The old full hero
          (badge + h1 + paragraph) said "Make a Reservation" and then the
          form card immediately below said "Book Your Table" seconds
          later; this gets to the form faster instead of repeating itself. */}
      <section className="bg-dark-navy text-white py-6 px-6 text-center border-b border-black">
        <h1 className="text-white text-2xl md:text-[1.75rem] font-bold">Make a Reservation</h1>
      </section>

      <div className="w-full max-w-[1240px] mx-auto px-6 py-[40px] pb-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
          {/* Booking Engine Form Card */}
          <div className="bg-white rounded-[12px] p-8 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-black/5">
            {!isBooked ? (
              <div>
                <h2 className="text-[1.9rem] mb-2 font-bold text-black font-serif">Book Your Table</h2>
                <p className="text-[#656b73] text-[0.95rem] mb-7">
                  Please fill out the form below to secure your table at The White Lion.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.88rem] font-semibold text-slate-navy">
                        <Calendar size={14} className="inline mr-1.5" />
                        Date *
                      </label>
                      <input
                        type="date"
                        value={form.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.88rem] font-semibold text-slate-navy">
                        <Clock size={14} className="inline mr-1.5" />
                        Time Slot *
                      </label>
                      <select
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white"
                      >
                        <option value="12:00">12:00 PM</option>
                        <option value="12:30">12:30 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="13:30">1:30 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="17:30">5:30 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="18:30">6:30 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="19:30">7:30 PM</option>
                        <option value="20:00">8:00 PM</option>
                        <option value="20:30">8:30 PM</option>
                        <option value="21:00">9:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.88rem] font-semibold text-slate-navy">
                        <Users size={14} className="inline mr-1.5" />
                        Number of Guests *
                      </label>
                      <select
                        value={form.guests}
                        onChange={(e) => setForm({ ...form, guests: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.88rem] font-semibold text-slate-navy">
                        <MapPin size={14} className="inline mr-1.5" />
                        Preferred Area
                      </label>
                      <select
                        value={form.area}
                        onChange={(e) => setForm({ ...form, area: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white"
                      >
                        <option value="Main Dining Room">Main Dining Room</option>
                        <option value="Pub & Bar Area">Pub & Bar Area</option>
                        <option value="Garden Seating">Garden Seating</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    <label className="text-[0.88rem] font-semibold text-slate-navy">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.88rem] font-semibold text-slate-navy">Email Address *</label>
                      <input
                        type="email"
                        placeholder="e.g. eleanor@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.88rem] font-semibold text-slate-navy">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="e.g. 07123 456789"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    <label className="text-[0.88rem] font-semibold text-slate-navy">Special Requests / Allergies / Notes</label>
                    <textarea
                      placeholder="Let us know if you have any dietary restrictions, need a high chair, or are celebrating a special occasion..."
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white min-h-[100px] resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    aria-label="Complete your table reservation at The White Lion"
                    className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 bg-maroon text-white rounded-[5px] text-[0.94rem] font-semibold tracking-[0.03em] cursor-pointer transition-all border border-white/70 shadow-[0_4px_14px_rgba(158,52,56,0.35)] hover:bg-maroon-hover hover:border-white hover:-translate-y-[1px]">
                    <Sparkles size={18} />
                    <span>Complete Reservation</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-7 px-2.5">
                <div className="w-16 h-16 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={36} />
                </div>
                <h2 className="text-[2.2rem] mb-2.5 font-bold text-black font-serif">Booking Confirmed!</h2>
                <p className="text-[#4b5563] mb-6">
                  A confirmation email has been dispatched to <strong className="text-black">{form.email}</strong>.
                </p>

                <div className="bg-[#fcfaf7] border border-[#e7dcce] rounded-[8px] p-6 text-left mb-7">
                  <div className="flex justify-between mb-3 border-b border-[#dfd2c0] pb-2.5">
                    <span className="text-[#777]">Booking Reference:</span>
                    <strong className="text-maroon font-bold text-[1.15rem]">{bookingRef}</strong>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[#777]">Guest Name:</span>
                    <strong className="text-black">{form.name}</strong>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[#777]">Date & Time:</span>
                    <strong className="text-black">{form.date} at {form.time}</strong>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[#777]">Party Size:</span>
                    <strong className="text-black">{form.guests} Guests</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#777]">Area:</span>
                    <strong className="text-black">{form.area}</strong>
                  </div>
                </div>

                <button
                  aria-label="Make another table reservation"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-maroon text-white rounded-[5px] text-[0.94rem] font-semibold tracking-[0.03em] cursor-pointer transition-all border border-white/70 shadow-[0_4px_14px_rgba(158,52,56,0.35)] hover:bg-maroon-hover hover:border-white hover:-translate-y-[1px]"
                  onClick={() => {
                    setIsBooked(false);
                    setForm({
                      date: new Date().toISOString().split('T')[0],
                      time: '19:00',
                      guests: '2',
                      area: 'Main Dining Room',
                      name: '',
                      email: '',
                      phone: '',
                      notes: ''
                    });
                  }}
                >
                  Book Another Table
                </button>
              </div>
            )}
          </div>

          {/* Right Side: Direct Call & Real Ambiance Gallery */}
          <div className="flex flex-col gap-7">
            {/* Direct Call Card */}
            <div className="bg-[#121517] rounded-card p-8 text-white border border-white/10">
              <Badge variant="plain" tone="gold" onDark className="mb-3.5">
                Direct Assistance
              </Badge>
              <h3 className="text-white text-[1.6rem] mb-2.5 font-bold">
                Prefer to just give us a call?
              </h3>
              <p className="text-[#cbd5e1] text-sm leading-[1.6] mb-5">
                If you have a complex reservation, a larger group (over 15 people), or would just prefer to speak directly with our team at The White Lion, feel free to give us a call.
              </p>
              <a
                href={siteData.info.phoneHref}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-[0.03em] rounded-control transition-all bg-maroon text-white border border-white/70 shadow-control hover:bg-maroon-hover hover:border-white hover:-translate-y-px no-underline"
              >
                <Phone size={16} />
                <span>Call 01494 766 849</span>
              </a>
            </div>

            {/* Gallery Grid with Real Photos */}
            <div>
              <h4 className="text-[1.25rem] mb-3.5 font-bold text-black">Atmosphere & Dining</h4>
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.map((item, idx) => (
                  <div key={idx} className="relative rounded-[6px] overflow-hidden group">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-[140px] object-cover block transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 inset-x-0 px-2 py-1.5 bg-gradient-to-t from-black/75 to-transparent text-white text-[0.75rem] font-semibold z-10 pointer-events-none">
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
