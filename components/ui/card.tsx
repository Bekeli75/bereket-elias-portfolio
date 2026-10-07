import type { HTMLAttributes, ReactNode } from "react";

export function Card({
  interactive = false,
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={["card", interactive && "card-hover", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
