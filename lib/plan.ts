import type { SupabaseClient } from "@supabase/supabase-js";

export type Plan = { plan: "free" | "pro"; endsAt: string | null; failed?: boolean };

// The signed-in member's plan. No membership row, or one that has ended, means Free.
export async function getPlan(supabase: SupabaseClient): Promise<Plan> {
  const { data, error } = await supabase.from("memberships").select("plan, ends_at").maybeSingle();
  if (error) return { plan: "free", endsAt: null, failed: true };
  if (!data) return { plan: "free", endsAt: null };
  const active = !data.ends_at || new Date(data.ends_at).getTime() > Date.now();
  return active ? { plan: "pro", endsAt: data.ends_at } : { plan: "free", endsAt: null };
}

export function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
