import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy note" };

const contact = "tony@signal-edge.ai";

export default function PrivacyPage() {
  return (
    <LegalPage label="Signal-Edge AI" title="Privacy note" updated="November 6, 2026">
      <p className="lede">
        The short version: we ask for as little as we can, we use it to help you, and we never sell it.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Your email,</strong> when you sign in to Signal-Edge Steps or join {site.newsletterName}.
        </li>
        <li>
          <strong>Your session prep answers,</strong> if you fill in that form: name, email, company, role, the AI
          tools you use, your laptop and your biggest time sink.
        </li>
        <li>
          <strong>Your progress</strong> through Signal-Edge Steps once you&apos;re signed in.
        </li>
        <li>
          <strong>Basic technical details</strong> our hosting keeps to run the site safely, like when a page was
          loaded.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To sign you in and keep your place in the lessons.</li>
        <li>To tailor a workshop or session to the tools you already use.</li>
        <li>
          To send {site.newsletterName}, only if you asked for it. Every issue has a way to unsubscribe.
        </li>
        <li>To reply when you get in touch.</li>
      </ul>

      <h2>Who else handles it</h2>
      <p>
        We use a few trusted services to run the site: Supabase for sign-in and storing your details, Google Cloud
        for hosting and Google Workspace for email. When paid plans open, Stripe will handle payments, and we
        won&apos;t see your full card number. These services only use your details to provide their service to us.
      </p>
      <p>We don&apos;t sell your information, and we don&apos;t share it for anyone else&apos;s advertising.</p>

      <h2>Cookies</h2>
      <p>
        We use a small sign-in cookie so you stay signed in. We don&apos;t use advertising cookies.
      </p>

      <h2>Your choices</h2>
      <p>
        You can unsubscribe from {site.newsletterName} at any time. You can also ask us to show you, correct or
        delete what we hold about you. Just email <a href={`mailto:${contact}`}>{contact}</a>.
      </p>

      <h2>Keeping it safe</h2>
      <p>
        Your details are stored with access limited to the people who run Signal-Edge AI. No system is perfect,
        but we take care to keep what you share safe.
      </p>

      <h2>Changes</h2>
      <p>
        If we change this note, we&apos;ll update the date at the top. For a big change, we&apos;ll tell you by email
        first.
      </p>
    </LegalPage>
  );
}
