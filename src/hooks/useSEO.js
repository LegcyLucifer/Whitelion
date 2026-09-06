/**
 * useSEO.js
 * Dynamically updates <title>, <meta name="description">, Open Graph,
 * Twitter Card, and canonical tags on every route change.
 * Lighthouse flags: document-title, meta-description, structured-data
 */
import { useEffect } from 'react';
import { siteData } from '../data/siteData';

const SITE_NAME = 'The White Lion Amersham';
const BASE_URL  = 'https://thewhitelionamersham.co.uk';

// JSON-LD facts (telephone, email, hours, social links) previously lived
// here as a second, hand-typed copy of siteData.info / siteData.openingHours
// and had drifted from it — wrong email domain, Sat/Sun hours merged with
// Friday's, and social handles pointing at different accounts than the
// ones actually linked from the Footer. Derived from siteData below so
// there's one source of truth for facts Google reads as well as facts
// people see.
function to24h(str) {
  const m = str.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2];
  const ap = m[3].toUpperCase();
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${min}`;
}

const FULL_DAY_NAMES = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};
const WEEK_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function expandDayNames(daysStr) {
  const parts = daysStr.split('-').map((s) => s.trim().slice(0, 3));
  if (parts.length === 1) return [FULL_DAY_NAMES[parts[0]]];
  const start = WEEK_ORDER.indexOf(parts[0]);
  const end = WEEK_ORDER.indexOf(parts[1]);
  return WEEK_ORDER.slice(start, end + 1).map((d) => FULL_DAY_NAMES[d]);
}

const OPENING_HOURS_SPEC = siteData.openingHours.map((row) => {
  const [openStr, closeStr] = row.hours.split('-').map((s) => s.trim());
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: expandDayNames(row.days),
    opens: to24h(openStr),
    closes: to24h(closeStr) === '00:00' ? '23:59' : to24h(closeStr),
  };
});

const [addressLine1, addressCity, addressPostcode] = siteData.info.address.split(',').map((s) => s.trim());
const PHONE_E164 = `+44${siteData.info.phone.replace(/\D/g, '').replace(/^0/, '')}`;

export function useSEO({ title, description, path = '/', image }) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} — Pub, Restaurant & Indian Cuisine, Little Chalfont`;

    const fullDesc = description ||
      'The White Lion Amersham — authentic Indian cuisine and traditional British pub classics in Little Chalfont. Dog-friendly, live sports, quiz nights, Sunday roasts, and private hire.';

    const canonical = `${BASE_URL}${path}`;
    const ogImage   = image || `${BASE_URL}/assets/og-image.jpg`;

    /* ── Title ──────────────────────────────────────────────────────── */
    document.title = fullTitle;

    /* ── Helper: upsert <meta> ──────────────────────────────────────── */
    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrValue] = selector
          .replace('meta[', '').replace(']', '').split('="');
        el.setAttribute(attrName, attrValue.replace('"', ''));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el); }
      el.href = href;
    };

    /* ── Standard SEO ───────────────────────────────────────────────── */
    setMeta('meta[name="description"]', 'content', fullDesc);
    setLink('canonical', canonical);

    /* ── Open Graph ─────────────────────────────────────────────────── */
    setMeta('meta[property="og:title"]',       'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', fullDesc);
    setMeta('meta[property="og:url"]',         'content', canonical);
    setMeta('meta[property="og:image"]',       'content', ogImage);
    setMeta('meta[property="og:type"]',        'content', 'website');
    setMeta('meta[property="og:site_name"]',   'content', SITE_NAME);
    setMeta('meta[property="og:locale"]',      'content', 'en_GB');

    /* ── Twitter Card ───────────────────────────────────────────────── */
    setMeta('meta[name="twitter:card"]',        'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]',       'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', fullDesc);
    setMeta('meta[name="twitter:image"]',       'content', ogImage);

    /* ── LocalBusiness structured data (JSON-LD) ────────────────────── */
    const SCHEMA_ID = 'wl-local-business-schema';
    let schemaEl = document.getElementById(SCHEMA_ID);
    if (!schemaEl) {
      schemaEl = document.createElement('script');
      schemaEl.id   = SCHEMA_ID;
      schemaEl.type = 'application/ld+json';
      document.head.appendChild(schemaEl);
    }
    schemaEl.textContent = JSON.stringify({
      '@context':   'https://schema.org',
      '@type':      'BarOrPub',
      name:         SITE_NAME,
      url:          BASE_URL,
      telephone:    PHONE_E164,
      email:        siteData.info.email,
      image:        ogImage,
      description:  fullDesc,
      priceRange:   '££',
      currenciesAccepted: 'GBP',
      paymentAccepted:    'Cash, Credit Card',
      servesCuisine:      ['Indian', 'British', 'Pub Food'],
      address: {
        '@type':          'PostalAddress',
        streetAddress:    addressLine1,
        addressLocality:  addressCity,
        addressRegion:    'Buckinghamshire',
        postalCode:       addressPostcode,
        addressCountry:   'GB',
      },
      geo: {
        '@type':    'GeoCoordinates',
        latitude:   51.6704,
        longitude:  -0.5974,
      },
      openingHoursSpecification: OPENING_HOURS_SPEC,
      hasMap:    siteData.info.mapsUrl,
      sameAs: [
        siteData.info.facebookUrl,
        siteData.info.instagramUrl,
        siteData.info.tiktokUrl,
        siteData.info.tripAdvisorUrl,
      ],
    });
  }, [title, description, path, image]);
}
