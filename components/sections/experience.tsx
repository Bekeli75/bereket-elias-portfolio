import { SectionHeader } from "@/components/ui/section-header";
import { Timeline, type TimelineItem } from "@/components/ui/timeline";
import { Reveal } from "@/components/motion/reveal";
import { experience } from "@/content/experience";
import { education } from "@/content/education";

const educationItems: TimelineItem[] = education.map((entry) => ({
  date: `${entry.start} – ${entry.end} (${entry.status})`,
  title: entry.degree,
  subtitle: entry.institution,
  body: (
    <ul className="list-disc space-y-1 pl-5 marker:text-accent">
      <li>Specialization: {entry.specialization}</li>
      <li>{entry.note}</li>
    </ul>
  ),
}));

const experienceItems: TimelineItem[] = experience.map((role) => ({
  date: `${role.start} – ${role.end}`,
  title: role.role,
  subtitle: role.company,
  body: (
    <ul className="list-disc space-y-1 pl-5 marker:text-accent">
      {role.bullets.map((bullet) => (
        <li key={bullet}>{bullet}</li>
      ))}
    </ul>
  ),
}));

export function Experience() {
  return (
    <section id="experience" className="section border-t border-line">
      <div className="container-page">
        <SectionHeader
          eyebrow="04 / EXPERIENCE"
          title="Experience & education"
          description="Practical apprenticeship experience alongside my degree studies."
        />

        <Reveal>
          <Timeline items={[...experienceItems, ...educationItems]} />
        </Reveal>
      </div>
    </section>
  );
}
