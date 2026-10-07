# Software Requirements Specification (SRS)
## Bereket Elias — Personal Portfolio Website

| Field | Value |
|---|---|
| Document version | 1.0 |
| Status | Draft for build |
| Owner | Bereket Elias |
| Standard | Structured after IEEE 830 / ISO/IEC/IEEE 29148 |

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements of Bereket Elias's personal portfolio website. It is the contract between the product vision (see `PRD.md`) and the implementation (see `MASTER_PLAN.md` and `API_CONTRACT.md`).

### 1.2 Scope
A single-owner, public-facing, modern and premium portfolio website that presents Bereket as an Electrical and Computer Engineering student with strengths in computer networking (CCNA), IoT, and software fundamentals. The site must:
- Communicate who he is within 5 seconds.
- Showcase projects, skills, certifications, education, and experience.
- Convert visitors (recruiters, internship hosts, collaborators, professors) into contacts.
- Deliver a premium visual and motion experience without sacrificing speed or accessibility.

Out of scope for v1: public user accounts, e-commerce, comments, multi-author blogging, payments.

### 1.3 Definitions
| Term | Meaning |
|---|---|
| Visitor | Anyone browsing the public site |
| Owner | Bereket Elias (sole admin) |
| CMS | Content source (MDX/JSON files in repo, optional admin later) |
| LCP / CLS / INP | Core Web Vitals metrics |
| WCAG | Web Content Accessibility Guidelines |

### 1.4 References
- `PRD.md`, `MASTER_PLAN.md`, `API_CONTRACT.md`
- Owner's CV (`bereket_elias_-cv_-resume.docx`)
- WCAG 2.2 AA, Core Web Vitals thresholds

---

## 2. Overall Description

### 2.1 Product Perspective
Standalone web application, statically generated where possible, with a small serverless backend for the contact form, analytics events, and resume download tracking.

### 2.2 User Classes
| Class | Goals |
|---|---|
| Recruiter / hiring manager | Quickly assess skills, projects, certifications; download CV; contact |
| Internship / apprenticeship host | See practical experience and engineering depth |
| Professor / academic peer | See academic projects and technical rigor |
| Collaborator / client | See what he can build; reach out |
| Owner | Update content easily; read contact messages; see traffic |

### 2.3 Operating Environment
Modern evergreen browsers (Chrome, Edge, Safari, Firefox — last 2 versions), mobile-first, tested on low-end Android devices and slower connections common in Ethiopia (3G/4G variable).

### 2.4 Constraints
- Free or low-cost hosting tier acceptable (Vercel / Cloudflare free tiers).
- Owner is a student: content must be editable without deep refactors.
- No fabricated content: every claim on the site must trace to the CV or owner-provided data.

### 2.5 Assumptions & Dependencies
- Owner will supply: professional photo, GitHub/LinkedIn URLs, project screenshots, final CV PDF, custom domain (optional).
- Email delivery via a transactional provider (e.g., Resend).
- Spam protection via Cloudflare Turnstile or hCaptcha.

---

## 3. Source Content (from CV — authoritative)

| Section | Content |
|---|---|
| Name | Bereket Elias |
| Title | Electrical and Computer Engineering Student (Computer Engineering) |
| Location | Addis Ababa, Ethiopia |
| Email | bereket.elias@aastustudent.edu.et |
| Education | BSc Electrical and Computer Engineering, Addis Ababa Science and Technology University (AASTU), 2022–2027 (expected), currently 4th year |
| Summary | Interest in ICT, computer networks, IoT; practical network design and simulation using Cisco Packet Tracer; CCNA holder; focused on real-world engineering projects |
| Skills | Circuit design; HTML5, CSS3, JavaScript, Java, C++; data structures (basic), algorithms (problem-solving approach); computer systems (CPU, memory, I/O basics); Cisco networking |
| Tools | MATLAB, Cisco Packet Tracer, Proteus, Multisim, VS Code, Microsoft Office |
| Experience | Apprentice, MOHA Soft Drinks Industry S.C, Aug 2025 – Sep 2025: assisted in maintenance of industrial systems; worked in production and technical departments; followed safety and engineering procedures |
| Projects | Digital Billboard Advertising Management System (Java); Mini Computer Design (academic); Basic Web Development projects (Udacity) |
| Certifications | CCNA; Programming Fundamentals Nanodegree (Udacity); Apprenticeship Certificate (MOHA Soft Drinks Industry) |

