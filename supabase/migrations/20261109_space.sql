-- Company spaces: lets a signed-in member see which access codes they've added,
-- so the site can open their company's space (like Casey Lesher Real Estate's).
-- Run once in Supabase: SQL Editor, New query, paste this file, Run. Safe to run again.

drop policy if exists "members read own redemptions" on public.code_redemptions;
create policy "members read own redemptions" on public.code_redemptions
  for select to authenticated using (user_id = auth.uid());
