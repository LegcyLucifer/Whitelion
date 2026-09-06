# 001 — BookingModal: make the open/close transition real

- **Status:** DONE
- **Commit at audit time:** d48bba7
- **Severity:** HIGH
- **Category:** Interruptibility / Physicality
- **File:** `src/components/BookingModal.jsx`

## Problem

```jsx
// src/components/BookingModal.jsx
export default function BookingModal({ isOpen, onClose, showToast }) {
  const closeButtonRef = React.useRef(null);
  useEffect(() => { /* ...focus + Escape handling... */ }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 md:p-6 overflow-y-auto transition-opacity duration-300" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Reserve your table"
        className="bg-white rounded-panel shadow-panel w-full max-w-[620px] max-h-[90vh] overflow-y-auto relative p-6 md:p-10 mx-auto my-auto transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
```

`if (!isOpen) return null` means the entire subtree — including both divs
carrying `transition-opacity duration-300` and `transition-transform
duration-300` — is unmounted when closed and mounted fresh when opened.
CSS transitions only animate a property change between two rendered states
of the *same* element; here there is no prior rendered state to interpolate
from; opacity and transform are never toggled between two values in the
code at all. The result: the modal snaps fully into view/out of view
instantly. Both transition classes are dead code today. This is the site's
primary conversion surface (every "Book a Table" button sitewide opens
this).

## Target fix

Replace the manual mount guard with Framer Motion's `AnimatePresence` +
`motion.div`, matching the convention already established in
`src/components/PageTransition.jsx` (same library, same project, so this
introduces no new dependency and no new pattern):

```jsx
import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Badge from './Badge';
import ReservationForm from './ReservationForm';
import { siteData } from '../data/siteData';

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
            <button ref={closeButtonRef} className="absolute top-4 right-4 bg-transparent border-none text-[#656b73] cursor-pointer p-2 transition-colors hover:text-black z-10" onClick={onClose} aria-label="Close modal">
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <Badge tone="maroon" className="mb-2">Instant Table Booking</Badge>
              <h2 className="text-[1.85rem] mb-1.5 font-brand text-black font-bold">Reserve Your Table</h2>
              <p className="text-[0.92rem] text-[#656b73]">
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
```

Notes on the exact values:
- `duration: 0.2` (200ms), `ease: 'easeOut'` — matches the feel of
  `PageTransition.jsx`'s `duration: 0.3, ease: 'easeOut'` but a touch
  snappier, appropriate for a modal (shorter travel distance, higher
  frequency of use than a full page transition).
- Panel: `scale: 0.96 → 1` plus `y: 8 → 0` (not `0.9`/`20px` — keep the
  motion subtle; this is a form dialog, not a hero element). Origin is
  implicitly center, which is correct for a centered dialog.
- Because `MotionConfig reducedMotion="user"` already wraps the whole app
  in `App.jsx`, this automatically respects `prefers-reduced-motion` with
  zero extra work — one more reason to use Framer Motion here rather than
  hand-rolled CSS.

## Steps

1. Open `src/components/BookingModal.jsx`.
2. Add `AnimatePresence, motion` to the `framer-motion` import (new import
   line, since the file doesn't currently import from `framer-motion`).
3. Remove the `if (!isOpen) return null;` early return.
4. Wrap the return value in `<AnimatePresence>{isOpen && ( ... )}</AnimatePresence>`.
5. Convert the outer `<div>` and the inner dialog `<div>` to `motion.div`
   with the `initial`/`animate`/`exit`/`transition` props shown above.
   Drop the now-redundant `transition-opacity duration-300` /
   `transition-transform duration-300` classes from their `className`
   strings (Framer Motion now owns those properties).
6. Leave everything else in the file (focus handling, Escape key listener,
   `ReservationForm` usage, close button) unchanged.

## Scope boundaries

- Do not change `ReservationForm.jsx` or the booking flow logic.
- Do not change how `isOpen` is controlled from `App.jsx`.
- Do not add a new easing/duration token for this — 200ms/`easeOut` is a
  one-off appropriate to this component; plan 005 handles sitewide token
  consolidation for the *hover-zoom* pattern specifically, not modals.

## Verification

1. `npm run build` — must compile with no errors.
2. In-browser: open the booking modal from the Navbar CTA. Confirm it
   fades and scales in (not an instant pop). Close it (X button, Escape,
   and backdrop click) — confirm it fades/scales out rather than
   vanishing.
3. Feel-check: use the browser's "slow motion" if available, or eyeball at
   normal speed — the panel should visibly grow slightly and settle, not
   flash.
4. Confirm keyboard focus still moves to the close button on open (existing
   `closeButtonRef.current?.focus()` behavior must survive the refactor).
5. Confirm `prefers-reduced-motion: reduce` (OS-level or DevTools emulation)
   makes the modal appear/disappear instantly with no scale/fade — this is
   `MotionConfig`'s job, verify it isn't broken by this change.
