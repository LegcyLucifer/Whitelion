import { supabaseInsert } from '../_lib/supabase.js';
import { sendEmail } from '../_lib/resend.js';
import { isValidEmail, isValidPhone, isRequired } from '../../src/lib/validation.js';

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  const { date, time, guests, area, name, email, phone, notes } = body;
  if (
    !isRequired(name || '') ||
    !isValidEmail(email || '') ||
    !isValidPhone(phone || '') ||
    !date || !time || !guests || !area
  ) {
    return json({ error: 'Missing or invalid fields' }, 400);
  }

  let row;
  try {
    row = await supabaseInsert(env, 'bookings', {
      reservation_date: date,
      reservation_time: time,
      party_size: Number(guests),
      area,
      full_name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: notes?.trim() || null,
    });
  } catch (err) {
    console.error('bookings insert failed', err);
    return json({ error: 'Could not save your request — please try again or call us.' }, 500);
  }

  // Best-effort notifications — the booking is already durably saved above,
  // so a Resend outage must never surface as a customer-facing error.
  await Promise.allSettled([
    sendEmail(env, {
      to: env.PUB_NOTIFICATION_EMAIL,
      subject: `New table request — ${row.booking_ref}`,
      html: `<p>${name} — ${guests} guests, ${date} at ${time}, ${area}.</p><p>${email} &middot; ${phone}</p><p>${notes || ''}</p>`,
    }),
    sendEmail(env, {
      to: email,
      subject: `We've got your request — ${row.booking_ref}`,
      html: `<p>Thanks ${name} — we'll confirm your table for ${date} at ${time} shortly. Reference: ${row.booking_ref}.</p>`,
    }),
  ]);

  return json({ reference: row.booking_ref });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
