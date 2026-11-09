import Link from "next/link";
import { promptPack } from "@/lib/lessons";
import { CopyPrompt } from "./CopyPrompt";

// The prompt pack, grouped by Step. Members on Free see Step 1's prompts; Pro opens the rest.
export function PromptPack({ isPro }: { isPro: boolean }) {
  return (
    <div className="pack">
      {promptPack.map((g) => (
        <section key={g.step}>
          <h3 className="eb">
            Step {g.step} · {g.title}
          </h3>
          {g.step === 1 || isPro ? (
            g.items.map((i) => <CopyPrompt key={i.label} label={i.label} text={i.text} />)
          ) : (
            <p className="sub">
              {g.items.length} prompt{g.items.length === 1 ? "" : "s"} in Pro. <Link href="/account">Add a code</Link> to
              open them.
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
