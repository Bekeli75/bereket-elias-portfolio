# API_CONTRACT.md
## Bereket Elias Portfolio — HTTP API Contract v1

| Field | Value |
|---|---|
| Base URL (prod) | `https://<your-domain>/api` |
| Base URL (local) | `http://localhost:3000/api` |
| Protocol | HTTPS, JSON (`application/json; charset=utf-8`) |
| Auth | None for public endpoints; admin endpoints (optional, v2) use bearer session |
| Versioning | Path-less in v1; breaking changes introduce `/api/v2` |
| Implementation | Next.js Route Handlers (`app/api/**/route.ts`) |

---

## 1. Conventions

### 1.1 Success envelope
```json
{ "ok": true, "data": { } }
```

### 1.2 Error envelope
```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable summary",
    "details": [{ "field": "email", "message": "Invalid email address" }],
    "requestId": "req_01HXYZ..."
  }
}
```

### 1.3 Error codes
| Code | HTTP | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Body failed schema validation |
| `BOT_CHECK_FAILED` | 403 | Turnstile failed or honeypot filled |
| `NOT_FOUND` | 404 | Resource does not exist |
| `METHOD_NOT_ALLOWED` | 405 | Wrong HTTP verb |
| `PAYLOAD_TOO_LARGE` | 413 | Body over 10 KB |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | Not `application/json` |
| `RATE_LIMITED` | 429 | Too many requests (see `Retry-After`) |
| `EMAIL_DELIVERY_FAILED` | 502 | Upstream email provider failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### 1.4 Standard headers
Response: `X-Request-Id`, `Cache-Control`, `Content-Type`. Rate-limited endpoints add `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`; a 429 adds `Retry-After` (seconds).

### 1.5 CORS
Same-origin only. No wildcard CORS. Preflight not required for first-party calls.

### 1.6 Security
Strict input validation (Zod), trimmed and length-limited strings, HTML stripped from message fields, no secrets in responses, IP is hashed before use as a rate-limit key.

---

## 2. Endpoints

### 2.1 `GET /api/health`
Liveness check for uptime monitors.

**200**
```json
{ "ok": true, "data": { "status": "healthy", "version": "1.0.0", "time": "2026-10-07T10:00:00Z" } }
```
Cache: `no-store`.

---

### 2.2 `POST /api/contact`
Submit a message to the owner.

**Rate limit:** 5 requests / hour / IP, plus 20 / day globally for abuse protection.

**Request body**
```json
{
  "name": "Hana Tesfaye",
  "email": "hana@example.com",
  "subject": "Internship opportunity",
  "message": "Hi Bereket, we'd like to talk about...",
  "turnstileToken": "0.abc...",
  "website": ""
}
```

| Field | Type | Rules |
|---|---|---|
| `name` | string | required, 2–80 chars |
| `email` | string | required, valid email, ≤ 254 chars |
| `subject` | string | optional, ≤ 120 chars, default "Portfolio inquiry" |
| `message` | string | required, 10–3000 chars |
| `turnstileToken` | string | required in production |
| `website` | string | **honeypot**, must be empty; any value is treated as bot and silently returns 200 without sending |

**Behavior**
1. Validate content type and size.
2. Check honeypot.
3. Verify Turnstile token server-side.
4. Apply rate limit.
5. Send email to `CONTACT_TO_EMAIL` with `reply-to` set to the sender.
6. (Optional) send auto-reply to sender.

**200 OK**
```json
{ "ok": true, "data": { "id": "msg_01HXYZ...", "message": "Thanks! Your message was sent. I'll reply soon." } }
```

**Errors:** 400 `VALIDATION_ERROR` · 403 `BOT_CHECK_FAILED` · 413 · 415 · 429 `RATE_LIMITED` · 502 `EMAIL_DELIVERY_FAILED` · 500

**Client fallback:** on 502/500, the UI shows "Couldn't send. Email me directly" with a `mailto:` link.

---

### 2.3 `GET /api/resume/download`
Records a download event and serves the CV.

**Query:** `source` (optional): `hero | nav | contact | resume_page`.

**Responses**
- `302 Found` → `Location: /cv/Bereket_Elias_CV.pdf` (default), or
- `200` streaming `application/pdf` with `Content-Disposition: attachment; filename="Bereket_Elias_CV.pdf"`.

Analytics event `resume_download` sent server-side with `source`. No personal data stored.
Rate limit: 60 / hour / IP.

---

### 2.4 `GET /api/projects`
List projects (derived from MDX frontmatter at build time).

**Query**
| Param | Type | Default | Notes |
|---|---|---|---|
| `category` | enum | all | `Software`, `Networking`, `Hardware`, `Academic`, `Web` |
| `featured` | boolean | — | filter featured only |
| `limit` | int | 20 | 1–50 |
| `cursor` | string | — | pagination cursor |

**200**
```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "slug": "digital-billboard-ams",
        "title": "Digital Billboard Advertising Management System",
        "summary": "Java application for managing advertising content on digital billboards.",
        "category": "Software",
        "tech": ["Java"],
        "cover": "/images/projects/billboard-cover.webp",
        "featured": true,
        "status": "completed",
        "links": { "repo": null, "demo": null },
        "order": 1
      }
    ],
    "nextCursor": null
  }
}
```
Cache: `public, s-maxage=3600, stale-while-revalidate=86400`.

---

### 2.5 `GET /api/projects/{slug}`
**200** — full project including `body` (rendered MDX as HTML string or MDX source), `gallery[]`, `highlights[]`, `learnings[]`.
**404** `NOT_FOUND` when the slug does not exist.

---

### 2.6 `GET /api/profile`
Public profile data for widgets, OG generation, and integrations.

