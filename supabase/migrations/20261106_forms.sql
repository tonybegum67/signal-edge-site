-- Signal-Edge site: tables for the session prep form and the Clear Signal list.
-- Run once in Supabase: SQL Editor, New query, paste this file, Run.
-- Safe to run again; it only creates what's missing.

-- Session prep answers. One row per submission.
create table if not exists public.prep_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  company text check (char_length(company) <= 160),
  role text check (char_length(role) <= 60),
  ai_tool text check (ai_tool in ('claude', 'chatgpt', 'free', 'none')),
  laptop text check (laptop in ('mac', 'win', 'unsure')),
  time_sink text check (char_length(time_sink) <= 500),
  newsletter_opt_in boolean not null default false,
  user_id uuid references auth.users (id) on delete set null
);

-- Clear Signal subscribers. One row per email.
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null check (char_length(email) between 3 and 254),
  source text not null default 'newsletter_form' check (source in ('newsletter_form', 'prep_form', 'account')),
  unsubscribed_at timestamptz
);
create unique index if not exists newsletter_subscribers_email_key
  on public.newsletter_subscribers (lower(email));

-- Visitors can add rows but never read, change or delete them.
-- Tony reads them in the Supabase Table Editor.
alter table public.prep_responses enable row level security;
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Anyone can send prep answers" on public.prep_responses;
create policy "Anyone can send prep answers"
  on public.prep_responses for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Anyone can join Clear Signal" on public.newsletter_subscribers;
create policy "Anyone can join Clear Signal"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (unsubscribed_at is null);
