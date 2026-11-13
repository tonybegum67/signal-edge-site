import { site } from "@/lib/site";
import { escapeHtml } from "./layout";

// The Live Signal frame shared by every marketing email the site sends to the list:
// Clear Signal issues and one-off announcements. Each email supplies its own header image and body rows;
// the frame adds the test banner, the footer with the postal address, and a personal unsubscribe link.
// Email apps ignore most CSS, so this is tables and inline styles only.

export const c = {
  midnight: "#08111F",
  titaniumHi: "#F3F5F8",
  steel: "#6F7C8E",
  amber: "#FFB23E",
  amberInk: "#120C02",
  amberDeep: "#B36B00",
  paper: "#EEF1F4",
  white: "#FFFFFF",
  ink: "#0B1626",
  inkMuted: "#4D5A6C",
  line: "#D9DEE5",
};
export const body = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif";
export const mono = "'IBM Plex Mono', Menlo, Consolas, monospace";

const e = escapeHtml;
export const lines = (s: string) => e(s).replace(/\n/g, "<br>");

export const label = (t: string) =>
  `<p style="margin:0 0 8px;font-family:${mono};font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${c.amberDeep};">${e(t)}</p>`;
export const heading = (t: string) =>
  `<h2 style="margin:0 0 12px;font-family:${body};font-size:22px;line-height:1.15;font-weight:800;text-transform:uppercase;letter-spacing:-0.01em;color:${c.ink};">${e(t)}</h2>`;
export const para = (html: string, extra = "") =>
  `<p style="margin:0 0 12px;font-family:${body};font-size:16px;line-height:1.55;color:${c.inkMuted};${extra}">${html}</p>`;
export const section = (inner: string) => `<tr><td style="padding:0 32px 28px;">${inner}</td></tr>`;
export const button = (text: string, href: string) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 0;"><tr>
  <td style="border-radius:6px;background:${c.amber};">
    <a href="${e(href)}" style="display:inline-block;padding:14px 24px;font-family:${body};font-size:16px;font-weight:700;color:${c.amberInk};text-decoration:none;border-radius:6px;">${e(text)}</a>
  </td>
</tr></table>`;
export const highlight = (labelText: string, value: string) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 16px;"><tr>
  <td style="border-left:3px solid ${c.amber};background:${c.paper};padding:14px 18px;border-radius:0 6px 6px 0;">
    <p style="margin:0 0 4px;font-family:${mono};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${c.amberDeep};">${e(labelText)}</p>
    <p style="margin:0;font-family:${body};font-size:17px;font-weight:700;line-height:1.4;color:${c.ink};">${e(value)}</p>
  </td>
</tr></table>`;

export type Header = {
  href: string; // where a click on the header goes
  src: string; // a 1200px-wide image, shown at 600px
  alt: string;
  background: string; // behind the image while it loads
  altColor: string; // the alt text's color, for mail apps that block images
};

// Clear Signal's own header, and the Signal-Edge AI header used for everything else.
export const headers = {
  clearSignal: {
    href: `${site.url}/clear-signal`,
    src: `${site.url}/brand/clear-signal-header.png`,
    alt: `${site.newsletterName} · ${site.newsletterTagline}`,
    background: c.midnight,
    altColor: c.titaniumHi,
  },
  signalEdge: {
    href: site.url,
    src: `${site.url}/brand/signal-edge-email-header.png`,
    alt: site.name,
    background: c.white,
    altColor: c.ink,
  },
} satisfies Record<string, Header>;

// Everyone on the list signed up through Clear Signal, so every marketing email gives the same reason.
const why = `You're getting this because you signed up for ${site.newsletterName} at signal-edge.ai.`;
const address = () => `${site.name} · ${site.mailingAddress}`;

export function subjectLine(subject: string, test: boolean) {
  return `${test ? "[Test] " : ""}${subject}`;
}

export function marketingHtml(p: {
  subject: string; // as sent, with any [Test] prefix
  preheader: string;
  test: boolean;
  header: Header;
  rows: string; // <tr> rows for the body, already escaped
  unsubscribeUrl: string;
}) {
  const testBanner = p.test
    ? `<tr><td style="background:${c.amber};padding:10px 32px;font-family:${mono};font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${c.amberInk};">Test send · only you got this one</td></tr>`
    : "";
  const h = p.header;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${e(p.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${c.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${e(p.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.paper};">
  <tr>
    <td align="center" style="padding:28px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${c.white};border:1px solid ${c.line};border-radius:6px;overflow:hidden;">
        ${testBanner}
        <tr><td style="background:${h.background};">
          <a href="${e(h.href)}"><img src="${e(h.src)}" width="600" alt="${e(h.alt)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;color:${h.altColor};font-family:${body};font-size:20px;font-weight:800;"></a>
        </td></tr>
        ${p.rows}
        <tr><td style="background:${c.paper};border-top:1px solid ${c.line};padding:18px 32px 24px;font-family:${body};font-size:13px;line-height:1.6;color:${c.steel};">
          Forward this to someone who'd like it.<br>
          ${e(why)} <a href="${e(p.unsubscribeUrl)}" style="color:${c.steel};text-decoration:underline;">Unsubscribe</a><br>
          ${e(address())}
        </td></tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;
}

// The plain-text footer, matching the HTML one.
export function marketingTextFooter(unsubscribeUrl: string) {
  return ["Forward this to someone who'd like it.", `${why} Unsubscribe: ${unsubscribeUrl}`, address()];
}
