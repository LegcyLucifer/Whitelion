import React from 'react';

// Replaces the 15+ ad hoc uppercase pill/eyebrow spans scattered across
// every page. Two semantic tones instead of four decorative ones rotated
// with no meaning:
//   maroon = action / booking context
//   gold   = seasonal / premium context
//
// `onDark` must be set by the caller to match the section's real
// background. Several of the pills this replaces used a dark-text colour
// (e.g. text-[#4b7349] on Menu/Offers/Party Venue's dark navy hero) that
// only reads correctly on a light card — on the dark hero it measures
// ~2:1, well under the 4.5:1 WCAG AA floor. The values below are chosen
// to pass 4.5:1 on their intended background (dark navy ~#232f3c, or
// white/cream cards).
const PILL = {
  maroon: {
    light: "bg-maroon/10 text-maroon border-maroon/30",       // maroon on white ≈ 7.0:1
    dark: "bg-maroon/20 text-[#ff9d9f] border-maroon/50",      // ≈ 6.9:1 on navy-800
  },
  gold: {
    light: "bg-gold/15 text-[#8a6a2f] border-gold/40",         // ≈ 5.0:1 on white
    dark: "bg-gold/15 text-[#e5c788] border-gold/40",          // ≈ 8.3:1 on navy-800
  },
};

const PLAIN = {
  maroon: { light: "text-maroon", dark: "text-[#ff9d9f]" },
  gold: { light: "text-[#8a6a2f]", dark: "text-[#e5c788]" },
};

export default function Badge({
  children,
  tone = 'maroon',       // 'maroon' | 'gold'
  variant = 'pill',      // 'pill' | 'plain'
  onDark = false,
  className = '',
}) {
  const ctx = onDark ? 'dark' : 'light';

  if (variant === 'plain') {
    return (
      <span
        className={`inline-block font-sans text-sm font-bold tracking-[0.18em] uppercase ${onDark ? 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]' : ''} ${PLAIN[tone][ctx]} ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold tracking-[0.08em] uppercase rounded-full border ${PILL[tone][ctx]} ${className}`}
    >
      {children}
    </span>
  );
}
