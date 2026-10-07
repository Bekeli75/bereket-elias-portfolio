# Product Requirements Document (PRD)
## Bereket Elias — Premium Portfolio Website

| Field | Value |
|---|---|
| Version | 1.0 |
| Owner | Bereket Elias |
| Related | `SRS.md`, `MASTER_PLAN.md`, `API_CONTRACT.md` |

---

## 1. Vision
A portfolio that feels like a well-engineered product: fast, calm, precise, and memorable. It should make a recruiter think "this person pays attention to detail", which is exactly what networking and electronics engineering demand.

**One-line positioning:** *Computer engineering student building reliable networks and connected systems.* (Adjust once you confirm your preferred tagline.)

## 2. Goals & Non-Goals

### Goals
1. Earn a clear first impression in 5 seconds: who, what, where, how to reach.
2. Prove credibility with CCNA, apprenticeship experience, projects, and tools.
3. Drive contact: CV downloads and messages for internships, graduate roles, and collaborations.
4. Look premium on mobile first, since most recruiters in the region browse on phones.
5. Stay easy to update as the owner grows (new labs, projects, certifications).

### Non-Goals (v1)
- Accounts, comments, e-commerce, payments.
- A full CMS. Content lives in files; an admin panel is a later option.
- Fake metrics (skill percentages, inflated stats).

## 3. Target Users & Jobs-to-be-Done

| Persona | Job | Success looks like |
|---|---|---|
| **Recruiter (Hana)** scanning 30 profiles | "Is this candidate relevant? Can I contact them fast?" | Finds role, certifications, CV, and contact in under 30 seconds |
| **Engineering manager (Dawit)** | "Can they do hands-on technical work?" | Sees concrete projects, tools, and apprenticeship detail |
| **Professor / peer** | "What has this student built?" | Reads clear project write-ups |
| **Collaborator** | "Could we build something together?" | Finds a friendly, credible contact path |

## 4. Success Metrics

| Metric | Target (first 90 days) |
|---|---|
| Lighthouse mobile (all categories) | ≥ 95 |
| LCP on 4G mobile | ≤ 2.0 s |
| Contact submissions + CV downloads | Tracked as primary conversions |
| Avg. engagement time | > 60 s |
| Scroll depth to Projects | > 60% of visitors |
| Bounce rate | < 55% |

## 5. Information Architecture

```
/                     Single-page: Hero → About → Skills → Projects → Experience → Certifications → Contact
/projects/[slug]      Case-study page per project
/resume               Print-friendly resume + PDF download
/blog (optional)      Technical notes (networking labs, CCNA, IoT)
/404                  Branded not-found page
```

## 6. Content Strategy (grounded in the CV)

**Hero:** Bereket Elias · Electrical & Computer Engineering Student · Addis Ababa, Ethiopia. Supporting line from the summary: interested in ICT, computer networks, and IoT; CCNA certified. CTAs: *View Projects*, *Download CV*.

**About:** Fourth-year Computer Engineering student at AASTU. Practical network design and simulation with Cisco Packet Tracer. Focus on applying skills to real-world engineering projects.

**Skills (grouped):**
- *Networking:* Cisco networking, CCNA fundamentals, network design and simulation, troubleshooting
- *Programming:* HTML5, CSS3, JavaScript, Java, C++
- *Foundations:* Data structures (basic), algorithms (problem-solving approach), computer systems (CPU, memory, I/O)
- *Hardware:* Circuit design
- *Tools:* MATLAB, Cisco Packet Tracer, Proteus, Multisim, VS Code, Microsoft Office

**Projects (seed):**
1. Digital Billboard Advertising Management System (Java)
2. Mini Computer Design (academic)
3. Web Development Projects (Udacity)
4. Networking labs in Cisco Packet Tracer (owner to supply topologies)

**Experience:** Apprentice, MOHA Soft Drinks Industry S.C (Aug–Sep 2025): industrial systems maintenance, production and technical departments, safety and engineering procedures.

**Certifications:** CCNA · Udacity Programming Fundamentals Nanodegree · MOHA Apprenticeship Certificate.

**Content rules:** no invented numbers, no inflated titles, no "expert" claims for basic-level skills. Project pages follow *Problem → Approach → Tools → Result → What I learned*.

## 7. Feature Requirements (summary; full detail in SRS)

| # | Feature | Priority | Notes |
|---|---|---|---|
| 1 | Hero with signature network/circuit animation | P0 | Reduced-motion safe |
| 2 | Sticky nav + theme toggle (dark default) | P0 | |
| 3 | About + quick facts + CCNA badge | P0 | |
| 4 | Skills by category with honest level labels | P0 | |
| 5 | Projects grid + detail case studies | P0 | |
| 6 | Experience timeline | P0 | |
| 7 | Certifications | P0 | |
| 8 | Contact form + direct links + spam protection | P0 | |
| 9 | CV download + tracking | P0 | |
| 10 | SEO, OG images, JSON-LD, sitemap | P0 | |
| 11 | Command palette (Cmd/Ctrl+K) | P1 | |
| 12 | Project filters | P1 | |
| 13 | Network topology viewer with zoom | P1 | Differentiator for networking focus |
| 14 | Blog/notes (MDX) | P2 | |
| 15 | Admin + Amharic toggle | P2 | |

