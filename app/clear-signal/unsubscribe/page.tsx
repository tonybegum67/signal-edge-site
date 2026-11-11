import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "../../components/Nav";
import { createClient } from "@/lib/supabase/server";
import { TOKEN } from "@/lib/clear-signal";
import { site } from "@/lib/site";
import { resubscribe, unsubscribe } from "./actions";

export const metadata: Metadata = { title: `${site.newsletterName} settings`, robots: { index: false, follow: false } };

// Always read the subscription fresh.
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ t?: string | string[] }> };
type Status = "subscribed" | "unsubscribed" | "unknown";

// Only the link's own subscription is looked up; the page never shows an email address.
async function readStatus(token: string): Promise<Status> {
  if (!TOKEN.test(token)) return "unknown";
  const supabase = await createClient();
  if (!supabase) return "unknown";
  const { data, error } = await supabase.rpc("clear_signal_status", { p_token: token });
  if (error) {
    console.error("clear signal status failed", error.code, error.message);
    return "unknown";
  }
  return data === "subscribed" || data === "unsubscribed" ? data : "unknown";
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const raw = (await searchParams).t;
  const token = typeof raw === "string" ? raw : "";
  const status = await readStatus(token);
  const name = site.newsletterName;

  return (
    <>
      <Nav />
      <main className="band">
        <div className="in unsub">
          <p className="eb">{name}</p>

          {status === "subscribed" && (
            <>
              <h1 className="h2">Unsubscribe from {name}?</h1>
              <p className="lede">One click and you won&apos;t get another issue. No hard feelings.</p>
              <form action={unsubscribe}>
                <input type="hidden" name="t" value={token} />
                <button type="submit" className="btn p">
                  Unsubscribe <span className="arr">→</span>
                </button>
              </form>
            </>
          )}

          {status === "unsubscribed" && (
            <>
              <h1 className="h2">You&apos;re unsubscribed</h1>
              <p className="lede">
                You won&apos;t get any more {name} emails. Thanks for reading while you did.
              </p>
              <form action={resubscribe}>
                <input type="hidden" name="t" value={token} />
                <button type="submit" className="btn">
                  Changed your mind? Resubscribe
                </button>
              </form>
            </>
          )}

          {status === "unknown" && (
            <>
              <h1 className="h2">This link didn&apos;t work</h1>
              <p className="lede">
                It may have been cut short by your email app. To unsubscribe, reply to any {name} email with the word
                unsubscribe and we&apos;ll take you off the list.
              </p>
            </>
          )}

          <p className="back">
            <Link href="/">Back to the home page</Link>
          </p>
        </div>
      </main>
    </>
  );
}
