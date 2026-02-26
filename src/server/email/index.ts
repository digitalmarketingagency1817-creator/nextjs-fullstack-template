import "server-only";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailParams) {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "noreply@yourdomain.com",
    to,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email");
  }
}
