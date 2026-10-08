import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/resume/download/route";

let logSpy;

beforeEach(() => {
  logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  logSpy.mockRestore();
});

describe("GET /api/resume/download", () => {
  const get = (query = "", ip = "203.0.113.10") =>
    GET(
      new Request(`http://localhost/api/resume/download${query}`, {
        headers: { "X-Forwarded-For": ip },
      }),
    );

  it("redirects to the CV and logs the source", async () => {
    const res = await get("?source=hero");
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toMatch(/\/cv\/Bereket_Elias_CV\.pdf$/);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("[analytics] resume_download source=hero"),
    );
  });

  it("falls back to 'unknown' source when not allowlisted", async () => {
    await get("?source=mailto");
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("[analytics] resume_download source=unknown"),
    );

    await get("");
    expect(logSpy).toHaveBeenCalledTimes(2);
  });
});