**Content gaps to fill by owner** (site must render gracefully without them): phone display preference, photo, GitHub, LinkedIn, project descriptions/screenshots/links, CCNA credential ID, CV PDF, any Packet Tracer lab write-ups.

---

## 4. System Features & Functional Requirements

Priority: **M** = Must, **S** = Should, **C** = Could.

### 4.1 Global Layout & Navigation
| ID | Requirement | Pri |
|---|---|---|
| FR-NAV-01 | Sticky, translucent navigation bar with section links: Home, About, Skills, Projects, Experience, Certifications, Contact | M |
| FR-NAV-02 | Active-section highlighting on scroll; smooth anchor scrolling | M |
| FR-NAV-03 | Mobile menu (full-screen overlay) with focus trap and ESC to close | M |
| FR-NAV-04 | Theme toggle (dark default, light, system) persisted per visitor | M |
| FR-NAV-05 | Command palette (`Ctrl/Cmd+K`) to jump to sections, open CV, copy email | C |
| FR-NAV-06 | Footer with socials, email, copyright, back-to-top | M |

### 4.2 Hero
| ID | Requirement | Pri |
|---|---|---|
| FR-HERO-01 | Display name, role line, one-sentence value statement, and two CTAs: "View Projects" and "Download CV" | M |
| FR-HERO-02 | Animated visual themed to networks/circuits (e.g., node-graph or signal-trace canvas) respecting `prefers-reduced-motion` | M |
| FR-HERO-03 | Availability badge (e.g., "Open to internships — 2027 graduate") controlled by a config flag | S |
| FR-HERO-04 | Rotating/typing role text (Network Engineering · IoT · Embedded · Software) | C |

### 4.3 About
| ID | Requirement | Pri |
|---|---|---|
| FR-ABOUT-01 | Short bio derived from CV summary, plus photo | M |
| FR-ABOUT-02 | Quick facts card: location, university, graduation year, CCNA badge | M |
| FR-ABOUT-03 | Education timeline entry for AASTU | M |

### 4.4 Skills
| ID | Requirement | Pri |
|---|---|---|
| FR-SKILL-01 | Skills grouped into: Networking, Programming, Hardware & Circuits, Computer Systems, Tools | M |
| FR-SKILL-02 | Visual representation without fake percentage bars (use level labels: Familiar / Working / Strong) | M |
| FR-SKILL-03 | Data-driven from a single config file | M |

### 4.5 Projects
| ID | Requirement | Pri |
|---|---|---|
| FR-PROJ-01 | Responsive card grid with title, summary, tech tags, thumbnail | M |
| FR-PROJ-02 | Filter by category (Networking, Software, Hardware, Academic) | S |
| FR-PROJ-03 | Project detail page/modal: problem, approach, tools, outcome, screenshots, links (repo/demo if available) | M |
| FR-PROJ-04 | Seed projects: Digital Billboard Advertising Management System; Mini Computer Design; Web Development Projects (Udacity); Networking labs (Cisco Packet Tracer) when supplied | M |
| FR-PROJ-05 | Networking projects may embed topology diagrams (image/SVG) with zoom | S |

### 4.6 Experience
| ID | Requirement | Pri |
|---|---|---|
| FR-EXP-01 | Timeline entry for MOHA Soft Drinks Industry S.C apprenticeship (Aug–Sep 2025) with responsibilities | M |
| FR-EXP-02 | Extensible to future roles | M |

