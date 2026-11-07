import nodemailer from "nodemailer";

// The site sends its own emails through the signal-edge.ai Gmail account.
// Both values come from Cloud Run: SMTP_USER from a GitHub variable, SMTP_PASSWORD from Secret Manager.
// Until both are set, nothing is sent.
const user = process.env.SMTP_USER ?? "";
const pass = process.env.SMTP_PASSWORD ?? "";
export const mailConfigured = Boolean(user && pass);

export async function sendMail(msg: { to: string; subject: string; html: string; text: string }) {
  if (!mailConfigured) return false;
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 10_000,
    socketTimeout: 15_000,
  });
  await transport.sendMail({ from: { name: "Signal-Edge AI", address: user }, replyTo: user, ...msg });
  return true;
}
