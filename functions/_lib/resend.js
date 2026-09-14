// Thin wrapper around Resend's send-email API. Every call is treated as
// best-effort by the Functions that use it (Promise.allSettled, never
// awaited in a way that can fail the response) — a Resend outage must never
// turn an already-saved booking/enquiry into a customer-facing error.
export async function sendEmail(env, { to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'The White Lion Amersham <bookings@thewhitelionamersham.co.uk>',
      to,
      subject,
      html,
    }),
  });
  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
  }
  return res.ok;
}
