import React from 'react';
import { Loader2 } from 'lucide-react';

// Every hand-rolled "primary CTA" button string across the site collapsed
// into these five variants. `navy` and `ghost-on-dark` existed everywhere
// as copy-pasted className strings but had no home in this component.
//
// Shape: sharp corners + a hard offset "stamp" shadow, not a rounded pill
// with a soft blur — the same letterpress-registration device Dishoom uses
// behind its own outlined buttons. The button sits offset from its shadow
// by default, lifts further on hover (revealing more of the stamp), and
// presses flat into it on click (shadow disappears, button meets the
// stamp's position) — a printed block being pressed onto paper, not a
// digital surface floating above one.
const VARIANTS = {
  primary: "bg-maroon text-white border-2 border-white/80 shadow-control hover:bg-maroon-hover hover:border-white",
  navy: "bg-book-table text-white border-2 border-book-table shadow-control hover:bg-book-table-hover",
  secondary: "bg-neutral-100 text-navy-900 border-2 border-black/15 shadow-control hover:bg-white",
  outline: "bg-transparent text-black border-2 border-black shadow-control hover:bg-black hover:text-white",
  'ghost-on-dark': "bg-transparent text-white border-2 border-white/70 hover:bg-white/10 hover:border-white",
};

const SIZES = {
  sm: { pad: "px-4 py-2", text: "text-xs", icon: 15 },
  md: { pad: "px-6 py-3", text: "text-sm", icon: 18 },
};

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'navy' | 'secondary' | 'outline' | 'ghost-on-dark'
  size = 'md',          // 'sm' | 'md'
  className = '',
  icon: Icon,
  loading = false,      // shows a spinner in place of the icon and disables the button
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const { pad, text, icon } = SIZES[size];
  const hasStamp = variant !== 'ghost-on-dark';
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold tracking-[0.03em] cursor-pointer transition-[background-color,border-color,transform,box-shadow,opacity] duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${hasStamp ? '-translate-x-0 -translate-y-0 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-control' : ''} ${pad} ${text} ${VARIANTS[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 size={icon} className="shrink-0 animate-spin" />
      ) : (
        Icon && <Icon size={icon} className="shrink-0" />
      )}
      {children}
    </button>
  );
}
