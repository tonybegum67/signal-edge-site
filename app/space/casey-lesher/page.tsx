import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "../../components/Nav";
import { CopyPrompt } from "../../components/CopyPrompt";
import { createClient } from "@/lib/supabase/server";
import { prompts, rulebookName } from "@/lib/lessons";
import { caseySpace, hasSpace } from "@/lib/space";

export const metadata: Metadata = { title: "Casey Lesher Real Estate", robots: { index: false, follow: false } };

// Always check the session on each visit.
export const dynamic = "force-dynamic";

// The workshop plan. Each block matches a Step on the site and a part of the deck.
const plan = [
  { time: "10:00", title: "Get in and get set up", step: null, what: "Sign in here and add your code" },
  { time: "10:10", title: "Set up the house", step: 1, what: "One folder, one app, one rule" },
  { time: "10:30", title: "Teach it who you are", step: 2, what: "Your AI interviews you" },
  { time: "11:00", title: "Feed it your business", step: 3, what: "Five to ten of your best files" },
  { time: "11:25", title: "Put it to work", step: 4, what: "Your first follow-up, before lunch" },
  { time: "11:50", title: "Keep it growing", step: 5, what: "15 minutes on a Friday" },
];

const bring = [
  "Your laptop and charger",
  "A paid Claude or ChatGPT plan",
  "Its desktop app installed and signed in (not the website)",
  "Your email open, for the sign-in link",
  "5 to 10 work files you're happy to share with your AI",
];

// The prompt pack. The same words work in Claude and ChatGPT.
const pack = [
  {
    step: "Step 1 · Set up the house",
    items: [{ label: "First look at your folder", text: prompts.firstLook }],
  },
  {
    step: "Step 2 · Teach it who you are",
    items: [
      { label: "The interview", text: prompts.interview },
      { label: "Fix a line in About me", text: prompts.fixAboutMe },
      { label: "Make the rulebook", text: prompts.rulebook },
      { label: "Add a rule", text: prompts.addRule },
    ],
  },
  {
    step: "Step 3 · Feed it your business",
    items: [
      { label: "Check a file before it goes in", text: prompts.cleanFile },
      { label: "File your Inbox", text: prompts.fileInbox },
    ],
  },
  {
    step: "Step 4 · Put it to work",
    items: [
      { label: "Follow-up (everyone does this one)", text: prompts.followUp },
      { label: "Listing copy", text: prompts.listingCopy },
      { label: "CMA talking points", text: prompts.cmaPrep },
      { label: "Morning brief", text: prompts.morningBrief },
    ],
  },
  {
    step: "Step 5 · Keep it growing",
    items: [{ label: "Friday review", text: prompts.weeklyReview }],
  },
];

export default async function CaseySpacePage() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) redirect(`/sign-in?next=${encodeURIComponent(caseySpace.path)}`);

  const allowed = await hasSpace(supabase, caseySpace.code);

  if (!allowed) {
    return (
      <>
        <Nav signedIn />
        <main className="band">
          <div className="in">
            <div className="sec-head">
              <p className="eb">Company space</p>
              <h1 className="h2">{caseySpace.company}</h1>
              <p className="lede">This space is for {caseySpace.company} agents. Add your workshop code to open it.</p>
            </div>
            <Link className="btn p" href={`/account?code=${caseySpace.code}`}>
              Add your code
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav signedIn />
      <main className="band space">
        <div className="in">
          <div className="sec-head">
            <p className="eb">Company space · {caseySpace.company}</p>
            <h1 className="h2">Build your AI second brain</h1>
            <p className="lede">
              {caseySpace.session.day}, {caseySpace.session.time}. In two hours you&apos;ll set up an AI that knows your
              business, and draft your first follow-up before lunch. Claude or ChatGPT both work.
            </p>
          </div>

          <div className="acct-grid">
            <section className="panel">
              <h3>Bring</h3>
              <ul className="ticks">
                {bring.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="sub">
                Missing the app or a paid plan? Come anyway. You&apos;ll pair up with someone and get set up at the
                break.
              </p>
            </section>

            <section className="panel">
              <h3>The plan</h3>
              <ol className="agenda">
                {plan.map((p) => (
                  <li key={p.time}>
                    <span className="t">{p.time}</span>
                    <div>
                      <strong>{p.step ? <Link href={`/steps/${p.step}`}>{`Step ${p.step} · ${p.title}`}</Link> : p.title}</strong>
                      <span>{p.what}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="sec-head" style={{ marginTop: 64 }}>
            <p className="eb">Prompt pack</p>
            <h2 className="h2">Copy, paste, go</h2>
            <p className="lede">
              Every prompt from the workshop, in order. They work the same in Claude and ChatGPT. The one difference:
              your rulebook is called {rulebookName.claude} in Claude and {rulebookName.chatgpt} in ChatGPT.
            </p>
          </div>

          <div className="pack">
            {pack.map((g) => (
              <section key={g.step}>
                <h3 className="eb">{g.step}</h3>
                {g.items.map((i) => (
                  <CopyPrompt key={i.label} label={i.label} text={i.text} />
                ))}
              </section>
            ))}
          </div>

          <section className="panel" style={{ marginTop: 48 }}>
            <h3>After the workshop</h3>
            <ul className="ticks">
              <li>Your Pro access runs 90 days from the day you add your code, and every Step stays here.</li>
              <li>Block 15 minutes on Fridays for the weekly review.</li>
              <li>Nothing your AI writes goes anywhere until you copy it into your own email or CRM.</li>
              <li>Questions? Email Tony at tony@signal-edge.ai.</li>
            </ul>
            <Link className="btn" href="/steps">
              Go to My Steps
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
