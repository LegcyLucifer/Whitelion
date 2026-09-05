/**
 * useSEO.js
 * Dynamically updates <title>, <meta name="description">, Open Graph,
 * Twitter Card, and canonical tags on every route change.
 * Lighthouse flags: document-title, meta-description, structured-data
 */
import { useEffect } from 'react';

const SITE_NAME = 'The White Lion Amersham';
const BASE_URL  = 'https://thewhitelionamersham.co.uk';

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
      telephone:    '+441494766849',
      email:        'thewhitelionamersham@gmail.com',
      image:        ogImage,
      description:  fullDesc,
      priceRange:   '££',
      currenciesAccepted: 'GBP',
      paymentAccepted:    'Cash, Credit Card',
      servesCuisine:      ['Indian', 'British', 'Pub Food'],
      address: {
        '@type':          'PostalAddress',
        streetAddress:    'White Lion Road',
        addressLocality:  'Amersham',
        addressRegion:    'Buckinghamshire',
        postalCode:       'HP7 9LJ',
        addressCountry:   'GB',
      },
      geo: {
        '@type':    'GeoCoordinates',
        latitude:   51.6704,
        longitude:  -0.5974,
      },
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday'], opens: '12:00', closes: '23:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday','Saturday'],                       opens: '12:00', closes: '00:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'],                                  opens: '12:00', closes: '22:00' },
      ],
      hasMap:    'https://maps.google.com/maps?q=White+Lion+Road,+Amersham+HP7+9LJ',
      sameAs: [
        'https://www.facebook.com/thewhitelionamersham',
        'https://www.instagram.com/thewhitelionamersham',
        'https://www.tiktok.com/@whitelionamersham',
        'https://www.tripadvisor.co.uk/Restaurant_Review-g186297-d782349-Reviews-The_White_Lion-Amersham_Buckinghamshire_England.html',
      ],
    });
  }, [title, description, path, image]);
}
