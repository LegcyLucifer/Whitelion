// Plain fetch calls to Supabase's auto-generated PostgREST API. Deliberately
// not the @supabase/supabase-js SDK — these Functions never need session/auth
// handling (they write with the anon key, exactly what Phase 0's RLS
// policies permit), so pulling in the full SDK would cost bundle size for
// nothing. The SDK is worth its weight starting in Phase 1, for the admin
// UI's actual session management — see src/admin/lib/supabaseClient.js.
export async function supabaseInsert(env, table, row) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(row),
  });
  const body = await res.json();
  if (!res.ok) {
    const err = new Error(body?.message || 'Supabase insert failed');
    err.code = body?.code;
    err.status = res.status;
    throw err;
  }
  return Array.isArray(body) ? body[0] : body;
}
