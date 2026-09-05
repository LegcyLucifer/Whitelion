import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import PageTransition from './components/PageTransition';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import OffersPage from './pages/OffersPage';
import WhatsOnPage from './pages/WhatsOnPage';
import ReservationsPage from './pages/ReservationsPage';
import PartyVenuePage from './pages/PartyVenuePage';
import ChristmasPage from './pages/ChristmasPage';
import ContactPage from './pages/ContactPage';

import { CheckCircle2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const location = useLocation();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Contact Bar */}
      <TopBar />

      {/* Main Header & Nav */}
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Page Content */}
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage onOpenBooking={() => setIsBookingOpen(true)} showToast={showToast} /></PageTransition>} />
            <Route path="/menu" element={<PageTransition><MenuPage onOpenBooking={() => setIsBookingOpen(true)} /></PageTransition>} />
            <Route path="/offers" element={<PageTransition><OffersPage onOpenBooking={() => setIsBookingOpen(true)} /></PageTransition>} />
            <Route path="/whats-on" element={<PageTransition><WhatsOnPage onOpenBooking={() => setIsBookingOpen(true)} /></PageTransition>} />
            <Route path="/reservations" element={<PageTransition><ReservationsPage showToast={showToast} /></PageTransition>} />
            <Route path="/party-venue" element={<PageTransition><PartyVenuePage showToast={showToast} /></PageTransition>} />
            <Route path="/christmas" element={<PageTransition><ChristmasPage onOpenBooking={() => setIsBookingOpen(true)} /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage showToast={showToast} /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onOpenBooking={() => setIsBookingOpen(true)} showToast={showToast} />

      {/* Global Quick Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        showToast={showToast}
      />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-black/5 min-w-[280px]">
            <CheckCircle2 size={20} className="text-book-table" />
            <span className="text-[0.92rem] font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
