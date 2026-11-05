"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/safe-next";
import { publicOrigin } from "@/lib/origin";

export type SignInState = { status: "idle" | "sent" | "error"; message?: string; email?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendSignInLink(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeNext(String(formData.get("next") ?? ""));
  if (!EMAIL.test(email)) return { status: "error", message: "Add an email address like name@company.com." };

  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Sign-in isn't switched on yet. Check back soon." };

  const h = await headers();
  const origin = publicOrigin(h);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Free members sign up just by confirming their email.
      shouldCreateUser: true,
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    const busy = error.status === 429;
    return {
      status: "error",
      message: busy
        ? "Lots of sign-ins right now. Give it a minute and try again."
        : "We couldn't send your link. Check the address and try again.",
    };
  }
  return { status: "sent", email };
}
