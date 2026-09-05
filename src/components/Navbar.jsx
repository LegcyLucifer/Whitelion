import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Menu, X, CalendarCheck, Phone } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { siteData } from '../data/siteData';

export default function Navbar({ onOpenBooking }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { id: '', path: '/', label: 'Home', multiline: false },
    { id: 'menu', path: '/menu', label: 'Menu', multiline: false },
    { id: 'christmas', path: '/christmas', label: 'Christmas', multiline: false },
    { id: 'offers', path: '/offers', label: 'Offers', multiline: false },
    { id: 'whats-on', path: '/whats-on', label: "What's On", multiline: true, line1: "What's", line2: "On" },
    { id: 'reservations', path: '/reservations', label: 'Reservations', multiline: false },
    { id: 'party-venue', path: '/party-venue', label: 'Party Venue', multiline: true, line1: "Party", line2: "Venue" },
    { id: 'contact', path: '/contact', label: 'Contact', multiline: false }
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-[1000] bg-navy-header border-t border-black border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all">
        <div className="w-full max-w-[1240px] mx-auto px-6 flex items-center justify-between h-[74px]">
          {/* Logo & Brand Identity */}
          <NavLink
            to="/"
            className="flex items-center gap-3 no-underline shrink-0"
            onClick={handleNavClick}
          >
            <img
              src="/assets/logo_thumb_sharp.png"
              alt="The White Lion Interior"
              className="w-8 h-[38px] object-cover rounded-[2px] shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
              onError={(e) => {
                e.target.src = '/assets/logo_thumbnail.png';
              }}
            />
            <div className="flex flex-col">
              <div className="flex flex-col font-brand text-[0.76rem] font-medium tracking-[0.32em] text-white leading-[1.15] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                <span>THE</span>
                <span>WHITE</span>
                <span>LION</span>
              </div>
              <span className="font-sans text-[0.54rem] font-bold tracking-[0.16em] text-maroon uppercase mt-[3px]">
                AMERSHAM • LITTLE CHALFONT
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5 list-none">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'inline-flex flex-col items-center justify-center text-sm font-medium tracking-[0.02em] px-0.5 py-1.5 relative transition-all no-underline text-center rounded-sm',
                    isActive ? 'text-white' : 'text-white/90 hover:text-maroon'
                  )
                }
                onClick={handleNavClick}
              >
                {({ isActive }) => (
                  <>
                    {item.multiline ? (
                      <span className="flex flex-col leading-[1.15] text-[0.82rem] text-center">
                        <span>{item.line1}</span>
                        <span>{item.line2}</span>
                      </span>
                    ) : (
                      <span>{item.label}</span>
                    )}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-maroon rounded-[1px]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <button
              className="inline-flex items-center gap-2 bg-[#f0f0f0] text-[#172534] border-none rounded-[5px] px-3.5 py-1.5 cursor-pointer transition-all shadow-[0_2px_6px_rgba(0,0,0,0.15)] hover:bg-white hover:shadow-[0_4px_12px_rgba(255,255,255,0.25)] hover:-translate-y-[1px]"
              onClick={onOpenBooking}
              title="Make a Table Booking"
            >
              <CalendarCheck size={14} className="shrink-0" />
              <div className="flex flex-col items-start leading-[1.15] text-[0.76rem] font-bold">
                <span>Make a</span>
                <span>Booking</span>
              </div>
            </button>
            <a
              href={siteData.info.phoneHref}
              className="inline-flex items-center gap-2 bg-transparent text-white border border-white/75 rounded-[5px] px-3.5 py-1 cursor-pointer transition-all no-underline hover:bg-white/10 hover:border-white hover:-translate-y-[1px]"
              title="Call The White Lion direct"
            >
              <Phone size={13} className="shrink-0" />
              <div className="flex flex-col items-start leading-[1.15] text-[0.76rem] font-semibold">
                <span>01494</span>
                <span>766 849</span>
              </div>
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="lg:hidden bg-transparent text-white text-2xl p-2 cursor-pointer border-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/65 backdrop-blur-[4px] z-[1040]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 right-0 w-[84%] max-w-[360px] h-screen bg-dark-navy shadow-[-10px_0_30px_rgba(0,0,0,0.6)] z-[1050] flex flex-col px-6 py-7 transition-transform duration-300 overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/12">
          <div className="flex flex-col">
            <div className="flex flex-col font-brand text-base font-medium tracking-[0.32em] text-white leading-[1.15] uppercase">
              <span>THE</span>
              <span>WHITE</span>
              <span>LION</span>
            </div>
            <span className="font-sans text-[0.54rem] font-bold tracking-[0.16em] text-maroon uppercase mt-[3px]">
              AMERSHAM • LITTLE CHALFONT
            </span>
          </div>
          <button
            className="bg-black/40 text-white border border-white/10 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <ul className="list-none flex flex-col gap-4 mb-8">
          {navItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between text-lg font-serif tracking-[0.05em] py-2 no-underline',
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
          <button
            className="inline-flex items-center justify-center gap-2 w-full p-3 bg-[#f0f0f0] text-[#172534] border-none rounded-[5px] cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.15)] hover:bg-white transition-all"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
          >
            <CalendarCheck size={16} />
            <div className="text-center leading-[1.15] text-[0.76rem] font-bold">
              <span>Make a Booking</span>
            </div>
          </button>
          <a
            href={siteData.info.phoneHref}
            className="inline-flex items-center justify-center gap-2 w-full p-2.5 bg-transparent text-white border border-white/75 rounded-[5px] cursor-pointer no-underline hover:bg-white/10 transition-all"
          >
            <Phone size={14} />
            <div className="text-center leading-[1.15] text-[0.76rem] font-semibold">
              <span>Call 01494 766 849</span>
            </div>
          </a>
        </div>
      </aside>
    </>
  );
}