**200**
```json
{
  "ok": true,
  "data": {
    "name": "Bereket Elias",
    "title": "Electrical & Computer Engineering Student",
    "location": "Addis Ababa, Ethiopia",
    "summary": "…",
    "availability": { "open": true, "label": "Open to internships · Class of 2027" },
    "socials": { "github": null, "linkedin": null, "telegram": null },
    "education": [{ "institution": "Addis Ababa Science and Technology University", "degree": "BSc Electrical and Computer Engineering", "start": 2022, "end": 2027, "status": "expected" }],
    "certifications": [
      { "title": "Cisco Certified Network Associate (CCNA)", "issuer": "Cisco", "url": null },
      { "title": "Programming Fundamentals Nanodegree", "issuer": "Udacity", "url": null },
      { "title": "Apprenticeship Certificate", "issuer": "MOHA Soft Drinks Industry", "url": null }
    ]
  }
}
```
Email and phone are **excluded** from this endpoint to limit scraping.

---

### 2.7 `GET /api/skills`
**200**
```json
{
  "ok": true,
  "data": {
    "categories": [
      { "name": "Networking", "items": [{ "name": "Cisco networking", "level": "working" }, { "name": "CCNA fundamentals", "level": "working" }] },
      { "name": "Programming", "items": [{ "name": "JavaScript", "level": "working" }, { "name": "Java", "level": "working" }, { "name": "C++", "level": "working" }, { "name": "HTML5 / CSS3", "level": "working" }] }
    ]
  }
}
```
`level` enum: `familiar | working | strong`. Values are owner-confirmed.

---

### 2.8 `POST /api/analytics/event` *(optional, only if not using a provider script)*
**Body**
```json
{ "name": "project_view", "props": { "slug": "digital-billboard-ams" } }
```
`name` enum: `project_view | resume_download | contact_open | contact_success | theme_toggle`.
**204 No Content.** No IPs, cookies, or fingerprinting stored. Rate limit: 120 / min / IP.

---

### 2.9 Admin endpoints *(v2, optional; require auth)*
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/admin/login` | Exchange credentials for a session cookie (httpOnly, Secure, SameSite=Strict) |
| GET | `/api/admin/messages` | Paginated contact messages |
| PATCH | `/api/admin/availability` | Toggle the availability badge |
| POST | `/api/admin/logout` | End session |

---

## 3. Shared Schemas (Zod, `lib/schemas.ts`)

```ts
import { z } from "zod";

export const ContactInput = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  subject: z.string().trim().max(120).optional().default("Portfolio inquiry"),
  message: z.string().trim().min(10).max(3000),
  turnstileToken: z.string().min(1),
  website: z.string().max(0).optional().default(""),
});
export type ContactInput = z.infer<typeof ContactInput>;

export const SkillLevel = z.enum(["familiar", "working", "strong"]);
export const ProjectCategory = z.enum(["Software", "Networking", "Hardware", "Academic", "Web"]);

export const ProjectSummary = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  category: ProjectCategory,
  tech: z.array(z.string()),
  cover: z.string().nullable(),
  featured: z.boolean(),
  status: z.enum(["completed", "in-progress", "planned"]),
  links: z.object({ repo: z.string().url().nullable(), demo: z.string().url().nullable() }),
  order: z.number().int(),
});
```

---

## 4. Contact Email Template (to owner)

```
Subject: [Portfolio] {{subject}} — from {{name}}
Reply-To: {{email}}

Name: {{name}}
Email: {{email}}
Sent: {{timestamp}} (UTC)

{{message}}
```

---

## 5. OpenAPI 3.1 (excerpt)

```yaml
openapi: 3.1.0
info: { title: Bereket Elias Portfolio API, version: 1.0.0 }
servers: [{ url: https://example.com/api }]
paths:
  /health:
    get:
      summary: Liveness check
      responses: { "200": { description: OK } }
  /contact:
    post:
      summary: Send a message to the owner
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: "#/components/schemas/ContactInput" }
      responses:
        "200": { description: Sent }
        "400": { description: Validation error }
        "403": { description: Bot check failed }
        "429": { description: Rate limited }
        "502": { description: Email delivery failed }
  /resume/download:
    get:
      parameters:
        - { name: source, in: query, schema: { type: string, enum: [hero, nav, contact, resume_page] } }
      responses: { "302": { description: Redirect to PDF } }
  /projects:
    get:
      parameters:
        - { name: category, in: query, schema: { type: string } }
        - { name: featured, in: query, schema: { type: boolean } }
      responses: { "200": { description: Project list } }
  /projects/{slug}:
    get:
      parameters: [{ name: slug, in: path, required: true, schema: { type: string } }]
      responses: { "200": { description: Project }, "404": { description: Not found } }
components:
  schemas:
    ContactInput:
      type: object
      required: [name, email, message, turnstileToken]
      properties:
        name: { type: string, minLength: 2, maxLength: 80 }
        email: { type: string, format: email }
        subject: { type: string, maxLength: 120 }
        message: { type: string, minLength: 10, maxLength: 3000 }
        turnstileToken: { type: string }
        website: { type: string, maxLength: 0 }
```

---

## 6. Contract Tests (must pass in CI)

1. `POST /api/contact` with valid body → 200, email provider mock called once.
2. Missing/short fields → 400 with per-field `details`.
3. Honeypot filled → 200 and email provider **not** called.
4. Invalid Turnstile → 403.
5. 6th request in an hour from the same IP → 429 with `Retry-After`.
6. `GET /api/resume/download` → 302 to the PDF.
7. `GET /api/projects/unknown` → 404 `NOT_FOUND`.
8. `GET /api/profile` never contains email or phone.
