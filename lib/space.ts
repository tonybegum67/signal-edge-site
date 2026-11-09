import type { SupabaseClient } from "@supabase/supabase-js";

// Company spaces are invite-only: a member gets in by adding their company's access code.
export const caseySpace = {
  code: "CASEY-LESHER",
  company: "Casey Lesher Real Estate",
  path: "/space/casey-lesher",
  // The workshop. Times are Pacific.
  session: {
    day: "Monday, November 16",
    time: "10 AM to 12 PM Pacific",
  },
};

// True when the signed-in member added this space's code.
// Reads the member's own code redemptions; if that table isn't readable yet,
// falls back to the code on their membership.
export async function hasSpace(supabase: SupabaseClient, code: string): Promise<boolean> {
  const { data, error } = await supabase.from("code_redemptions").select("code").eq("code", code).limit(1);
  if (!error) {
    if ((data?.length ?? 0) > 0) return true;
  }
  const { data: m } = await supabase.from("memberships").select("code").maybeSingle();
  return m?.code === code;
}
