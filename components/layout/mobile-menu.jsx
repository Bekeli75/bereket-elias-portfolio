"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { navLinks } from "@/content/navigation";

export function MobileMenu({
  open,
  onOpenChange,
  activeSection,
  onNavigate,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-md" />
        <Dialog.Content
          className="fixed inset-x-0 top-0 z-50 border-b border-line bg-surface p-5 shadow-card focus:outline-none"
          aria-label="Navigation menu"
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="font-mono text-sm tracking-widest text-muted">
              MENU
            </span>
            <Dialog.Close
              className="inline-flex size-9 items-center justify-center rounded-[var(--radius-sm)] border border-line text-muted transition-colors hover:text-accent"
              aria-label="Close menu"
            >
              <X aria-hidden="true" size={18} />
            </Dialog.Close>
          </div>

          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.sectionId !== undefined &&
                  link.sectionId === activeSection;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => {
                        onNavigate?.();
                        onOpenChange(false);
                      }}
                      aria-current={isActive ? "location" : undefined}
                      className={`block rounded-[var(--radius-sm)] px-3 py-3 text-lg font-medium transition-colors ${
                        isActive
                          ? "bg-surface-2 text-accent"
                          : "text-ink hover:bg-surface-2 hover:text-accent"
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
