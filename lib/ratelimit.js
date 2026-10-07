// In-memory sliding-window rate limiter — the graceful fallback when Upstash
// is not configured (see MASTER_PLAN §6). Suitable for a single instance;
// swap for Upstash Ratelimit when deploying at scale.

const buckets = new Map();

function prune(now) {
  if (buckets.size < 1000) return;
  for (const [key, hits] of buckets) {
    buckets.set(
      key,
      hits.filter((time) => time > now),
    );
    if (buckets.get(key).length === 0) buckets.delete(key);
  }
}

export function rateLimit({ key, limit, windowMs }) {
  const now = Date.now();
  prune(now);

  const hits = (buckets.get(key) ?? []).filter((time) => time > now - windowMs);
  if (hits.length >= limit) {
    const retryAfter = Math.ceil((hits[0] + windowMs - now) / 1000);
    return { ok: false, retryAfter, remaining: 0 };
  }

  hits.push(now);
  buckets.set(key, hits);
  return {
    ok: true,
    remaining: Math.max(0, limit - hits.length),
    reset: Math.ceil((now + windowMs) / 1000),
  };
}
