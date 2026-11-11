import fs from "node:fs";
import path from "node:path";
import { stepSummaries } from "@/lib/lessons";

// One JSON file per issue in content/clear-signal, named by its number (001.json).
// Adding a file and merging it publishes that issue's page. docs/clear-signal-issues.md has the format.
export type Issue = {
  number: string; // three digits, matches the file name and the address: /clear-signal/001
  date: string; // as shown on the page, like "November 2026"
  title: string; // the Prompt of the week's name
  intro: string;
  prompt: string;
  promptNote: string; // what they'll get back
  homework: string;
  step: number; // the Signal-Edge Steps lesson the issue points to
};

const DIR = path.join(process.cwd(), "content", "clear-signal");
const NUMBER = /^\d{3}$/;

// Checks a file so a bad issue fails the build instead of shipping a broken page.
function parseIssue(file: string, raw: unknown): Issue {
  const fail = (why: string): never => {
    throw new Error(`content/clear-signal/${file}: ${why}`);
  };
  if (!raw || typeof raw !== "object") fail("not a JSON object");
  const o = raw as Record<string, unknown>;
  const text = (key: string) => {
    const v = o[key];
    if (typeof v !== "string" || !v.trim()) fail(`"${key}" must be a non-empty string`);
    return (v as string).trim();
  };
  const number = text("number");
  if (!NUMBER.test(number) || `${number}.json` !== file) fail(`"number" must be three digits and match the file name`);
  const step = o.step;
  if (!stepSummaries.some((s) => s.step === step)) fail(`"step" must be 1 to ${stepSummaries.length}`);
  return {
    number,
    date: text("date"),
    title: text("title"),
    intro: text("intro"),
    prompt: text("prompt"),
    promptNote: text("promptNote"),
    homework: text("homework"),
    step: step as number,
  };
}

// Newest first.
export function getIssues(): Issue[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => /^\d{3}\.json$/.test(f))
    .map((f) => parseIssue(f, JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"))))
    .sort((a, b) => b.number.localeCompare(a.number));
}

export function getIssue(number: string) {
  return getIssues().find((i) => i.number === number) ?? null;
}

export function stepLabel(step: number) {
  return stepSummaries.find((s) => s.step === step)?.title ?? "";
}

