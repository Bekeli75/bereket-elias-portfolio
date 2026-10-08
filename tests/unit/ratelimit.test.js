import { afterEach, describe, expect, it, vi } from "vitest";
import { rateLimit } from "@/lib/ratelimit";

let n = 0;
const uniqueKey = () => `test:key:${++n}`;

afterEach(() => {
  vi.useRealTimers();
});

describe("rateLimit", () => {
  it("allows up to the limit and reports remaining", () => {
    const key = uniqueKey();
    expect(rateLimit({ key, limit: 3, windowMs: 60_000 }).ok).toBe(true);
    const second = rateLimit({ key, limit: 3, windowMs: 60_000 });
    expect(second).toMatchObject({ ok: true, remaining: 1 });
    const third = rateLimit({ key, limit: 3, windowMs: 60_000 });
    expect(third).toMatchObject({ ok: true, remaining: 0 });
  });

  it("blocks the request over the limit with a positive Retry-After", () => {
    const key = uniqueKey();
    for (let i = 0; i < 2; i++) {
      expect(rateLimit({ key, limit: 2, windowMs: 60_000 }).ok).toBe(true);
    }
    const blocked = rateLimit({ key, limit: 2, windowMs: 60_000 });
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(60);
    expect(blocked.remaining).toBe(0);
  });

  it("Retry-After reflects the time until the oldest hit expires", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const key = uniqueKey();
    rateLimit({ key, limit: 1, windowMs: 60_000 });
    vi.setSystemTime(new Date("2026-01-01T00:00:30Z"));
    const blocked = rateLimit({ key, limit: 1, windowMs: 60_000 });
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBe(30);
  });

  it("allows requests again once the window slides past", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const key = uniqueKey();
    expect(rateLimit({ key, limit: 1, windowMs: 60_000 }).ok).toBe(true);
    expect(rateLimit({ key, limit: 1, windowMs: 60_000 }).ok).toBe(false);
    vi.setSystemTime(new Date("2026-01-01T00:01:01Z"));
    expect(rateLimit({ key, limit: 1, windowMs: 60_000 }).ok).toBe(true);
  });

  it("tracks keys independently", () => {
    const a = uniqueKey();
    const b = uniqueKey();
    expect(rateLimit({ key: a, limit: 1, windowMs: 60_000 }).ok).toBe(true);
    expect(rateLimit({ key: a, limit: 1, windowMs: 60_000 }).ok).toBe(false);
    expect(rateLimit({ key: b, limit: 1, windowMs: 60_000 }).ok).toBe(true);
  });
});
