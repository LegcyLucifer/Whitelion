import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { Clock, Users, MapPin, CheckCircle, Copy, Check } from 'lucide-react';
import Button from './Button';
import FieldError from './FieldError';
import Select from './Select';
import DatePicker from './DatePicker';
import { siteData } from '../data/siteData';
import { fieldCls, labelCls } from '../lib/formStyles';
import { isValidEmail, isValidPhone, isRequired } from '../lib/validation';
import { shakeAnimation } from '../lib/motion';
import { getLocalISODate } from '../lib/date';

// The single reservation form used by both the quick-booking modal (any
// page, via the Navbar) and the dedicated /reservations page. Those two
// used to be hand-copied duplicates of each other and had already drifted
// — the modal's area options didn't match the page's. One component now,
// two shells around it.
//
// Field/label styling matches every other form on the site (Contact,
// Party Venue) via the shared `../lib/formStyles` — the only things unique
// to this form are the boxed Date/Time/Guests row (a custom `DatePicker`
// and `Select`, not native controls — see those components for why) and
// the solid, sharp-cornered maroon submit button used for booking itself.

const TIME_OPTIONS = [
  '12:00', '12:30', '13:00', '13:30', '14:00',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
];

function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

const AREA_OPTIONS = ['Main Dining Room', 'Pub & Bar Lounge', 'Outdoor Beer Garden'];
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20];

// Every key is always present (explicit `undefined` for a passing field,
// not an absent key) — callers merge this with `{...prev, ...validate()}`,
// and object spread only ever overwrites keys that actually appear in the
// source. A validate() that omits a now-valid field would leave that
// field's stale error sitting in state forever, uncleared.
function validate(formData) {
  return {
    name: isRequired(formData.name) ? undefined : "Please tell us your name.",
    email: !isRequired(formData.email)
      ? "We need an email to confirm your booking."
      : !isValidEmail(formData.email) ? "That email address doesn't look right." : undefined,
    phone: !isRequired(formData.phone)
      ? "Please add a phone number, in case we need to reach you."
      : !isValidPhone(formData.phone) ? "That phone number doesn't look right." : undefined,
  };
}

