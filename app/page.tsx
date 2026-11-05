import Link from "next/link";
import { HowWeWork } from "./components/HowWeWork";
import { LessonDemo } from "./components/LessonDemo";
import { Nav } from "./components/Nav";
import { NewsletterForm } from "./components/NewsletterForm";
import { PrepForm } from "./components/PrepForm";
import { Wave } from "./components/Wave";
import { Wordmark } from "./components/Wordmark";
import { site } from "@/lib/site";

const heroWave = { base: 0.62, calm: 0.62, amp: 0.32, peak: 0.5, layers: 3, speed: 1 };
const newsWave = { base: 0.6, calm: 0.6, amp: 0.35, peak: 0.45, layers: 1, speed: 0.7 };

const stepsModules = [
  { n: "STEP 1", title: "Set up the house", body: "Where your brain lives and the line between personal notes and client data" },
  { n: "STEP 2", title: "Teach it who you are", body: "A guided interview on your business, market, sphere and voice" },
  { n: "STEP 3", title: "Feed it your business", body: "Listings, past deals and scripts, with client details stripped out first" },
  { n: "STEP 4", title: "Put it to work", body: "Morning brief, listing copy, follow-ups and CMA prep" },
  { n: "STEP 5", title: "Keep it growing", body: "A weekly review and staying compliant as tools change" },
];

