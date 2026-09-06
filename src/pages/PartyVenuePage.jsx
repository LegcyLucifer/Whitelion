import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { CheckCircle, Phone } from 'lucide-react';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';
import Badge from '../components/Badge';
import Button from '../components/Button';
import FieldError from '../components/FieldError';
import Select from '../components/Select';
import DatePicker from '../components/DatePicker';
import { fieldCls, labelCls } from '../lib/formStyles';
import { isValidEmail, isValidPhone, isRequired } from '../lib/validation';
import { shakeAnimation } from '../lib/motion';
import { getLocalISODate } from '../lib/date';

// Every key is always present (explicit `undefined` for a passing field,
// not an absent key) — callers merge this with `{...prev, ...validate()}`,
// and object spread only ever overwrites keys that actually appear in the
// source, so an omitted key would leave a fixed field's stale error in
// place forever.
function validate(formData) {
  return {
    date: isRequired(formData.date) ? undefined : "Please choose a date for your event.",
    name: isRequired(formData.name) ? undefined : "Please tell us your name.",
    email: !isRequired(formData.email)
      ? "We need an email to send your quote to."
      : !isValidEmail(formData.email) ? "That email address doesn't look right." : undefined,
    phone: !isRequired(formData.phone)
      ? "Please add a phone number."
      : !isValidPhone(formData.phone) ? "That phone number doesn't look right." : undefined,
  };
}

