# Bereket Elias — Portfolio

Personal portfolio site for Bereket Elias (Electrical & Computer Engineering student, AASTU): projects with case studies, skills, experience, certifications, and a contact form. Built with Next.js 15 (App Router), Tailwind CSS v4, and JavaScript (no TypeScript — deliberate project choice).

Planning documents at the repo root (`PRD.md`, `SRS.md`, `MASTER_PLAN.md`, `API_CONTRACT.md`) are the source of truth for requirements. This README covers how to run, configure, and maintain the implementation.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15.5 (App Router, Turbopack) |
| Language | JavaScript (ESM, `jsconfig.json` path alias `@/*`) |
| Styling | Tailwind CSS v4 + CSS variables in `app/globals.css` |
| Motion | `motion` v14 (`Reveal`, `Stagger`, `Magnetic`) |
| Icons | `lucide-react` + `simple-icons` (brand glyphs) |
| Validation | `zod` v4 (server), mirrored hand-rolled checks in the form (client) |
| CI | GitHub Actions (lint + Vitest + build + Playwright e2e) |

## Getting started

```bash
npm ci            # install
cp .env.example .env.local   # optional: every variable has a working default
npm run dev       # http://localhost:3000
```

Other scripts: `npm run build` (production build), `npm run start` (serve build), `npm run lint` (ESLint), `npm run test` (Vitest unit tests), `npm run test:e2e` (Playwright against a production build).

**The site runs with zero configuration.** Missing backend credentials degrade gracefully:

| Missing | Behavior |
|---|---|
| `RESEND_API_KEY` | Contact messages are logged to the server console instead of emailed |
| Turnstile keys | Challenge is skipped; honeypot + rate limit still apply |
| Upstash Redis | In-memory rate limiting (per server instance) |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | No analytics script is injected |

## Environment variables

Defined in `.env.example`:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap, JSON-LD |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Contact email delivery |
| `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Bot protection |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Distributed rate limiting |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | Plausible-compatible analytics |

## Project structure

```
app/                  # routes: home, case studies, 404, sitemap, robots, OG images
  api/                # health, contact, resume/download, projects, projects/[slug]
components/
  layout/             # Navbar, MobileMenu (lazy), Footer, ThemeToggle
  sections/           # Hero, About, Skills, Projects, Experience, Certifications, Contact
  ui/                 # Button, Badge, Card, Tag, Field, Timeline, Toast, BrandIcon...
  motion/             # Reveal, Stagger, Magnetic
  visuals/            # NetworkCanvas (pauses off-screen / reduced motion)
  providers/          # ThemeProvider (dark default, honors prefers-color-scheme)
content/              # ALL site copy — edit here, never inside components
lib/                  # schemas (zod), api envelopes, ratelimit, turnstile, email
public/cv/            # Bereket_Elias_CV.pdf (served via /api/resume/download)
```

## Editing content

Every editable fact lives in `content/*.js`. Placeholders that need the owner's input are marked `TODO(owner)` (social links, project repo/demo URLs, cover images, learnings text). Empty fields render clean empty states — social rows and links disappear rather than show broken icons.

Projects are plain JS objects in `content/projects.js` (see **Deviations** below). Each entry supports `slug`, `title`, `summary`, `category`, `tech`, `cover`, `featured`, `status`, `links`, `order`, and case-study body fields `problem` / `approach` / `result` / `learnings`. Case-study pages SSG from these values and omit empty sections.

## API

All responses follow `API_CONTRACT.md`: `{ ok: true, data }` / `{ ok: false, error: { code, message, details?, requestId } }`, with `X-Request-Id` on every response.

| Endpoint | Notes |
|---|---|
| `GET /api/health` | Liveness, `Cache-Control: no-store` |
| `POST /api/contact` | zod validation → honeypot (silent 200) → Turnstile → rate limit (5/hr/IP, 20/day, hashed IPs, `Retry-After`) → Resend or console log |
| `GET /api/resume/download?source=…` | Logs the download event, 302 → `/cv/Bereket_Elias_CV.pdf` (rate limited 60/hr/IP) |
| `GET /api/projects`, `GET /api/projects/[slug]` | JSON read API for the same project data |

Content types other than JSON get `415`; oversized bodies `413`; unknown fields are rejected with per-field `details`.

## SEO & security

- Metadata, canonical, Open Graph/Twitter cards, `Person` JSON-LD in `app/layout.jsx`
- `app/sitemap.js`, `app/robots.js` (disallows `/api/`), generated OG images (home + per case study)
- Branded 404 page (`app/not-found.jsx`)
- Security headers in `next.config.mjs`: CSP (allowing Cloudflare Turnstile), HSTS, `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`

## Performance

Budget from `MASTER_PLAN.md` §8: home JS ≤ 150 kB gzip.

| Measurement | Value |
|---|---|
| `next build` — home First Load JS | 183 kB (gzip) |
| Measured transfer, modern browsers | ~179 kB gzip (the 110 kB legacy `nomodule` polyfill is skipped) |
| Breakdown | Next runtime ~66 kB · React 19 ~58 kB · app + `motion` + icons ~56 kB |

**~29 kB over budget.** The largest reducible cost is `motion` (~25–30 kB); everything else is framework baseline. See "Recommended follow-ups" below.

## Deploy (Vercel)

1. Push to GitHub (already configured: `Bekeli75/bereket-elias-portfolio`).
2. Import the repo in Vercel — framework auto-detected as Next.js.
3. Add the environment variables from `.env.example` (Resend + Turnstile keys at minimum).
4. Set `NEXT_PUBLIC_SITE_URL` to the production domain, redeploy, then verify `/robots.txt`, `/sitemap.xml`, and an OG image.

## Deviations from `MASTER_PLAN.md`

1. **JavaScript, not TypeScript** — explicit project decision; all `.ts/.tsx` converted to `.js/.jsx`, typecheck step removed from CI.
2. **Projects as plain JS, not MDX** — `content/projects.js` instead of an MDX/contentlayer pipeline: zero extra dependencies, same authoring shape (frontmatter fields → object fields). Switching to MDX later is additive.
3. **Client validation is hand-rolled** — `zod` stays server-only to keep it out of the client bundle; the form mirrors `ContactInput` rules with identical messages (`lib/schemas.js` is the server source of truth).
4. **Not built (out of scope for this pass)**: blog, Command Palette, Topology viewer, axe/Lighthouse CI, Prettier/Husky/Commitlint.

## Testing

- **Unit (Vitest)** — `npm test`: zod schemas, in-memory + Upstash rate limiter, API envelope/IP hashing, contact route (validation, honeypot, delivery, 429 + `Retry-After`), resume download route.
- **E2E (Playwright)** — `npm run test:e2e`: desktop (1280px) + mobile (Pixel 7) projects; hero/nav/theme/404, mobile menu → `/resume`, contact validation + successful submit, CV download, resume page print/PDF controls. Skips desktop-only/mobile-only cases by viewport.

## Recommended follow-ups

1. **Close the 29 kB gap**: replace `motion` with CSS transitions + `IntersectionObserver` (largest win), or accept the framework baseline and re-baseline the budget to 180 kB.
2. **Fill `TODO(owner)` content**: social URLs, project repo/demo links, cover images, learnings text — verified facts only.
3. **Wire real keys at launch** (env vars already supported): `RESEND_API_KEY`, Turnstile keys, Upstash Redis URL+token — otherwise tests/site degrade gracefully (console log, skipped challenge, in-memory limiter).
4. **Verify real-device rendering** (the plan calls out low-end Android) and add axe + Lighthouse CI with budgets in PRs.
