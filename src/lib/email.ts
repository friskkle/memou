import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, text, html }: { to: string, subject: string, text: string, html?: string }) {
  // Check if Resend API key is provided
  if (!process.env.RESEND_API_KEY) {
    console.log("========================================");
    console.log("EMAIL SIMULATION (RESEND_API_KEY not set)");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Text:", text);
    console.log("========================================");
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Memou App <onboarding@resend.dev>',
      to,
      subject,
      text,
      html: html || text, // Resend often prefers having HTML, or at least one of them.
    });

    if (error) {
      console.error("Resend API Error:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    throw error;
  }
}
