export function Card({
  interactive = false,
  className,
  children,
  ...rest
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
