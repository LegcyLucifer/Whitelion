import React from 'react';
import { siteData } from '../data/siteData';
import { useSEO } from '../hooks/useSEO';

// A plain utility page, same pattern as ContactPage.jsx — no hero, a simple
// in-flow title is enough. Content here is grounded in what Phase 0 of the
// backend plan actually collects (see docs/ADMIN_PANEL_PLAN.md §11 and the
// implementation plan's §2.6) — nothing here should describe collection
// this site doesn't really do.
export default function PrivacyPolicyPage() {
  useSEO({
    title: 'Privacy Policy',
    description: 'How The White Lion Amersham collects, uses, and protects the personal information you share through this website.',
    path: '/privacy-policy',
  });

  return (
    <div className="w-full max-w-[760px] mx-auto px-6 pt-12 pb-24">
      <h1 className="text-black text-3xl font-bold mb-3">Privacy Policy</h1>
      <p className="text-text-muted text-md mb-10">Last updated: this page describes how thewhitelionamersham.co.uk currently collects and handles personal data.</p>

      <div className="flex flex-col gap-9 text-text-muted leading-[1.7]">
        <section>
          <h2 className="text-black text-xl font-bold mb-2.5">Who we are</h2>
          <p>
            {siteData.info.name} ("we", "us") is the data controller for the information collected through this
            website. You can reach us by post at {siteData.info.address}, by phone on{' '}
            <a href={siteData.info.phoneHref} className="text-maroon font-semibold hover:underline">{siteData.info.phone}</a>,
            or by email at{' '}
            <a href={`mailto:${siteData.info.email}`} className="text-maroon font-semibold hover:underline">{siteData.info.email}</a>.
          </p>
        </section>

        <section>
          <h2 className="text-black text-xl font-bold mb-2.5">What we collect, and why</h2>
          <p className="mb-3">We only collect what each form on this site visibly asks for:</p>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li><strong className="text-black">Table reservations</strong> — name, email, phone, date/time/party size, and any special requests you add (this field may incidentally include dietary or allergy information you choose to share).</li>
            <li><strong className="text-black">Contact and party venue enquiries</strong> — name, email, phone (where required), and your message or event details.</li>
            <li><strong className="text-black">Newsletter sign-up</strong> — your email address and the fact that you ticked the consent box, with a timestamp.</li>
          </ul>
          <p className="mt-3">We don't use cookies or tracking scripts on this site today, so there is nothing to collect beyond what you type into a form.</p>
        </section>

        <section>
          <h2 className="text-black text-xl font-bold mb-2.5">Our lawful basis</h2>
          <p>
            We process reservation and enquiry details under <strong className="text-black">contract and legitimate interest</strong> — we need
            this information to respond to your booking or question. We only add you to the newsletter list on the basis
            of your <strong className="text-black">explicit consent</strong>, given by ticking the sign-up checkbox — you can withdraw that
            consent at any time by asking us to remove you.
          </p>
        </section>

        <section>
          <h2 className="text-black text-xl font-bold mb-2.5">How long we keep it</h2>
          <p>
            We intend to keep booking and enquiry records for up to <strong className="text-black">12 months</strong> from your visit or reply, and
            newsletter details for as long as you stay subscribed. <em>(This retention period is a working default —
            confirm or adjust it with us directly if you'd like specifics.)</em>
          </p>
        </section>

        <section>
          <h2 className="text-black text-xl font-bold mb-2.5">Who else sees it</h2>
          <p>
            We use two processors to run this site: <strong className="text-black">Supabase</strong> (database hosting) stores the information
            you submit, and <strong className="text-black">Resend</strong> (email delivery) sends the confirmation and notification emails
            triggered by your submission. We don't sell or share your data with anyone else.
          </p>
        </section>

        <section>
          <h2 className="text-black text-xl font-bold mb-2.5">Your rights</h2>
          <p className="mb-3">You can ask us at any time to:</p>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li>See what personal data we hold about you</li>
            <li>Correct anything that's inaccurate</li>
            <li>Delete your data ("right to erasure")</li>
            <li>Object to how we're using it, or withdraw newsletter consent</li>
          </ul>
          <p className="mt-3">
            Email <a href={`mailto:${siteData.info.email}`} className="text-maroon font-semibold hover:underline">{siteData.info.email}</a> for
            any of the above. If you're not satisfied with our response, you can complain to the UK Information
            Commissioner's Office (ico.org.uk).
          </p>
        </section>
      </div>
    </div>
  );
}
