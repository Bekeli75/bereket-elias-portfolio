// Email delivery via the Resend REST API (no SDK dependency).
// Without RESEND_API_KEY the message is logged to the server console so the
// contact flow still works end-to-end in development.

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function contactTemplate({ name, email, subject, message }) {
  return {
    subject: `[Portfolio] ${subject} — from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Sent: ${new Date().toISOString()} (UTC)`,
      "",
      message,
    ].join("\n"),
  };
}

export async function sendContactEmail(input) {
  const { subject, text } = contactTemplate(input);

  if (!emailConfigured()) {
    console.log(
      [
        "── [contact] RESEND_API_KEY not set — message logged, not delivered ──",
        `Subject: ${subject}`,
        `Reply-To: ${input.email}`,
        text,
        "──────────────────────────────────────────────────────────────────",
      ].join("\n"),
    );
    return { delivered: false };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL],
      reply_to: input.email,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend responded ${res.status}: ${body.slice(0, 200)}`);
  }

  return { delivered: true };
}
