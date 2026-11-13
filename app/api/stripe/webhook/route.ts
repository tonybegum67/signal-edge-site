import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripe, webhookSecret } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncSubscription } from "@/lib/billing";

export const dynamic = "force-dynamic";

// Stripe calls this after a checkout and on every subscription change. It is the only thing
// that turns card Pro on or off. Each event is checked with the webhook signing secret.
export async function POST(req: Request) {
  const stripe = getStripe();
  const admin = createAdminClient();
  if (!stripe || !admin || !webhookSecret) {
    return NextResponse.json({ error: "billing not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, webhookSecret);
  } catch (err) {
    console.error("stripe webhook: bad signature", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode === "subscription" && session.subscription) {
          const id = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
          await syncSubscription(admin, stripe, id);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscription(admin, stripe, event.data.object.id);
        break;
      default:
        break;
    }
  } catch (err) {
    // A 500 makes Stripe retry, which is what we want if Supabase or Stripe hiccuped.
    console.error("stripe webhook: sync failed", event.type, err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "sync failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
