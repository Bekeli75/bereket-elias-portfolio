"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { navLinks } from "@/content/navigation";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Navbar() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navLinks
      .map((link) => link.sectionId)
      .filter((id): id is string => Boolean(id) && id !== "top");
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-all duration-200 ${
        scrolled
          ? "border-b border-line bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-ink transition-colors hover:text-accent"
          aria-label="Bereket Elias — home"
        >
          Bereket<span className="text-accent">.</span>
          <span className="text-muted">elias</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.sectionId !== undefined &&
                link.sectionId === activeSection;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-surface-2 text-accent"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="inline-flex size-9 items-center justify-center rounded-[var(--radius-sm)] border border-line bg-surface text-muted transition-colors hover:border-accent hover:text-accent lg:hidden"
          >
            <Menu aria-hidden="true" size={18} />
          </button>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        activeSection={activeSection}
      />
    </header>
  );
}