export default function Home() {
  return (
    <>
      {site.isPreview && (
        <div className="ribbon">
          <div className="in">
            <span>
              <b>Preview</b> · Forms don&apos;t save yet · Case study numbers are placeholders
            </span>
          </div>
        </div>
      )}

      <Nav />

      <header className="hero" id="top">
        <div className="grid-bg" />
        <Wave options={heroWave} />
        <div className="in">
          <p className="eb">AI consulting · Real estate · Financial services · Health care</p>
          <h1>
            Real AI results. <span>Built on your data.</span>
          </h1>
          <p className="lede">
            Signal-Edge AI finds the number worth moving in your business, builds AI on the data you already own and
            runs it inside the tools your team uses every day.
          </p>
          <div className="ctas">
            <a className="btn p" href="#prep">
              Book a working session <span className="arr">→</span>
            </a>
            <a className="btn" href="#results">
              See the SolCal story
            </a>
          </div>
          <div className="proof">
            <span className="live">
              <i />
              <b>Live</b> in a working brokerage
            </span>
            <span>Assess · Design · Build · Run</span>
            <span>Your data stays yours</span>
          </div>
        </div>
      </header>

      <main>
        <section className="principles" aria-label="What we stand for">
          <div className="in">
            <div className="pr rv">
              <h3>Your data, not a demo</h3>
              <p>We start from the records you already have, so results show up in your business, not just in a slideshow.</p>
            </div>
            <div className="pr rv">
              <h3>Inside your tools</h3>
              <p>AI that lives in your CRM, inbox and files, so nobody has to learn a new app to get value.</p>
            </div>
            <div className="pr rv">
              <h3>Measured from day one</h3>
              <p>We agree on the number before we build, and we report against it after we ship.</p>
            </div>
          </div>
        </section>

        <section className="band" id="how">
          <div className="in">
            <div className="sec-head rv">
              <p className="eb">How we work</p>
              <h2 className="h2">Four steps from noise to signal</h2>
              <p className="lede">
                Every engagement follows the same path. You can start at step one or bring us in to run something you
                already have.
              </p>
            </div>
            <HowWeWork />
          </div>
        </section>

        <section className="band" id="industries" style={{ paddingTop: 0 }}>
          <div className="in">
            <div className="sec-head rv">
              <p className="eb">Industries</p>
              <h2 className="h2">Proven in real estate. Built for regulated work.</h2>
              <p className="lede">
                We lead with real estate because we run there every day. The same approach has carried into financial
                services and health care, where data rules are tighter.
              </p>
            </div>
            <div className="ind">
              <article className="card feat rv">
                <span className="tag">Flagship · Real estate</span>
                <h3>Brokerages and teams that want every agent using AI</h3>
                <p>Lead follow-up that never goes cold, transactions that track themselves, and agents trained to use AI the next morning.</p>
                <ul>
                  <li>Re-engage past clients and stale leads from your own CRM</li>
                  <li>Transaction coordination with fewer missed dates</li>
                  <li>Agent training through Signal-Edge Steps</li>
                  <li>Visibility in AI search for your listings and team</li>
                </ul>
                <div className="flag">
                  <div>
                    <span className="mono">Running live at</span>
                    <br />
                    <strong>SolCal Properties</strong>
                  </div>
                </div>
              </article>
              <article className="card rv">
                <span className="tag">Financial services</span>
                <h3>Faster answers, cleaner audit trails</h3>
                <p>Document review, client reporting and internal knowledge search built with the controls compliance teams expect.</p>
              </article>
              <article className="card rv">
                <span className="tag">Health care</span>
                <h3>Less admin, same privacy rules</h3>
                <p>Intake, scheduling and policy lookup that take work off staff while keeping patient data where it belongs.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="band case" id="results">
          <div className="in">
            <div className="case-grid">
              <div className="case-copy rv">
                <p className="eb">Case study · Real estate</p>
                <h2 className="h2">SolCal Properties runs on Signal-Edge</h2>
                <p className="lede">
                  A Coachella Valley real estate team that uses the Signal-Edge platform for its whole operation, so
                  every recommendation we make has been tested in a live brokerage.
                </p>
                <div className="blk">
                  <span className="mono">The problem</span>
                  <p>Placeholder: what was slow, manual or leaking before the platform, in SolCal&apos;s words.</p>
                </div>
                <div className="blk">
                  <span className="mono">What we built</span>
                  <p>
                    One platform on SolCal&apos;s own data: lead re-engagement, transaction coordination and agent
                    accountability, connected to the CRM the team already used.
                  </p>
                </div>
                <div>
                  <a className="btn" href="#prep">
                    Talk about your version <span className="arr">→</span>
                  </a>
                </div>
              </div>
              <div className="rv">
                <div className="metrics">
                  {[
                    ["00%", "Result one, with date range"],
                    ["0.0×", "Result two, with date range"],
                    ["00 hrs", "Result three, with date range"],
                  ].map(([v, k]) => (
                    <div className="metric" key={k}>
                      <span className="ph-note">Placeholder</span>
                      <span className="v ph">{v}</span>
                      <span className="k">{k}</span>
                    </div>
                  ))}
                </div>
                <div className="quote">
                  <p>Placeholder for a short quote from the SolCal team about what changed day to day.</p>
                  <span className="who">Name, role · SolCal Properties</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="band" id="steps">
          <div className="in">
            <div className="steps-grid">
              <div className="rv">
                <p className="eb">Signal-Edge Steps</p>
                <h2 className="h2" style={{ marginTop: 16 }}>
                  Your agents, using AI by next week
                </h2>
                <p className="lede" style={{ marginTop: 16 }}>
                  A private, step by step walkthrough for real estate teams. Each agent builds their own AI second
                  brain, one short lesson at a time, and picks up right where they left off.
                </p>
                <ol className="mods">
                  {stepsModules.map((m) => (
                    <li key={m.n}>
                      <span className="n">{m.n}</span>
                      <div>
                        <strong>{m.title}</strong>
                        <span>{m.body}</span>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="ctas">
                  <a className="btn p" href="#prep">
                    Get your team a space <span className="arr">→</span>
                  </a>
                </div>
              </div>
              <LessonDemo />
            </div>
          </div>
        </section>

        <section className="band forms" id="prep">
          <div className="in">
            <div className="sec-head rv">
              <p className="eb">Get started</p>
              <h2 className="h2">Before your session</h2>
              <p className="lede">
                Coming to a Signal-Edge workshop, or bringing us to your team? Tell us a little first so the session
                fits the tools you already use.
              </p>
            </div>
            <div className="forms-grid">
              <PrepForm />
              <div className="panel news rv" id="newsletter">
                <div>
                  <p className="eb">{site.newsletterName}</p>
                  <h3 style={{ marginTop: 12 }}>Short, useful, only what works.</h3>
                  <p className="sub" style={{ marginTop: 10 }}>
                    {site.newsletterCadence}: prompts you can use the same day, tool changes that matter and one real
                    result from the field.
                  </p>
                </div>
                <NewsletterForm />
                <div>
                  <div className="issue">
                    <span className="mono">Sample issue</span>
                    <span>Five prompts that turn a listing appointment into a follow-up plan</span>
                  </div>
                  <div className="issue">
                    <span className="mono">Sample issue</span>
                    <span>What changed in the AI tools lately, and what to ignore</span>
                  </div>
                </div>
                <Wave options={newsWave} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="in">
          <div className="foot-top">
            <div>
              <Wordmark />
              <p className="tagline">{site.description}</p>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="#how">How we work</a></li>
                <li><a href="#industries">Industries</a></li>
                <li><a href="#results">Results</a></li>
                <li><a href="#prep">Talk to us</a></li>
              </ul>
            </div>
            <div>
              <h4>Learn</h4>
              <ul>
                <li><a href="#steps">Signal-Edge Steps</a></li>
                <li><a href="#newsletter">{site.newsletterName}</a></li>
                <li><Link href="/sign-in">Member sign-in</Link></li>
              </ul>
            </div>
            <div>
              <h4>Products</h4>
              <ul>
                {["Agent Edge", "TitleEdge", "TourCoach"].map((p) => (
                  <li className="prod" key={p}>
                    {p}
                    <small>by Signal-Edge AI</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="foot-bot">
            <span>© {new Date().getFullYear()} Signal-Edge AI</span>
            <span>
              <a href="#top">Privacy</a>
              <a href="#top">Terms</a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
