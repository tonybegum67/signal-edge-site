import { site } from "@/lib/site";
import { escapeHtml, renderEmail } from "./layout";

// The thank-you email sent once to each address that sends the session prep form.
// Only a plain first name goes into the email, so nobody can use the form to send links or odd text.
const NAME = /^[\p{L}'’-]{1,30}$/u;

export function prepThanksEmail(firstName: string) {
  const session = site.prepSession;
  const signIn = `${site.url}/sign-in`;

  const subject = "You're set for your AI session";
  const heading = NAME.test(firstName) ? `Thanks, ${firstName}. You're all set` : "Thanks. You're all set";
  const lines = [
    "Thanks for filling out the prep form. Your answers help me shape the session around how you actually work.",
    "Before the day, sign in to Signal-Edge Steps so you're ready to go. It takes a minute and there's no password. Bring your laptop and we'll set the rest up together.",
  ];
  const note = "Questions before the session? Just reply to this email.";

  const html = renderEmail({
    preheader: escapeHtml(session ? session.when : lines[0]),
    label: "Session prep",
    heading: escapeHtml(heading),
    paragraphs: lines.map(escapeHtml),
    highlight: session ? { label: "Your session", value: escapeHtml(session.when) } : undefined,
    button: { text: "Sign in to Signal-Edge", href: signIn },
    note: escapeHtml(note),
  });

  const text = [
    heading,
    "",
    lines[0],
    "",
    ...(session ? [`Your session: ${session.when}`, ""] : []),
    lines[1],
    "",
    `Sign in: ${signIn}`,
    "",
    note,
    "",
    "Signal-Edge AI · Real AI results with your data",
  ].join("\n");

  return { subject, html, text };
}
