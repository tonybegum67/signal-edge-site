import Stripe from "stripe";

// Stripe for Pro billing. The key comes from Secret Manager through Cloud Run (docs/stripe-billing.md),
// never from the build or the browser. Null until it's set, so the site runs before billing is switched on.
const secretKey = process.env.STRIPE_SECRET_KEY ?? "";
export const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

let client: Stripe | null = null;
export function getStripe() {
  if (!secretKey) return null;
  client ??= new Stripe(secretKey, { appInfo: { name: "signal-edge-site" } });
  return client;
}

// Checkout needs the Stripe key and the Supabase service role (to remember each member's Stripe customer).
export const billingReady = Boolean(secretKey && process.env.SUPABASE_SERVICE_ROLE_KEY);

// Tony's approved pricing, Nov 4, 2026. Prices are found in Stripe by lookup key, so the same code works
// in test and live mode. Checkout refuses a price whose amount doesn't match, so a stale price can't charge.
export const proPrices = {
  monthly: { lookupKey: "second_brain_pro_monthly", amount: 2900, interval: "month", label: "$29 a month" },
  annual: { lookupKey: "second_brain_pro_annual", amount: 29000, interval: "year", label: "$290 a year" },
} as const;
export type ProInterval = keyof typeof proPrices;

// Subscription states that keep Pro open. past_due keeps it while Stripe retries the card.
export const PRO_STATUSES = ["active", "trialing", "past_due"] as const;

// The Stripe events the webhook acts on. Subscribe the Dashboard endpoint to exactly these.
export const HANDLED_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
] as const;
