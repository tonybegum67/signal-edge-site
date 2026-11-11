import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TOKEN } from "@/lib/clear-signal";

// One-click unsubscribe (RFC 8058) for the List-Unsubscribe header.
// Mail apps POST here when someone presses their built-in Unsubscribe button.
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t") ?? "";
  if (!TOKEN.test(token)) return new NextResponse("Unknown link", { status: 400 });
  const supabase = await createClient();
  if (!supabase) return new NextResponse("Not available", { status: 503 });
  const { data, error } = await supabase.rpc("clear_signal_set_subscribed", { p_token: token, p_subscribed: false });
  if (error) {
    console.error("one-click unsubscribe failed", error.code, error.message);
    return new NextResponse("Try again later", { status: 503 });
  }
  if (!data) return new NextResponse("Unknown link", { status: 404 });
  return new NextResponse("Unsubscribed", { status: 200 });
}

// Someone who opens the address in a browser gets the normal page, which asks before changing anything.
export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t") ?? "";
  const url = new URL(`/clear-signal/unsubscribe?t=${encodeURIComponent(token)}`, request.nextUrl.origin);
  return NextResponse.redirect(url, 303);
}
