import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "../../components/Nav";
import { PromptPack } from "../../components/PromptPack";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plan";
import { rulebookName } from "@/lib/lessons";

export const metadata: Metadata = { title: "Prompt pack" };

// Always check the session on each visit.
export const dynamic = "force-dynamic";

export default async function PromptPackPage() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) redirect(`/sign-in?next=${encodeURIComponent("/steps/prompts")}`);

  const plan = await getPlan(supabase);

  return (
    <>
      <Nav signedIn />
      <main className="band">
        <div className="in lesson-page">
          <p className="crumb">
            <Link href="/steps">My Steps</Link> / Prompt pack
          </p>
          <div className="sec-head">
            <p className="eb">Signal-Edge Steps · Prompt pack</p>
            <h1 className="h2">Copy, paste, go</h1>
            <p className="lede">
              Every ready-made prompt from the Steps, in order. They work the same in Claude and ChatGPT. The one
              difference: your rulebook is called {rulebookName.claude} in Claude and {rulebookName.chatgpt} in ChatGPT.
            </p>
          </div>
          <PromptPack isPro={plan.plan === "pro"} />
        </div>
      </main>
    </>
  );
}