## 8. Design System ("Premium + Aesthetic")

### 8.1 Creative Direction
**"Quiet precision."** Dark, deep-ink canvas with a single electric accent, fine grid or circuit lines at very low contrast, glassy cards, large confident type, and motion that feels engineered rather than flashy. The network/circuit motif ties visuals to the owner's field.

### 8.2 Color Tokens (starting palette, tune visually)

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#07090F` | `#F7F8FA` |
| `--surface` | `#0E121B` | `#FFFFFF` |
| `--surface-2` | `#141A26` | `#EEF1F5` |
| `--border` | `rgba(255,255,255,.08)` | `rgba(10,15,25,.10)` |
| `--text` | `#E8ECF4` | `#0B1220` |
| `--muted` | `#8B95A8` | `#5B667A` |
| `--accent` | `#4F8CFF` (electric blue) | `#2563EB` |
| `--accent-2` | `#22D3A6` (signal green) | `#0D9F7A` |
| `--warn` | `#F5B544` | `#B7791F` |

Use accent sparingly: links, CTAs, active states, one gradient glow in the hero.

### 8.3 Typography
- Display / headings: **Space Grotesk** or **Geist** (700/600)
- Body: **Inter** or Geist Sans (400/500)
- Technical labels, tags, code: **JetBrains Mono** or Geist Mono
- Fluid type scale using `clamp()`: H1 ≈ 3rem→5.5rem, body 1rem→1.125rem, line-height 1.6.

### 8.4 Layout & Spacing
8-pt spacing scale, max content width 1200 px, 12-column grid on desktop, generous vertical rhythm (96–140 px between sections on desktop, 64–80 px on mobile). Radius 14–20 px on cards.

### 8.5 Motion
- Page load: staggered fade-up of hero text (60 ms stagger).
- Scroll reveals: 24 px translate + fade, once only.
- Cards: subtle lift and border-glow on hover; magnetic effect on primary CTA (desktop only).
- Hero signature: animated node graph (packets traveling along links) on canvas/WebGL-lite, pausing off-screen and under reduced motion.
- Respect `prefers-reduced-motion`; never block content on animation.

### 8.6 Components
Button (primary/secondary/ghost), Badge/Tag, Card (glass), Section header with mono eyebrow label (e.g., `01 / ABOUT`), Timeline, Skill chip group, Project card, Modal/Drawer, Toast, Form field, Command palette, Theme toggle.

### 8.7 Imagery
Professional portrait with soft rim light or clean background; project covers as consistent 16:10 mockups; topology diagrams exported as crisp SVG. Avoid generic stock photos.

## 9. Page Wireframe Notes

1. **Hero:** left-aligned text, right-side animated network visual; availability pill above name; scroll cue below.
2. **About:** two columns, portrait + bio; facts strip (Location · AASTU · Class of 2027 · CCNA).
3. **Skills:** bento-style grid of category cards, each with chips.
4. **Projects:** large featured project followed by a 2-up grid; each opens a case-study page.
5. **Experience / Education:** vertical timeline with mono date labels.
6. **Certifications:** compact card row with issuer marks and verify links.
7. **Contact:** large headline ("Let's build something reliable."), form on one side, direct links on the other.
8. **Footer:** minimal, socials, back-to-top, "Built with…" line.

## 10. Tech Direction (summary)
Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion, MDX/JSON content, serverless route handlers, Resend, Turnstile, Upstash rate limiting, Vercel hosting. Details in `MASTER_PLAN.md`.

## 11. Release Plan

| Milestone | Scope |
|---|---|
| M1 — Foundation | Repo, design tokens, layout, nav, theme |
| M2 — Core Sections | Hero, About, Skills, Experience, Certifications |
| M3 — Projects | Grid, case-study pages, topology viewer |
| M4 — Conversion | Contact API, CV download, analytics |
| M5 — Polish | SEO/OG, a11y audit, performance, QA |
| M6 — Launch | Domain, DNS, monitoring, announce on LinkedIn/Telegram |

## 12. Open Questions (owner to answer)
1. Preferred tagline and which focus to lead with: Networking, IoT, or Embedded?
2. GitHub, LinkedIn, Telegram URLs?
3. Is the email on the CV (university address) the one to publish, or a personal one? Should the phone number be shown?
4. Which projects get full case studies, and can you share screenshots, topologies, and repos?
5. CCNA credential ID or Credly/Cisco verification link?
6. Custom domain (e.g., `bereketelias.dev`) or a free subdomain at launch?
7. Do you want an Amharic version or a blog in v1?
8. Photo available? Preferred accent color?
