import type { Announcement } from "@/lib/announcements";
import { escapeHtml } from "./layout";
import {
  body,
  button,
  c,
  headers,
  highlight,
  label,
  marketingHtml,
  marketingTextFooter,
  para,
  section,
  subjectLine,
} from "./marketing";

// A one-off announcement to the list in the branded Live Signal design, plus its plain-text twin.
// Built for one subscriber at a time, because each one gets their own unsubscribe link.

const e = escapeHtml;

export function announcementEmail(a: Announcement, opts: { unsubscribeUrl: string; test: boolean }) {
  const subject = subjectLine(a.subject, opts.test);

  const main =
    label(a.label) +
    `<h1 style="margin:0 0 16px;font-family:${body};font-size:26px;line-height:1.2;font-weight:800;color:${c.ink};">${e(a.heading)}</h1>` +
    a.paragraphs.map((p) => para(e(p))).join("") +
    (a.highlight ? highlight(a.highlight.label, a.highlight.value) : "") +
    (a.button ? button(a.button.text, a.button.href) : "");

  const rows = [
    `<tr><td style="padding:28px 32px 28px;">${main}</td></tr>`,
    a.ps ? section(para(`<strong style="color:${c.ink};">P.S.</strong> ${e(a.ps)}`, "margin:0;")) : "",
  ]
    .filter(Boolean)
    .join("\n        ");

  const html = marketingHtml({
    subject,
    preheader: a.preheader,
    test: opts.test,
    header: headers.signalEdge,
    rows,
    unsubscribeUrl: opts.unsubscribeUrl,
  });

  const text = [
    ...(opts.test ? ["(Test send, only you got this one)", ""] : []),
    a.label.toUpperCase(),
    a.heading,
    "",
    ...a.paragraphs.flatMap((p) => [p, ""]),
    ...(a.highlight ? [`${a.highlight.label}: ${a.highlight.value}`, ""] : []),
    ...(a.button ? [`${a.button.text}: ${a.button.href}`, ""] : []),
    ...(a.ps ? [`P.S. ${a.ps}`, ""] : []),
    ...marketingTextFooter(opts.unsubscribeUrl),
  ].join("\n");

  return { subject, html, text };
}
