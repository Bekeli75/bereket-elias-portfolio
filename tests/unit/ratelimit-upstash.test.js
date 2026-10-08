import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Env vars are resolved lazily on first rateLimit() call, so stubbing them
// in beforeEach is enough — no import ordering tricks required.
vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");

const { rateLimit } = await import("@/lib/ratelimit");

describe("rateLimit with Upstash configured", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("falls back to the in-memory limiter when Upstash is unreachable", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("connect ECONNREFUSED")),
    );

    const key = "test:upstash:down";
    const first = await rateLimit({ key, limit: 1, windowMs: 60_000 });
    expect(first.ok).toBe(true);
    expect(first.remaining).toBe(0);

    const blocked = await rateLimit({ key, limit: 1, windowMs: 60_000 });
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("[ratelimit] Upstash unavailable"),
      expect.anything(),
    );
  });
});
