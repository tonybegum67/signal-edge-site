import fs from "node:fs";
import path from "node:path";
import type { Audience } from "@/lib/clear-signal-emails";

// One-off marketing emails to the list, like a workshop or a new offer: one JSON file each in
// content/announcements, named by a short slug (workshop-dec.json). They go out in the same branded
// design and through the same automatic send as Clear Signal issues.
// docs/announcements.md has the format and how sending works.

export type Announcement = {
  slug: string;
  audience: Audience;
  subject: string;
  preheader: string; // the grey line inboxes show after the subject
  label: string; // the small amber word above the heading, like "Workshop"
  heading: string;
  paragraphs: string[];
  highlight?: { label: string; value: string }; // one fact to stand out, like the date
  button?: { text: string; href: string };
  ps?: string;
};

const DIR = path.join(process.cwd(), "content", "announcements");
// Short enough that the send record's key ("a-<slug>-test-<version>") stays within 60 characters.
const FILE = /^([a-z0-9][a-z0-9-]{2,39})\.json$/;

function parse(file: string, slug: string, raw: unknown): Announcement {
  const where = `content/announcements/${file}`;
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

  const o = obj(raw, "file");
  const audience = o.audience;
  if (audience !== "test" && audience !== "everyone") fail(`"audience" must be "test" or "everyone"`);

  const paragraphs = o.paragraphs;
  if (!Array.isArray(paragraphs) || paragraphs.length < 1 || paragraphs.length > 6)
    fail(`"paragraphs" must be a list of 1 to 6 items`);
  const ps = (paragraphs as unknown[]).map((p, i) => {
    if (typeof p !== "string" || !p.trim()) fail(`"paragraphs[${i}]" must be a non-empty string`);
    return (p as string).trim();
  });

  let highlight: Announcement["highlight"];
  if (o.highlight !== undefined) {
    const h = obj(o.highlight, "highlight");
    highlight = { label: text(h, "label", "highlight.label"), value: text(h, "value", "highlight.value") };
  }

  let button: Announcement["button"];
  if (o.button !== undefined) {
    const b = obj(o.button, "button");
    const href = text(b, "href", "button.href");
    if (!/^https:\/\/[^\s"'<>]+$/.test(href)) fail(`"button.href" must be a full https:// address`);
    button = { text: text(b, "text", "button.text"), href };
  }

  return {
    slug,
    audience: audience as Audience,
    subject: text(o, "subject"),
    preheader: text(o, "preheader"),
    label: text(o, "label"),
    heading: text(o, "heading"),
    paragraphs: ps,
    highlight,
    button,
    ps: o.ps === undefined ? undefined : text(o, "ps"),
  };
}

export function getAnnouncements(): Announcement[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const match = FILE.exec(f);
      if (!match) throw new Error(`content/announcements/${f}: name it with 3 to 40 lowercase letters, digits and dashes`);
      return parse(f, match[1], JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")));
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}
