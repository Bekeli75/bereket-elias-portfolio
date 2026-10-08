import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/contact/route";

const validBody = (overrides = {}) => ({
  name: "Bereket Elias",
  email: "bereket@example.com",
  subject: "Hello",
  message: "This is a valid message body.",
  ...overrides,
});

const post = (body, { ip = "203.0.113.10", contentType = "application/json" } = {}) =>
  POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        ...(contentType ? { "Content-Type": contentType } : {}),
        "X-Forwarded-For": ip,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

let logSpy;
let errorSpy;

beforeEach(() => {
  logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  logSpy.mockRestore();
  errorSpy.mockRestore();
});

describe("GET", () => {
  it("returns 405 with Allow: POST", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    expect(res.headers.get("Allow")).toBe("POST");
    expect((await res.json()).error.code).toBe("METHOD_NOT_ALLOWED");
  });
});

describe("POST validation", () => {
  it("rejects non-JSON content types with 415", async () => {
    const res = await post(validBody(), { contentType: "text/plain" });
    expect(res.status).toBe(415);
    expect((await res.json()).error.code).toBe("UNSUPPORTED_MEDIA_TYPE");
  });

  it("rejects malformed JSON with 400", async () => {
    const res = await post("{not json");
    expect(res.status).toBe(400);
    expect((await res.json()).error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects bodies over 10 KB with 413", async () => {
    const res = await post(JSON.stringify(validBody({ message: "x".repeat(11 * 1024) })));
    expect(res.status).toBe(413);
    expect((await res.json()).error.code).toBe("PAYLOAD_TOO_LARGE");
  });

  it("returns per-field details for invalid input", async () => {
    const res = await post(validBody({ email: "nope", message: "short" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
    const fields = body.error.details.map((d) => d.field);
    expect(fields).toContain("email");
    expect(fields).toContain("message");
  });
});

describe("honeypot", () => {
  it("silently accepts bots without validating or sending", async () => {
    const res = await post(validBody({ website: "spam.example" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    const emailLogged = logSpy.mock.calls.some((args) =>
      String(args[0]).includes("[contact]"),
    );
    expect(emailLogged).toBe(false);
  });
});

describe("delivery (no RESEND_API_KEY configured)", () => {
  it("accepts valid input and logs instead of sending", async () => {
    const res = await post(validBody(), { ip: "203.0.113.20" });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data.delivered).toBe(false);
    const emailLogged = logSpy.mock.calls.some((args) =>
      String(args[0]).includes("[contact]"),
    );
    expect(emailLogged).toBe(true);
  });
});

describe("rate limiting", () => {
  it("answers the 6th request from one IP with 429 and Retry-After", async () => {
    const ip = "203.0.113.30";
    for (let i = 0; i < 5; i++) {
      const res = await post(validBody(), { ip });
      expect(res.status).toBe(200);
    }
    const blocked = await post(validBody(), { ip });
    expect(blocked.status).toBe(429);
    const body = await blocked.json();
    expect(body.error.code).toBe("RATE_LIMITED");
    expect(Number(blocked.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(blocked.headers.get("X-RateLimit-Limit")).toBe("5");
  });
});
