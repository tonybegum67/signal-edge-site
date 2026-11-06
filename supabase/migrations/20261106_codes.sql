-- Access codes and Pro memberships.
-- A member types a code on My account; a valid code gives them Pro for a set number of days.
-- Safe to run twice.

-- Codes. Nobody reads this table from the site; only the redeem function below uses it.
create table if not exists public.access_codes (
  code text primary key check (code = upper(code) and length(code) between 3 and 40),
  plan text not null default 'pro' check (plan in ('pro')),
  days integer not null check (days between 1 and 3650),
  max_uses integer check (max_uses is null or max_uses > 0),
  uses integer not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  note text,
  created_at timestamptz not null default now()
);
alter table public.access_codes enable row level security;

-- One row per member with a paid or gifted plan. No row means Free.
create table if not exists public.memberships (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan text not null check (plan in ('pro')),
  source text not null check (source in ('code', 'stripe', 'manual')),
  code text references public.access_codes (code),
  ends_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.memberships enable row level security;

-- Each member can use a given code once.
create table if not exists public.code_redemptions (
  code text not null references public.access_codes (code),
  user_id uuid not null references auth.users (id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  primary key (code, user_id)
);
alter table public.code_redemptions enable row level security;

-- A signed-in member can see their own plan, nothing else.
drop policy if exists "members read own membership" on public.memberships;
create policy "members read own membership" on public.memberships
  for select to authenticated using (user_id = auth.uid());

-- Checks a code and gives the signed-in member its plan.
-- Runs with the owner's rights so the site never needs to read the codes table.
create or replace function public.redeem_access_code(p_code text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_code public.access_codes%rowtype;
  v_ends timestamptz;
begin
  if v_user is null then
    return json_build_object('status', 'signed_out');
  end if;

  select * into v_code from public.access_codes
    where code = upper(trim(p_code)) for update;
  if not found or not v_code.active or (v_code.expires_at is not null and v_code.expires_at < now()) then
    return json_build_object('status', 'invalid');
  end if;
  if exists (select 1 from public.code_redemptions where code = v_code.code and user_id = v_user) then
    return json_build_object('status', 'already_used');
  end if;
  if v_code.max_uses is not null and v_code.uses >= v_code.max_uses then
    return json_build_object('status', 'used_up');
  end if;

  -- Time adds on top of any Pro time the member already has.
  -- A membership with no end date stays open-ended.
  select ends_at into v_ends from public.memberships where user_id = v_user;
  if found and v_ends is null then
    v_ends := null;
  else
    v_ends := greatest(coalesce(v_ends, now()), now()) + make_interval(days => v_code.days);
  end if;

  insert into public.code_redemptions (code, user_id) values (v_code.code, v_user);
  update public.access_codes set uses = uses + 1 where code = v_code.code;
  insert into public.memberships (user_id, plan, source, code, ends_at, updated_at)
    values (v_user, v_code.plan, 'code', v_code.code, v_ends, now())
    on conflict (user_id) do update
      set plan = excluded.plan, source = excluded.source, code = excluded.code,
          ends_at = excluded.ends_at, updated_at = now();

  return json_build_object('status', 'ok', 'plan', v_code.plan, 'ends_at', v_ends);
end;
$$;

revoke all on function public.redeem_access_code(text) from public, anon;
grant execute on function public.redeem_access_code(text) to authenticated;

-- Casey Lesher Real Estate agents: 90 days of Pro from the day each agent adds the code.
insert into public.access_codes (code, plan, days, note)
  values ('CASEY-LESHER', 'pro', 90, 'Casey Lesher Real Estate agents, Nov 16 session')
  on conflict (code) do nothing;
