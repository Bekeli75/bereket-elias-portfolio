# MASTER_PLAN.md
## Bereket Elias Portfolio — Build Blueprint

> Single source of truth for building the site. Read with `SRS.md`, `PRD.md`, `API_CONTRACT.md`.
> If you are an AI coding agent: follow this file top to bottom, do not invent content, and use only facts from `/content`.

---

## 1. Tech Stack (Decided)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | SSG/ISR, route handlers for the API, great SEO |
| Language | **TypeScript (strict)** | Safety, maintainability |
| Styling | **Tailwind CSS v4** + CSS variables for tokens | Fast, consistent, theme-friendly |
| UI primitives | **Radix UI** (headless) + custom components | Accessible modals, menus, tooltips |
| Motion | **Framer Motion** (`motion`) | Scroll reveals, layout animation |
| Hero visual | **Canvas 2D** (custom node-graph), optional `three` later | Light, themed to networking |
| Content | **MDX** (projects, blog) + **typed TS/JSON** (profile, skills, etc.) | Easy edits, no CMS needed |
| Forms | **React Hook Form + Zod** | Shared validation client/server |
| Email | **Resend** | Simple transactional email |
| Bot protection | **Cloudflare Turnstile** + honeypot | Free, privacy-friendly |
| Rate limiting | **Upstash Ratelimit** (fallback: in-memory) | Serverless-safe |
| Analytics | **Plausible** or **Umami** (or Vercel Analytics) | No cookie banner |
| Icons | **lucide-react** + simple-icons for brands | Consistent set |
| Fonts | **Geist / Space Grotesk + Inter + JetBrains Mono** via `next/font` | Self-hosted, no layout shift |
| Testing | **Vitest**, **Playwright**, **axe-core**, **Lighthouse CI** | Unit, E2E, a11y, perf |
| Quality | ESLint, Prettier, Husky + lint-staged, Commitlint | Clean history |
| Hosting | **Vercel** (or Cloudflare Pages) | Free tier, edge CDN |
| CI/CD | **GitHub Actions** | Lint, test, LHCI on PR |

---

## 2. Repository Structure

```
portfolio/
├─ app/
│  ├─ layout.tsx                # fonts, theme provider, analytics, JSON-LD
│  ├─ page.tsx                  # home: composes all sections
│  ├─ projects/[slug]/page.tsx  # case study (MDX)
│  ├─ resume/page.tsx           # print-friendly resume
│  ├─ blog/                     # optional
│  ├─ not-found.tsx
│  ├─ sitemap.ts  robots.ts  opengraph-image.tsx
│  └─ api/
│     ├─ contact/route.ts
│     ├─ resume/download/route.ts
│     ├─ health/route.ts
│     └─ projects/route.ts      # optional read API
├─ components/
│  ├─ layout/    (Navbar, MobileMenu, Footer, ThemeToggle, CommandPalette)
│  ├─ sections/  (Hero, About, Skills, Projects, Experience, Certifications, Contact)
│  ├─ ui/        (Button, Badge, Card, Tag, Timeline, Modal, Toast, Input, Textarea)
│  ├─ visuals/   (NetworkCanvas, GridBackdrop, GlowBlob, TopologyViewer)
│  └─ motion/    (Reveal, Stagger, Magnetic)
├─ content/
│  ├─ profile.ts  skills.ts  experience.ts  education.ts  certifications.ts
│  └─ projects/*.mdx            # one file per project
├─ lib/
│  ├─ schemas.ts (Zod)  email.ts  ratelimit.ts  turnstile.ts  seo.ts  analytics.ts  utils.ts
├─ public/
│  ├─ cv/Bereket_Elias_CV.pdf   images/  topologies/
├─ styles/globals.css           # tokens, base, utilities
├─ tests/ (unit, e2e, a11y)
├─ .github/workflows/ci.yml
├─ .env.example
└─ README.md
```

---

## 3. Content Source of Truth (`/content`)

Seed values come **only** from the CV.

