import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = { title: "Terms" };

const contact = "tony@signal-edge.ai";

export default function TermsPage() {
  return (
    <LegalPage label="Signal-Edge AI" title="Terms" updated="November 6, 2026">
      <p className="lede">
        These terms cover using the Signal-Edge AI site and Signal-Edge Steps. By using them, you agree to what&apos;s
        below. We kept it short and plain.
      </p>

      <h2>Your account</h2>
      <p>
        You sign in with your email. Keep access to that inbox to yourself, and use your own account rather than
        sharing one. If you&apos;re signing up for a team, make sure you&apos;re allowed to.
      </p>

      <h2>The lessons</h2>
      <p>
        Signal-Edge Steps teaches practical ways to use AI at work. It&apos;s general education, not legal, tax,
        financial or other professional advice. AI tools can get things wrong, so check what they give you before
        you rely on it, especially anything you send to clients.
      </p>

      <h2>Using it fairly</h2>
      <ul>
        <li>Don&apos;t copy, resell or republish the lessons without our okay.</li>
        <li>Don&apos;t try to break, overload or get around the site&apos;s security.</li>
        <li>Don&apos;t use the site for anything unlawful or to harm others.</li>
      </ul>

      <h2>Plans and payments</h2>
      <p>
        Step 1 and the newsletter are free. When paid plans open, their price, billing and how to cancel will be shown before
        you pay, and those details become part of these terms.
      </p>

      <h2>What&apos;s ours and what&apos;s yours</h2>
      <p>
        The lessons, site and brand belong to Signal-Edge AI. What you write or upload stays yours. Your details are
        handled as our <Link href="/privacy">privacy note</Link> explains.
      </p>

      <h2>No guarantees</h2>
      <p>
        We work hard to keep the site useful and running, but it&apos;s offered as is. We can&apos;t promise it will
        always be available or error-free, or that you&apos;ll see a particular result. To the extent the law allows,
        we aren&apos;t responsible for indirect losses from using the site.
      </p>

      <h2>Ending things</h2>
      <p>
        You can stop using the site at any time and ask us to delete your account. We may suspend an account that
        breaks these terms.
      </p>

      <h2>Changes</h2>
      <p>
        If we change these terms, we&apos;ll update the date at the top. For a big change, we&apos;ll tell you by
        email first.
      </p>

      <h2>Questions</h2>
      <p>
        Email <a href={`mailto:${contact}`}>{contact}</a>.
      </p>
    </LegalPage>
  );
}
