-- Signal-Edge site: a record of every Clear Signal email sent, so nobody gets an issue twice.
-- The site writes one row per issue and address just before it sends. Re-running a send
-- (a redeploy, a retry) skips everyone who already has a row.
-- Run once in Supabase: SQL Editor, New query, paste this file, Run.
-- Safe to run again.

create table if not exists public.newsletter_sends (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- "001" for the real send of issue 001; "001-test-<version>" for a test copy to Tony.
  send_key text not null check (char_length(send_key) between 3 and 60),
  email text not null check (char_length(email) between 3 and 254)
);
create unique index if not exists newsletter_sends_key_email
  on public.newsletter_sends (send_key, lower(email));

-- Only the site's server (service role) reads or writes this. No policies, so visitors can't see it.
alter table public.newsletter_sends enable row level security;
