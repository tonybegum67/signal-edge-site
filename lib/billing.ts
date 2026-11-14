import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { proPrices, type ProInterval } from "@/lib/stripe";

// The member's Stripe customer, created on their first checkout and remembered in billing_customers.
export async function customerFor(admin: SupabaseClient, stripe: Stripe, user: { id: string; email?: string }) {
  const { data: row, error } = await admin
    .from("billing_customers")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw new Error(`billing_customers read failed: ${error.code} ${error.message}`);
  if (row) return row.stripe_customer_id as string;

  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { supabase_user_id: user.id },
  });
  // Two clicks at once can race: keep whichever row landed first.
  const { error: insertError } = await admin
    .from("billing_customers")
    .insert({ user_id: user.id, stripe_customer_id: customer.id });
  if (insertError && insertError.code !== "23505") {
    throw new Error(`billing_customers insert failed: ${insertError.code} ${insertError.message}`);
  }
  if (insertError) {
    const { data: again } = await admin
      .from("billing_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();
    return again!.stripe_customer_id as string;
  }
  return customer.id;
}

// The live Stripe price for a plan, checked against the approved amount.
export async function findProPrice(stripe: Stripe, interval: ProInterval) {
  const want = proPrices[interval];
  const { data } = await stripe.prices.list({ lookup_keys: [want.lookupKey], active: true, limit: 1 });
  const price = data[0];
  if (!price) return { ok: false as const, why: `no active price with lookup key ${want.lookupKey}` };
  if (price.unit_amount !== want.amount || price.currency !== "usd" || price.recurring?.interval !== want.interval) {
    return {
      ok: false as const,
      why: `price ${price.id} is ${price.unit_amount} ${price.currency}/${price.recurring?.interval}, expected ${want.amount} usd/${want.interval}`,
    };
  }
  return { ok: true as const, price };
}

// Copies a subscription's current state from Stripe into stripe_subscriptions.
// Always reads the subscription fresh from Stripe, so events arriving twice or out of order are harmless.
export async function syncSubscription(admin: SupabaseClient, stripe: Stripe, subscriptionId: string) {
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  let userId = sub.metadata?.supabase_user_id || null;
  if (!userId) {
    const { data } = await admin
      .from("billing_customers")
      .select("user_id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    userId = (data?.user_id as string | undefined) ?? null;
  }
  if (!userId) {
    console.error("stripe sync: no member for subscription", sub.id, customerId);
    return "no_member" as const;
  }

  const item = sub.items.data[0];
  const toIso = (s: number | null | undefined) => (s ? new Date(s * 1000).toISOString() : null);
  const { error } = await admin.from("stripe_subscriptions").upsert({
    id: sub.id,
    user_id: userId,
    stripe_customer_id: customerId,
    status: sub.status,
    lookup_key: item?.price.lookup_key ?? null,
    current_period_end: toIso(item?.current_period_end),
    cancel_at_period_end: sub.cancel_at_period_end,
    trial_end: toIso(sub.trial_end),
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`stripe_subscriptions upsert failed: ${error.code} ${error.message}`);
  return "synced" as const;
}
