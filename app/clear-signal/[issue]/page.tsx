import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "../../components/Nav";
import { CopyPrompt } from "../../components/CopyPrompt";
import { getIssue, getIssues, stepLabel } from "@/lib/clear-signal-issues";
import { getIssueEmails } from "@/lib/clear-signal-emails";
import { site } from "@/lib/site";

type Props = { params: Promise<{ issue: string }> };

// Every issue page is built ahead of time; unknown numbers 404.
export const dynamicParams = false;
export function generateStaticParams() {
  // Also checks every issue's email file, so a broken one fails the build instead of the send.
  getIssueEmails();
  return getIssues().map((i) => ({ issue: i.number }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const issue = getIssue((await params).issue);
  return issue
    ? { title: `${site.newsletterName} ${issue.number}: ${issue.title}`, description: issue.intro }
    : { title: site.newsletterName };
}

export default async function IssuePage({ params }: Props) {
  const issue = getIssue((await params).issue);
  if (!issue) notFound();

  return (
    <>
      <Nav />
      <main className="band">
        <div className="in lesson-page issue-page">
          <p className="crumb">
            <Link href="/clear-signal">{site.newsletterName}</Link> / Issue {issue.number}
          </p>
          <div className="sec-head">
            <p className="eb">
              {site.newsletterName} {issue.number} · {issue.date} · Prompt of the week
            </p>
            <h1 className="h2">{issue.title}</h1>
            <p className="lede">{issue.intro}</p>
          </div>

          <CopyPrompt label="Prompt of the week" text={issue.prompt} />
          <p className="issue-note">{issue.promptNote}</p>

          <section className="panel issue-block">
            <p className="eb">Homework</p>
            <p>{issue.homework}</p>
          </section>

          <section className="panel issue-block">
            <p className="eb">Your next step</p>
            <h2 className="issue-h">
              Step {issue.step}: {stepLabel(issue.step)}
            </h2>
            <p>
              Signal-Edge Steps walks you through building your own AI second brain, one short lesson at a time.
              {issue.step === 1 ? " Step 1 is free." : ""}
            </p>
            <p>
              <Link className="btn p" href={`/steps/${issue.step}`}>
                Start Step {issue.step} <span className="arr">→</span>
              </Link>
            </p>
          </section>

          <p className="issue-note">
            Not on {site.newsletterName} yet? <Link href="/#newsletter">Get it free</Link>, twice a month.
          </p>
        </div>
      </main>
    </>
  );
}
