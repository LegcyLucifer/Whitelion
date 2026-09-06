import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { getLocalISODate } from '../lib/date';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// No weekday in the trigger's compact display — "Sun, 6 Sept 2026" was
// wide enough (Fraunces + a 3-column grid alongside Time/Guests) to
// truncate on exactly the dates that spell out "Sept" in en-GB. The
// weekday is one tap away inside the calendar itself.
function formatDisplay(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Same reasoning as Select: a native <input type="date">'s calendar popup
// is entirely OS-drawn and cannot be restyled in any browser, so it was
// the one interaction on the booking forms that looked like nothing else
// on the site. This draws its own month grid instead.
const DatePicker = forwardRef(function DatePicker({ value, onChange, min, hasError = false, ariaLabel }, triggerRef) {
  const [isOpen, setIsOpen] = useState(false);
  const minDate = min ? new Date(min + 'T00:00:00') : null;
  const initialView = value ? new Date(value + 'T00:00:00') : (minDate || new Date());
  const [viewMonth, setViewMonth] = useState(new Date(initialView.getFullYear(), initialView.getMonth(), 1));
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setIsOpen(false);
    };
    const handleKey = (e) => {
      // stopPropagation, not just closing the calendar — without it, this
      // Escape keystroke keeps bubbling up to BookingModal's own window-
      // level Escape handler, closing the ENTIRE booking modal (and
      // discarding everything the user typed) just for dismissing the
      // calendar popover.
      if (e.key === 'Escape') { e.stopPropagation(); setIsOpen(false); }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = getLocalISODate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isDisabled = (d) => {
    if (!minDate) return false;
    const cellDate = new Date(year, month, d);
    return cellDate < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
  };

  const stateCls = hasError
    ? 'border-error focus:shadow-[0_0_0_3px_rgba(174,41,54,0.15)]'
    : 'border-maroon/25 focus:border-maroon focus:shadow-[0_0_0_3px_rgba(32,101,98,0.15)]';

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((o) => !o)}
        className={`w-full pl-4 pr-4 py-3 bg-warm-cream font-brand text-lg text-black text-left border-2 transition-[border-color,box-shadow,background-color] duration-150 focus:outline-none cursor-pointer flex items-center justify-between gap-2 ${stateCls} ${isOpen ? (hasError ? 'border-error' : 'border-maroon') : ''}`}
      >
        <span className={value ? 'truncate' : 'truncate text-text-muted'}>{value ? formatDisplay(value) : 'Select a date'}</span>
        <Calendar size={16} className="text-maroon/60 shrink-0" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Choose a date"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className="absolute z-50 top-[calc(100%+4px)] left-0 bg-white border-2 border-maroon shadow-control p-4 w-[280px]"
          >
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => setViewMonth(new Date(year, month - 1, 1))}
                className="p-1 text-maroon hover:bg-maroon/10 transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="font-brand font-bold text-md text-black">{MONTH_NAMES[month]} {year}</span>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => setViewMonth(new Date(year, month + 1, 1))}
                className="p-1 text-maroon hover:bg-maroon/10 transition-colors cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((w) => (
                <div key={w} className="text-center text-xs font-bold text-text-muted uppercase tracking-[0.03em] py-1">
                  {w}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, idx) => {
                if (d === null) return <div key={`blank-${idx}`} />;
                const iso = getLocalISODate(new Date(year, month, d));
                const disabled = isDisabled(d);
                const isSelected = iso === value;
                const isToday = iso === today;
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={disabled}
                    onClick={() => { onChange(iso); setIsOpen(false); }}
                    className={`aspect-square flex items-center justify-center text-sm font-brand cursor-pointer transition-colors ${
                      disabled
                        ? 'text-neutral-300 cursor-not-allowed'
                        : isSelected
                        ? 'bg-maroon text-white font-bold'
                        : isToday
                        ? 'border border-maroon/50 text-black hover:bg-maroon/10'
                        : 'text-black hover:bg-maroon/10'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default DatePicker;
