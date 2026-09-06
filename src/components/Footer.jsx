import React, { useState, useRef } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { Phone, Mail, MapPin, ExternalLink, Send, Check, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteData } from '../data/siteData';
import Button from './Button';
import FieldError from './FieldError';
import { isValidEmail } from '../lib/validation';
import { shakeAnimation } from '../lib/motion';

// Lucide has no official TikTok glyph (brand marks are out of scope for that
// icon set) — a small local outline instead of pulling in a whole brand-icon
// package for one icon.
function TikTokIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82c-.9-.63-1.47-1.63-1.6-2.82h-3.02v13.44c0 1.4-1.13 2.53-2.53 2.53a2.53 2.53 0 1 1 0-5.06c.25 0 .48.03.71.09V11c-.23-.03-.47-.05-.71-.05a5.55 5.55 0 1 0 5.55 5.55V9.4a7.5 7.5 0 0 0 4.38 1.4V7.79c-.99 0-1.94-.31-2.78-.85a5.6 5.6 0 0 1-.99-1.12z"/>
    </svg>
  );
}

// Every footer nav destination in one place — this list feeds the "Explore"
// column below, so the sitemap exists in exactly one spot in this component
// instead of a second copy in a bottom link row.
const SITEMAP_LINKS = [
  { to: '/menu', label: 'Menu' },
  { to: '/whats-on', label: "What's On" },
  { to: '/offers', label: 'Offers' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/party-venue', label: 'Party Venue' },
  { to: '/christmas', label: 'Christmas' },
  { to: '/contact', label: 'Contact' },
];

const SOCIAL_LINKS = [
  { href: siteData.info.instagramUrl, label: 'Instagram', Icon: Instagram },
  { href: siteData.info.facebookUrl, label: 'Facebook', Icon: Facebook },
  { href: siteData.info.tiktokUrl, label: 'TikTok', Icon: TikTokIcon },
];

export default function Footer({ onOpenBooking, showToast }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  // Default unchecked — pre-ticked consent boxes are a UK PECR red flag
  const [consentChecked, setConsentChecked] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [consentError, setConsentError] = useState(false);
  const formControls = useAnimation();
  const emailRef = useRef(null);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setNewsletterEmail(value);
    if (emailError) {
      setEmailError(isValidEmail(value) ? '' : (value ? "That email address doesn't look right." : 'Please enter your email address.'));
    }
  };

  const handleConsentChange = (e) => {
    setConsentChecked(e.target.checked);
    if (e.target.checked) setConsentError(false);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (isSubscribing) return;
    const noEmail = !isValidEmail(newsletterEmail);
    const noConsent = !consentChecked;
    if (noEmail || noConsent) {
      setEmailError(noEmail ? (newsletterEmail ? "That email address doesn't look right." : 'Please enter your email address.') : '');
      setConsentError(noConsent);
      formControls.start(shakeAnimation);
      if (noEmail) emailRef.current?.focus();
      showToast('Please check the highlighted fields below.', 'error');
      return;
    }
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setSubscribed(true);
      showToast('Thank you for subscribing to The White Lion newsletter!');
      setNewsletterEmail('');
      setConsentChecked(false);
      setTimeout(() => setSubscribed(false), 5000);
    }, 600);
  };

  const handleNav = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-navy-800 text-white pt-10 pb-6 lg:pt-16 lg:pb-8 border-t border-black">
      <div className="w-full max-w-[1240px] mx-auto px-6">
        {/* Four functional categories (Visit / Hours / Explore / Follow)
            instead of three generic columns — grouped by what the reader is
            trying to do, the way Dishoom's footer separates "Visit Us" from
            "Café Support" from social. The sitemap now lives once, here in
            "Explore", rather than duplicated again in the bottom bar.
            Row gap and trailing margin are tighter below `lg`: Visit Us and
            Opening Hours go full-width there (their content — an email
            address, a day/time table — genuinely needs the room), so they
            stack instead of sitting side by side. That stacking is correct;
            what wasn't was reusing the same 48px desktop gap between
            stacked full-width blocks on a phone, which is what made the
            footer run to 1.7 screens of pure scrolling before this. */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 lg:gap-x-8 lg:gap-y-12 mb-8 lg:mb-14">
          {/* Col 1: Visit Us */}
          <div className="flex flex-col col-span-2 lg:col-span-1">
            <h4 className="text-lg font-brand text-white font-bold tracking-[0.02em] mb-3.5 pb-2.5 lg:mb-5 lg:pb-3 border-b border-white/12 inline-block">
              Visit Us
            </h4>
            <ul className="list-none flex flex-col gap-2.5 lg:gap-3.5">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-white/45 shrink-0 mt-[3px]" />
                <a href={siteData.info.phoneHref} className="text-navy-100 no-underline transition-colors hover:text-white">
                  {siteData.info.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-white/45 shrink-0 mt-[3px]" />
                <a href={`mailto:${siteData.info.email}`} className="text-navy-100 no-underline transition-colors hover:text-white break-all">
                  {siteData.info.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-white/45 shrink-0 mt-[3px]" />
                <span className="text-navy-100 leading-[1.5]">{siteData.info.address}</span>
              </li>
              <li>
                <a
                  href={siteData.info.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-text-muted-on-dark no-underline transition-colors hover:text-white"
                >
                  <span>Get directions</span>
                  <ExternalLink size={13} />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Opening Times — pub hours only. Food-serving hours have
              a live, more useful version on the Menu page's Today tab and
              the full breakdown on Contact, so this footer (present on
              every page) doesn't carry a second static copy of it. */}
          <div className="flex flex-col col-span-2 lg:col-span-1">
            <h4 className="text-lg font-brand text-white font-bold tracking-[0.02em] mb-3.5 pb-2.5 lg:mb-5 lg:pb-3 border-b border-white/12 inline-block">
              Opening Hours
            </h4>
            <table className="w-full text-left border-collapse text-md mb-4">
              <tbody>
                {siteData.openingHours.map((item, idx) => (
                  <tr key={idx} className="border-b border-white/10 last:border-0">
                    <td className="py-2 pr-4 text-navy-100 font-semibold whitespace-nowrap lg:py-2.5">{item.days}</td>
                    <td className="py-2 lg:py-2.5 text-text-muted-on-dark">{item.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link to="/contact" onClick={handleNav} className="text-sm text-text-muted-on-dark hover:text-white transition-colors no-underline">
              Kitchen &amp; food service times →
            </Link>
          </div>

          {/* Col 3: Explore — the one sitemap on the page */}
          <div className="flex flex-col">
            <h4 className="text-lg font-brand text-white font-bold tracking-[0.02em] mb-3.5 pb-2.5 lg:mb-5 lg:pb-3 border-b border-white/12 inline-block">
              Explore
            </h4>
            <ul className="list-none flex flex-col gap-3">
              {SITEMAP_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} onClick={handleNav} className="text-navy-100 no-underline transition-colors hover:text-white text-md">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Follow Us — siteData already carried these three URLs,
              but nothing on the site rendered them until now. */}
          <div className="flex flex-col">
            <h4 className="text-lg font-brand text-white font-bold tracking-[0.02em] mb-3.5 pb-2.5 lg:mb-5 lg:pb-3 border-b border-white/12 inline-block">
              Follow Us
            </h4>
            <div className="flex items-center gap-2.5 mb-3.5 lg:mb-5">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/80 transition-colors hover:text-white hover:border-white/60"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <a
              href={siteData.info.tripAdvisorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted-on-dark no-underline transition-colors hover:text-white"
            >
              <span>Leave a review on TripAdvisor</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Newsletter — a closing band of its own rather than a fourth
            column competing for attention with contact facts and the
            sitemap, matching how Rules and Big Mamma place "stay in touch"
            as the last word in the footer, not a co-equal category. */}
        <div className="border-t border-white/10 pt-6 pb-2 lg:pt-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-5">
          <div>
            <h4 className="text-lg font-brand text-white font-bold tracking-[0.02em] mb-1">
              Stay Connected
            </h4>
            <p className="text-sm text-text-muted-on-dark">
              Special deals, live music, and pub quiz updates — straight to your inbox.
            </p>
          </div>
          <motion.form animate={formControls} onSubmit={handleSubscribe} className="flex flex-col gap-2 w-full lg:w-auto lg:min-w-[420px]" noValidate>
            <div className="flex flex-col sm:flex-row gap-2 items-start">
              <div className="flex-1 w-full">
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  value={newsletterEmail}
                  onChange={handleEmailChange}
                  aria-invalid={!!emailError}
                  className={`w-full px-3.5 py-2.5 border-2 bg-white/10 text-white text-sm focus:outline-none transition-[border-color,box-shadow] duration-150 ${
                    emailError
                      ? 'border-error focus:shadow-[0_0_0_3px_rgba(174,41,54,0.25)]'
                      : 'border-white/20 focus:border-maroon focus:shadow-[0_0_0_3px_rgba(32,101,98,0.2)]'
                  }`}
                />
                <FieldError>{emailError}</FieldError>
              </div>
              <Button type="submit" loading={isSubscribing} className="whitespace-nowrap shrink-0">
                {!isSubscribing && (
                  <AnimatePresence mode="wait" initial={false}>
                    {subscribed ? (
                      <motion.span key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }} className="flex shrink-0">
                        <Check size={18} />
                      </motion.span>
                    ) : (
                      <motion.span key="send" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }} className="flex shrink-0">
                        <Send size={18} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                )}
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </div>
            <div>
              <label htmlFor="footer-newsletter-consent" className="flex items-start gap-2 text-text-muted-on-dark text-xs leading-[1.4] cursor-pointer">
                <input
                  id="footer-newsletter-consent"
                  type="checkbox"
                  checked={consentChecked}
                  onChange={handleConsentChange}
                  aria-invalid={consentError}
                  className={`w-4 h-4 mt-0.5 shrink-0 cursor-pointer accent-maroon ${consentError ? 'outline outline-2 outline-error outline-offset-2' : ''}`}
                />
                <span>I want to subscribe to The White Lion mailing list.</span>
              </label>
              <FieldError>{consentError && 'Please check the box to subscribe.'}</FieldError>
            </div>
          </motion.form>
        </div>

        {/* Bottom Bar — copyright only now that the sitemap lives once, in
            the Explore column above. */}
        <div className="pt-4 mt-4 lg:pt-6 lg:mt-6 border-t border-white/10 text-xs text-text-muted-on-dark text-center">
          © {new Date().getFullYear()} The White Lion Amersham. All rights reserved. Pubs, Restaurant &amp; Indian Cuisine, Little Chalfont.
        </div>
      </div>
    </footer>
  );
}
