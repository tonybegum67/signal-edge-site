"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TOKEN } from "@/lib/clear-signal";

// Switches one subscription off or back on, by its private token, then reloads the page to show the result.
async function setSubscribed(formData: FormData, subscribed: boolean) {
  const token = String(formData.get("t") ?? "");
  if (!TOKEN.test(token)) redirect("/clear-signal/unsubscribe");
  const supabase = await createClient();
  if (supabase) {
    const { error } = await supabase.rpc("clear_signal_set_subscribed", { p_token: token, p_subscribed: subscribed });
    if (error) console.error("clear signal switch failed", error.code, error.message);
  }
  redirect(`/clear-signal/unsubscribe?t=${encodeURIComponent(token)}`);
}

export async function unsubscribe(formData: FormData) {
  await setSubscribed(formData, false);
}

export async function resubscribe(formData: FormData) {
  await setSubscribed(formData, true);
}
