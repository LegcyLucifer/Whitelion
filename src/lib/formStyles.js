// Shared field/label styling for every form on the site (Contact, Party
// Venue enquiry, Newsletter, and the booking ReservationForm). These used
// to be independently copy-pasted `const fieldCls =` / `const labelCls =`
// literals in each file — identical by luck, not by reference, the same
// drift risk that caused the opening-hours mismatch fixed earlier. One
// definition now; a restyle only has to happen once.

export const labelCls = "font-brand italic text-md text-navy-700 mb-1 block";

// Functions, not static strings: every field needs to render differently
// once it has a validation error, and a function call site
// (`className={fieldCls(!!errors.name)}`) makes that a required decision
// rather than something easy to forget on one field and not another.
// The focus state adds a soft colour-matched glow (box-shadow), not just
// a border-colour swap — a glow reads as "this field is alive" the instant
// you tab into it, before you've even started typing.
export const fieldCls = (hasError) =>
  `w-full px-4 py-3 border-2 bg-warm-cream font-brand text-lg text-black transition-[border-color,box-shadow,background-color] duration-150 focus:outline-none focus:bg-white ${
    hasError
      ? 'border-error focus:shadow-[0_0_0_3px_rgba(174,41,54,0.15)]'
      : 'border-maroon/25 focus:border-maroon focus:shadow-[0_0_0_3px_rgba(32,101,98,0.15)]'
  }`;
