import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Nav } from "../components/Nav";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Signal-Edge Steps" };

// Always check the session on each visit.
export const dynamic = "force-dynamic";

const steps = [
  { n: "STEP 1", title: "Set up the house", body: "Where your brain lives and the line between personal notes and client data", open: true },
  { n: "STEP 2", title: "Teach it who you are", body: "A guided interview on your business, market, sphere and voice", open: false },
  { n: "STEP 3", title: "Feed it your business", body: "Listings, past deals and scripts, with client details stripped out first", open: false },
  { n: "STEP 4", title: "Put it to work", body: "Morning brief, listing copy, follow-ups and CMA prep", open: false },
  { n: "STEP 5", title: "Keep it growing", body: "A weekly review and staying compliant as tools change", open: false },
];

export default async function StepsPage() {
  const user = await getUser();
  if (!user) redirect("/sign-in?next=/steps");

  return (
    <>
      <Nav signedIn />
      <main className="band">
        <div className="in">
          <div className="sec-head">
            <p className="eb">Signal-Edge Steps</p>
            <h1 className="h2">Welcome in</h1>
            <p className="lede">
              You&apos;re signed in as {user.email}. Step 1 is free. The lessons themselves are on their way, and this
              page will pick up right where you left off.
            </p>
          </div>
          <ol className="mods">
            {steps.map((s) => (
              <li key={s.n}>
                <span className="n">{s.n}</span>
                <div>
                  <strong>{s.title}</strong>
                  <span>
                    {s.body}
                    {s.open ? "" : " · Pro"}
                  </span>
                </div>
              </li>
            ))}
          </ol>
          <form action="/auth/sign-out" method="post" style={{ marginTop: 32 }}>
            <button className="btn" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
