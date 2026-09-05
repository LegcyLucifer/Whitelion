import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, ExternalLink } from 'lucide-react';
import Button from '../components/Button';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';

export default function ContactPage({ showToast }) {
  useSEO({
    title: 'Contact Us — Get in Touch',
    description: 'Contact The White Lion Amersham. Call 01494 766 849, email us, or use our enquiry form. Find us on White Lion Road, Amersham HP7 9LJ.',
    path: '/contact',
  });
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in your name, email, and message.');
      return;
    }
    setFormSent(true);
    showToast('Thank you for contacting The White Lion Amersham. We will reply promptly!');
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-dark-navy text-white py-16 px-6 text-center shadow-inner relative border-b border-black">
        <div className="absolute inset-0 bg-gradient-to-b from-[#002e5d]/60 to-[#232f3c]/90" />
        <div className="w-full max-w-[1240px] mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-[14px] py-[5px] text-[0.76rem] font-bold tracking-[0.08em] uppercase rounded-full bg-sage-subtle text-[#4b7349] border border-sage/45 mb-3">
            We'd Love To Hear From You
          </span>
          <h1 className="text-white text-[clamp(2.4rem,4.5vw,3.2rem)] font-bold mb-4 drop-shadow-md">Contact Us</h1>
          <p className="text-[#cbd5e1] text-[1.1rem] max-w-[700px] mx-auto leading-[1.6]">
            Have a question, feedback, or need special dining arrangements?
            Get in touch with The White Lion team or visit us in Little Chalfont, Amersham.
          </p>
        </div>
      </section>

      <div className="w-full max-w-[1240px] mx-auto px-6 py-[60px] pb-20">
        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-[60px]">
          <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-8 text-center shadow-sm flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-sage-subtle text-sage flex items-center justify-center mb-4">
              <Phone size={26} />
            </div>
            <h3 className="text-[1.35rem] mb-2 font-bold text-black">Phone Us</h3>
            <p className="text-[#656b73] text-[0.92rem] mb-4 leading-[1.5]">
              Give us a call during opening hours for reservations or inquiries.
            </p>
            <a href={siteData.info.phoneHref} className="text-[#213348] font-bold text-[1.1rem] hover:underline mt-auto">
              {siteData.info.phone}
            </a>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-8 text-center shadow-sm flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-sage-subtle text-sage flex items-center justify-center mb-4">
              <Mail size={26} />
            </div>
            <h3 className="text-[1.35rem] mb-2 font-bold text-black">Email Us</h3>
            <p className="text-[#656b73] text-[0.92rem] mb-4 leading-[1.5]">
              Send us an email for general inquiries, feedback, or private events.
            </p>
            <a href={`mailto:${siteData.info.email}`} className="text-[#213348] font-bold text-[0.95rem] break-all hover:underline mt-auto">
              {siteData.info.email}
            </a>
          </div>

          <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-8 text-center shadow-sm flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-sage-subtle text-sage flex items-center justify-center mb-4">
              <MapPin size={26} />
            </div>
            <h3 className="text-[1.35rem] mb-2 font-bold text-black">Location</h3>
            <p className="text-[#656b73] text-[0.92rem] mb-4 leading-[1.5]">
              {siteData.info.address}
            </p>
            <a href={siteData.info.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-[#213348] font-bold text-[0.95rem] hover:underline mt-auto">
              Open in Google Maps →
            </a>
          </div>
        </div>

        {/* Contact Form & Hours Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white rounded-[12px] p-8 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-black/5">
            <h3 className="text-[1.8rem] mb-2 font-bold text-black">Send Us a Message</h3>
            <p className="text-[#656b73] text-[0.95rem] mb-6">
              We normally respond within 24 hours.
            </p>

            {!formSent ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.88rem] font-semibold text-slate-navy">Your Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. David Miller"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-book-table focus:bg-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.88rem] font-semibold text-slate-navy">Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. david@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-book-table focus:bg-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.88rem] font-semibold text-slate-navy">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 01494 000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-book-table focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.88rem] font-semibold text-slate-navy">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Table reservation question, private hire, dietary query"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-book-table focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.88rem] font-semibold text-slate-navy">Message *</label>
                  <textarea
                    placeholder="How can we help you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[5px] border border-black/15 bg-off-white text-[0.95rem] font-sans transition-colors focus:outline-none focus:border-sage focus:bg-white min-h-[120px] resize-y"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  aria-label="Send your message to The White Lion"
                  className="w-full mt-2"
                  icon={Send}
                >
                  <span>Send Message</span>
                </Button>
              </form>
            ) : (
              <div className="text-center py-9 px-2.5">
                <CheckCircle size={48} className="text-[#2e7d32] mx-auto mb-4" />
                <h3 className="text-[1.8rem] mb-2 font-bold text-black">Message Dispatched!</h3>
                <p className="text-[#4b5563] mb-5 text-base">
                  Thanks for getting in touch, <strong>{formData.name}</strong>. A member of The White Lion team will get back to you soon.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormSent(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            )}
          </div>

          {/* Opening & Serving Times Tables + Map */}
          <div className="flex flex-col gap-7">
            <div className="bg-[#fbf9f5] rounded-[12px] p-7 border border-[#e7e0d3]">
              <h4 className="text-[1.25rem] mb-4 font-bold text-black flex items-center gap-2">
                <Clock size={18} className="text-sage" />
                <span>Operating Schedule</span>
              </h4>

              <div className="mb-5">
                <strong className="text-[0.92rem] text-black block mb-2">
                  Pub Opening Hours
                </strong>
                <table className="w-full text-left border-collapse text-[0.92rem] text-[#4b5563]">
                  <tbody>
                    {siteData.openingHours.map((h, i) => (
                      <tr key={i} className="border-b border-[#e5e7eb] last:border-0">
                        <td className="py-2.5 pr-4 text-[#4b5563]">{h.days}</td>
                        <td className="py-2.5 text-black font-semibold">{h.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <strong className="text-[0.92rem] text-black block mb-2">
                  Kitchen & Food Service
                </strong>
                <table className="w-full text-left border-collapse text-[0.92rem] text-[#4b5563]">
                  <tbody>
                    {siteData.foodServingHours.map((h, i) => (
                      <tr key={i} className="border-b border-[#e5e7eb] last:border-0">
                        <td className="py-2.5 pr-4 text-[#4b5563]">{h.days}</td>
                        <td className="py-2.5 text-black font-semibold">{h.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Map Pin Box */}
            <div className="bg-white rounded-[12px] overflow-hidden border border-[#e5e7eb] shadow-sm">
              <iframe
                title="The White Lion Amersham Map"
                src="https://maps.google.com/maps?q=White+Lion+Road,+Amersham+HP7+9LJ&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="220"
                className="border-0 block"
                allowFullScreen=""
                loading="lazy"
              />
              <div className="p-4 px-5 flex justify-between items-center bg-white">
                <span className="text-[0.88rem] text-[#656b73]">
                  White Lion Rd, Amersham HP7 9LJ
                </span>
                <a
                  href={siteData.info.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-[0.8rem] font-semibold tracking-[0.03em] rounded-[5px] transition-all bg-transparent text-black border border-black hover:bg-black hover:text-white cursor-pointer no-underline"
                >
                  <ExternalLink size={14} />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
