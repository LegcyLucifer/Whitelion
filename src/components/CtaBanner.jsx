import React from 'react';

// Replaces the 5-6 copy-pasted "dark gradient rounded box with heading +
// button(s)" panels that closed out Home, Menu, Offers, and Christmas with
// drifting colour values and no shared markup. Composition over
// configuration: actions are passed as children (usually <Button>s)
// rather than a rigid actions-array prop.
const BACKGROUND = {
  gradient: "bg-gradient-to-br from-navy-900 to-navy-800",
  flat: "bg-navy-950",
};

export default function CtaBanner({
  eyebrow,
  title,
  description,
  image,                  // optional background photo URL, used when variant="photo"
  variant = 'gradient',   // 'gradient' | 'flat' | 'photo'
  align = 'between',      // 'between' (heading left, actions right) | 'center'
  children,
  className = '',
}) {
  const isPhoto = variant === 'photo' && image;

  return (
    <div
      className={`relative overflow-hidden rounded-panel p-8 md:p-12 text-white shadow-panel ${isPhoto ? '' : (BACKGROUND[variant] || BACKGROUND.gradient)} ${className}`}
      style={isPhoto ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {isPhoto && <div className="absolute inset-0 bg-navy-900/80" />}
      <div className={`relative z-10 flex flex-wrap gap-8 ${align === 'center' ? 'flex-col items-center text-center' : 'items-center justify-between'}`}>
        <div className="max-w-[640px]">
          {eyebrow}
          {/* Fluid, not the dead text-3xl md:text-3xl no-op this replaces
              (a fossil of an earlier automated font-scale consolidation
              that collapsed two originally-different sizes onto one token).
              This component's title is caller-supplied and this page's own
              use is 36 characters — at a flat 36px that wrapped to 3 lines
              on a phone; the floor below gets it to 2. */}
          <h2 className="text-white text-[clamp(1.5rem,4vw,2.25rem)] mb-2 font-bold">{title}</h2>
          {/* photo variant: text-muted-on-dark (navy-300) is tuned for flat
              navy surfaces (5.9:1) and fails against bright patches showing
              through the fixed navy-900/80 scrim — same failure mode found
              and fixed on the Home hero and Party Venue header. White +
              drop-shadow holds up against a photo the way muted-on-dark
              can't; gradient/flat keep the original treatment since those
              are flat colour and already pass. */}
          {description && (
            <p className={`text-lg leading-[1.6] ${isPhoto ? 'text-white/85 drop-shadow-md' : 'text-text-muted-on-dark'}`}>
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex flex-wrap gap-4">{children}</div>}
      </div>
    </div>
  );
}
