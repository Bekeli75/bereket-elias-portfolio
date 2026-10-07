type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  id?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  id,
}: SectionHeaderProps) {
  return (
    <div
      className={[
        "mb-10 flex flex-col gap-4 md:mb-14",
        align === "center" && "items-center text-center",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {description && (
        <p className="max-w-2xl text-muted md:text-lg">{description}</p>
      )}
    </div>
  );
}