### 4.7 Certifications
| ID | Requirement | Pri |
|---|---|---|
| FR-CERT-01 | Cards for CCNA, Udacity Programming Fundamentals Nanodegree, MOHA Apprenticeship Certificate | M |
| FR-CERT-02 | Optional verification link / credential ID per card | S |

### 4.8 Contact
| ID | Requirement | Pri |
|---|---|---|
| FR-CON-01 | Contact form: name, email, subject, message, with client and server validation | M |
| FR-CON-02 | Spam protection (bot challenge + honeypot + rate limit) | M |
| FR-CON-03 | Email notification to owner; success/error UI states | M |
| FR-CON-04 | Direct links: mailto, LinkedIn, GitHub, Telegram (optional) with click-to-copy email | M |
| FR-CON-05 | Auto-reply confirmation email to sender | C |

### 4.9 Resume
| ID | Requirement | Pri |
|---|---|---|
| FR-CV-01 | Downloadable PDF CV from hero, nav, and contact | M |
| FR-CV-02 | Download event tracked (privacy-friendly) via API | S |
| FR-CV-03 | Print-friendly `/resume` page | C |

### 4.10 SEO, Sharing & Analytics
| ID | Requirement | Pri |
|---|---|---|
| FR-SEO-01 | Per-page title, meta description, canonical, Open Graph and Twitter cards | M |
| FR-SEO-02 | Dynamic OG image generation per project | S |
| FR-SEO-03 | `sitemap.xml`, `robots.txt`, JSON-LD `Person` schema | M |
| FR-AN-01 | Privacy-friendly analytics (Plausible / Umami / Vercel Analytics); no cookie banner required | M |

### 4.11 Optional / Later
| ID | Requirement | Pri |
|---|---|---|
| FR-BLOG-01 | Technical notes/blog (MDX): networking labs, CCNA study notes, IoT builds | C |
| FR-ADMIN-01 | Protected admin to read messages and toggle availability | C |
| FR-I18N-01 | Amharic language toggle | C |

---

## 5. Non-Functional Requirements

### 5.1 Performance
| ID | Requirement |
|---|---|
| NFR-PERF-01 | LCP ≤ 2.0 s, INP ≤ 200 ms, CLS ≤ 0.05 on mobile (Lighthouse mobile profile, throttled 4G) |
| NFR-PERF-02 | Lighthouse scores ≥ 95 for Performance, Accessibility, Best Practices, SEO |
| NFR-PERF-03 | Initial JS ≤ 150 KB gzipped on home route; heavy visuals lazy-loaded |
| NFR-PERF-04 | All images in AVIF/WebP, responsive `srcset`, lazy-loaded below the fold |
| NFR-PERF-05 | Fonts self-hosted, subsetted, `font-display: swap` |

### 5.2 Accessibility
| ID | Requirement |
|---|---|
| NFR-A11Y-01 | WCAG 2.2 AA conformance |
| NFR-A11Y-02 | Full keyboard navigation, visible focus rings, skip-to-content link |
| NFR-A11Y-03 | `prefers-reduced-motion` disables parallax, canvas animation, and large transitions |
| NFR-A11Y-04 | Color contrast ≥ 4.5:1 for text in both themes |
| NFR-A11Y-05 | Semantic landmarks, alt text for all meaningful images |

### 5.3 Security & Privacy
| ID | Requirement |
|---|---|
| NFR-SEC-01 | HTTPS only; HSTS; security headers (CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) |
| NFR-SEC-02 | Server-side validation and sanitization of all input; no secrets in client bundle |
| NFR-SEC-03 | Rate limiting on write endpoints (e.g., 5 contact submissions / IP / hour) |
| NFR-SEC-04 | Messages not retained beyond what is necessary; no third-party tracking cookies |
| NFR-SEC-05 | Phone number not exposed in page source unless owner opts in (obfuscated reveal) |

