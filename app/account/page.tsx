import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "../components/Nav";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import { formatDay, getPlan } from "@/lib/plan";
import { setClearSignal } from "./actions";
import { CodeForm } from "./CodeForm";

export const metadata: Metadata = { title: "My account" };

// Always check the session on each visit.
export const dynamic = "force-dynamic";

type Subscription = "on" | "off" | "unknown";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code: codeParam } = await searchParams;
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
                    ? `Pro${plan.endsAt ? ` until ${formatDay(plan.endsAt)}` : ""}: every Step and ${site.newsletterName}`
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
              <p className="sub">Paying for Pro by card opens soon. You&apos;ll manage billing right here.</p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
