import { escapeHtml, renderEmail } from "./layout";

// The note Tony gets each time someone sends the session prep form.
// It only ever goes to the site's own mailbox, never to the person who filled out the form.

export type PrepAnswers = {
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  aiTool: string | null;
  laptop: string | null;
  filesLocation: string | null;
  crm: string | null;
  aiComfort: number | null;
  timeSink: string | null;
  remember: string | null;
  newsletterOptIn: boolean;
};

const AI: Record<string, string> = { claude: "Claude, paid", chatgpt: "ChatGPT, paid", free: "A free plan", none: "None yet" };
const LAPTOP: Record<string, string> = { mac: "Mac", win: "Windows", unsure: "Not sure" };
const FILES: Record<string, string> = {
  google: "Google Drive",
  dropbox: "Dropbox",
  onedrive: "OneDrive",
  computer: "On my computer",
  mix: "A mix, or not sure",
};

// One line, no control characters, so a visitor can't bend the subject line.
function oneLine(value: string, max: number) {
  return value.replace(/[\s\p{Cc}]+/gu, " ").trim().slice(0, max);
}

// Where Tony sees every answer: the prep_responses table in Supabase.
function tableLink() {
  const ref = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").match(/^https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
  return ref ? `https://supabase.com/dashboard/project/${ref}/editor` : "https://supabase.com/dashboard";
}

export function prepNoticeEmail(a: PrepAnswers) {
  const who = oneLine(a.name, 60);
  const company = a.company ? oneLine(a.company, 60) : "";
  const subject = `New prep form: ${who}${company ? `, ${company}` : ""}`;

  const rows: [string, string][] = [
    ["Name", who],
    ["Email", a.email],
    ["Company", a.company ?? "-"],
    ["Role", a.role ?? "-"],
    ["AI today", a.aiTool ? AI[a.aiTool] ?? a.aiTool : "-"],
    ["Laptop", a.laptop ? LAPTOP[a.laptop] ?? a.laptop : "-"],
    ["Work files", a.filesLocation ? FILES[a.filesLocation] ?? a.filesLocation : "-"],
    ["CRM", a.crm ?? "-"],
    ["AI comfort", a.aiComfort ? `${a.aiComfort} of 5` : "-"],
    ["Time sinks", a.timeSink ?? "-"],
    ["Remember", a.remember ?? "-"],
    ["Clear Signal", a.newsletterOptIn ? "Yes, opted in" : "No"],
  ];

  const html = renderEmail({
    preheader: escapeHtml(`${who}${company ? ` from ${company}` : ""} sent the prep form`),
    label: "New sign-up",
    heading: escapeHtml(`${who} sent the prep form`),
    paragraphs: rows.map(([k, v]) => `<strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}`),
    button: { text: "See all answers", href: tableLink() },
    note: "Reply to this email to write back to them. Every answer is also saved in Supabase, in prep_responses.",
  });

  const text = [
    `${who} sent the prep form`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    `See all answers: ${tableLink()}`,
    "",
    "Reply to this email to write back to them.",
  ].join("\n");

  return { subject, html, text };
}
