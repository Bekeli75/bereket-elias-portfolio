import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { skillCategories, type SkillLevel } from "@/content/skills";

const spans: Record<string, string> = {
  Networking: "lg:col-span-2",
  Programming: "lg:col-span-2",
  Foundations: "lg:col-span-1",
  Hardware: "lg:col-span-1",
  Tools: "lg:col-span-2",
};

const levelStyles: Record<SkillLevel, string> = {
  familiar: "text-muted",
  working: "text-accent",
  strong: "text-accent-2",
};

export function Skills() {
  return (
    <section id="skills" className="section border-t border-line">
      <div className="container-page">
        <SectionHeader
          eyebrow="02 / SKILLS"
          title="Skills & tools"
          description="Grouped by area with honest level labels — familiar, working, or strong. No fake percentages."
        />

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category) => (
            <StaggerItem
              key={category.name}
              className={`${spans[category.name] ?? ""} flex`}
            >
              <Card interactive className="flex w-full flex-col p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3>{category.name}</h3>
                  <span className="font-mono text-xs text-muted">
                    {String(category.items.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item.name}
                      tabIndex={0}
                      className="group inline-flex cursor-default items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-sm text-ink transition-colors hover:border-accent/50 focus-visible:border-accent/50"
                    >
                      {item.name}
                      <span
                        className={`font-mono text-[0.65rem] uppercase tracking-wider opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${levelStyles[item.level]}`}
                      >
                        · {item.level}
                      </span>
                    </span>
                  ))}
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.15}>
          <p className="mt-6 font-mono text-xs uppercase tracking-wider text-muted">
            levels:{" "}
            <span className="text-muted">familiar</span> ·{" "}
            <span className="text-accent">working</span> ·{" "}
            <span className="text-accent-2">strong</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
