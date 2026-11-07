"use server";

import { createClient } from "@/lib/supabase/server";
import { prepThanksEmail } from "@/lib/emails/prep-thanks";
import { mailConfigured, sendMail } from "@/lib/mail";
import { site } from "@/lib/site";

export type FormState = { status: "idle" | "done" | "error"; message?: string; already?: boolean };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AI = new Set(["claude", "chatgpt", "free", "none"]);
const LAPTOP = new Set(["mac", "win", "unsure"]);
const ROLES = new Set(["Agent", "Team lead or broker", "Operations or admin", "Business owner", "Other"]);

const NOT_ON = "Forms aren't switched on yet. Check back soon.";
const FAILED = "Something went wrong on our side. Give it another try in a minute.";

function text(formData: FormData, key: string, max: number): string {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

// Bots fill every field, people never see this one.
function isBot(formData: FormData): boolean {
  return text(formData, "website", 200) !== "";
}

type Db = NonNullable<Awaited<ReturnType<typeof createClient>>>;

// Adds the email to Clear Signal. Returns "already" when it's on the list.
async function addSubscriber(supabase: Db, email: string, source: string): Promise<"added" | "already" | "failed"> {
  const { error } = await supabase.from("newsletter_subscribers").insert({ email, source });
  if (!error) return "added";
  if (error.code === "23505") return "already";
  console.error("newsletter insert failed", error.code, error.message);
  return "failed";
}

// Sends the thank-you email once per address. A mail problem never fails the form.
async function sendPrepThanks(supabase: Db, email: string, firstName: string) {
  if (!mailConfigured) return;
  const { error } = await supabase.from("prep_thanks_sent").insert({ email });
  if (error) {
    if (error.code !== "23505") console.error("thank-you record failed", error.code, error.message);
    return; // 23505: this address already got it
  }
  try {
    await sendMail({ to: email, ...prepThanksEmail(firstName) });
  } catch (e) {
    console.error("thank-you email failed", e instanceof Error ? e.message : e);
  }
}

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = text(formData, "email", 254).toLowerCase();
  if (!EMAIL.test(email)) return { status: "error", message: "Add an email address like name@company.com." };
  if (isBot(formData)) return { status: "done" };

  const supabase = await createClient();
  if (!supabase) return { status: "error", message: NOT_ON };

  const result = await addSubscriber(supabase, email, "newsletter_form");
  if (result === "failed") return { status: "error", message: FAILED };
  return { status: "done", already: result === "already" };
}

export async function sendPrep(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = text(formData, "name", 120);
  const email = text(formData, "email", 254).toLowerCase();
  if (!name) return { status: "error", message: "Add your name so we know who is coming." };
  if (!EMAIL.test(email)) return { status: "error", message: "Add an email address like name@company.com." };
  if (isBot(formData)) return { status: "done" };

  const supabase = await createClient();
  if (!supabase) return { status: "error", message: NOT_ON };

  const role = text(formData, "role", 60);
  const ai = text(formData, "ai", 20);
  const laptop = text(formData, "laptop", 20);
  const optIn = formData.get("optin") === "on";
  const { data } = await supabase.auth.getUser();

  const { error } = await supabase.from("prep_responses").insert({
    name,
    email,
    company: text(formData, "company", 160) || null,
    role: ROLES.has(role) ? role : null,
    ai_tool: AI.has(ai) ? ai : null,
    laptop: LAPTOP.has(laptop) ? laptop : null,
    time_sink: text(formData, "timeSink", 500) || null,
    newsletter_opt_in: optIn,
    user_id: data.user?.id ?? null,
  });
  if (error) {
    console.error("prep insert failed", error.code, error.message);
    return { status: "error", message: FAILED };
  }

  // The prep answers are saved; a list hiccup shouldn't undo that.
  if (optIn) await addSubscriber(supabase, email, "prep_form");

  const first = name.split(" ")[0];
  await sendPrepThanks(supabase, email, first);

  return { status: "done", message: `Thanks, ${first}. You're set for the session${optIn ? ` and on ${site.newsletterName}` : ""}.` };
}
