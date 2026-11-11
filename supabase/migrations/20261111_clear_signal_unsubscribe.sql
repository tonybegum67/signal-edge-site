-- Signal-Edge site: one-click unsubscribe for Clear Signal.
-- Gives every subscriber a private, unguessable unsubscribe token, and two small
-- functions the unsubscribe page calls. The page never sees or lists anyone's email.
-- Run once in Supabase: SQL Editor, New query, paste this file, Run.
-- Safe to run again.

-- 1. A private token for each subscriber. Existing rows get one now.
alter table public.newsletter_subscribers
  add column if not exists unsubscribe_token uuid not null default gen_random_uuid();
create unique index if not exists newsletter_subscribers_unsubscribe_token_key
  on public.newsletter_subscribers (unsubscribe_token);

-- 2. A visitor who joins can't pick their own token: the database always makes a fresh one.
create or replace function public.clear_signal_new_token()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.unsubscribe_token := gen_random_uuid();
  return new;
end;
$$;
drop trigger if exists clear_signal_new_token on public.newsletter_subscribers;
create trigger clear_signal_new_token
  before insert on public.newsletter_subscribers
  for each row execute function public.clear_signal_new_token();

-- 3. What the unsubscribe page may do with a token, and nothing more:
--    see whether that one subscription is on, and switch it off or back on.
create or replace function public.clear_signal_status(p_token uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case when unsubscribed_at is null then 'subscribed' else 'unsubscribed' end
  from public.newsletter_subscribers
  where unsubscribe_token = p_token;
$$;

create or replace function public.clear_signal_set_subscribed(p_token uuid, p_subscribed boolean)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  result text;
begin
  update public.newsletter_subscribers
  set unsubscribed_at = case when p_subscribed then null else coalesce(unsubscribed_at, now()) end
  where unsubscribe_token = p_token
  returning case when unsubscribed_at is null then 'subscribed' else 'unsubscribed' end into result;
  return result; -- null when the token matches nobody
end;
$$;

revoke all on function public.clear_signal_status(uuid) from public;
revoke all on function public.clear_signal_set_subscribed(uuid, boolean) from public;
grant execute on function public.clear_signal_status(uuid) to anon, authenticated;
grant execute on function public.clear_signal_set_subscribed(uuid, boolean) to anon, authenticated;