### 5.4 Reliability & Maintainability
| ID | Requirement |
|---|---|
| NFR-REL-01 | Static pages remain available if the backend is down; contact form shows a fallback mailto |
| NFR-MNT-01 | TypeScript strict mode; ESLint + Prettier; component-based architecture |
| NFR-MNT-02 | Content separated from presentation (config/MDX), updating a project requires editing one file |
| NFR-MNT-03 | CI runs lint, type-check, unit tests, and Lighthouse CI on each PR |

### 5.5 Compatibility & Responsiveness
| ID | Requirement |
|---|---|
| NFR-COMP-01 | Fluid layout from 320 px to 2560 px; breakpoints at 640 / 768 / 1024 / 1280 / 1536 |
| NFR-COMP-02 | Graceful degradation without JS for core content (SSG/SSR) |

### 5.6 Design Quality
| ID | Requirement |
|---|---|
| NFR-DES-01 | Consistent design tokens (color, type scale, spacing, radius, shadow) |
| NFR-DES-02 | Motion language: 150–400 ms ease-out micro-interactions; one signature hero animation |
| NFR-DES-03 | Premium aesthetic: generous whitespace, strong typographic hierarchy, restrained palette |

---

## 6. External Interface Requirements

### 6.1 User Interface
Defined in `PRD.md` §8 (design system) and `MASTER_PLAN.md` (components). Primary pages: `/` (single-page sections), `/projects/[slug]`, `/resume`, `/blog` (optional), `404`.

### 6.2 Software Interfaces
| Interface | Purpose |
|---|---|
| Resend (or SMTP) | Contact email delivery |
| Cloudflare Turnstile | Bot protection |
| Upstash Redis (or in-memory fallback) | Rate limiting |
| Plausible / Umami / Vercel Analytics | Analytics |
| GitHub API (optional) | Pull pinned repos / activity |

### 6.3 API
See `API_CONTRACT.md`.

---

## 7. Data Requirements

### 7.1 Content Model (file-based)
- `Profile`: name, title, summary, location, email, social links, availability
- `Skill`: name, category, level
- `Project`: slug, title, summary, category, tech[], cover, gallery[], links, status, featured, order
- `Experience`: company, role, start, end, bullets[]
- `Certification`: title, issuer, date, credentialId?, url?
- `Education`: institution, degree, start, end, status

### 7.2 Stored Runtime Data
| Entity | Storage | Retention |
|---|---|---|
| ContactMessage (delivery log only) | Email + optional DB row | 90 days max |
| Rate-limit counters | Redis / edge KV | 1 hour TTL |
| Analytics events | Analytics provider | Provider default |

---

## 8. Acceptance Criteria (Release Gate for v1.0)

1. All **Must** requirements implemented and manually verified.
2. Lighthouse mobile ≥ 95 in all four categories on production URL.
3. axe-core reports zero serious/critical issues; manual keyboard walkthrough passes.
4. Contact form delivers an email end-to-end, blocks obvious spam, and handles failure gracefully.
5. CV PDF downloads correctly on desktop and mobile.
6. Every factual claim matches the CV or owner-approved content.
7. OG preview renders correctly on LinkedIn, WhatsApp, and Telegram.
8. Site verified on Chrome, Safari (iOS), Firefox, and a low-end Android device.

---

## 9. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Few shipped software projects | Thin Projects section | Include networking labs, hardware/academic projects, write case-study-style detail; build 1–2 small showcase projects |
| Heavy animation hurts performance | Poor UX on low-end devices | Lazy-load canvas, reduced-motion fallback, performance budget in CI |
| Overstating skills | Credibility loss | Level labels honest ("Familiar/Working/Strong"); basic DS&A labeled as such |
| Spam on contact form | Noise, deliverability | Turnstile + honeypot + rate limit |
| Missing assets | Delayed launch | Placeholders + graceful empty states |
