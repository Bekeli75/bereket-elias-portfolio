import Link from "next/link";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-56 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent";

const variants = {
  primary:
    "bg-accent-solid text-white shadow-[0_8px_24px_-10px_var(--accent-solid)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "border border-line bg-surface text-ink hover:border-accent hover:text-accent",
  ghost: "text-muted hover:text-accent",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonClasses(variant = "primary", size = "md", className) {
  return [base, variants[variant], sizes[size], className]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant,
  size,
  className,
  children,
  ...rest
}) {
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  href,
  external = false,
  ...rest
}) {
  const cls = buttonClasses(variant, size, className);

  if (external) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
