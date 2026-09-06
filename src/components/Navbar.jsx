import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Menu, X, CalendarCheck, Phone } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { siteData } from '../data/siteData';
import Button from './Button';

// Collapsed the old two navs (an 8-item inline desktop bar that needed
// manual line-breaks to fit — "What's\nOn", "Party\nVenue" — plus a
// separate mobile drawer duplicating the same list) into one drawer used
// at every width. Inspired by Rules' and Big Mamma's header language: a
// hamburger opens the full sitemap, the wordmark sits alone and centred,
// and the bar carries exactly one action. The phone number moves out of
// the persistent chrome (none of the three reference sites keep a live
// phone number in the header bar) and into the drawer and Footer instead.
const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/menu', label: 'Menu' },
  { path: '/whats-on', label: "What's On" },
  { path: '/offers', label: 'Offers' },
  { path: '/reservations', label: 'Reservations' },
  { path: '/party-venue', label: 'Party Venue' },
  { path: '/christmas', label: 'Christmas' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar({ onOpenBooking }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const handleNavClick = () => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-[1000] bg-navy-header border-t border-black border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
        <div className="w-full max-w-[1240px] mx-auto px-6 grid grid-cols-[1fr_auto_1fr] items-center h-[74px]">
          {/* Left: single hamburger trigger — the only nav entry point */}
          <div className="flex justify-start">
            {/* min-h/w-11 (44px) — the most-tapped element on every page of
                an installable app needs a real thumb target, not just the
                icon+padding size that happened to result from the layout. */}
            <button
              className="inline-flex items-center justify-center gap-2 min-h-11 min-w-11 bg-transparent text-white border-none cursor-pointer -ml-2 pr-2"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Menu size={22} />
              <span className="hidden sm:inline text-xs font-semibold tracking-[0.1em] uppercase">Menu</span>
            </button>
          </div>

          {/* Center: wordmark, always the visual anchor */}
          <NavLink to="/" className="flex items-center no-underline shrink-0" onClick={handleNavClick}>
            <img
              src="/assets/logo-navbar.png"
              alt="The White Lion"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </NavLink>

          {/* Right: one action */}
          <div className="flex justify-end">
            <Button variant="primary" size="sm" icon={CalendarCheck} onClick={onOpenBooking} className="min-h-11">
              <span className="hidden sm:inline">Book a Table</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Nav Drawer — the site's one navigation surface, at every width.
          Backdrop is always mounted (not `{menuOpen && ...}`) so its own
          opacity transition can actually run in lockstep with the <aside>
          drawer's transform transition below — both use duration-300. */}
      <div
        className={`fixed inset-0 bg-black/65 backdrop-blur-[4px] z-[1040] transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 left-0 w-[86%] max-w-[380px] h-screen bg-navy-800 shadow-[10px_0_30px_rgba(0,0,0,0.6)] z-[1050] flex flex-col px-7 py-7 transition-transform duration-300 overflow-y-auto ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/12">
          <span className="font-brand text-lg font-medium tracking-[0.28em] text-white uppercase">
            The White Lion
          </span>
          <button
            className="bg-black/40 text-white border border-white/25 min-w-11 min-h-11 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <ul className="list-none flex flex-col gap-1 mb-8">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between text-lg font-brand tracking-[0.02em] py-2.5 no-underline border-b border-white/5',
                    isActive ? 'text-maroon' : 'text-white hover:text-maroon'
                  )
                }
                onClick={handleNavClick}
              >
                <span>{item.label}</span>
                <span>→</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 mt-auto">
          <Button
            variant="primary"
            className="w-full"
            icon={CalendarCheck}
            onClick={() => {
              setMenuOpen(false);
              onOpenBooking();
            }}
          >
            Book a Table
          </Button>
          <a
            href={siteData.info.phoneHref}
            className="inline-flex items-center justify-center gap-2 w-full p-2.5 bg-transparent text-white border-2 border-white/50 cursor-pointer no-underline hover:bg-white/10 transition-colors"
          >
            <Phone size={14} />
            <span className="text-sm font-semibold">Call {siteData.info.phone}</span>
          </a>
        </div>
      </aside>
    </>
  );
}
