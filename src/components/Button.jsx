import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', // 'primary' | 'secondary' | 'outline'
  className = '', 
  icon: Icon,
  onClick,
  type = 'button',
  ...props 
}) {
  const baseClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[5px] text-[0.94rem] font-semibold tracking-[0.03em] cursor-pointer transition-all focus:outline-none";
  
  const variants = {
    primary: "bg-maroon text-white border border-white/70 shadow-[0_4px_14px_rgba(158,52,56,0.35)] hover:bg-maroon-hover hover:border-white hover:-translate-y-[1px]",
    secondary: "bg-[#f0f0f0] text-[#172534] border-none shadow-[0_2px_6px_rgba(0,0,0,0.15)] hover:bg-white hover:shadow-[0_4px_12px_rgba(255,255,255,0.25)] hover:-translate-y-[1px]",
    outline: "bg-transparent text-black border border-black hover:bg-black hover:text-white"
  };

  return (
    <button 
      type={type}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={18} className="shrink-0" />}
      {children}
    </button>
  );
}
