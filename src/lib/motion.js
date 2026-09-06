// Shared Framer Motion variants for form feedback. One definition so a
// failed submit feels the same on every form on the site.

// A short horizontal shake for a field (or a whole form) that failed
// validation on submit — decays in amplitude so it reads as a physical
// "no" rather than a glitch. Respects reduced-motion automatically via
// the app-wide <MotionConfig reducedMotion="user"> in App.jsx.
export const shakeAnimation = {
  x: [0, -8, 8, -6, 6, -3, 3, 0],
  transition: { duration: 0.4, ease: 'easeInOut' },
};
