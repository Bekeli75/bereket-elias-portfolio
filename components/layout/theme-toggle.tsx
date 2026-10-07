"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

const labels = {
  dark: "Dark",
  light: "Light",
  system: "System",
} as const;

const icons = {
  dark: Moon,
  light: Sun,
  system: Monitor,
} as const;

export function ThemeToggle() {
  const { mode, cycleMode } = useTheme();
  const Icon = icons[mode];

  return (
    <button
      type="button"
      onClick={cycleMode}
      aria-label={`Theme: ${labels[mode]}. Click to cycle theme.`}
      title={`Theme: ${labels[mode]}`}
      className="inline-flex size-9 items-center justify-center rounded-[var(--radius-sm)] border border-line bg-surface text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <Icon aria-hidden="true" size={16} />
    </button>
  );
}
