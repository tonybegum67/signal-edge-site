import nodemailer from "nodemailer";

// The site sends its own emails through the signal-edge.ai Gmail account.
// Both values come from Cloud Run: SMTP_USER from a GitHub variable, SMTP_PASSWORD from Secret Manager.
// Until both are set, nothing is sent.
const user = process.env.SMTP_USER ?? "";
const pass = process.env.SMTP_PASSWORD ?? "";
export const mailConfigured = Boolean(user && pass);
// The site's own mailbox (tony@signal-edge.ai). Sign-up notices go here.
export const ownerAddress = user;

export type MailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

function transport(pool: boolean) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 10_000,
    socketTimeout: 15_000,
    ...(pool ? { pool: true, maxConnections: 1 } : {}),
  });
}

const from = (name: string) => ({ name, address: user });

export async function sendMail(msg: MailMessage) {
  if (!mailConfigured) return false;
  await transport(false).sendMail({ from: from("Signal-Edge AI"), replyTo: user, ...msg });
  return true;
}

// For sending many emails in one go (Clear Signal): one connection, reused, closed at the end.
export function openMailer(fromName: string) {
  if (!mailConfigured) return null;
  const t = transport(true);
  return {
    send: (msg: MailMessage) => t.sendMail({ from: from(fromName), replyTo: user, ...msg }),
    close: () => t.close(),
  };
}
