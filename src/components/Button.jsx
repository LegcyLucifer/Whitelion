import React from 'react';

// Every hand-rolled "primary CTA" button string across the site collapsed
// into these five variants. `navy` and `ghost-on-dark` existed everywhere
// as copy-pasted className strings but had no home in this component.
const VARIANTS = {
  primary: "bg-maroon text-white border border-white/70 shadow-control hover:bg-maroon-hover hover:border-white hover:-translate-y-px",
  navy: "bg-book-table text-white border border-book-table hover:bg-book-table-hover hover:-translate-y-px",
  secondary: "bg-[#f0f0f0] text-[#172534] border-none shadow-control hover:bg-white hover:-translate-y-px",
  outline: "bg-transparent text-black border border-black hover:bg-black hover:text-white",
  'ghost-on-dark': "bg-transparent text-white border border-white/70 hover:bg-white/10 hover:border-white",
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
  onClick,
  type = 'button',
  ...props
}) {
  const { pad, text, icon } = SIZES[size];

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-control font-semibold tracking-[0.03em] cursor-pointer transition-all ${pad} ${text} ${VARIANTS[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={icon} className="shrink-0" />}
      {children}
    </button>
  );
}
