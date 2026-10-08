// Rate limiting — Upstash Ratelimit when configured (serverless-safe, shared
// across instances), sliding-window in-memory fallback otherwise (MASTER_PLAN §6).
// Any Upstash failure falls back to the in-memory limiter so the API stays up.

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

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

function memoryRateLimit({ key, limit, windowMs }) {
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

let redisClient = null;
let redisResolved = false;
const limiters = new Map();

function getRedis() {
  if (redisResolved) return redisClient;
  redisResolved = true;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    // Fail fast: one retry, then rateLimit() falls back to memory so a
    // slow Upstash never stalls the contact request.
    redisClient = new Redis({ url, token, retry: { retries: 1 } });
  }
  return redisClient;
}

function getLimiter(limit, windowMs) {
  const id = `${limit}:${windowMs}`;
  if (!limiters.has(id)) {
    limiters.set(
      id,
      new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(limit, `${Math.round(windowMs / 1000)} s`),
        prefix: "portfolio:ratelimit",
      }),
    );
  }
  return limiters.get(id);
}

export async function rateLimit({ key, limit, windowMs }) {
  if (getRedis()) {
    try {
      const res = await getLimiter(limit, windowMs).limit(key);
      if (res.success) {
        return {
          ok: true,
          remaining: Math.max(0, res.remaining),
          reset: Math.ceil(res.reset / 1000),
        };
      }
      const retryAfter = Math.max(1, Math.ceil((res.reset - Date.now()) / 1000));
      return { ok: false, retryAfter, remaining: 0 };
    } catch (error) {
      console.error(
        "[ratelimit] Upstash unavailable, falling back to in-memory:",
        error?.message ?? error,
      );
    }
  }
  return memoryRateLimit({ key, limit, windowMs });
}
