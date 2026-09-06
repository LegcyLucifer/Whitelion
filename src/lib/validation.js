// Shared field-level validation for every form on the site. Plain
// functions, not a schema library — the site has four short forms, not
// forty, so a dependency would cost more than it'd save.

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// Loose on purpose: UK mobiles, landlines, spaces, and +44 all need to
// pass. This only catches "clearly not a phone number" (letters, too
// short), not format-policing a real one.
export function isValidPhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 13;
}

export function isRequired(value) {
  return value.trim().length > 0;
}
