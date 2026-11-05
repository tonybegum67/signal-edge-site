// The public address the visitor used. Behind Cloud Run the server itself listens on 0.0.0.0:8080,
// so build redirects from the forwarded headers instead of the server's own address.
export function publicOrigin(h: Headers) {
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto")?.split(",")[0] ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
