// Shared submission helper for every form on the site. Each form keeps its
// own validation/touched/error/shake state exactly as before — this is only
// the network call that replaces the old setTimeout fake.
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function post(path, payload) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.error || 'Something went wrong. Please try again.', res.status);
  }
  return data;
}

export const submitBooking       = (payload) => post('/api/bookings', payload);
export const submitEnquiry       = (payload) => post('/api/enquiries', payload);
export const subscribeNewsletter = (payload) => post('/api/newsletter', payload);
