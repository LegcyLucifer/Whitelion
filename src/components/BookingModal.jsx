import React, { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle, MapPin, Sparkles } from 'lucide-react';
import Button from './Button';
import { siteData } from '../data/siteData';

export default function BookingModal({ isOpen, onClose, showToast }) {
  const [step, setStep] = useState('form'); // 'form' | 'confirmed'
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    guests: '2',
    area: 'Main Dining Room',
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [bookingRef, setBookingRef] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      showToast('Please fill in your name, email, and phone number.');
      return;
    }

    const ref = `WL-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingRef(ref);
    setStep('confirmed');
    showToast(`Reservation confirmed! Booking Ref: ${ref}`);
  };

  const handleReset = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 md:p-6 overflow-y-auto transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-[12px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] w-full max-w-[620px] max-h-[90vh] overflow-y-auto relative p-6 md:p-10 mx-auto my-auto transition-transform duration-300" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 bg-transparent border-none text-[#656b73] cursor-pointer p-2 transition-colors hover:text-black z-10" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>

        {step === 'form' ? (
          <div>
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[0.76rem] font-bold tracking-[0.08em] uppercase rounded-full bg-maroon/10 text-maroon border border-maroon/30 mb-2">
                Instant Table Booking
              </span>
              <h2 className="text-[1.85rem] mb-1.5 font-serif text-black font-bold">Reserve Your Table</h2>
              <p className="text-[0.92rem] text-[#656b73]">
                At {siteData.info.name} • Best seats reserved for your dining experience
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.88rem] font-semibold text-slate-navy">
                    <Calendar size={14} className="inline mr-1.5" />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.88rem] font-semibold text-slate-navy">
                    <Clock size={14} className="inline mr-1.5" />
                    Time Slot
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.88rem] font-semibold text-slate-navy">
                    <Users size={14} className="inline mr-1.5" />
                    Number of Guests
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
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
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white"
                  >
                    <option value="Main Dining Room">Main Dining Room</option>
                    <option value="Pub & Bar Lounge">Pub & Bar Lounge</option>
                    <option value="Outdoor Beer Garden">Outdoor Beer Garden</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[0.88rem] font-semibold text-slate-navy">Your Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. James Smith"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.88rem] font-semibold text-slate-navy">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. james@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.88rem] font-semibold text-slate-navy">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g. 07123 456789"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[0.88rem] font-semibold text-slate-navy">Dietary Requirements or Special Requests</label>
                <textarea
                  name="notes"
                  placeholder="Tell us about birthdays, anniversaries, high chairs, or allergies..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white min-h-[80px] resize-y"
                />
              </div>

              <Button
                type="submit"
                aria-label="Confirm your table reservation at The White Lion"
                className="w-full mt-2"
                icon={Sparkles}
              >
                <span>Confirm Reservation</span>
              </Button>

              <div className="text-center text-[0.82rem] text-[#777] mt-3">
                Prefer to book over the phone? Call us directly on{' '}
                <a href={siteData.info.phoneHref} className="text-book-table font-bold hover:underline">
                  {siteData.info.phone}
                </a>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center px-2.5 py-5">
            <div className="inline-flex p-4 bg-[#e8f5e9] rounded-full text-[#2e7d32] mb-4.5">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-[2rem] mb-2.5 font-serif text-black font-bold">Reservation Confirmed!</h2>
            <p className="text-[#4b5563] mb-5 text-base">
              We're delighted to welcome you to <strong>{siteData.info.name}</strong>.
            </p>

            <div className="bg-[#fbf9f6] border border-[#eadbc8] rounded-lg p-5 text-left mb-6">
              <div className="flex justify-between mb-2.5 border-b border-[#e0d0bd] pb-2">
                <span className="text-[#777] text-[0.9rem]">Booking Reference:</span>
                <strong className="text-book-table text-[1.05rem]">{bookingRef}</strong>
              </div>
              <div className="flex justify-between mb-2 text-[0.92rem]">
                <span className="text-[#777]">Name:</span>
                <strong className="text-black">{formData.name}</strong>
              </div>
              <div className="flex justify-between mb-2 text-[0.92rem]">
                <span className="text-[#777]">Date & Time:</span>
                <strong className="text-black">{formData.date} at {formData.time}</strong>
              </div>
              <div className="flex justify-between mb-2 text-[0.92rem]">
                <span className="text-[#777]">Party Size:</span>
                <strong className="text-black">{formData.guests} Guests ({formData.area})</strong>
              </div>
            </div>

            <Button
              aria-label="Close booking modal and return to site"
              className="w-full mt-4"
              onClick={handleReset}>
              Done &amp; Return to Site
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