export default function ReservationForm({ showToast, onAfterConfirm }) {
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    date: getLocalISODate(),
    time: '19:00',
    guests: '2',
    area: AREA_OPTIONS[0],
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [refCopied, setRefCopied] = useState(false);
  const formControls = useAnimation();
  const fieldRefs = useRef({});
  const isMounted = useRef(true);

  useEffect(() => {
    // React 18 StrictMode double-invokes effects in dev: mount, cleanup,
    // mount again. Without resetting the flag back to true on that second
    // mount, `isMounted.current` is permanently stuck false after the very
    // first render in dev — silently breaking the delayed submit callback
    // below on every use, not just in a real-unmount edge case.
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Drives both the entrance fade AND the invalid-submit shake through the
  // same imperative controller — `useAnimation` requires the target to be
  // set with `.start()` even for the initial mount transition, since
  // handing `animate` a controls object (rather than a plain target
  // object) opts out of Framer's automatic initial→animate run.
  useEffect(() => {
    if (step === 'form') {
      formControls.start({ opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } });
    }
  }, [step, formControls]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Re-validate live once a field has already been flagged, so the error
    // clears the moment it's actually fixed instead of waiting for the
    // next blur or another submit attempt.
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, ...validate({ ...formData, [name]: value }) }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, ...validate(formData) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Belt-and-braces against a double-fire: the submit button disables
    // itself via `loading`, but that's a render away from taking effect,
    // so a re-entrant call (rapid double-click, Enter fired twice) is
    // guarded here too rather than relying on the button alone.
    if (isSubmitting) return;
    const validationErrors = validate(formData);
    if (Object.values(validationErrors).some(Boolean)) {
      setErrors(validationErrors);
      setTouched({ name: true, email: true, phone: true });
      formControls.start(shakeAnimation);
      const firstInvalid = ['name', 'email', 'phone'].find((f) => validationErrors[f]);
      fieldRefs.current[firstInvalid]?.focus();
      showToast?.('Please check the highlighted fields below.', 'error');
      return;
    }

    setIsSubmitting(true);
    // A brief, deliberate delay rather than an instant flip — a booking
    // confirmation that appears in zero time reads as fake. This is long
    // enough to register as "it did something," short enough not to feel
    // like a wait.
    setTimeout(() => {
      if (!isMounted.current) return;
      const ref = `WL-${Math.floor(10000 + Math.random() * 90000)}`;
      setBookingRef(ref);
      setIsSubmitting(false);
      setStep('confirmed');
      showToast?.(`Reservation confirmed! Booking ref: ${ref}`);
    }, 700);
  };

  const handleDone = () => {
    setStep('form');
    setErrors({});
    setTouched({});
    onAfterConfirm?.();
  };

  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(bookingRef);
      setRefCopied(true);
      setTimeout(() => setRefCopied(false), 2000);
    } catch {
      // Clipboard permission denied or unavailable — the reference is
      // already visible on screen, so there's nothing further to recover.
    }
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'confirmed' ? (
        <motion.div
          key="confirmed"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="text-center py-2"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
            className="inline-flex p-4 bg-success-bg-light border border-success/30 text-success mb-4"
          >
            <CheckCircle size={40} />
          </motion.div>
          <h2 className="text-2xl mb-2 font-brand font-bold text-black">Reservation Confirmed</h2>
          <p className="text-text-muted mb-6 text-base">
            We're delighted to welcome you to <strong>{siteData.info.name}</strong>.
          </p>

          <div className="border-2 border-maroon/25 p-6 text-left mb-7 bg-warm-cream">
            <div className="flex justify-between items-center mb-2.5 border-b border-maroon/15 pb-2.5">
              <span className="font-brand italic text-text-muted">Booking reference</span>
              <span className="flex items-center gap-2">
                <strong className="text-maroon text-lg">{bookingRef}</strong>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  aria-label="Copy booking reference"
                  className="text-text-muted hover:text-maroon transition-colors cursor-pointer p-0.5"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {refCopied ? (
                      <motion.span key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }} className="flex text-success">
                        <Check size={15} />
                      </motion.span>
                    ) : (
                      <motion.span key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }} className="flex">
                        <Copy size={14} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </span>
            </div>
            <div className="flex justify-between mb-2 text-md">
              <span className="text-text-muted">Name</span>
              <strong className="text-black">{formData.name}</strong>
            </div>
            <div className="flex justify-between mb-2 text-md">
              <span className="text-text-muted">Date &amp; time</span>
              <strong className="text-black">{formData.date} at {formatTime(formData.time)}</strong>
            </div>
            <div className="flex justify-between text-md">
              <span className="text-text-muted">Party size</span>
              <strong className="text-black">{formData.guests} guests · {formData.area}</strong>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleDone}
            className="w-full py-4"
          >
            Book Another Table
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          animate={formControls}
          initial={{ opacity: 0, y: 8 }}
          className="flex flex-col gap-5"
          noValidate
        >
          {/* Condensed date / time / guests row — the distinctive part of this
              form's identity, styled as one connected control rather than
              three generic labeled inputs. */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Date</label>
              <DatePicker
                ariaLabel="Date"
                value={formData.date}
                min={getLocalISODate()}
                onChange={(v) => setFormData((prev) => ({ ...prev, date: v }))}
              />
            </div>

            <div>
              <label className={labelCls}>Time</label>
              <Select
                ariaLabel="Time"
                icon={Clock}
                value={formData.time}
                onChange={(v) => setFormData((prev) => ({ ...prev, time: v }))}
                options={TIME_OPTIONS.map((t) => ({ value: t, label: formatTime(t) }))}
              />
            </div>

            <div>
              <label className={labelCls}>Guests</label>
              <Select
                ariaLabel="Guests"
                icon={Users}
                value={formData.guests}
                onChange={(v) => setFormData((prev) => ({ ...prev, guests: v }))}
                options={GUEST_OPTIONS.map((n) => ({ value: String(n), label: `${n} ${n === 1 ? 'Guest' : 'Guests'}` }))}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Preferred area</label>
            <Select
              ariaLabel="Preferred area"
              icon={MapPin}
              value={formData.area}
              onChange={(v) => setFormData((prev) => ({ ...prev, area: v }))}
              options={AREA_OPTIONS.map((a) => ({ value: a, label: a }))}
            />
          </div>

          <div>
            <label className={labelCls}>Full name</label>
            <input
              ref={(el) => (fieldRefs.current.name = el)}
              type="text" name="name" placeholder="e.g. Eleanor Vance"
              value={formData.name} onChange={handleChange} onBlur={handleBlur}
              className={fieldCls(touched.name && !!errors.name)}
              aria-invalid={touched.name && !!errors.name}
              aria-describedby={errors.name ? 'reservation-name-error' : undefined}
              required
            />
            <div id="reservation-name-error"><FieldError>{touched.name && errors.name}</FieldError></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <label className={labelCls}>Email address</label>
              <input
                ref={(el) => (fieldRefs.current.email = el)}
                type="email" name="email" placeholder="e.g. eleanor@example.com"
                value={formData.email} onChange={handleChange} onBlur={handleBlur}
                className={fieldCls(touched.email && !!errors.email)}
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={errors.email ? 'reservation-email-error' : undefined}
                required
              />
              <div id="reservation-email-error"><FieldError>{touched.email && errors.email}</FieldError></div>
            </div>
            <div>
              <label className={labelCls}>Phone number</label>
              <input
                ref={(el) => (fieldRefs.current.phone = el)}
                type="tel" name="phone" placeholder="e.g. 07123 456789"
                value={formData.phone} onChange={handleChange} onBlur={handleBlur}
                className={fieldCls(touched.phone && !!errors.phone)}
                aria-invalid={touched.phone && !!errors.phone}
                aria-describedby={errors.phone ? 'reservation-phone-error' : undefined}
                required
              />
              <div id="reservation-phone-error"><FieldError>{touched.phone && errors.phone}</FieldError></div>
            </div>
          </div>

          <div>
            <label className={labelCls}>Special requests</label>
            <textarea
              name="notes"
              placeholder="Birthdays, anniversaries, high chairs, allergies…"
              value={formData.notes}
              onChange={handleChange}
              className={`${fieldCls(false)} min-h-[90px] resize-y`}
            />
          </div>

          <Button
            type="submit"
            aria-label="Confirm your table reservation at The White Lion"
            className="w-full py-4"
            loading={isSubmitting}
          >
            {isSubmitting ? 'Reserving Your Table…' : 'Reserve Your Table'}
          </Button>

          <p className="text-center text-xs text-text-muted">
            Prefer to book over the phone? Call{' '}
            <a href={siteData.info.phoneHref} className="text-maroon font-bold hover:underline">
              {siteData.info.phone}
            </a>
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