```ts
// content/profile.ts
export const profile = {
  name: "Bereket Elias",
  title: "Electrical & Computer Engineering Student",
  specialization: "Computer Engineering",
  location: "Addis Ababa, Ethiopia",
  email: "bereket.elias@aastustudent.edu.et",   // confirm public email with owner
  summary:
    "4th-year Electrical and Computer Engineering student at AASTU with a strong interest in ICT, computer networks, and IoT. Practical experience in network design and simulation with Cisco Packet Tracer. CCNA certified.",
  availability: { open: true, label: "Open to internships · Class of 2027" },
  socials: { github: "", linkedin: "", telegram: "" },   // TODO owner
};
```

Skills (levels are **owner-confirmed labels**, not percentages): Networking (Cisco, CCNA, design and simulation, troubleshooting) · Programming (HTML5, CSS3, JavaScript, Java, C++) · Foundations (data structures — basic, algorithms — problem solving, computer systems) · Hardware (circuit design) · Tools (MATLAB, Packet Tracer, Proteus, Multisim, VS Code, MS Office).

Experience: MOHA Soft Drinks Industry S.C, Apprentice, Aug 2025 – Sep 2025.
Education: AASTU, BSc ECE, 2022–2027 (expected).
Certifications: CCNA; Udacity Programming Fundamentals Nanodegree; MOHA Apprenticeship Certificate.

Project MDX frontmatter:

```yaml
---
slug: digital-billboard-ams
title: Digital Billboard Advertising Management System
summary: Java application for managing advertising content on digital billboards.
category: Software
tech: [Java]
cover: /images/projects/billboard-cover.webp
featured: true
status: completed
links: { repo: "", demo: "" }
order: 1
---
```
> Write only what the owner confirms in the body: Problem → Approach → Tools → Result → Learnings.

---

## 4. Design Tokens (`styles/globals.css`)

```css
:root {
  --bg:#F7F8FA; --surface:#fff; --surface-2:#EEF1F5;
  --border:rgba(10,15,25,.10); --text:#0B1220; --muted:#5B667A;
  --accent:#2563EB; --accent-2:#0D9F7A;
  --radius:16px; --maxw:1200px;
}
:root[data-theme="dark"], .dark {
  --bg:#07090F; --surface:#0E121B; --surface-2:#141A26;
  --border:rgba(255,255,255,.08); --text:#E8ECF4; --muted:#8B95A8;
  --accent:#4F8CFF; --accent-2:#22D3A6;
}
```
Dark is default; honor `prefers-color-scheme` on first visit, then persist the choice. Full spec in `PRD.md` §8.

---

## 5. Section-by-Section Build Spec

| Section | Key components | Behavior |
|---|---|---|
| **Hero** | `NetworkCanvas`, availability pill, H1, subtitle, 2 CTAs | Canvas pauses off-screen (IntersectionObserver) and when reduced-motion; staggered text entrance |
| **About** | Portrait (`next/image`), bio, facts strip, CCNA badge | Reveal on scroll |
| **Skills** | Bento grid of category cards + chips | Chips show level label on hover/focus |
| **Projects** | Featured card + grid, category filter, link to `/projects/[slug]` | Filter via URL query for shareability |
| **Experience** | Timeline | Mono date labels, expandable bullets |
| **Certifications** | Cards with verify link | Optional credential ID |
| **Contact** | RHF form + Turnstile, direct links, copy-email | States: idle, sending, success, error; mailto fallback |
| **Footer** | Socials, back-to-top | |

Global: skip link, `Navbar` with active-section observer, `CommandPalette` (P1), `Toaster`.

---

## 6. Backend Plan (Route Handlers)

All endpoints are defined in `API_CONTRACT.md`. Implementation order:
1. `GET /api/health`
2. `POST /api/contact` — Zod validate → honeypot check → Turnstile verify → rate limit → Resend email → 202/200
3. `GET /api/resume/download` — log event, 302 redirect to the PDF (or stream it)
4. `GET /api/projects`, `GET /api/projects/{slug}` — optional JSON read APIs from MDX frontmatter

