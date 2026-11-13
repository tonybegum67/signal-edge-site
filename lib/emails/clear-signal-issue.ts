import { site } from "@/lib/site";
import { issueUrl } from "@/lib/clear-signal";
import { stepLabel } from "@/lib/clear-signal-issues";
import type { IssueEmail } from "@/lib/clear-signal-emails";
import { escapeHtml } from "./layout";
import {
  body,
  button,
  c,
  headers,
  heading,
  label,
  lines,
  marketingHtml,
  marketingTextFooter,
  mono,
  para,
  section,
  subjectLine,
} from "./marketing";

// A Clear Signal issue as a branded Live Signal email, plus its plain-text twin.
// Built for one subscriber at a time, because each one gets their own unsubscribe link.
// The frame (header, test banner, footer) is shared with announcements in ./marketing.ts.

const e = escapeHtml;

export function clearSignalIssueEmail(m: IssueEmail, opts: { unsubscribeUrl: string; test: boolean }) {
  const issue = m.issue;
  const exercise = issueUrl(m.number);
  const step = `Step ${issue.step}: ${stepLabel(issue.step)}`;
  const subject = subjectLine(m.subject, opts.test);
  const inside = [m.oneThing.title, `Prompt of the week: ${issue.title}`, "Quick hits"];

  const rows = `<tr><td style="padding:24px 32px 8px;">
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
        ${section(`${para(`<strong style="color:${c.ink};">P.S.</strong> ${e(m.ps)}`, "margin:0;")}`)}`;

  const html = marketingHtml({
    subject,
    preheader: m.preheader,
    test: opts.test,
    header: headers.clearSignal,
    rows,
    unsubscribeUrl: opts.unsubscribeUrl,
  });

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
    ...marketingTextFooter(opts.unsubscribeUrl),
  ].join("\n");

  return { subject, html, text };
}
