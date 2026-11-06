import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicOrigin } from "@/lib/origin";
import { supabaseConfigured, supabaseKey, supabaseUrl } from "@/lib/supabase/config";

// Pages that need a signed-in member.
const MEMBERS_ONLY = ["/steps", "/account"];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  if (!supabaseConfigured) return response;

  // Keeps the member's session fresh while they use the members area.
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  if (!user && MEMBERS_ONLY.some((p) => path === p || path.startsWith(`${p}/`))) {
    // Keeps the query too, so a shared link like /account?code=ABC-123 still works after sign-in.
    const back = path + request.nextUrl.search;
    const url = new URL(`/sign-in?next=${encodeURIComponent(back)}`, publicOrigin(request.headers));
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  // Only the members area needs a session check, so public pages stay fast.
  matcher: ["/steps", "/steps/:path*", "/account", "/account/:path*"],
};
