import { site } from "@/lib/site";
import { issueUrl } from "@/lib/clear-signal";
import { stepLabel } from "@/lib/clear-signal-issues";
import type { IssueEmail } from "@/lib/clear-signal-emails";
import { escapeHtml } from "./layout";

// A Clear Signal issue as a branded Live Signal email, plus its plain-text twin.
// Built for one subscriber at a time, because each one gets their own unsubscribe link.
// Email apps ignore most CSS, so this is tables and inline styles only.

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

const e = escapeHtml;
const lines = (s: string) => e(s).replace(/\n/g, "<br>");

const label = (t: string) =>
  `<p style="margin:0 0 8px;font-family:${mono};font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${c.amberDeep};">${e(t)}</p>`;
const heading = (t: string) =>
  `<h2 style="margin:0 0 12px;font-family:${body};font-size:22px;line-height:1.15;font-weight:800;text-transform:uppercase;letter-spacing:-0.01em;color:${c.ink};">${e(t)}</h2>`;
const para = (html: string, extra = "") =>
  `<p style="margin:0 0 12px;font-family:${body};font-size:16px;line-height:1.55;color:${c.inkMuted};${extra}">${html}</p>`;
const section = (inner: string) => `<tr><td style="padding:0 32px 28px;">${inner}</td></tr>`;
const button = (text: string, href: string) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 0;"><tr>
  <td style="border-radius:6px;background:${c.amber};">
    <a href="${e(href)}" style="display:inline-block;padding:14px 24px;font-family:${body};font-size:16px;font-weight:700;color:${c.amberInk};text-decoration:none;border-radius:6px;">${e(text)}</a>
  </td>
</tr></table>`;

export function clearSignalIssueEmail(m: IssueEmail, opts: { unsubscribeUrl: string; test: boolean }) {
  const issue = m.issue;
  const exercise = issueUrl(m.number);
  const step = `Step ${issue.step}: ${stepLabel(issue.step)}`;
  const subject = `${opts.test ? "[Test] " : ""}${m.subject}`;
  const inside = [m.oneThing.title, `Prompt of the week: ${issue.title}`, "Quick hits"];
  const why = `You're getting this because you signed up for ${site.newsletterName} at signal-edge.ai.`;
  const address = `${site.name} · ${site.mailingAddress}`;

  const testBanner = opts.test
    ? `<tr><td style="background:${c.amber};padding:10px 32px;font-family:${mono};font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${c.amberInk};">Test send · only you got this one</td></tr>`
    : "";

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${e(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${c.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${e(m.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.paper};">
  <tr>
    <td align="center" style="padding:28px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${c.white};border:1px solid ${c.line};border-radius:6px;overflow:hidden;">
        ${testBanner}
        <tr><td style="background:${c.midnight};">
          <a href="${e(site.url)}/clear-signal"><img src="${e(site.url)}/brand/clear-signal-header.png" width="600" alt="${e(`${site.newsletterName} · ${site.newsletterTagline}`)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;color:${c.titaniumHi};font-family:${body};font-size:20px;font-weight:800;"></a>
        </td></tr>
        <tr><td style="padding:24px 32px 8px;">
          <p style="margin:0 0 16px;padding:0 0 14px;border-bottom:1px solid ${c.line};font-family:${mono};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${c.inkMuted};">Issue ${e(m.number)} · ${e(issue.date)} · 5-minute read</p>
          ${para(`<strong style="color:${c.ink};">Inside this issue</strong>`, "margin-bottom:6px;")}
          <ol style="margin:0 0 24px;padding-left:22px;font-family:${body};font-size:16px;line-height:1.55;color:${c.inkMuted};">
            ${inside.map((t) => `<li>${e(t)}</li>`).join("\n            ")}
          </ol>
        </td></tr>
        ${section(`${label("Hi from Tony")}${para(e(m.hello), "margin:0;")}`)}
        ${section(
          `${label("The one thing")}${heading(m.oneThing.title)}` +
            m.oneThing.points.map((p) => para(`<strong style="color:${c.ink};">${e(p.label)}.</strong> ${e(p.text)}`)).join(""),
        )}
        ${section(
          `${label("Prompt of the week")}${heading(issue.title)}${para(e(issue.intro))}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 12px;"><tr>
            <td style="background:${c.midnight};border-radius:6px;padding:18px;font-family:${mono};font-size:14px;line-height:1.6;color:${c.titaniumHi};">${lines(issue.prompt)}</td>
          </tr></table>
          ${para(e(issue.promptNote), "margin:0;")}`,
        )}
        ${section(
          `${label("From the field")}<h3 style="margin:0 0 6px;font-family:${body};font-size:17px;line-height:1.35;font-weight:700;color:${c.ink};">${e(m.field.question)}</h3>${para(e(m.field.answer), "margin:0;")}`,
        )}
        ${section(
          `${label("Quick hits")}` +
            m.quickHits
              .map(
                (h) =>
                  `<p style="margin:0 0 12px;padding-left:14px;border-left:2px solid ${c.line};font-family:${body};font-size:16px;line-height:1.55;color:${c.inkMuted};"><strong style="color:${c.ink};">${e(h.title)}.</strong> ${e(h.text)}</p>`,
              )
              .join(""),
        )}
        ${section(
          `${label("This week's exercise")}${para(e(issue.homework))}${para(e(`It's on the site with a Copy button and a link into ${step}.`))}${button("Open this issue's exercise", exercise)}`,
        )}
        ${section(`${para(`<strong style="color:${c.ink};">P.S.</strong> ${e(m.ps)}`, "margin:0;")}`)}
        <tr><td style="background:${c.paper};border-top:1px solid ${c.line};padding:18px 32px 24px;font-family:${body};font-size:13px;line-height:1.6;color:${c.steel};">
          Forward this to someone who'd like it.<br>
          ${e(why)} <a href="${e(opts.unsubscribeUrl)}" style="color:${c.steel};text-decoration:underline;">Unsubscribe</a><br>
          ${e(address)}
        </td></tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;

  const text = [
    `${site.newsletterName.toUpperCase()} · Issue ${m.number}${opts.test ? " (test send, only you got this one)" : ""}`,
    site.newsletterTagline,
    "",
    "Inside this issue:",
    ...inside.map((t, i) => `${i + 1}. ${t}`),
    "",
    "HI FROM TONY",
    m.hello,
    "",
    "THE ONE THING",
    m.oneThing.title,
    ...m.oneThing.points.map((p) => `${p.label}: ${p.text}`),
    "",
    "PROMPT OF THE WEEK",
    `${issue.title}. ${issue.intro}`,
    "",
    issue.prompt,
    "",
    issue.promptNote,
    "",
    "FROM THE FIELD",
    m.field.question,
    m.field.answer,
    "",
    "QUICK HITS",
    ...m.quickHits.map((h) => `• ${h.title}: ${h.text}`),
    "",
    "THIS WEEK'S EXERCISE",
    issue.homework,
    `It's on the site with a Copy button and a link into ${step}: ${exercise}`,
    "",
    `P.S. ${m.ps}`,
    "",
    "Forward this to someone who'd like it.",
    `${why} Unsubscribe: ${opts.unsubscribeUrl}`,
    address,
  ].join("\n");

  return { subject, html, text };
}
