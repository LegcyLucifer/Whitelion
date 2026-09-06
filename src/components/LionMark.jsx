import React from 'react';

// The site's one pictorial identity element — a scalloped-mane heraldic
// lion head, matching the brand direction given directly by the client
// (front-facing head, geometric mane, diamond nose, wave muzzle, white
// line-art). Stroke-only so it can sit on any of the site's navy
// backgrounds at any size without a raster asset; `color` lets it appear
// in maroon or navy-on-cream where a section isn't dark.
export default function LionMark({ size = 48, color = 'currentColor', strokeWidth = 1.6, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
        <path d="M 50 8 Q 59.58 18.52 73.51 15.64 Q 75.08 29.78 88.04 35.64 Q 81 48 88.04 60.36 Q 75.08 66.22 73.51 80.36 Q 59.58 77.48 50 88 Q 40.42 77.48 26.49 80.36 Q 24.92 66.22 11.96 60.36 Q 19 48 11.96 35.64 Q 24.92 29.78 26.49 15.64 Q 40.42 18.52 50 8 Z" />
        <path d="M 35 42.5 Q 40 40 45 42.5" />
        <path d="M 55 42.5 Q 60 40 65 42.5" />
        <path d="M 50 48 L 54 53 L 50 58 L 46 53 Z" />
        <path d="M 34 58 Q 42 66 50 58 Q 58 66 66 58" />
      </g>
    </svg>
  );
}
