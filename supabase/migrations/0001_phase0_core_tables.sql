-- Phase 0 — "make the forms real". See docs/ADMIN_PANEL_PLAN.md and
-- .claude/plans (recommendation + backend plan) for the full rationale.
--
-- Run this against a new Supabase project (UK/EU region). Public (anon)
-- role may only INSERT into bookings/enquiries/newsletter_subscribers and
-- can read nothing — every read/update below requires an authenticated
-- staff session, which doesn't exist until Phase 1.

create extension if not exists pgcrypto;

-- ─── bookings ──────────────────────────────────────────────────────────────
create table public.bookings (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  booking_ref       text not null unique
                      default (upper('WL-' || substr(md5(random()::text || clock_timestamp()::text), 1, 5))),
  status            text not null default 'pending'
                      check (status in ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  reservation_date  date not null,
  reservation_time  time not null,
  party_size        integer not null check (party_size > 0),
  area              text not null,
  full_name         text not null,
  email             text not null,
  phone             text not null,
  notes             text,
  source            text default 'reservations_page' check (source in ('reservations_page', 'booking_modal')),
  confirmed_by      text,
  confirmed_at      timestamptz
);

create index bookings_reservation_date_idx on public.bookings (reservation_date);
create index bookings_status_idx           on public.bookings (status);
create index bookings_created_at_idx       on public.bookings (created_at desc);

alter table public.bookings enable row level security;

create policy "public can create bookings" on public.bookings for insert to anon         with check (true);
create policy "staff can view bookings"    on public.bookings for select to authenticated using (true);
create policy "staff can update bookings"  on public.bookings for update to authenticated using (true) with check (true);
create policy "staff can delete bookings"  on public.bookings for delete to authenticated using (true);

-- ─── enquiries ─────────────────────────────────────────────────────────────
-- Contact + Party Venue share one table; `kind` discriminates. `phone` is
-- nullable because ContactPage.jsx doesn't require it but PartyVenuePage.jsx
-- does (enforced in the form + Function, not the column). `guest_count`
-- stays text: Party Venue collects a band ("50-100"), not a number.
create table public.enquiries (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  status           text not null default 'new' check (status in ('new', 'read', 'replied', 'closed')),
  kind             text not null check (kind in ('contact', 'party_venue')),
  full_name        text not null,
  email            text not null,
  phone            text,
  subject          text,
  message          text,
  event_type       text,
  guest_count      text,
  event_date       date,
  catering_package text
);

create index enquiries_kind_idx       on public.enquiries (kind);
create index enquiries_status_idx     on public.enquiries (status);
create index enquiries_created_at_idx on public.enquiries (created_at desc);

alter table public.enquiries enable row level security;

create policy "public can create enquiries" on public.enquiries for insert to anon         with check (true);
create policy "staff can view enquiries"    on public.enquiries for select to authenticated using (true);
create policy "staff can update enquiries"  on public.enquiries for update to authenticated using (true) with check (true);
create policy "staff can delete enquiries"  on public.enquiries for delete to authenticated using (true);

-- ─── newsletter_subscribers ──────────────────────────────────────────────
create table public.newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  email           text not null unique,
  consent_given   boolean not null default false,
  consent_at      timestamptz not null default now(),
  unsubscribed_at timestamptz,
  constraint newsletter_requires_consent check (consent_given is true)
);

alter table public.newsletter_subscribers enable row level security;

create policy "public can subscribe"         on public.newsletter_subscribers for insert to anon         with check (consent_given is true);
create policy "staff can view subscribers"   on public.newsletter_subscribers for select to authenticated using (true);
create policy "staff can update subscribers" on public.newsletter_subscribers for update to authenticated using (true) with check (true);
create policy "staff can delete subscribers" on public.newsletter_subscribers for delete to authenticated using (true);

-- ─── audit_log ─────────────────────────────────────────────────────────────
-- Table ships now; the trigger that writes to it ships in Phase 1, exactly
-- when the first staff mutation (status changes, below) ships. No value
-- sitting empty through Phase 0, and no unaccountable multi-staff writes
-- from day one of Phase 1.
create table public.audit_log (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  actor_email  text not null,
  action       text not null,
  entity_table text not null,
  entity_id    uuid not null,
  before       jsonb,
  after        jsonb
);

create index audit_log_entity_idx on public.audit_log (entity_table, entity_id);

alter table public.audit_log enable row level security;

create policy "staff can view audit log" on public.audit_log for select to authenticated using (true);
-- Deliberately no insert/update/delete policy for ANY client role, including
-- authenticated — rows are written only by the SECURITY DEFINER trigger
-- below (added in the Phase 1 migration), so a logged-in staff member can
-- never edit or clear their own trail.
