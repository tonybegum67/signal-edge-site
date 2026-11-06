import Link from "next/link";
import { Nav } from "./Nav";

// Shared shell for the privacy note and terms.
export function LegalPage({
  label,
  title,
  updated,
  children,
}: {
  label: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="band">
        <div className="in legal">
          <p className="eb">{label}</p>
          <h1 className="h2" style={{ marginTop: 12 }}>
            {title}
          </h1>
          <p className="updated">Last updated {updated}</p>
          {children}
          <p className="back">
            <Link href="/">Back to the home page</Link>
          </p>
        </div>
      </main>
    </>
  );
}
