import React from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';
import { siteData } from '../data/siteData';

export default function TopBar() {
  const { phone, phoneHref, address, facebookUrl, instagramUrl, tiktokUrl } = siteData.info;

  return (
    <aside aria-label="Quick contact and hours" className="bg-black text-white text-[0.82rem] border-b border-white/10">
      <div className="w-full max-w-[1240px] mx-auto px-6 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-5">
          <a href={phoneHref} className="inline-flex items-center gap-1.5 text-white no-underline hover:text-sage transition-all">
            <Phone size={13} className="text-divider-teal" />
            <span className="tracking-[0.04em]">{phone}</span>
          </a>
          <span className="inline-flex items-center gap-1.5 text-white">
            <MapPin size={13} className="text-divider-teal" />
            <span>{address}</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <span className="inline-flex items-center gap-1.5 text-white mr-2">
            <Clock size={13} className="text-sage" />
            <span>Mon–Thu: 12pm–11pm | Fri–Sat: to Midnight</span>
          </span>
          <div className="flex items-center gap-3">
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white hover:text-sage transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.95-4.49V8.58a8.28 8.28 0 0 0 5.25 1.83V6.99a4.85 4.85 0 0 1-1.43-.3z" />
              </svg>
            </a>
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white hover:text-sage transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white hover:text-sage transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
