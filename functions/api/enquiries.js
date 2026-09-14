import { supabaseInsert } from '../_lib/supabase.js';
import { sendEmail } from '../_lib/resend.js';
import { isValidEmail, isValidPhone, isRequired } from '../../src/lib/validation.js';

// Contact and Party Venue post here with a `kind` discriminator — one
// table, one Function, instead of two near-duplicate pipelines. Field
// requirements intentionally differ per kind, matching what each form on
// the frontend already enforces (ContactPage.jsx's phone is optional;
// PartyVenuePage.jsx's is required).
export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  const { kind, name, email, phone, subject, message, eventType, guests, date, package: cateringPackage, notes } = body;

  if (!['contact', 'party_venue'].includes(kind)) {
    return json({ error: 'Invalid enquiry type' }, 400);
  }
  if (!isRequired(name || '') || !isValidEmail(email || '')) {
    return json({ error: 'Missing or invalid fields' }, 400);
  }
  if (kind === 'contact' && !isRequired(message || '')) {
    return json({ error: 'Message is required' }, 400);
  }
  if (kind === 'party_venue') {
    if (!date) return json({ error: 'Date is required' }, 400);
    if (!isValidPhone(phone || '')) return json({ error: 'A valid phone number is required' }, 400);
  }

  let row;
  try {
    row = await supabaseInsert(env, 'enquiries', {
      kind,
      full_name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      subject: kind === 'contact' ? (subject?.trim() || null) : null,
      message: kind === 'contact' ? (message?.trim() || null) : (notes?.trim() || null),
      event_type: kind === 'party_venue' ? eventType : null,
      guest_count: kind === 'party_venue' ? guests : null,
      event_date: kind === 'party_venue' ? date : null,
      catering_package: kind === 'party_venue' ? cateringPackage : null,
    });
  } catch (err) {
    console.error('enquiry insert failed', err);
    return json({ error: 'Could not send your message — please try again or call us.' }, 500);
  }

  await Promise.allSettled([
    sendEmail(env, {
      to: env.PUB_NOTIFICATION_EMAIL,
      subject: kind === 'contact' ? `New contact message from ${name}` : `New party venue enquiry from ${name}`,
      html: `<pre>${JSON.stringify(row, null, 2)}</pre>`,
    }),
  ]);

  return json({ id: row.id });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
