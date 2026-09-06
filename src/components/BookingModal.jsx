import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Badge from './Badge';
import ReservationForm from './ReservationForm';
import { siteData } from '../data/siteData';

// AnimatePresence, not a plain `if (!isOpen) return null`, so the open/close
// transition is real: the old version toggled className strings carrying
// `transition-opacity`/`transition-transform` on an element that mounted
// and unmounted in one shot, so there was never a "before" state for the
// browser to interpolate from — the modal simply snapped in and out.
export default function BookingModal({ isOpen, onClose, showToast }) {
  const closeButtonRef = React.useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 md:p-6 overflow-y-auto"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Reserve your table"
            className="bg-white rounded-panel shadow-panel w-full max-w-[620px] max-h-[90vh] overflow-y-auto relative p-6 md:p-10 mx-auto my-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <button ref={closeButtonRef} className="absolute top-4 right-4 bg-transparent border-none text-text-muted cursor-pointer p-2 transition-colors hover:text-black z-10" onClick={onClose} aria-label="Close modal">
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <Badge tone="maroon" className="mb-2">Instant Table Booking</Badge>
              <h2 className="text-2xl mb-1.5 font-brand text-black font-bold">Reserve Your Table</h2>
              <p className="text-md text-text-muted">
                At {siteData.info.name} • Best seats reserved for your dining experience
              </p>
            </div>

            <ReservationForm showToast={showToast} onAfterConfirm={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
