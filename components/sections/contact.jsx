"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Mail, Send } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { SectionHeader } from "@/components/ui/section-header";
import { BrandIcon } from "@/components/ui/brand-icons";
import { useToast } from "@/components/ui/toast";
import { profile } from "@/content/profile";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const socials = [
  { key: "github", label: "GitHub", href: profile.socials.github },
  { key: "linkedin", label: "LinkedIn", href: profile.socials.linkedin },
  { key: "telegram", label: "Telegram", href: profile.socials.telegram },
].filter((social) => social.href);

const initialForm = { name: "", email: "", subject: "", message: "" };

// Mirrors lib/schemas.js ContactInput without pulling zod into the client
// bundle; the API re-validates server-side and is the source of truth.
function validate(values) {
  const errors = {};
  const name = values.name.trim();
  if (name.length < 2)
    errors.name = "Please enter your name (at least 2 characters).";
  else if (name.length > 80) errors.name = "Name must be 80 characters or fewer.";

  const email = values.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Please enter a valid email address.";
  else if (email.length > 254)
    errors.email = "Email must be 254 characters or fewer.";

  const message = values.message.trim();
  if (message.length < 10)
    errors.message = "Message must be at least 10 characters.";
  else if (message.length > 3000)
    errors.message = "Message must be 3000 characters or fewer.";

  if (values.subject.trim().length > 120)
    errors.subject = "Subject must be 120 characters or fewer.";

  return errors;
}

export function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState("idle");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef(null);
  const renderedNode = useRef(null);

  useEffect(() => {
    if (!siteKey || status === "success") return;

    const render = () => {
      if (!window.turnstile || !turnstileRef.current) return;
      if (renderedNode.current === turnstileRef.current) return;
      renderedNode.current = turnstileRef.current;
      setTurnstileToken("");
      window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
      });
    };

    const existing = document.getElementById("turnstile-script");
    if (existing) {
      render();
      return;
    }

    const script = document.createElement("script");
    script.id = "turnstile-script";
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = render;
    document.head.appendChild(script);
  }, [status]);

  const set = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      toast("Email copied to clipboard.", "success");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Couldn't copy — select the address manually.", "error");
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    setFormError(null);

    // Honeypot filled: pretend success, never contact the server.
    if (honeypot) {
      setForm(initialForm);
      setStatus("success");
      return;
    }

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          subject: form.subject.trim() || undefined,
          message: form.message.trim(),
          turnstileToken,
          website: "",
        }),
      });
      const payload = await res.json();

      if (res.ok && payload.ok) {
        setStatus("success");
        setForm(initialForm);
        toast(payload.data.message, "success");
        return;
      }

      if (payload.error?.details) {
        const errors = {};
        for (const detail of payload.error.details) {
          errors[detail.field] = detail.message;
        }
        setFieldErrors(errors);
        setStatus("idle");
        return;
      }

      setStatus("error");
      setFormError(
        payload.error?.message || "Something went wrong. Please try again.",
      );
    } catch {
      setStatus("error");
      setFormError("Network error — please try again.");
    }
  }

  return (
    <section id="contact" className="section border-t border-line">
      <div className="container-page">
        <SectionHeader
          eyebrow="06 / CONTACT"
          title="Let's build something reliable."
          description="Open to internships and entry-level roles in networking, ICT, and software — or just to say hello."
        />

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            {status === "success" ? (
              <div
                role="status"
                className="card flex h-full flex-col items-start justify-center gap-4 p-8"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full border border-accent-2/40 bg-accent-2/10 text-accent-2">
                  <Check aria-hidden="true" size={20} />
                </span>
                <h3>Message sent.</h3>
                <p className="text-muted">
                  Thanks for reaching out — I&apos;ll reply soon.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setStatus("idle")}
                >
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Name"
                    name="name"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={set("name")}
                    error={fieldErrors.name}
                    disabled={status === "sending"}
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={set("email")}
                    error={fieldErrors.email}
                    disabled={status === "sending"}
                  />
                </div>

                <Input
                  label="Subject"
                  name="subject"
                  hint="Optional"
                  value={form.subject}
                  onChange={set("subject")}
                  error={fieldErrors.subject}
                  disabled={status === "sending"}
                />

                <Textarea
                  label="Message"
                  name="message"
                  required
                  value={form.message}
                  onChange={set("message")}
                  error={fieldErrors.message}
                  disabled={status === "sending"}
                />

                <div
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-px w-px overflow-hidden"
                >
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                  />
                </div>

                {siteKey && (
                  <div ref={turnstileRef} className="min-h-[65px]" />
                )}

                {status === "error" && (
                  <div
                    role="alert"
                    className="rounded-[var(--radius-sm)] border border-warn/40 bg-warn/10 px-4 py-3 text-sm text-warn"
                  >
                    {formError}{" "}
                    <a
                      href={`mailto:${profile.email}`}
                      className="underline underline-offset-2 hover:text-ink"
                    >
                      Email me directly
                    </a>
                    .
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? (
                      "Sending…"
                    ) : (
                      <>
                        <Send aria-hidden="true" size={16} />
                        Send message
                      </>
                    )}
                  </Button>
                  <ButtonLink
                    href="/api/resume/download?source=contact"
                    variant="ghost"
                    size="lg"
                  >
                    <Download aria-hidden="true" size={16} />
                    Download CV
                  </ButtonLink>
                </div>
              </form>
            )}
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <p className="eyebrow mb-3">Direct</p>
              <div className="flex items-center justify-between gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex min-w-0 items-center gap-2.5 text-ink transition-colors hover:text-accent"
                >
                  <Mail aria-hidden="true" size={16} className="shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  {copied ? (
                    <Check aria-hidden="true" size={14} />
                  ) : (
                    <Copy aria-hidden="true" size={14} />
                  )}
                </button>
              </div>
            </div>

            {socials.length > 0 && (
              <div className="card p-6">
                <p className="eyebrow mb-3">Elsewhere</p>
                <div className="flex flex-wrap gap-2">
                  {socials.map(({ key, label, href }) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      <BrandIcon name={key} size={15} />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="card p-6">
              <p className="eyebrow mb-3">Availability</p>
              <p className="text-sm text-muted">{profile.availability.label}</p>
              <p className="mt-2 text-sm text-muted">
                {profile.location}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
