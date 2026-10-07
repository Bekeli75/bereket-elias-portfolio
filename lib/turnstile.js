// Cloudflare Turnstile verification — skipped entirely when no secret is
// configured, so local dev and keyless deploys keep working.

export function turnstileEnabled() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token, ip) {
  if (!turnstileEnabled()) return { ok: true, skipped: true };
  if (!token) return { ok: false, reason: "missing token" };

  try {
    const form = new FormData();
    form.append("secret", process.env.TURNSTILE_SECRET_KEY);
    form.append("response", token);
    if (ip) form.append("remoteip", ip);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: form },
    );
    const data = await res.json();
    return { ok: Boolean(data.success), reason: data["error-codes"]?.[0] };
  } catch {
    return { ok: false, reason: "verification unavailable" };
  }
}
