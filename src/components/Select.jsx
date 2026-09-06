import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

// A hand-built dropdown, not a native <select>. The trigger can be styled
// to match the site (sharp corners, copper focus glow, the same fieldCls
// language as every text input) — but a native <select>'s OPEN popup
// cannot be styled at all in any browser, so the instant someone opened
// one it fell into plain OS/Chrome chrome: blue system highlight, system
// font, nothing to do with the site. This renders its own dropdown panel
// instead, so the open state is as on-brand as the closed one.
//
// Keyboard focus never leaves the trigger button (the standard
// aria-activedescendant combobox pattern) — ArrowUp/Down move the
// highlighted option and open the list if it's closed, Enter/Space
// chooses the highlighted option, Escape closes without changing it. A
// visitor who never touches a mouse can use this exactly like a native
// select.
export default function Select({
  value,
  onChange,
  options, // [{ value, label }]
  icon: Icon,
  hasError = false,
  ariaLabel,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef(null);
  const listRef = useRef(null);

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setHighlighted(selectedIndex);
  }, [isOpen, selectedIndex]);

  useEffect(() => {
    if (isOpen) {
      listRef.current?.querySelector('[data-highlighted="true"]')?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, highlighted]);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(options[highlighted].value);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      // stopPropagation — same reasoning as DatePicker's Escape handler:
      // without it, this bubbles up to BookingModal's window-level Escape
      // listener and closes the whole modal instead of just this dropdown.
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(false);
    }
  };

  const base = "w-full py-3 bg-warm-cream font-brand text-lg text-black text-left border-2 transition-[border-color,box-shadow,background-color] duration-150 focus:outline-none cursor-pointer flex items-center justify-between gap-2";
  const paddingCls = Icon ? 'pl-4 pr-3' : 'px-4';
  const stateCls = hasError
    ? 'border-error focus:shadow-[0_0_0_3px_rgba(174,41,54,0.15)]'
    : 'border-maroon/25 focus:border-maroon focus:shadow-[0_0_0_3px_rgba(32,101,98,0.15)]';

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        aria-activedescendant={isOpen ? `option-${options[highlighted]?.value}` : undefined}
        onClick={() => setIsOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className={`${base} ${paddingCls} ${stateCls} ${isOpen ? (hasError ? 'border-error' : 'border-maroon') : ''}`}
      >
        {/* Wraps rather than truncates — a selected option like "Up to 50
            Guests (No Hire Fee)" loses real information behind an ellipsis
            on a narrow phone; there's vertical room to just show it. */}
        <span className="text-left">{selected?.label}</span>
        <span className="flex items-center gap-2 shrink-0">
          {Icon && <Icon size={16} className="text-maroon/60" />}
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.15 }} className="text-maroon/50">
            <ChevronDown size={16} />
          </motion.span>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listRef}
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className="absolute z-50 top-[calc(100%+4px)] left-0 right-0 max-h-[260px] overflow-y-auto bg-white border-2 border-maroon shadow-control list-none py-1"
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isHighlighted = idx === highlighted;
              return (
                <li
                  key={opt.value}
                  id={`option-${opt.value}`}
                  role="option"
                  aria-selected={isSelected}
                  data-highlighted={isHighlighted}
                  onMouseEnter={() => setHighlighted(idx)}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`flex items-center justify-between gap-2 px-4 py-2.5 font-brand text-md cursor-pointer ${
                    isHighlighted ? 'bg-maroon/10 text-black' : 'text-black'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={15} className="text-maroon shrink-0" />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
