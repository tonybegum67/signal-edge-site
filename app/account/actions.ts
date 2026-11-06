"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Turns Clear Signal on or off for the signed-in member's own email.
export async function setClearSignal(formData: FormData) {
  const on = formData.get("on") === "1";
  const supabase = await createClient();
  if (!supabase) return;
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (!email) return;

  const { data: rows, error } = await supabase
    .from("newsletter_subscribers")
    .update({ unsubscribed_at: on ? null : new Date().toISOString() })
    .ilike("email", email)
    .select("id");
  if (error) console.error("subscription update failed", error.code, error.message);

  // No row yet: joining from the account page adds one.
  if (on && !error && (rows?.length ?? 0) === 0) {
    const { error: insertError } = await supabase.from("newsletter_subscribers").insert({ email, source: "account" });
    if (insertError && insertError.code !== "23505") {
      console.error("subscription insert failed", insertError.code, insertError.message);
    }
  }
  revalidatePath("/account");
}

export type CodeState = { status: "idle" | "done" | "error"; message?: string };

const CODE = /^[A-Za-z0-9-]{3,40}$/;

const CODE_MESSAGES: Record<string, string> = {
  invalid: "That code didn't work. Check the spelling and try again.",
  already_used: "You've already used that code.",
  used_up: "That code has been used up. Ask whoever gave it to you for a new one.",
  signed_out: "Your sign-in ran out. Sign in again and add the code.",
};

// Checks an access code and gives the signed-in member its plan.
export async function redeemCode(_prev: CodeState, formData: FormData): Promise<CodeState> {
  const code = String(formData.get("code") ?? "").trim();
  if (!CODE.test(code)) return { status: "error", message: "Add the code exactly as you got it, like ABC-123." };

  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Codes aren't switched on yet. Check back soon." };

  const { data, error } = await supabase.rpc("redeem_access_code", { p_code: code });
  if (error) {
    console.error("code redeem failed", error.code, error.message);
    return { status: "error", message: "Something went wrong on our side. Try again in a minute." };
  }
  const result = data as { status?: string } | null;
  if (result?.status !== "ok") {
    return { status: "error", message: CODE_MESSAGES[result?.status ?? ""] ?? CODE_MESSAGES.invalid };
  }
  revalidatePath("/account");
  revalidatePath("/steps");
  return { status: "done" };
}
