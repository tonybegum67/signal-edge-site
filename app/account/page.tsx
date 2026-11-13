import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "../components/Nav";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import { formatDay, getPlan, type CardPlan } from "@/lib/plan";
import { billingReady, proPrices } from "@/lib/stripe";
import { setClearSignal } from "./actions";
import { openPortal, startCheckout } from "./billing-actions";
import { CodeForm } from "./CodeForm";

export const metadata: Metadata = { title: "My account" };

// Always check the session on each visit.
export const dynamic = "force-dynamic";

type Subscription = "on" | "off" | "unknown";

const BILLING_NOTES: Record<string, string> = {
  success: "You're on Pro. Thanks for backing Signal-Edge! It can take a few seconds to show here, so refresh if it hasn't.",
  cancelled: "No problem. Nothing was charged.",
  error: "Something went wrong on our side and nothing was charged. Try again in a minute.",
  off: "Paying by card isn't switched on yet. Check back soon.",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; billing?: string }>;
}) {
  const { code: codeParam, billing: billingParam } = await searchParams;
  const billingNote = typeof billingParam === "string" ? BILLING_NOTES[billingParam] : undefined;
  const initialCode = typeof codeParam === "string" ? codeParam.slice(0, 40) : "";
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) {
    const back = initialCode ? `/account?code=${encodeURIComponent(initialCode)}` : "/account";
    redirect(`/sign-in?next=${encodeURIComponent(back)}`);
  }

  let subscription: Subscription = "off";
  const { data: row, error } = await supabase
    .from("newsletter_subscribers")
    .select("unsubscribed_at")
    .maybeSingle();
  if (error) subscription = "unknown";
  else if (row && !row.unsubscribed_at) subscription = "on";

  const memberSince = formatDay(user.created_at);
  const plan = await getPlan(supabase);
  const isPro = plan.plan === "pro";
  const card = plan.card ?? null;
  const cardLine = card ? describeCard(card) : null;

  return (
    <>
      <Nav signedIn />
      <main className="band">
        <div className="in account">
          <div className="sec-head">
            <p className="eb">Signal-Edge Steps</p>
            <h1 className="h2">My account</h1>
          </div>

          <div className="acct-grid">
            <section className="panel">
              <h3>You</h3>
              <dl>
                <dt>Email</dt>
                <dd>{user.email}</dd>
                <dt>Member since</dt>
                <dd>{memberSince}</dd>
              </dl>
              <form action="/auth/sign-out" method="post">
                <button className="btn" type="submit">
                  Sign out
                </button>
              </form>
            </section>

            <section className="panel">
              <h3>{site.newsletterName}</h3>
              {subscription === "unknown" ? (
                <p className="sub">We couldn&apos;t load your setting just now. Try again in a minute.</p>
              ) : (
                <>
                  <p className="sub">
                    {subscription === "on"
                      ? `You're getting ${site.newsletterName}: ${site.newsletterTagline}`
                      : `You're not getting ${site.newsletterName} right now. ${site.newsletterTagline}`}
                  </p>
                  <form action={setClearSignal}>
                    <input type="hidden" name="on" value={subscription === "on" ? "0" : "1"} />
                    <button className={subscription === "on" ? "btn" : "btn p"} type="submit">
                      {subscription === "on" ? "Turn it off" : `Get ${site.newsletterName}`}
                    </button>
                  </form>
                </>
              )}
            </section>

            <section className="panel">
              <h3>Your plan</h3>
              <dl>
                <dt>Plan</dt>
                <dd>
                  {isPro
                    ? `Pro${!card && plan.endsAt ? ` until ${formatDay(plan.endsAt)}` : ""}: every Step and ${site.newsletterName}`
                    : `Free: Step 1 and ${site.newsletterName}`}
                </dd>
                <dt>Progress</dt>
                <dd>All five Steps are ready. Your ticks save on this device.</dd>
              </dl>
              <Link className="btn" href="/steps">
                Go to My Steps
              </Link>
            </section>

            <section className="panel">
              <h3>Codes and billing</h3>
              {plan.failed ? (
                <p className="sub">We couldn&apos;t load your plan just now. Try again in a minute.</p>
              ) : (
                <>
                  <p className="sub">
                    {isPro
                      ? "Got another code? Add it here and its time adds on to your plan."
                      : "Got an access code? Add it here to unlock Pro."}
                  </p>
                  <CodeForm initialCode={initialCode} />
                </>
              )}
              {billingNote && <p className="sub">{billingNote}</p>}
              {plan.failed ? null : card ? (
                <>
                  <p className="sub">{cardLine}</p>
                  <form action={openPortal}>
                    <button className="btn" type="submit">
                      Manage billing
                    </button>
                  </form>
                </>
              ) : billingReady ? (
                <>
                  <p className="sub">
                    {plan.codeEndsAt
                      ? `Want to keep Pro after ${formatDay(plan.codeEndsAt)}? Add a card now and you won't be charged until then. Cancel any time before and you pay nothing.`
                      : "Pay for Pro by card. Cancel any time from this page."}
                  </p>
                  <div className="billing-choice">
                    <form action={startCheckout}>
                      <input type="hidden" name="plan" value="monthly" />
                      <button className="btn p" type="submit">
                        Pro, {proPrices.monthly.label}
                      </button>
                    </form>
                    <form action={startCheckout}>
                      <input type="hidden" name="plan" value="annual" />
                      <button className="btn" type="submit">
                        Pro, {proPrices.annual.label}
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <p className="sub">Paying for Pro by card opens soon. You&apos;ll manage billing right here.</p>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

// One plain line about the member's card plan.
function describeCard(card: CardPlan) {
  const price = card.interval ? proPrices[card.interval].label : "Pro";
  if (card.status === "past_due") return "Your last payment didn't go through. Update your card in billing to keep Pro.";
  if (card.cancelAtPeriodEnd && card.periodEnd) return `Your card plan ends on ${formatDay(card.periodEnd)}. You won't be charged again.`;
  if (card.status === "trialing" && card.trialEnd) return `Pro by card, ${price}. Your first charge is on ${formatDay(card.trialEnd)}.`;
  if (card.periodEnd) return `Pro by card, ${price}. Next charge on ${formatDay(card.periodEnd)}.`;
  return `Pro by card, ${price}.`;
}
