import React from 'react';

// Replaces the 5-6 copy-pasted "dark gradient rounded box with heading +
// button(s)" panels that closed out Home, Menu, Offers, and Christmas with
// drifting colour values and no shared markup. Composition over
// configuration: actions are passed as children (usually <Button>s)
// rather than a rigid actions-array prop.
const BACKGROUND = {
  gradient: "bg-gradient-to-br from-[#172534] to-[#232f3c]",
  flat: "bg-[#121517]",
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
          <h2 className="text-white text-[2rem] md:text-[2.4rem] mb-2 font-bold">{title}</h2>
          {description && <p className="text-[#cbd5e1] text-lg leading-[1.6]">{description}</p>}
        </div>
        {children && <div className="flex flex-wrap gap-4">{children}</div>}
      </div>
    </div>
  );
}
