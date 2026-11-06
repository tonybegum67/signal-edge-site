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
