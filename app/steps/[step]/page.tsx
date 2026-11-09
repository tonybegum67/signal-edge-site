import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Nav } from "../../components/Nav";
import { LessonBody } from "../../components/LessonBody";
import { LessonChecklist } from "../../components/LessonChecklist";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plan";
import { getLesson, stepSummaries } from "@/lib/lessons";

// Always check the session on each visit.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ step: string }> };

function parseStep(raw: string) {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 && n <= stepSummaries.length ? n : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = parseStep((await params).step);
  const s = n ? stepSummaries[n - 1] : null;
  return { title: s ? `Step ${s.step}: ${s.title}` : "Signal-Edge Steps" };
}

export default async function LessonPage({ params }: Props) {
  const n = parseStep((await params).step);
  if (!n) notFound();

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!supabase || !user) redirect(`/sign-in?next=${encodeURIComponent(`/steps/${n}`)}`);

  const summary = stepSummaries[n - 1];
  const lesson = getLesson(n);
  const plan = await getPlan(supabase);
  const locked = !summary.free && plan.plan !== "pro";
  const next = stepSummaries[n];

  return (
    <>
      <Nav signedIn />
      <main className="band">
        <div className="in lesson-page">
          <p className="crumb">
            <Link href="/steps">My Steps</Link> / Step {n}
          </p>
          <div className="sec-head">
            <p className="eb">
              Step {n} · {summary.title}
              {lesson ? ` · about ${lesson.minutes} min` : ""}
            </p>
            <h1 className="h2">{lesson ? lesson.headline : summary.title}</h1>
            <p className="lede">{lesson ? lesson.intro : summary.body}</p>
          </div>

          {!lesson ? (
            <div className="panel">
              <h3>This lesson is on its way</h3>
              <p className="sub">
                We&apos;re writing Step {n} now. The prompts for it are already in your company space, if you have one.
              </p>
              <Link className="btn" href="/steps">
                Back to My Steps
              </Link>
            </div>
          ) : locked ? (
            <div className="panel">
              <h3>Step {n} is part of Pro</h3>
              <p className="sub">Got an access code from your workshop or company? Add it and every Step opens.</p>
              <Link className="btn p" href="/account">
                Add a code
              </Link>
            </div>
          ) : (
            <>
              <LessonBody parts={lesson.parts} />
              <LessonChecklist
                step={n}
                tasks={lesson.tasks}
                next={next ? `Step ${next.step} is next` : "You've done every Step"}
              />
              <div className="ctas">
                {next ? (
                  <Link className="btn p" href={`/steps/${next.step}`}>
                    Step {next.step}: {next.title} <span className="arr">→</span>
                  </Link>
                ) : null}
                <Link className="btn" href="/steps">
                  All Steps
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
