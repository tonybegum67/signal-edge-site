"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { site } from "@/lib/site";
import { getStripe, proPrices, type ProInterval } from "@/lib/stripe";
import { customerFor, findProPrice } from "@/lib/billing";

// Stripe needs at least 48 hours between now and a free period's end, so short code time is skipped.
const MIN_TRIAL_MS = 49 * 60 * 60 * 1000;

async function signedInMember() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) redirect("/sign-in?next=%2Faccount");
  return { supabase, user };
}

// Sends the member to Stripe Checkout for Pro. Members with code time left keep it free:
// their card isn't charged until the code's Pro ends.
export async function startCheckout(formData: FormData) {
  const interval = formData.get("plan") === "annual" ? "annual" : ("monthly" as ProInterval);
  const { supabase, user } = await signedInMember();
  const stripe = getStripe();
  const admin = createAdminClient();
  if (!stripe || !admin) redirect("/account?billing=off");

  let url: string | null = null;
  try {
    const customer = await customerFor(admin, stripe, { id: user.id, email: user.email });

    // Already paying: manage the plan instead of starting a second one.
    const { data: subs } = await supabase.from("stripe_subscriptions").select("status");
    if ((subs ?? []).some((s) => ["active", "trialing", "past_due"].includes(s.status))) {
      const portal = await stripe.billingPortal.sessions.create({ customer, return_url: `${site.url}/account` });
      url = portal.url;
    } else {
      const found = await findProPrice(stripe, interval);
      if (!found.ok) {
        console.error("checkout: price check failed", found.why);
        redirect("/account?billing=error");
      }

      const { data: membership } = await supabase.from("memberships").select("ends_at").maybeSingle();
      const codeEnds = membership?.ends_at ? new Date(membership.ends_at).getTime() : 0;
      const trialEnd = codeEnds - Date.now() > MIN_TRIAL_MS ? Math.floor(codeEnds / 1000) : undefined;

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer,
        client_reference_id: user.id,
        line_items: [{ price: found.price.id, quantity: 1 }],
        subscription_data: {
          metadata: { supabase_user_id: user.id, plan: proPrices[interval].lookupKey },
          ...(trialEnd ? { trial_end: trialEnd } : {}),
        },
        allow_promotion_codes: true,
        success_url: `${site.url}/account?billing=success`,
        cancel_url: `${site.url}/account?billing=cancelled`,
      });
      url = session.url;
    }
  } catch (err) {
    // redirect() throws on purpose; let it through.
    if (err && typeof err === "object" && "digest" in err) throw err;
    console.error("checkout failed", err instanceof Error ? err.message : err);
  }
  redirect(url ?? "/account?billing=error");
}

// Opens Stripe's billing page, where members change plan, update their card, see receipts or cancel.
export async function openPortal() {
  const { user } = await signedInMember();
  const stripe = getStripe();
  const admin = createAdminClient();
  if (!stripe || !admin) redirect("/account?billing=off");

  let url: string | null = null;
  try {
    const { data } = await admin
      .from("billing_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      const portal = await stripe.billingPortal.sessions.create({
        customer: data.stripe_customer_id,
        return_url: `${site.url}/account`,
      });
      url = portal.url;
    }
  } catch (err) {
    console.error("portal failed", err instanceof Error ? err.message : err);
  }
  redirect(url ?? "/account?billing=error");
}
