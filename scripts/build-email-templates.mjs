// Builds the Supabase sign-in email templates in supabase/templates/.
// Run with: npm run emails
// Then paste each file into Supabase (see docs/supabase-emails.md).
//
// The {{ .ConfirmationURL }}, {{ .Email }} and {{ .NewEmail }} parts are
// Supabase's own placeholders. Supabase fills them in when it sends.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "supabase", "templates");

// Live Signal colors (brand kit tokens). Light body, dark header band.
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

function layout({ preheader, label, heading, paragraphs, button, note }) {
  const ps = paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-family:${body};font-size:16px;line-height:1.55;color:${c.inkMuted};">${p}</p>`,
    )
    .join("\n              ");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${heading}</title>
</head>
<body style="margin:0;padding:0;background:${c.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.paper};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${c.white};border-radius:6px;overflow:hidden;">
        <tr>
          <td style="background:${c.midnight};padding:22px 32px;">
            <span style="font-family:${body};font-size:18px;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;color:${c.titaniumHi};">Signal-Edge AI</span>
          </td>
        </tr>
        <tr>
          <td style="height:3px;line-height:3px;font-size:0;background:${c.amber};">&nbsp;</td>
        </tr>
        <tr>
          <td style="padding:32px 32px 8px;">
            <p style="margin:0 0 12px;font-family:${mono};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${c.amberDeep};">${label}</p>
            <h1 style="margin:0 0 16px;font-family:${body};font-size:26px;line-height:1.2;font-weight:800;color:${c.ink};">${heading}</h1>
              ${ps}
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="border-radius:6px;background:${c.amber};">
                  <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 26px;font-family:${body};font-size:16px;font-weight:700;color:${c.amberInk};text-decoration:none;border-radius:6px;">${button}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 28px;">
            <p style="margin:0 0 8px;font-family:${body};font-size:13px;line-height:1.5;color:${c.steel};">Button not working? Copy this link into your browser:</p>
            <p style="margin:0 0 20px;font-family:${body};font-size:13px;line-height:1.5;word-break:break-all;"><a href="{{ .ConfirmationURL }}" style="color:${c.amberDeep};">{{ .ConfirmationURL }}</a></p>
            <p style="margin:0;font-family:${body};font-size:13px;line-height:1.5;color:${c.steel};">${note}</p>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid ${c.line};padding:18px 32px;">
            <p style="margin:0;font-family:${body};font-size:12px;line-height:1.5;color:${c.steel};">Signal-Edge AI · Real AI results with your data</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;
}

// Subject lines go in Supabase's Subject box; the file holds the body.
export const templates = [
  {
    file: "confirm-signup.html",
    supabase: "Confirm signup",
    subject: "Confirm your email for Signal-Edge Steps",
    preheader: "One tap and you're in.",
    label: "Signal-Edge Steps",
    heading: "One tap and you're in",
    paragraphs: [
      "Thanks for joining Signal-Edge Steps. Tap the button to confirm this is your email, and you'll land right on Step 1.",
    ],
    button: "Confirm my email",
    note: "Didn't sign up? You can ignore this email and nothing will happen.",
  },
  {
    file: "magic-link.html",
    supabase: "Magic link",
    subject: "Your Signal-Edge sign-in link",
    preheader: "No password needed. Tap to sign in.",
    label: "Signal-Edge Steps",
    heading: "Here's your sign-in link",
    paragraphs: [
      "Tap the button to sign in to Signal-Edge Steps. No password needed.",
      "The link works once and expires soon, so use it shortly.",
    ],
    button: "Sign me in",
    note: "Didn't ask to sign in? You can ignore this email. Nobody gets in without this link.",
  },
  {
    file: "change-email.html",
    supabase: "Change email address",
    subject: "Confirm your new email for Signal-Edge",
    preheader: "Confirm the switch to your new email.",
    label: "Your account",
    heading: "Confirm your new email",
    paragraphs: [
      "You asked to change your Signal-Edge email from {{ .Email }} to {{ .NewEmail }}. Tap the button to confirm the switch.",
    ],
    button: "Confirm new email",
    note: "Didn't ask for this? Ignore this email and your email stays the same.",
  },
  {
    file: "invite.html",
    supabase: "Invite user",
    subject: "You're invited to Signal-Edge Steps",
    preheader: "Short lessons that make AI useful in your daily work.",
    label: "You're invited",
    heading: "Come join Signal-Edge Steps",
    paragraphs: [
      "You've been invited to Signal-Edge Steps: short, friendly lessons that help you use AI in your everyday work.",
      "Tap the button to accept, and you'll start with Step 1.",
    ],
    button: "Accept my invite",
    note: "Not expecting this? You can ignore this email.",
  },
];

mkdirSync(outDir, { recursive: true });
for (const t of templates) {
  writeFileSync(join(outDir, t.file), layout(t));
  console.log(`${t.supabase.padEnd(22)} ${t.file}  subject: ${t.subject}`);
}
