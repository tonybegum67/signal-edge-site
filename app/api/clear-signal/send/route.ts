import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getIssueEmails, type Audience } from "@/lib/clear-signal-emails";
import { clearSignalIssueEmail } from "@/lib/emails/clear-signal-issue";
import { getAnnouncements } from "@/lib/announcements";
import { announcementEmail } from "@/lib/emails/announcement";
import { listUnsubscribeHeaders, unsubscribeUrl } from "@/lib/clear-signal";
import { mailConfigured, openMailer, ownerAddress } from "@/lib/mail";
import { createAdminClient } from "@/lib/supabase/admin";
import { site } from "@/lib/site";

// Sends every marketing email that's due: Clear Signal issues and one-off announcements.
// The deploy calls this right after each merge to main (see .github/workflows/deploy.yml),
// so merging an issue or an announcement is what sends it.
//
// - An email with "audience": "test" goes only to the site's own mailbox, once per version of its content.
// - An email with "audience": "everyone" goes to every subscriber who hasn't unsubscribed, read fresh
//   from Supabase when it first goes out, so every sign-up up to that moment is included.
// - Every send is recorded in newsletter_sends first, so a redeploy or retry never sends anyone the same email twice.
//
// Each call sends what it can in about three minutes and reports how many are left; the deploy calls again until none are.

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const TIME_BUDGET_MS = 180_000;
const PAGE = 1000;

const sendKeySecret = process.env.CLEAR_SIGNAL_SEND_KEY ?? "";

function authorized(request: NextRequest) {
  if (sendKeySecret.length < 32) return false;
  const given = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(sendKeySecret).digest();
  return timingSafeEqual(a, b);
}

type Admin = NonNullable<ReturnType<typeof createAdminClient>>;
type Recipient = { email: string; token: string | null };

// Everyone subscribed when the email first went out. Someone who joins later starts with the next one,
// instead of getting an old one on some unrelated deploy weeks later.
async function activeSubscribers(db: Admin, key: string): Promise<Recipient[]> {
  const first = await db.from("newsletter_sends").select("created_at").eq("send_key", key).order("created_at").limit(1);
  if (first.error) throw new Error(`reading sends: ${first.error.code} ${first.error.message}`);
  const cutoff = (first.data[0]?.created_at as string | undefined) ?? null;
  const out: Recipient[] = [];
  for (let from = 0; ; from += PAGE) {
    let q = db.from("newsletter_subscribers").select("email, unsubscribe_token").is("unsubscribed_at", null);
    if (cutoff) q = q.lte("created_at", cutoff);
    const { data, error } = await q.order("created_at").range(from, from + PAGE - 1);
    if (error) throw new Error(`reading subscribers: ${error.code} ${error.message}`);
    out.push(...data.map((r) => ({ email: r.email as string, token: (r.unsubscribe_token as string) ?? null })));
    if (data.length < PAGE) return out;
  }
}

// The site's own mailbox. Uses its real unsubscribe link when it's on the list, so the test shows a working one.
async function testRecipient(db: Admin): Promise<Recipient> {
  const { data } = await db
    .from("newsletter_subscribers")
    .select("unsubscribe_token")
    .ilike("email", ownerAddress)
    .is("unsubscribed_at", null)
    .maybeSingle();
  return { email: ownerAddress, token: (data?.unsubscribe_token as string) ?? null };
}

async function alreadySent(db: Admin, key: string) {
  const sent = new Set<string>();
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db.from("newsletter_sends").select("email").eq("send_key", key).range(from, from + PAGE - 1);
    if (error) throw new Error(`reading sends: ${error.code} ${error.message}`);
    data.forEach((r) => sent.add((r.email as string).toLowerCase()));
    if (data.length < PAGE) return sent;
  }
}

// One email to send: a Clear Signal issue or an announcement.
type Mailing = {
  name: string; // for the report: "001" or "workshop-dec"
  audience: Audience;
  key: string; // its key in newsletter_sends
  render: (opts: { unsubscribeUrl: string; test: boolean }) => { subject: string; html: string; text: string };
};

// The real send of an email has a fixed key: "001" for issue 001, "a-<slug>" for an announcement.
// A test copy gets a new key whenever the words change, so each edit can be checked in the inbox.
function sendKey(base: string, audience: Audience, content: unknown) {
  if (audience === "everyone") return base;
  const version = createHash("sha256").update(JSON.stringify(content)).digest("hex").slice(0, 10);
  return `${base}-test-${version}`;
}

// Issues first, oldest first, then announcements.
function dueMailings(): Mailing[] {
  return [
    ...getIssueEmails().map((m) => ({
      name: m.number,
      audience: m.audience,
      key: sendKey(m.number, m.audience, m),
      render: (o: { unsubscribeUrl: string; test: boolean }) => clearSignalIssueEmail(m, o),
    })),
    ...getAnnouncements().map((a) => ({
      name: a.slug,
      audience: a.audience,
      key: sendKey(`a-${a.slug}`, a.audience, a),
      render: (o: { unsubscribeUrl: string; test: boolean }) => announcementEmail(a, o),
    })),
  ];
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "not allowed" }, { status: 401 });
  const db = createAdminClient();
  if (!db || !mailConfigured) return NextResponse.json({ error: "sending is not switched on" }, { status: 503 });

  let mailings: Mailing[];
  try {
    mailings = dueMailings();
  } catch (err) {
    console.error("clear signal: bad email file", err);
    return NextResponse.json({ error: "an email file is invalid" }, { status: 500 });
  }

  const mailer = openMailer(site.newsletterName)!;
  const deadline = Date.now() + TIME_BUDGET_MS;
  const report: { email: string; audience: string; sent: number; failed: number; remaining: number }[] = [];

  try {
    for (const m of mailings) {
      const key = m.key;
      const recipients = m.audience === "everyone" ? await activeSubscribers(db, key) : [await testRecipient(db)];
      const sent = await alreadySent(db, key);
      const todo = recipients.filter((r) => !sent.has(r.email.toLowerCase()));
      const row = { email: m.name, audience: m.audience, sent: 0, failed: 0, remaining: todo.length };
      report.push(row);

      let failedInARow = 0;
      for (const r of todo) {
        if (Date.now() > deadline || failedInARow >= 3) break;
        // Claim the address first. If another run already claimed it, skip it.
        const claim = await db.from("newsletter_sends").insert({ send_key: key, email: r.email });
        if (claim.error) {
          if (claim.error.code === "23505") row.remaining--;
          else console.error("clear signal: claim failed", claim.error.code, claim.error.message);
          continue;
        }
        const unsub = r.token ? unsubscribeUrl(r.token) : `${site.url}/clear-signal`;
        const mail = m.render({ unsubscribeUrl: unsub, test: m.audience === "test" });
        try {
          await mailer.send({
            to: r.email,
            ...mail,
            headers: r.token ? listUnsubscribeHeaders(r.token, ownerAddress) : undefined,
          });
          row.sent++;
          row.remaining--;
          failedInARow = 0;
        } catch (err) {
          // Release the claim so the next run tries this address again.
          await db.from("newsletter_sends").delete().eq("send_key", key).eq("email", r.email);
          row.failed++;
          failedInARow++;
          console.error("clear signal: send failed", m.name, err instanceof Error ? err.message : err);
        }
      }
    }
  } catch (err) {
    console.error("clear signal: send run stopped", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "send run stopped early", report }, { status: 500 });
  } finally {
    mailer.close();
  }

  const remaining = report.reduce((n, r) => n + r.remaining, 0);
  return NextResponse.json({ remaining, report });
}