export default function PartyVenuePage({ showToast }) {
  const { title, subtitle, desc, stats, packages } = siteData.partyVenue;
  useSEO({
    title: 'Private Party Venue & Event Hire Amersham',
    description: 'Host your next event at The White Lion Amersham. Private venue hire for up to 320 guests, free parking, tailored Indian buffets and pub food. No hire fee for up to 50 guests.',
    path: '/party-venue',
  });
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    eventType: 'Birthday Party',
    guests: '50',
    date: '',
    package: 'Authentic Indian Feast',
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  useEffect(() => {
    if (!submitted) formControls.start({ opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } });
  }, [submitted, formControls]);

  const venueImages = [
    { title: "Event Buffet Platters", src: "/assets/venue_party_1.jpg" },
    { title: "Outdoor Terrace & Patio", src: "/assets/pub_patio_garden.jpg" },
    { title: "The White Lion Exterior & Grounds", src: "/assets/interior_dining_2.webp" },
    { title: "Main Lounge & Screen Area", src: "/assets/interior_dining_3.webp" }
  ];

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, ...validate({ ...formData, [field]: value }) }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, ...validate(formData) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const validationErrors = validate(formData);
    if (Object.values(validationErrors).some(Boolean)) {
      setErrors(validationErrors);
      setTouched({ date: true, name: true, email: true, phone: true });
      formControls.start(shakeAnimation);
      const firstInvalid = ['date', 'name', 'email', 'phone'].find((f) => validationErrors[f]);
      fieldRefs.current[firstInvalid]?.focus();
      showToast('Please check the highlighted fields below.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      if (!isMounted.current) return;
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Your party enquiry has been submitted. Our event coordinator will contact you shortly!');
    }, 700);
  };

  return (
    <div>
      {/* Page Header — a real venue photo instead of a flat navy gradient,
          matching the full-bleed photo-hero idiom already used on Home's
          atmosphere banner rather than the shared centered-block hero. */}
      <section
        className="relative py-20 px-6 text-center border-b border-black bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/venue_party_1.jpg)' }}
      >
        <div className="absolute inset-0 bg-navy-900/78" />
        <div className="w-full max-w-[1240px] mx-auto relative z-10">
          <Badge variant="plain" tone="neutral" onDark className="mb-3">
            Private Hire & Celebrations
          </Badge>
          {/* Floor lowered from 2.4rem to 1.75rem: "Book The White Lion for
              Your Next Event in Amersham" (51 characters) is longer than
              the floor this clamp was tuned for, and held it at 38.4px on
              a phone — 4 wrapped lines for one headline. 1.75rem gets it
              to 3. */}
          <h1 className="text-white text-[clamp(1.75rem,4.5vw,3.2rem)] font-bold mb-4 drop-shadow-md">{title}</h1>
          {/* Was text-text-muted-on-dark (navy-300) — tuned for flat navy
              surfaces (5.9:1), not this section's real background: a photo
              under a 78%-opacity scrim, which still lets bright patches
              (the pale platters below) through at contrast as low as
              3.1:1. Matched the h1's own white + drop-shadow treatment,
              which already holds up against this image. */}
          <p className="text-white/85 text-lg max-w-[700px] mx-auto leading-[1.6] drop-shadow-md">
            {subtitle} — {desc}
          </p>
        </div>
      </section>

      {/* The Brief — a bold, asymmetric editorial stat spread instead of
          an even-columned strip. Numbers are set at wildly different
          sizes on purpose (the way a magazine infographic weights the
          headline number over the supporting ones), on a full navy field
          so this reads as a distinct "capacity brief" moment rather than
          a continuation of the page above it. */}
      <div className="bg-navy-900 py-20">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 items-end">
            <div>
              <span className="block font-brand italic text-lg text-gold-text-dark mb-3">The Brief</span>
              <div className="font-brand text-[clamp(4.5rem,11vw,8rem)] font-bold text-white leading-[0.85] tracking-[-0.02em]">
                {stats[0].value}
              </div>
              <div className="text-white/60 uppercase tracking-[0.1em] text-sm font-semibold mt-2">{stats[0].label}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-6">
              {stats.slice(1).map((s, idx) => (
                <div key={idx}>
                  <div className="font-brand text-3xl font-bold text-white mb-1">{s.value}</div>
                  <div className="text-white/60 uppercase tracking-[0.08em] text-xs font-semibold leading-[1.4]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1240px] mx-auto px-6 py-16 pb-20">
        {/* Packages — full-width stacked spreads, each with an oversized
            numeral bleeding behind the copy, alternating alignment left
            and right like facing pages of a brochure. Not a 3-up grid: at
            three items a grid reads as "matching set," a stack reads as
            "these are ranked, read them in order." */}
        <div className="mb-[70px]">
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <span className="block font-brand italic text-lg text-navy-700 mb-2">
              Catering Options
            </span>
            <h2 className="text-3xl mb-2 font-bold font-serif text-black">Pre-Bookable Event Packages</h2>
            <p className="text-text-muted">
              Whether you want a casual buffet, full sit-down service, or canapés with champagne.
            </p>
          </div>

          <div className="flex flex-col gap-16">
            {packages.map((pkg, idx) => {
              const isRight = idx % 2 === 1;
              return (
                <div key={idx} className={`relative flex ${isRight ? 'justify-end' : 'justify-start'}`}>
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 font-brand font-bold text-maroon/[0.08] leading-none select-none pointer-events-none text-[10rem] md:text-[14rem] ${isRight ? 'right-0 md:-right-6' : 'left-0 md:-left-6'}`}
                    aria-hidden="true"
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className={`relative max-w-[520px] ${isRight ? 'text-right' : 'text-left'} ${isRight ? 'pr-4 md:pr-16' : 'pl-4 md:pl-16'}`}>
                    <h3 className="text-2xl mb-3 font-bold text-black">{pkg.title}</h3>
                    <p className="text-text-muted text-base leading-[1.7]">{pkg.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Enquiry Form & Real Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
          {/* Form */}
          <div className="bg-white border-t-4 border-maroon p-8 md:p-10">
            <h3 className="text-2xl mb-2 font-brand font-bold text-black">Make a Venue Hire Enquiry</h3>
            <p className="text-text-muted text-md mb-6">
              Fill in your event details and our events team will get back to you with availability and a custom quote.
            </p>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  animate={formControls}
                  initial={{ opacity: 0, y: 8 }}
                  className="flex flex-col gap-5"
                  noValidate
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Event type</label>
                      <Select
                        ariaLabel="Event type"
                        value={formData.eventType}
                        onChange={(v) => setFormData((prev) => ({ ...prev, eventType: v }))}
                        options={[
                          'Birthday Party',
                          'Wedding Reception / Engagement',
                          'Corporate / Work Event',
                          'Christmas Party',
                          'Anniversary / Family Gathering',
                          'Other Occasion',
                        ].map((o) => ({ value: o, label: o }))}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Expected guest count</label>
                      <Select
                        ariaLabel="Expected guest count"
                        value={formData.guests}
                        onChange={(v) => setFormData((prev) => ({ ...prev, guests: v }))}
                        options={[
                          { value: '20-50', label: 'Up to 50 Guests (No Hire Fee)' },
                          { value: '50-100', label: '50 - 100 Guests' },
                          { value: '100-180', label: '100 - 180 Guests' },
                          { value: '180-320', label: '180 - 320 Guests (Full Pub Takeover)' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div>
                      <label className={labelCls}>Desired date</label>
                      <DatePicker
                        ref={(el) => (fieldRefs.current.date = el)}
                        ariaLabel="Desired date"
                        min={getLocalISODate()}
                        value={formData.date}
                        onChange={(v) => {
                          setFormData((prev) => ({ ...prev, date: v }));
                          setTouched((prev) => ({ ...prev, date: true }));
                          setErrors((prev) => ({ ...prev, ...validate({ ...formData, date: v }) }));
                        }}
                        hasError={touched.date && !!errors.date}
                      />
                      <FieldError>{touched.date && errors.date}</FieldError>
                    </div>

                    <div>
                      <label className={labelCls}>Preferred catering</label>
                      <Select
                        ariaLabel="Preferred catering"
                        value={formData.package}
                        onChange={(v) => setFormData((prev) => ({ ...prev, package: v }))}
                        options={[
                          'Traditional Pub Buffet',
                          'Authentic Indian Feast',
                          'Canapé & Drinks Reception',
                          'Drinks Only / Bar Tab',
                        ].map((o) => ({ value: o, label: o }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Your name</label>
                    <input
                      ref={(el) => (fieldRefs.current.name = el)}
                      type="text"
                      placeholder="e.g. Marcus Thorne"
                      value={formData.name}
                      onChange={handleChange('name')}
                      onBlur={handleBlur('name')}
                      className={fieldCls(touched.name && !!errors.name)}
                      aria-invalid={touched.name && !!errors.name}
                      required
                    />
                    <FieldError>{touched.name && errors.name}</FieldError>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div>
                      <label className={labelCls}>Email</label>
                      <input
                        ref={(el) => (fieldRefs.current.email = el)}
                        type="email"
                        placeholder="e.g. marcus@example.com"
                        value={formData.email}
                        onChange={handleChange('email')}
                        onBlur={handleBlur('email')}
                        className={fieldCls(touched.email && !!errors.email)}
                        aria-invalid={touched.email && !!errors.email}
                        required
                      />
                      <FieldError>{touched.email && errors.email}</FieldError>
                    </div>

                    <div>
                      <label className={labelCls}>Phone</label>
                      <input
                        ref={(el) => (fieldRefs.current.phone = el)}
                        type="tel"
                        placeholder="e.g. 07123 456789"
                        value={formData.phone}
                        onChange={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        className={fieldCls(touched.phone && !!errors.phone)}
                        aria-invalid={touched.phone && !!errors.phone}
                        required
                      />
                      <FieldError>{touched.phone && errors.phone}</FieldError>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Additional requirements or ideas</label>
                    <textarea
                      placeholder="Tell us about entertainment, music, DJ requirements, dietary notes..."
                      value={formData.notes}
                      onChange={handleChange('notes')}
                      className={`${fieldCls(false)} min-h-[100px] resize-y`}
                    />
                  </div>

                  <Button
                    type="submit"
                    aria-label="Send party venue enquiry"
                    className="w-full py-4"
                    loading={isSubmitting}
                  >
                    {isSubmitting ? 'Sending Enquiry…' : 'Send Venue Enquiry'}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="text-center py-7 px-2.5"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
                    className="inline-flex mb-4"
                  >
                    <CheckCircle size={48} className="text-success" />
                  </motion.div>
                  <h3 className="text-2xl mb-2 font-bold text-black">Enquiry Received!</h3>
                  <p className="text-text-muted mb-5 text-base">
                    Thank you, <strong>{formData.name}</strong>. Our events manager will review your date and requirements and reach out via phone/email within 24 hours.
                  </p>
                  <Button size="sm" onClick={() => { setSubmitted(false); setErrors({}); setTouched({}); }}>
                    Submit Another Enquiry
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right column: direct call, then gallery — same order and
              weight as the Reservations page's sidebar (dark call card
              leading, photos below), so the higher-value enquiry here
              isn't the one with the weaker fallback. */}
          <div className="flex flex-col gap-7">
            <div className="bg-navy-950 rounded-card p-8 text-white border border-white/10">
              <Badge variant="plain" tone="neutral" onDark className="mb-3.5">
                Direct Assistance
              </Badge>
              <h3 className="text-white text-2xl mb-2.5 font-bold">
                Need it sorted today?
              </h3>
              <p className="text-text-muted-on-dark text-sm leading-[1.6] mb-5">
                Short-notice bookings, an immediate walkthrough, or a large event over 320 guests —
                speak with our events team directly and skip the enquiry form.
              </p>
              <a
                href={siteData.info.phoneHref}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-[0.03em] rounded-control transition-[background-color,border-color,transform,box-shadow] bg-maroon text-white border-2 border-white/80 shadow-control hover:bg-maroon-hover hover:border-white no-underline"
              >
                <Phone size={16} />
                <span>Call 01494 766 849</span>
              </a>
            </div>

            <div>
              <h4 className="text-xl mb-3.5 font-bold text-black">Venue Spaces & Setups</h4>
              <div className="grid grid-cols-2 gap-3.5">
                {venueImages.map((img, idx) => (
                  <div key={idx} className="relative overflow-hidden group border border-black/10">
                    <img
                      src={img.src}
                      alt={img.title}
                      className="w-full h-[180px] object-cover block transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 inset-x-0 px-2.5 py-2 bg-gradient-to-t from-black/75 to-transparent text-white text-xs font-semibold z-10 pointer-events-none">
                      {img.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
