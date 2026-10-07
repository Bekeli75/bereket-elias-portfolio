"use client";

import { ArrowUp, Mail } from "lucide-react";
import { BrandIcon } from "@/components/ui/brand-icons";
import { profile } from "@/content/profile";

const allSocials = [
  { key: "github", label: "GitHub", href: profile.socials.github },
  { key: "linkedin", label: "LinkedIn", href: profile.socials.linkedin },
  { key: "telegram", label: "Telegram", href: profile.socials.telegram },
];

const socials = allSocials.filter((social) => social.href);

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="font-display text-base font-semibold text-ink">
            {profile.name}
          </p>
          <p className="text-sm text-muted">
            © {year} · Built with Next.js &amp; Tailwind CSS
          </p>
        </div>

        <div className="flex items-center gap-2">
          {socials.map(({ key, label, href }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="inline-flex size-9 items-center justify-center rounded-[var(--radius-sm)] border border-line text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <BrandIcon name={key} />
            </a>
          ))}
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email Bereket"
            className="inline-flex size-9 items-center justify-center rounded-[var(--radius-sm)] border border-line text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <Mail aria-hidden="true" size={16} />
          </a>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="inline-flex size-9 items-center justify-center rounded-[var(--radius-sm)] border border-line text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <ArrowUp aria-hidden="true" size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
