-- Remembers which addresses already got the prep thank-you email, so each address gets it once.
-- The site can add a row but never read the list. Safe to run twice.

create table if not exists public.prep_thanks_sent (
  email text primary key check (email = lower(email)),
  sent_at timestamptz not null default now()
);
alter table public.prep_thanks_sent enable row level security;

drop policy if exists "site records thank-you emails" on public.prep_thanks_sent;
create policy "site records thank-you emails" on public.prep_thanks_sent
  for insert to anon, authenticated with check (true);
