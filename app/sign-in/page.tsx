import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Nav } from "../components/Nav";
import { SignInForm } from "./SignInForm";
import { getUser } from "@/lib/supabase/server";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  if (await getUser()) redirect(next);

  return (
    <>
      <Nav />
      <main className="band forms">
        <div className="in">
          <div className="panel" style={{ maxWidth: 560 }}>
            <div>
              <p className="eb">Signal-Edge Steps</p>
              <h1 className="h2" style={{ marginTop: 12 }}>
                Sign in
              </h1>
              <p className="sub" style={{ marginTop: 12 }}>
                New here or coming back, it&apos;s the same step: enter your email and we&apos;ll send you a link.
                Step 1 and the newsletter are free.
              </p>
            </div>
            <SignInForm next={next} linkError={params.error === "link"} />
          </div>
        </div>
      </main>
    </>
  );
}
