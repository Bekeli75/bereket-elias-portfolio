import { describe, expect, it } from "vitest";
import { fail, getClientIp, hashIp, ok, projectToApi, requestId } from "@/lib/api";

describe("envelopes", () => {
  it("ok() wraps data with contract headers", async () => {
    const res = ok({ hello: "world" }, { id: "req_fixed" });
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("application/json");
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(res.headers.get("X-Request-Id")).toBe("req_fixed");
    const body = await res.json();
    expect(body).toEqual({ ok: true, data: { hello: "world" } });
  });

  it("fail() wraps error details and honors custom status", async () => {
    const res = fail("VALIDATION_ERROR", "Bad input", {
      status: 400,
      details: [{ field: "email", message: "nope" }],
      id: "req_x",
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Bad input",
      requestId: "req_x",
    });
    expect(body.error.details).toEqual([{ field: "email", message: "nope" }]);
  });

  it("omits details when not provided", async () => {
    const body = await fail("NOT_FOUND", "Missing").json();
    expect("details" in body.error).toBe(false);
  });

  it("generates request ids in the contract format", () => {
    expect(requestId()).toMatch(/^req_[0-9a-f]{24}$/);
  });
});

describe("getClientIp", () => {
  const req = (headers) => new Request("http://localhost/api", { headers });

  it("takes the first x-forwarded-for entry, trimmed", () => {
    expect(getClientIp(req({ "x-forwarded-for": " 1.2.3.4 , 5.6.7.8 " }))).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip, then loopback", () => {
    expect(getClientIp(req({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
    expect(getClientIp(req({}))).toBe("127.0.0.1");
  });
});

describe("hashIp", () => {
  it("is deterministic, hex, and truncated to 32 chars", () => {
    expect(hashIp("1.2.3.4")).toBe(hashIp("1.2.3.4"));
    expect(hashIp("1.2.3.4")).toMatch(/^[0-9a-f]{32}$/);
    expect(hashIp("1.2.3.4")).not.toBe(hashIp("1.2.3.5"));
  });
});

describe("projectToApi", () => {
  it("maps content projects and nulls empty links", () => {
    const api = projectToApi({
      slug: "demo",
      title: "Demo",
      summary: "Sum",
      category: "Web",
      tech: ["HTML5"],
      cover: null,
      featured: false,
      status: "planned",
      links: { repo: "", demo: "" },
      order: 1,
    });
    expect(api).toMatchObject({
      slug: "demo",
      category: "Web",
      status: "planned",
      links: { repo: null, demo: null },
    });
  });
});
