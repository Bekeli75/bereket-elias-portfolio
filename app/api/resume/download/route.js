import { fail, getClientIp, hashIp, ok } from "@/lib/api";
import { rateLimit } from "@/lib/ratelimit";

const ALLOWED_SOURCES = new Set(["hero", "nav", "contact", "resume_page"]);
const CV_PATH = "/cv/Bereket_Elias_CV.pdf";

export async function GET(request) {
  const ipKey = hashIp(getClientIp(request));
  const limit = rateLimit({
    key: `resume:ip:${ipKey}`,
    limit: 60,
    windowMs: 60 * 60 * 1000,
  });
  if (!limit.ok) {
    return fail("RATE_LIMITED", "Too many download requests.", {
      status: 429,
      headers: { "Retry-After": String(limit.retryAfter) },
    });
  }

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");
  const safeSource =
    source && ALLOWED_SOURCES.has(source) ? source : "unknown";

  // Privacy-friendly server-side event: no personal data stored.
  console.log(`[analytics] resume_download source=${safeSource}`);

  return Response.redirect(new URL(CV_PATH, request.url), 302);
}
