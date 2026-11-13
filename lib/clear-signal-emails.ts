import fs from "node:fs";
import path from "node:path";
import { getIssue, type Issue } from "@/lib/clear-signal-issues";

// The email side of each Clear Signal issue: one JSON file per issue in content/clear-signal/email,
// named by its number (001.json). The Prompt of the week and homework come from the issue page file
// (content/clear-signal/001.json), so the email and the page always match.
// docs/clear-signal-sending.md has the format and how sending works.

// "test" sends the issue only to the site's own mailbox. "everyone" sends it to every subscriber.
export type Audience = "test" | "everyone";

export type IssueEmail = {
  number: string;
  audience: Audience;
  subject: string;
  preheader: string; // the grey line inboxes show after the subject
  hello: string;
  oneThing: { title: string; points: { label: string; text: string }[] };
  field: { question: string; answer: string };
  quickHits: { title: string; text: string }[];
  ps: string;
  issue: Issue; // the matching page file
};

const DIR = path.join(process.cwd(), "content", "clear-signal", "email");
const FILE = /^\d{3}\.json$/;

function parse(file: string, raw: unknown): IssueEmail {
  const where = `content/clear-signal/email/${file}`;
  const fail = (why: string): never => {
    throw new Error(`${where}: ${why}`);
  };
  const obj = (v: unknown, name: string) => {
    if (!v || typeof v !== "object" || Array.isArray(v)) fail(`"${name}" must be an object`);
    return v as Record<string, unknown>;
  };
  const text = (o: Record<string, unknown>, key: string, name = key) => {
    const v = o[key];
    if (typeof v !== "string" || !v.trim()) fail(`"${name}" must be a non-empty string`);
    return (v as string).trim();
  };
  const list = (v: unknown, name: string, min: number, max: number) => {
    if (!Array.isArray(v) || v.length < min || v.length > max) fail(`"${name}" must be a list of ${min} to ${max} items`);
    return v as unknown[];
  };

  const o = obj(raw, "file");
  const number = text(o, "number");
  if (`${number}.json` !== file) fail(`"number" must match the file name`);
  const issue = getIssue(number);
  if (!issue) fail(`there is no content/clear-signal/${number}.json, so this issue has no page to link to`);
  const audience = o.audience;
  if (audience !== "test" && audience !== "everyone") fail(`"audience" must be "test" or "everyone"`);

  const one = obj(o.oneThing, "oneThing");
  const field = obj(o.field, "field");
  return {
    number,
    audience: audience as Audience,
    subject: text(o, "subject"),
    preheader: text(o, "preheader"),
    hello: text(o, "hello"),
    oneThing: {
      title: text(one, "title", "oneThing.title"),
      points: list(one.points, "oneThing.points", 1, 4).map((p, i) => {
        const po = obj(p, `oneThing.points[${i}]`);
        return { label: text(po, "label", `oneThing.points[${i}].label`), text: text(po, "text", `oneThing.points[${i}].text`) };
      }),
    },
    field: { question: text(field, "question", "field.question"), answer: text(field, "answer", "field.answer") },
    quickHits: list(o.quickHits, "quickHits", 1, 6).map((h, i) => {
      const ho = obj(h, `quickHits[${i}]`);
      return { title: text(ho, "title", `quickHits[${i}].title`), text: text(ho, "text", `quickHits[${i}].text`) };
    }),
    ps: text(o, "ps"),
    issue: issue as Issue,
  };
}

// Oldest first, so a backlog goes out in order.
export function getIssueEmails(): IssueEmail[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => FILE.test(f))
    .map((f) => parse(f, JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"))))
    .sort((a, b) => a.number.localeCompare(b.number));
}
