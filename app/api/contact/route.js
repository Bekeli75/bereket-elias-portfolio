import { ContactInput } from "@/lib/schemas";
import { fail, getClientIp, hashIp, ok, requestId } from "@/lib/api";
import { sendContactEmail } from "@/lib/email";
import { rateLimit } from "@/lib/ratelimit";
import { turnstileEnabled, verifyTurnstile } from "@/lib/turnstile";

const MAX_BODY_BYTES = 10 * 1024;

export async function POST(request) {
  const id = requestId();

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return fail("UNSUPPORTED_MEDIA_TYPE", "Expected application/json.", {
      status: 415,
      id,
    });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return fail("PAYLOAD_TOO_LARGE", "Body exceeds 10 KB.", {
      status: 413,
      id,
    });
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail("VALIDATION_ERROR", "Body is not valid JSON.", {
      status: 400,
      id,
    });
  }

  // Honeypot first: silently accept bots without validating or sending.
  if (body.website) {
    return ok(
      {
        id: `msg_${id.slice(4, 20)}`,
        message: "Thanks! Your message was sent. I'll reply soon.",
      },
      { id },
    );
  }

  const parsed = ContactInput.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Please check the highlighted fields.", {
      status: 400,
      id,
      details: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
      headers: { "X-Request-Id": id },
    });
  }

  const input = parsed.data;
  const ip = getClientIp(request);
  const ipKey = hashIp(ip);

  // Contract: 5 requests / hour / IP, plus 20 / day globally.
  const perIp = rateLimit({
    key: `contact:ip:${ipKey}`,
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  const perDay = rateLimit({
    key: "contact:global:day",
    limit: 20,
    windowMs: 24 * 60 * 60 * 1000,
  });

  const limited = !perIp.ok ? perIp : !perDay.ok ? perDay : null;
  if (limited) {
    return fail("RATE_LIMITED", "Too many requests. Please try again later.", {
      status: 429,
      id,
      headers: {
        "Retry-After": String(limited.retryAfter),
        "X-RateLimit-Limit": "5",
        "X-RateLimit-Remaining": String(perIp.remaining ?? 0),
      },
    });
  }

  const tokenCheck = await verifyTurnstile(input.turnstileToken, ip);
  if (!tokenCheck.ok) {
    return fail("BOT_CHECK_FAILED", "Bot verification failed. Please try again.", {
      status: 403,
      id,
    });
  }

  try {
    const { delivered } = await sendContactEmail(input);
    return ok(
      {
        id: `msg_${id.slice(4, 20)}`,
        message: "Thanks! Your message was sent. I'll reply soon.",
        delivered,
      },
      { id },
    );
  } catch (error) {
    console.error("[contact] email delivery failed:", error);
    return fail(
      "EMAIL_DELIVERY_FAILED",
      "Couldn't deliver your message. Please email directly.",
      { status: 502, id },
    );
  }
}

export function GET() {
  return fail("METHOD_NOT_ALLOWED", "Use POST to send a message.", {
    status: 405,
    headers: { Allow: "POST" },
  });
}
