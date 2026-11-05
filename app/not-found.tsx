import Link from "next/link";

export default function NotFound() {
  return (
    <main className="in nf">
      <p className="eb">404 · No signal here</p>
      <h1 className="h2">That page wandered off.</h1>
      <p className="lede">The link may be old, or the page hasn&apos;t been built yet.</p>
      <div>
        <Link className="btn p" href="/">
          Back to the home page <span className="arr">→</span>
        </Link>
      </div>
    </main>
  );
}
