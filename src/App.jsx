import React, { useState, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import NotFoundPage from './pages/NotFoundPage';

import { CheckCircle2, AlertCircle } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [toast, setToast] = useState(null); // { message, type } | null
  const location = useLocation();

  // Every form on the site calls this for both success ("Reservation
  // confirmed") and failure ("Please fill in your name") messages. It used
  // to always render the same green checkmark regardless — an error toast
  // wearing a success icon is exactly the kind of mismatch Nielsen's
  // "recognition rather than recall" heuristic flags: the icon should let
  // you tell good news from bad without reading the words.
  //
  // Dismissal is keyed to a unique id per call, not the message text.
  // Several forms share the exact same validation-error string ("Please
  // check the highlighted fields below."), so keying on message equality
  // meant resubmitting an invalid form a second time — a very ordinary
  // thing to do while fixing one field at a time — got the toast cleared
  // by the FIRST attempt's 4s timer, up to 4s early relative to the second,
  // more recent trigger.
  const toastIdRef = useRef(0);
  const showToast = (msg, type = 'success') => {
    const id = ++toastIdRef.current;
    setToast({ id, message: msg, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="flex flex-col min-h-screen">
      {/* Main Header & Nav */}
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Page Content */}
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage onOpenBooking={() => setIsBookingOpen(true)} /></PageTransition>} />
            <Route path="/menu" element={<PageTransition><MenuPage onOpenBooking={() => setIsBookingOpen(true)} /></PageTransition>} />
            <Route path="/offers" element={<PageTransition><OffersPage onOpenBooking={() => setIsBookingOpen(true)} /></PageTransition>} />
            <Route path="/whats-on" element={<PageTransition><WhatsOnPage onOpenBooking={() => setIsBookingOpen(true)} /></PageTransition>} />
            <Route path="/reservations" element={<PageTransition><ReservationsPage showToast={showToast} /></PageTransition>} />
            <Route path="/party-venue" element={<PageTransition><PartyVenuePage showToast={showToast} /></PageTransition>} />
            <Route path="/christmas" element={<PageTransition><ChristmasPage onOpenBooking={() => setIsBookingOpen(true)} /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage showToast={showToast} /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFoundPage onOpenBooking={() => setIsBookingOpen(true)} /></PageTransition>} />
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
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
        <AnimatePresence>
          {toast && (
            <motion.div
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`flex items-center gap-3 bg-white px-5 py-3 shadow-panel border-2 min-w-[280px] max-w-[90vw] pointer-events-auto ${
                toast.type === 'error' ? 'border-error/40' : 'border-black/10'
              }`}
            >
              {toast.type === 'error' ? (
                <AlertCircle size={20} className="text-error shrink-0" />
              ) : (
                <CheckCircle2 size={20} className="text-success shrink-0" />
              )}
              <span className="text-md font-medium">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </MotionConfig>
  );
}