Env vars (`.env.example`):
```
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_ANALYTICS_DOMAIN=
```

---

## 7. Phased Roadmap

### Phase 0 — Prep (0.5 day)
- [ ] Answer open questions in `PRD.md` §12
- [ ] Collect photo, CV PDF, socials, project assets
- [ ] Create GitHub repo, Vercel project, Resend and Turnstile accounts

### Phase 1 — Foundation (1–2 days)
- [ ] `create-next-app` (TS, Tailwind, App Router, ESLint)
- [ ] Fonts, tokens, theme provider, base layout
- [ ] Navbar, MobileMenu, Footer, ThemeToggle, Button/Card/Badge primitives
- [ ] CI pipeline (lint, typecheck)

### Phase 2 — Core Sections (3–4 days)
- [ ] Hero + `NetworkCanvas`
- [ ] About, Skills, Experience, Certifications from `/content`
- [ ] Reveal and stagger motion utilities
- [ ] Responsive pass at 320 / 768 / 1280

### Phase 3 — Projects (2–3 days)
- [ ] MDX pipeline (`@next/mdx` or `contentlayer2`/`velite`)
- [ ] Project grid, filters, case-study template
- [ ] Topology viewer (SVG pan/zoom) for networking labs

### Phase 4 — Conversion & API (2 days)
- [ ] Contact form UI + `/api/contact`
- [ ] Rate limit, Turnstile, honeypot, email templates
- [ ] CV download route + analytics event

### Phase 5 — SEO, A11y, Performance (2 days)
- [ ] Metadata, OG image generator, sitemap, robots, JSON-LD `Person`
- [ ] axe and keyboard audit; contrast checks in both themes
- [ ] Image optimization, bundle analysis, Lighthouse CI budgets

### Phase 6 — QA & Launch (1–2 days)
- [ ] Playwright E2E: nav, theme, contact success/failure, CV download
- [ ] Cross-browser and real-device test (incl. low-end Android)
- [ ] Domain and DNS, HTTPS, security headers
- [ ] Launch posts (LinkedIn, Telegram); add link to CV and email signature

**Estimated total:** ~2–3 weeks part-time.

---

## 8. Performance Budget & Rules

- Home route JS ≤ 150 KB gzip; no client-side libs for static content.
- Server Components by default; `"use client"` only for interactive pieces (canvas, form, palette, theme).
- Dynamic import `NetworkCanvas`, `CommandPalette`, `TopologyViewer`.
- Hero text is real HTML (LCP), never rendered inside canvas.
- Images: `next/image`, AVIF/WebP, explicit width/height, `priority` only on hero portrait if above fold.
- Only animate `transform` and `opacity`.

## 9. Security Headers (`next.config.ts`)

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://challenges.cloudflare.com <analytics-host>; frame-src https://challenges.cloudflare.com; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; connect-src 'self' <analytics-host>
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## 10. Testing Matrix

| Type | Tool | Coverage |
|---|---|---|
| Unit | Vitest | Zod schemas, utils, rate-limit logic |
| Component | Testing Library | Form states, theme toggle |
| E2E | Playwright | Core journeys on Chromium, WebKit, mobile viewport |
| A11y | axe + manual | Every page, both themes |
| Perf | Lighthouse CI | Budgets enforced on PR |

## 11. Definition of Done (per task)
Typed, linted, responsive, keyboard accessible, reduced-motion safe, tested where logic exists, no console errors, content traceable to `/content`.

## 12. Post-Launch Backlog
Blog/notes (CCNA study notes, Packet Tracer labs, IoT builds) · GitHub activity widget · Amharic toggle · Admin dashboard for messages · Testimonials (from supervisors/professors) · Case study with live IoT dashboard demo.

## 13. Guardrails for AI Agents
1. Never fabricate projects, metrics, links, or employers.
2. Leave `TODO(owner)` markers for missing data and render clean empty states.
3. Keep all copy in `/content`, not hardcoded in components.
4. Do not add dependencies beyond section 1 without justification.
5. Commit in small, conventional commits per task.
