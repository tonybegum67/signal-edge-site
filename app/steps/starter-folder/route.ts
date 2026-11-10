import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { starterFolderZip } from "@/lib/starter/folder";
import { publicOrigin } from "@/lib/origin";

// The Second Brain starter folder, as one zip. Signed-in members only.
export async function GET(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent("/steps/1")}`, publicOrigin(request.headers)));
  }
  const zip = starterFolderZip();
  return new NextResponse(Buffer.from(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="Second Brain starter folder.zip"',
      "Cache-Control": "private, no-store",
    },
  });
}
