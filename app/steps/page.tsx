import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "../components/Nav";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plan";
import { stepSummaries } from "@/lib/lessons";
import { caseySpace, hasSpace } from "@/lib/space";

export const metadata: Metadata = { title: "Signal-Edge Steps" };

// Always check the session on each visit.
export const dynamic = "force-dynamic";

export default async function StepsPage() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) redirect("/sign-in?next=/steps");

  const plan = await getPlan(supabase);
  const isPro = plan.plan === "pro";
  const inCasey = await hasSpace(supabase, caseySpace.code);

  return (
    <>
      <Nav signedIn />
      <main className="band">
        <div className="in">
          <div className="sec-head">
            <p className="eb">Signal-Edge Steps</p>
            <h1 className="h2">Welcome in</h1>
            <p className="lede">
              You&apos;re signed in as {user.email}. Five Steps take you from an empty folder to an AI that knows your
              business. Every Step works with Claude or ChatGPT.
            </p>
          </div>

          {inCasey ? (
            <Link className="space-card" href={caseySpace.path}>
              <span className="eb">Your company space</span>
              <strong>{caseySpace.company}</strong>
              <span>
                Workshop {caseySpace.session.day}, {caseySpace.session.time}. Your plan, prompts and what to bring.
              </span>
            </Link>
          ) : null}

          <ol className="mods">
            {stepSummaries.map((s) => {
              const locked = !s.free && !isPro;
              const status = !s.ready ? "Coming soon" : locked ? "Pro" : s.free ? "Free" : "Open";
              const body = (
                <>
                  <span className="n">STEP {s.step}</span>
                  <div>
                    <strong>{s.title}</strong>
                    <span>
                      {s.body} · {status}
                    </span>
                  </div>
                </>
              );
              return (
                <li key={s.step} className={s.ready ? "go" : "soon"}>
                  {s.ready ? <Link href={`/steps/${s.step}`}>{body}</Link> : body}
                </li>
              );
            })}
          </ol>

          {!isPro ? (
            <p className="sub" style={{ marginTop: 24 }}>
              Got an access code? <Link href="/account">Add it on My account</Link> to open every Step.
            </p>
          ) : null}
        </div>
      </main>
    </>
  );
}
