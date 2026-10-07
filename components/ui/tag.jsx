export function Tag({ children, className }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border border-line bg-surface-2 px-2.5 py-0.5 font-mono text-xs text-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
