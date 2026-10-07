"use client";

import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

const fieldClasses =
  "w-full rounded-[var(--radius-sm)] border border-line bg-surface px-4 py-3 text-ink placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none disabled:opacity-60";

type FieldWrapperProps = {
  label: string;
  error?: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
};

function FieldWrapper({
  label,
  error,
  hint,
  htmlFor,
  children,
}: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="font-mono text-xs uppercase tracking-wider text-muted"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-warn">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted/80">{hint}</p>
      )}
    </div>
  );
}

export function Input({
  label,
  error,
  hint,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <FieldWrapper
      label={label}
      error={error}
      hint={hint}
      htmlFor={id}
    >
      <input
        id={id}
        aria-invalid={Boolean(error)}
        className={[fieldClasses, className].filter(Boolean).join(" ")}
        {...rest}
      />
    </FieldWrapper>
  );
}

export function Textarea({
  label,
  error,
  hint,
  className,
  rows = 6,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <FieldWrapper label={label} error={error} hint={hint} htmlFor={id}>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={[fieldClasses, "resize-y", className]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
    </FieldWrapper>
  );
}
