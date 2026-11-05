// Only allow redirects to paths on this site, never to another domain.
export function safeNext(value: string | null | undefined, fallback = "/steps") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
