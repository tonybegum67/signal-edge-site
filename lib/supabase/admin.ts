import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./config";

// Supabase with the service role, for server code that must read the Clear Signal list.
// The key comes from Secret Manager through Cloud Run (docs/clear-signal-sending.md), never from the build
// or the browser. Null until it's set, so nothing breaks before sending is switched on.
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function createAdminClient() {
  if (!supabaseUrl || !serviceKey) return null;
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
