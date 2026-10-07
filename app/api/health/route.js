import { ok } from "@/lib/api";

export function GET() {
  return ok(
    {
      status: "healthy",
      version: "1.0.0",
      time: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
