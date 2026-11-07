// Live Signal email layout for emails the site sends itself.
// Matches the Supabase sign-in templates built by scripts/build-email-templates.mjs.

const c = {
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
const body = "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const mono = "'IBM Plex Mono', Menlo, Consolas, monospace";

// Everything that comes from a visitor goes through this before it lands in HTML.
export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);
}

export type EmailParts = {
  preheader: string;
  label: string;
  heading: string;
  paragraphs: string[]; // already escaped
  highlight?: { label: string; value: string }; // already escaped
  button: { text: string; href: string };
  note: string;
};

export function renderEmail(p: EmailParts) {
  const ps = p.paragraphs
    .map(
      (t) => `<p style="margin:0 0 16px;font-family:${body};font-size:16px;line-height:1.55;color:${c.inkMuted};">${t}</p>`,
    )
    .join("\n");
  const highlight = p.highlight
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 20px;">
  <tr><td style="border-left:3px solid ${c.amber};background:${c.paper};padding:14px 18px;border-radius:0 6px 6px 0;">
    <p style="margin:0 0 4px;font-family:${mono};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${c.amberDeep};">${p.highlight.label}</p>
    <p style="margin:0;font-family:${body};font-size:17px;font-weight:700;line-height:1.4;color:${c.ink};">${p.highlight.value}</p>
  </td></tr>
</table>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${p.heading}</title>
</head>
<body style="margin:0;padding:0;background:${c.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${p.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.paper};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${c.white};border-radius:6px;overflow:hidden;">
        <tr><td style="background:${c.midnight};padding:22px 32px;">
          <span style="font-family:${body};font-size:18px;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;color:${c.titaniumHi};">Signal-Edge AI</span>
        </td></tr>
        <tr><td style="height:3px;line-height:3px;font-size:0;background:${c.amber};">&nbsp;</td></tr>
        <tr><td style="padding:32px 32px 8px;">
          <p style="margin:0 0 12px;font-family:${mono};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${c.amberDeep};">${p.label}</p>
          <h1 style="margin:0 0 16px;font-family:${body};font-size:26px;line-height:1.2;font-weight:800;color:${c.ink};">${p.heading}</h1>
          ${ps}
          ${highlight}
        </td></tr>
        <tr><td style="padding:0 32px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="border-radius:6px;background:${c.amber};">
              <a href="${p.button.href}" style="display:inline-block;padding:14px 26px;font-family:${body};font-size:16px;font-weight:700;color:${c.amberInk};text-decoration:none;border-radius:6px;">${p.button.text}</a>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:0 32px 28px;">
          <p style="margin:0;font-family:${body};font-size:13px;line-height:1.5;color:${c.steel};">${p.note}</p>
        </td></tr>
        <tr><td style="border-top:1px solid ${c.line};padding:18px 32px;">
          <p style="margin:0;font-family:${body};font-size:12px;line-height:1.5;color:${c.steel};">Signal-Edge AI · Real AI results with your data</p>
        </td></tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;
}
