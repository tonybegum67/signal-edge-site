import type { SupabaseClient } from "@supabase/supabase-js";

export type CardPlan = {
  status: string;
  interval: "monthly" | "annual" | null;
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  trialEnd: string | null;
};

export type Plan = {
  plan: "free" | "pro";
  endsAt: string | null;
  failed?: boolean;
  // Pro time from an access code (or a manual grant), when there is some left.
  codeEndsAt?: string | null;
  // The member's Stripe subscription, when they pay by card.
  card?: CardPlan | null;
};

const PRO_STATUSES = new Set(["active", "trialing", "past_due"]);

// The signed-in member's plan. Pro comes from an access code that hasn't ended, or a card subscription
// that is active, in its free period, or retrying a payment. Everything else means Free.
export async function getPlan(supabase: SupabaseClient): Promise<Plan> {
  const { data, error } = await supabase.from("memberships").select("plan, ends_at").maybeSingle();
  if (error) return { plan: "free", endsAt: null, failed: true };
  const codeActive = Boolean(data) && (!data!.ends_at || new Date(data!.ends_at).getTime() > Date.now());

  // Before the billing migration runs this table doesn't exist; the site carries on with codes only.
  const { data: subs } = await supabase
    .from("stripe_subscriptions")
    .select("status, lookup_key, current_period_end, cancel_at_period_end, trial_end, updated_at")
    .order("updated_at", { ascending: false });
  const live = (subs ?? []).find((s) => PRO_STATUSES.has(s.status));
  const card: CardPlan | null = live
    ? {
        status: live.status,
        interval: live.lookup_key?.endsWith("_annual") ? "annual" : live.lookup_key?.endsWith("_monthly") ? "monthly" : null,
        periodEnd: live.current_period_end,
        cancelAtPeriodEnd: live.cancel_at_period_end,
        trialEnd: live.trial_end,
      }
    : null;

  const codeEndsAt = codeActive ? data!.ends_at : null;
  if (card) return { plan: "pro", endsAt: null, codeEndsAt, card };
  if (codeActive) return { plan: "pro", endsAt: data!.ends_at, codeEndsAt };
  return { plan: "free", endsAt: null };
}

export function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
