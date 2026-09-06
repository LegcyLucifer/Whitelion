import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

// One error line, used under every form field on the site. Height-animates
// in rather than popping into place — the field below it would otherwise
// jump the instant an error appears, which reads as the page glitching
// rather than responding to you. `role="alert"` + `aria-live` so a screen
// reader announces it the moment it appears, not just on next tab-through.
export default function FieldError({ children }) {
  return (
    <AnimatePresence>
      {children && (
        <motion.p
          role="alert"
          aria-live="polite"
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="flex items-center gap-1.5 text-xs text-error overflow-hidden"
        >
          <AlertCircle size={13} className="shrink-0" />
          <span>{children}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}
