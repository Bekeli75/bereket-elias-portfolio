import { Download } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PrintButton } from "@/components/ui/print-button";
import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import { skillCategories } from "@/content/skills";
import { certifications } from "@/content/certifications";

export const metadata = {
  title: "Resume",
  description: `Print-friendly resume for ${profile.name} — ${profile.title}.`,
  alternates: { canonical: "/resume" },
};

const levelLabel = {
  familiar: "Familiar",
  working: "Working",
  strong: "Strong",
};

export default function ResumePage() {
  return (
    <article className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">Resume</p>
            <h1 className="text-4xl md:text-5xl">{profile.name}</h1>
            <p className="mt-2 font-medium text-accent">{profile.title}</p>
            <p className="mt-3 text-sm text-muted">
              {profile.email} · {profile.location}
            </p>
            {profile.availability.open && (
              <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted">
                {profile.availability.label}
              </p>
            )}
          </div>

          <div className="print-hide flex gap-2">
            <PrintButton />
            <ButtonLink
              href="/api/resume/download?source=resume"
              variant="ghost"
              size="sm"
            >
              <Download aria-hidden="true" size={15} />
              PDF
            </ButtonLink>
          </div>
        </header>

        <section className="print-block">
          <h2>Summary</h2>
          <p className="mt-3 text-muted md:text-lg">{profile.summary}</p>
        </section>

        <section className="print-block">
          <h2>Experience</h2>
          <div className="mt-5 space-y-6">
            {experience.map((role) => (
              <div key={`${role.company}-${role.role}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg">{role.role}</h3>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted">
                    {role.start} – {role.end}
                  </span>
                </div>
                <p className="text-sm font-medium text-accent">{role.company}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted marker:text-accent">
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="print-block">
          <h2>Education</h2>
          <div className="mt-5 space-y-6">
            {education.map((entry) => (
              <div key={entry.institution}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg">{entry.degree}</h3>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted">
                    {entry.start} – {entry.end} ({entry.status})
                  </span>
                </div>
                <p className="text-sm font-medium text-accent">
                  {entry.institution}
                </p>
                <p className="mt-1 text-sm text-muted">
                  Specialization: {entry.specialization} · {entry.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="print-block">
          <h2>Skills</h2>
          <div className="mt-5 space-y-4">
            {skillCategories.map((category) => (
              <div key={category.name}>
                <h3 className="text-base">{category.name}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item.name}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1 text-sm text-ink"
                    >
                      {item.name}
                      <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                        · {levelLabel[item.level]}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="print-block">
          <h2>Certifications</h2>
          <ul className="mt-5 space-y-3">
            {certifications.map((cert) => (
              <li
                key={cert.title}
                className="flex flex-wrap items-baseline justify-between gap-2"
              >
                <span className="text-ink">{cert.title}</span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted">
                  {cert.issuer}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}