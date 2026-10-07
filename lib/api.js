import { createHash, randomBytes } from "node:crypto";

export function requestId() {
  return `req_${randomBytes(12).toString("hex")}`;
}

export const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

export function ok(data, init = {}) {
  const { headers = {}, status = 200, id = requestId() } = init;
  return Response.json(
    { ok: true, data },
    { status, headers: { ...JSON_HEADERS, "X-Request-Id": id, ...headers } },
  );
}

export function fail(code, message, init = {}) {
  const {
    status = 500,
    details,
    headers = {},
    id = requestId(),
  } = init;
  return Response.json(
    {
      ok: false,
      error: { code, message, details, requestId: id },
    },
    { status, headers: { ...JSON_HEADERS, "X-Request-Id": id, ...headers } },
  );
}

export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "127.0.0.1";
}

// Contract: the IP is hashed before being used as a rate-limit key.
export function hashIp(ip) {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export function projectToApi(project) {
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    category: project.category,
    tech: project.tech,
    cover: project.cover,
    featured: project.featured,
    status: project.status,
    links: { repo: project.links.repo || null, demo: project.links.demo || null },
    order: project.order,
  };
}
