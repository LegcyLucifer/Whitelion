import React from 'react';

// Three semantic tones, each meaning one specific thing — not decorative
// colour rotation:
//   maroon  = action / booking context
//   gold    = Christmas page only — the site's one seasonal accent
//   neutral = quiet section label — no colour statement at all, used for
//             every eyebrow that isn't actually seasonal or transactional
//
// `onDark` must be set by the caller to match the section's real
// background. Values are chosen to pass 4.5:1 on their intended background
// (dark navy ~#232f3c, or white/cream cards).
const PILL = {
  maroon: {
    light: "bg-maroon/10 text-maroon border-maroon/30",       // maroon on white ≈ 7.0:1
    dark: "bg-maroon/20 text-accent-tint-dark border-maroon/50", // ≈ 8.6:1 on navy-800
  },
  gold: {
    light: "bg-gold/15 text-gold-text-light border-gold/40",   // ≈ 5.0:1 on white
    dark: "bg-gold/15 text-gold-text-dark border-gold/40",      // ≈ 8.3:1 on navy-800
  },
  navy: {
    light: "bg-book-table/10 text-book-table border-book-table/30",
    dark: "bg-book-table/20 text-navy-300 border-book-table/50",
  },
  neutral: {
    light: "bg-navy-800/8 text-navy-700 border-navy-800/15",   // navy-700 on white ≈ 8.3:1
    dark: "bg-white/10 text-white/90 border-white/20",          // white/90 on navy-800 ≈ 9.5:1
  },
};

const PLAIN = {
  maroon: { light: "text-maroon", dark: "text-accent-tint-dark" },
  gold: { light: "text-gold-text-light", dark: "text-gold-text-dark" },
  navy: { light: "text-book-table", dark: "text-navy-300" },
  neutral: { light: "text-navy-700", dark: "text-white/80" },
};

const SOLID = {
  maroon: { light: "bg-maroon text-white", dark: "bg-maroon text-white" },
  gold: { light: "bg-gold text-white", dark: "bg-gold text-white" },
  navy: { light: "bg-book-table text-white", dark: "bg-book-table text-white" },
  neutral: { light: "bg-navy-800 text-white", dark: "bg-white text-navy-900" },
};

export default function Badge({
  children,
  tone = 'maroon',       // 'maroon' | 'gold' | 'navy' | 'neutral'
  variant = 'pill',      // 'pill' | 'plain' | 'solid'
  onDark = false,
  className = '',
}) {
  const ctx = onDark ? 'dark' : 'light';

  if (variant === 'plain') {
    // Serif italic, sentence case, no shout — an editorial caption line
    // (Dishoom-style) rather than the bold-tracked-uppercase "eyebrow"
    // pattern this replaces. Content keeps whatever case it's authored in.
    return (
      <span
        className={`inline-block font-brand italic text-lg tracking-[0.01em] ${onDark ? 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]' : ''} ${PLAIN[tone][ctx]} ${className}`}
      >
        {children}
      </span>
    );
  }

  if (variant === 'solid') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-[0.05em] uppercase ${SOLID[tone][ctx]} ${className}`}
      >
        {children}
      </span>
    );
  }

  // A printed label, not a chat-bubble pill: sharp corners, a hairline
  // border standing in for a stamped ticket edge.
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold tracking-[0.08em] uppercase border ${PILL[tone][ctx]} ${className}`}
    >
      {children}
    </span>
  );
}
