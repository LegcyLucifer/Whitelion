import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, UtensilsCrossed } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function NotFoundPage({ onOpenBooking }) {
  const navigate = useNavigate();
  useSEO({
    title: 'Page Not Found',
    description: 'This page could not be found at The White Lion Amersham.',
    path: '/404',
  });

  const handleNav = (path) => {
    navigate(`/${path}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-warm-cream px-6 py-24 text-center">
      <div className="max-w-[520px]">
        <Badge variant="plain" tone="maroon" className="mb-3">Page Not Found</Badge>
        <h1 className="font-brand text-[clamp(2.4rem,5vw,3.4rem)] font-bold text-black mb-4">
          This table isn't set.
        </h1>
        <p className="text-text-muted text-lg leading-[1.6] mb-8">
          The page you're looking for doesn't exist — it may have moved, or the link was mistyped.
          Head back to the menu, or book a table while you're here.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="primary" icon={UtensilsCrossed} onClick={() => handleNav('menu')}>
            View the Menu
          </Button>
          <Button variant="outline" icon={CalendarCheck} onClick={onOpenBooking}>
            Book a Table
          </Button>
        </div>
      </div>
    </div>
  );
}
