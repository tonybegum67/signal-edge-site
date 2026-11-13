-- Stripe billing for Pro ($29 a month or $290 a year).
-- Run once in the Supabase SQL Editor. Safe to run twice.
-- The site writes these tables only from the server (service role), after Stripe's webhook confirms a change.

-- Each member's Stripe customer. Server only: no policies, so the browser can't read or write it.
create table if not exists public.billing_customers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now()
);
alter table public.billing_customers enable row level security;

-- One row per Stripe subscription, copied from Stripe on every change.
-- active, trialing and past_due mean Pro; anything else means the card plan has ended.
create table if not exists public.stripe_subscriptions (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_customer_id text not null,
  status text not null,
  lookup_key text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  trial_end timestamptz,
  updated_at timestamptz not null default now()
);
create index if not exists stripe_subscriptions_user_id_idx on public.stripe_subscriptions (user_id);
alter table public.stripe_subscriptions enable row level security;

-- A signed-in member can see their own subscriptions, nothing else.
drop policy if exists "members read own subscriptions" on public.stripe_subscriptions;
create policy "members read own subscriptions" on public.stripe_subscriptions
  for select to authenticated using (user_id = auth.uid());
