const tones = {
  accent: "border-accent/30 bg-accent/10 text-accent",
  success: "border-accent-2/30 bg-accent-2/10 text-accent-2",
  warn: "border-warn/30 bg-warn/10 text-warn",
  neutral: "border-line bg-surface-2 text-muted",
};

export function Badge({ tone = "neutral", dot = false, children, className }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        tones[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {dot && (
        <span className="relative flex size-2" aria-hidden="true">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
