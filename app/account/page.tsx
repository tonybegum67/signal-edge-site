import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "../components/Nav";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import { setClearSignal } from "./actions";

export const metadata: Metadata = { title: "My account" };

// Always check the session on each visit.
export const dynamic = "force-dynamic";

type Subscription = "on" | "off" | "unknown";

export default async function AccountPage() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) redirect("/sign-in?next=/account");

  let subscription: Subscription = "off";
  const { data: row, error } = await supabase
    .from("newsletter_subscribers")
    .select("unsubscribed_at")
    .maybeSingle();
  if (error) subscription = "unknown";
  else if (row && !row.unsubscribed_at) subscription = "on";

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
                <dd>Free: Step 1 and {site.newsletterName}</dd>
                <dt>Progress</dt>
                <dd>Lessons are on their way. Your progress will show here.</dd>
              </dl>
              <Link className="btn" href="/steps">
                Go to My Steps
              </Link>
            </section>

            <section className="panel">
              <h3>Codes and billing</h3>
              <p className="sub">
                Pro plans and access codes open soon. When they do, you&apos;ll add a code and manage billing right
                here.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
