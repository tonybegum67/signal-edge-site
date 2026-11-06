-- Signal-Edge site: lets a signed-in member see and change their own
-- Clear Signal setting on the My account page.
-- Run once in Supabase: SQL Editor, New query, paste this file, Run.
-- Safe to run again.

-- A member can read only the subscriber row with their own sign-in email.
drop policy if exists "Members can see their own subscription" on public.newsletter_subscribers;
create policy "Members can see their own subscription"
  on public.newsletter_subscribers for select
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

-- A member can switch only their own row on or off.
drop policy if exists "Members can change their own subscription" on public.newsletter_subscribers;
create policy "Members can change their own subscription"
  on public.newsletter_subscribers for update
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'))
  with check (lower(email) = lower(auth.jwt() ->> 'email'));
