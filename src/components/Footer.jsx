import React, { useState } from 'react';
import { Phone, Mail, MapPin, ExternalLink, Send, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteData } from '../data/siteData';

export default function Footer({ onOpenBooking, showToast }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  // Default unchecked — pre-ticked consent boxes are a UK PECR red flag
  const [consentChecked, setConsentChecked] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    if (!consentChecked) {
      showToast('Please check the box to subscribe.');
      return;
    }
    setSubscribed(true);
    showToast('Thank you for subscribing to The White Lion newsletter!');
    setNewsletterEmail('');
    setConsentChecked(false);
    setTimeout(() => setSubscribed(false), 5000);
  };

  const handleNav = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark-navy text-white pt-16 pb-8 border-t border-black">
      <div className="w-full max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Col 1: Venue Info */}
          <div className="flex flex-col">
            <h4 className="text-[1.25rem] font-serif text-white font-bold tracking-[0.02em] mb-5 pb-3 border-b border-white/12 inline-block">
              Venue Info
            </h4>
            <ul className="list-none flex flex-col gap-3.5 mb-6">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-sage shrink-0 mt-[3px]" />
                <a href={siteData.info.phoneHref} className="text-[#d1d5db] no-underline transition-colors hover:text-white">
                  {siteData.info.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-sage shrink-0 mt-[3px]" />
                <a href={`mailto:${siteData.info.email}`} className="text-[#d1d5db] no-underline transition-colors hover:text-white">
                  {siteData.info.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-sage shrink-0 mt-[3px]" />
                <span className="text-[#d1d5db] leading-[1.5]">{siteData.info.address}</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-2.5 mt-2">
              <a
                href={siteData.info.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-transparent text-white border border-white/85 rounded-[5px] px-3.5 py-2 text-[0.86rem] font-semibold tracking-[0.03em] transition-colors no-underline hover:bg-white hover:text-dark-navy"
              >
                <MapPin size={14} />
                <span>Find Us</span>
              </a>
              <a
                href={siteData.info.tripAdvisorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-transparent text-white border border-white/85 rounded-[5px] px-3.5 py-2 text-[0.86rem] font-semibold tracking-[0.03em] transition-colors no-underline hover:bg-white hover:text-dark-navy"
              >
                <ExternalLink size={14} />
                <span>Leave Feedback</span>
              </a>
            </div>
          </div>

          {/* Col 2: Opening Times */}
          <div className="flex flex-col">
            <h4 className="text-[1.25rem] font-serif text-white font-bold tracking-[0.02em] mb-5 pb-3 border-b border-white/12 inline-block">
              Opening Times
            </h4>
            <table className="w-full text-left border-collapse text-[0.92rem]">
              <tbody>
                {siteData.openingHours.map((item, idx) => (
                  <tr key={idx} className="border-b border-white/10 last:border-0">
                    <td className="py-2.5 pr-4 text-[#d1d5db] font-semibold whitespace-nowrap">{item.days}</td>
                    <td className="py-2.5 text-[#9ca3af]">{item.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Col 3: Food Serving Times */}
          <div className="flex flex-col">
            <h4 className="text-[1.25rem] font-serif text-white font-bold tracking-[0.02em] mb-5 pb-3 border-b border-white/12 inline-block">
              Food Serving Times
            </h4>
            <table className="w-full text-left border-collapse text-[0.92rem]">
              <tbody>
                {siteData.foodServingHours.map((item, idx) => (
                  <tr key={idx} className="border-b border-white/10 last:border-0">
                    <td className="py-2.5 pr-4 text-[#d1d5db] font-semibold whitespace-nowrap">{item.days}</td>
                    <td className="py-2.5 text-[#9ca3af]">{item.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Col 4: Newsletter & Links */}
          <div className="flex flex-col">
            <h4 className="text-[1.25rem] font-serif text-white font-bold tracking-[0.02em] mb-5 pb-3 border-b border-white/12 inline-block">
              Stay Connected
            </h4>
            <p className="text-[0.9rem] text-[#9ca3af] mb-4">
              Subscribe to our newsletter • Don't miss out on special deals, live music, and pub quiz updates!
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded border border-white/20 bg-white/10 text-white text-[0.9rem] focus:outline-none focus:border-maroon transition-colors"
              />
              <label htmlFor="footer-newsletter-consent" className="flex items-start gap-2 text-[#9ca3af] text-[0.82rem] leading-[1.4] cursor-pointer">
                <input
                  id="footer-newsletter-consent"
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="w-4 h-4 mt-0.5 shrink-0 cursor-pointer accent-maroon"
                />
                <span>I want to subscribe to The White Lion mailing list.</span>
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-2.5 bg-maroon text-white border border-white/70 rounded-[5px] text-[0.94rem] font-semibold tracking-[0.03em] cursor-pointer transition-all shadow-[0_2px_8px_rgba(158,52,56,0.25)] hover:bg-maroon-hover hover:border-white hover:-translate-y-[1px]"
              >
                {subscribed ? <Check size={16} /> : <Send size={16} />}
                <span>{subscribed ? 'Subscribed!' : 'Subscribe'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-[0.84rem] text-[#9ca3af]">
          <div className="text-center md:text-left">
            © {new Date().getFullYear()} The White Lion Amersham. All rights reserved. Pubs, Restaurant & Indian Cuisine, Little Chalfont.
          </div>
          <div className="flex flex-wrap justify-center gap-4.5">
            <Link to="/menu" onClick={handleNav} className="text-[#9ca3af] no-underline hover:text-white transition-colors">Menu</Link>
            <Link to="/offers" onClick={handleNav} className="text-[#9ca3af] no-underline hover:text-white transition-colors">Offers</Link>
            <Link to="/reservations" onClick={handleNav} className="text-[#9ca3af] no-underline hover:text-white transition-colors">Book Table</Link>
            <Link to="/party-venue" onClick={handleNav} className="text-[#9ca3af] no-underline hover:text-white transition-colors">Venue Hire</Link>
            <Link to="/contact" onClick={handleNav} className="text-[#9ca3af] no-underline hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
