import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "../components/Nav";
import { getIssues } from "@/lib/clear-signal-issues";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.newsletterName} exercises`,
  description: `The Prompt of the week from every ${site.newsletterName} issue.`,
};

// Lists only issues whose file is merged, so an unsent issue never shows here.
export default function ClearSignalIndex() {
  const issues = getIssues();
  return (
    <>
      <Nav />
      <main className="band">
        <div className="in lesson-page">
          <div className="sec-head">
            <p className="eb">{site.newsletterName}</p>
            <h1 className="h2">Every Prompt of the week</h1>
            <p className="lede">
              Each issue comes with one exercise you can do in five minutes. Here they all are, newest first.
            </p>
          </div>
          <ul className="issue-list">
            {issues.map((i) => (
              <li key={i.number}>
                <Link href={`/clear-signal/${i.number}`}>
                  <span className="issue-num">{i.number}</span>
                  <span>{i.title}</span>
                  <span className="issue-date">{i.date}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="issue-note">
            Not on {site.newsletterName} yet? <Link href="/#newsletter">Get it free</Link>, twice a month.
          </p>
        </div>
      </main>
    </>
  );
}
