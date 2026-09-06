import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import Button from '../components/Button';
import FieldError from '../components/FieldError';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';
import { fieldCls, labelCls } from '../lib/formStyles';
import { isValidEmail, isRequired } from '../lib/validation';
import { shakeAnimation } from '../lib/motion';

// Every key is always present (explicit `undefined` for a passing field,
// not an absent key) — callers merge this with `{...prev, ...validate()}`,
// and object spread only ever overwrites keys that actually appear in the
// source, so an omitted key would leave a fixed field's stale error in
// place forever.
function validate(formData) {
  return {
    name: isRequired(formData.name) ? undefined : "Please tell us your name.",
    email: !isRequired(formData.email)
      ? "We need an email address to reply to you."
      : !isValidEmail(formData.email) ? "That email address doesn't look right." : undefined,
    message: isRequired(formData.message) ? undefined : "Let us know what you'd like to say.",
  };
}

export default function ContactPage({ showToast }) {
  useSEO({
    title: 'Contact Us — Get in Touch',
    description: 'Contact The White Lion Amersham. Call 01494 766 849, email us, or use our enquiry form. Find us on White Lion Road, Amersham HP7 9LJ.',
    path: '/contact',
  });
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
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
    if (!formSent) formControls.start({ opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } });
  }, [formSent, formControls]);

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
      setTouched({ name: true, email: true, message: true });
      formControls.start(shakeAnimation);
      const firstInvalid = ['name', 'email', 'message'].find((f) => validationErrors[f]);
      fieldRefs.current[firstInvalid]?.focus();
      showToast('Please check the highlighted fields below.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      if (!isMounted.current) return;
      setIsSubmitting(false);
      setFormSent(true);
      showToast('Thank you for contacting The White Lion Amersham. We will reply promptly!');
    }, 700);
  };

  return (
    <div>
      {/* No full hero here -- a utility page like this doesn't need a
          sixth copy of the navy-gradient block. A simple in-flow title
          is enough. */}
      <div className="w-full max-w-[1240px] mx-auto px-6 pt-12 pb-20">
        <div className="max-w-[640px] mx-auto text-center mb-12">
          <h1 className="text-black text-3xl font-bold mb-3">Contact Us</h1>
          <p className="text-text-muted text-lg leading-[1.6]">
            Have a question, feedback, or need special dining arrangements?
            Get in touch with The White Lion team or visit us in Little Chalfont, Amersham.
          </p>
        </div>

        {/* 3 Contact Methods — a plain left-aligned row divided by rules,
            not the icon-in-tinted-square formula reused on Home/Party
            Venue/Christmas. Icon sits inline with the heading. */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200 border-y border-neutral-200 mb-[60px]">
          <div className="p-6 md:pr-8 first:pl-0">
            <div className="flex items-center gap-2 mb-1.5 text-navy-800">
              <Phone size={18} />
              <h3 className="text-lg font-bold text-black">Phone Us</h3>
            </div>
            <p className="text-text-muted text-sm mb-2 leading-[1.5]">
              Give us a call during opening hours for reservations or inquiries.
            </p>
            <a href={siteData.info.phoneHref} className="text-navy-700 font-bold text-base hover:underline">
              {siteData.info.phone}
            </a>
          </div>

          <div className="p-6 md:px-8">
            <div className="flex items-center gap-2 mb-1.5 text-navy-800">
              <Mail size={18} />
              <h3 className="text-lg font-bold text-black">Email Us</h3>
            </div>
            <p className="text-text-muted text-sm mb-2 leading-[1.5]">
              Send us an email for general inquiries, feedback, or private events.
            </p>
            <a href={`mailto:${siteData.info.email}`} className="text-navy-700 font-bold text-sm break-all hover:underline">
              {siteData.info.email}
            </a>
          </div>

          <div className="p-6 md:pl-8 last:pr-0">
            <div className="flex items-center gap-2 mb-1.5 text-navy-800">
              <MapPin size={18} />
              <h3 className="text-lg font-bold text-black">Location</h3>
            </div>
            <p className="text-text-muted text-sm mb-1 leading-[1.5]">
              {siteData.info.address}
            </p>
            <p className="text-text-muted text-sm mb-2 leading-[1.5]">
              {siteData.history.station}
            </p>
            <a href={siteData.info.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-navy-700 font-bold text-sm hover:underline">
              Open in Google Maps →
            </a>
          </div>
        </div>

        {/* Contact Form & Hours Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 border-2 border-black/10">
            <h3 className="text-2xl mb-2 font-brand font-bold text-black">Send Us a Message</h3>
            <p className="text-text-muted text-md mb-6">
              We normally respond within 24 hours.
            </p>

            <AnimatePresence mode="wait">
              {!formSent ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  animate={formControls}
                  initial={{ opacity: 0, y: 8 }}
                  className="flex flex-col gap-5"
                  noValidate
                >
                  <div>
                    <label className={labelCls}>Your name</label>
                    <input
                      ref={(el) => (fieldRefs.current.name = el)}
                      type="text"
                      placeholder="e.g. David Miller"
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
                      <label className={labelCls}>Email address</label>
                      <input
                        ref={(el) => (fieldRefs.current.email = el)}
                        type="email"
                        placeholder="e.g. david@example.com"
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
                      <label className={labelCls}>Phone number</label>
                      <input
                        type="tel"
                        placeholder="e.g. 01494 000000"
                        value={formData.phone}
                        onChange={handleChange('phone')}
                        className={fieldCls(false)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. Table reservation question, private hire, dietary query"
                      value={formData.subject}
                      onChange={handleChange('subject')}
                      className={fieldCls(false)}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Message</label>
                    <textarea
                      ref={(el) => (fieldRefs.current.message = el)}
                      placeholder="How can we help you today?"
                      value={formData.message}
                      onChange={handleChange('message')}
                      onBlur={handleBlur('message')}
                      className={`${fieldCls(touched.message && !!errors.message)} min-h-[120px] resize-y`}
                      aria-invalid={touched.message && !!errors.message}
                      required
                    />
                    <FieldError>{touched.message && errors.message}</FieldError>
                  </div>

                  <Button
                    type="submit"
                    aria-label="Send your message to The White Lion"
                    className="w-full py-4"
                    loading={isSubmitting}
                  >
                    {isSubmitting ? 'Sending…' : 'Send Message'}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="text-center py-9 px-2.5"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
                    className="inline-flex mb-4"
                  >
                    <CheckCircle size={48} className="text-success" />
                  </motion.div>
                  <h3 className="text-2xl mb-2 font-bold text-black">Message Dispatched!</h3>
                  <p className="text-text-muted mb-5 text-base">
                    Thanks for getting in touch, <strong>{formData.name}</strong>. A member of The White Lion team will get back to you soon.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFormSent(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                      setErrors({});
                      setTouched({});
                    }}
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Opening & Serving Times Tables + Map */}
          <div className="flex flex-col gap-7">
            <div className="bg-neutral-50 p-7 border-2 border-neutral-200">
              <h4 className="mb-4 font-bold text-black flex items-center gap-2">
                <Clock size={18} className="text-navy-700" />
                <span>Operating Schedule</span>
              </h4>

              <div className="mb-5">
                <strong className="text-md text-black block mb-2">
                  Pub Opening Hours
                </strong>
                <table className="w-full text-left border-collapse text-md text-text-muted">
                  <tbody>
                    {siteData.openingHours.map((h, i) => (
                      <tr key={i} className="border-b border-neutral-200 last:border-0">
                        <td className="py-2.5 pr-4 text-text-muted">{h.days}</td>
                        <td className="py-2.5 text-black font-semibold">{h.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <strong className="text-md text-black block mb-2">
                  Kitchen & Food Service
                </strong>
                <table className="w-full text-left border-collapse text-md text-text-muted">
                  <tbody>
                    {siteData.foodServingHours.map((h, i) => (
                      <tr key={i} className="border-b border-neutral-200 last:border-0">
                        <td className="py-2.5 pr-4 text-text-muted">{h.days}</td>
                        <td className="py-2.5 text-black font-semibold">{h.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Map Pin Box */}
            <div className="bg-white overflow-hidden border-2 border-neutral-200">
              <iframe
                title="The White Lion Amersham Map"
                src="https://maps.google.com/maps?q=White+Lion+Road,+Amersham+HP7+9LJ&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="220"
                className="border-0 block"
                allowFullScreen=""
                loading="lazy"
              />
              <div className="p-4 px-5 flex justify-between items-center bg-white">
                <span className="text-sm text-text-muted">
                  White Lion Rd, Amersham HP7 9LJ
                </span>
                <a
                  href={siteData.info.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold tracking-[0.03em] transition-colors bg-transparent text-black border-2 border-black hover:bg-black hover:text-white cursor-pointer no-underline"
                >
                  <ExternalLink size={14} />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
