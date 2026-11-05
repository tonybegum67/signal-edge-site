// Cloud Run and uptime checks call this to see the site is up.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ ok: true });
}
