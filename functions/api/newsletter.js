import { supabaseInsert } from '../_lib/supabase.js';
import { isValidEmail } from '../../src/lib/validation.js';

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  const { email, consent } = body;
  if (!isValidEmail(email || '')) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }
  if (!consent) {
    return json({ error: 'Please check the box to subscribe.' }, 400);
  }

  try {
    await supabaseInsert(env, 'newsletter_subscribers', {
      email: email.trim().toLowerCase(),
      consent_given: true,
    });
  } catch (err) {
    // Postgres unique-violation on the email column — treat as a soft
    // success so the UI can show "you're already on our list" instead of a
    // scary failure toast for what is, from the visitor's point of view, not
    // an error at all.
    if (err.code === '23505') {
      return json({ alreadySubscribed: true });
    }
    console.error('newsletter insert failed', err);
    return json({ error: 'Could not subscribe you right now — please try again.' }, 500);
  }

  return json({ subscribed: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
