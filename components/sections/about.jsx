import Image from "next/image";
import { Award, CalendarDays, GraduationCap, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/motion/reveal";
import { profile } from "@/content/profile";
import { education } from "@/content/education";

const facts = [
  { icon: MapPin, label: "Location", value: profile.location },
  {
    icon: GraduationCap,
    label: "University",
    value: "AASTU",
  },
  {
    icon: CalendarDays,
    label: "Graduating",
    value: `${education[0].end} · Class of ${education[0].end}`,
  },
  { icon: Award, label: "Certification", value: "CCNA certified" },
];

export function About() {
  const current = education[0];

  return (
    <section id="about" className="section border-t border-line">
      <div className="container-page">
        <SectionHeader
          eyebrow="01 / ABOUT"
          title="About me"
          description="A quick introduction — who I am, where I study, and what I focus on."
        />

        <div className="grid items-start gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
          <Reveal>
            <figure className="relative mx-auto max-w-sm lg:max-w-none">
              <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-card">
                <Image
                  src="/images/portrait.webp"
                  alt={`Portrait of ${profile.name}`}
                  width={380}
                  height={380}
                  className="aspect-square w-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent"
                />
              </div>
              <figcaption className="mt-3 text-center font-mono text-xs uppercase tracking-widest text-muted">
                {profile.name} · {profile.location}
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-5 text-lg leading-relaxed text-muted">
              <p>
                I&apos;m a fourth-year Electrical and Computer Engineering
                student at Addis Ababa Science and Technology University,
                specializing in Computer Engineering.
              </p>
              <p>
                My focus is ICT and computer networks — including practical
                network design and simulation with Cisco Packet Tracer — along
                with IoT and software fundamentals. I enjoy applying classroom
                theory to real-world engineering projects.
              </p>
              <p className="text-ink">
                Currently open to internships where I can contribute, learn
                from practicing engineers, and grow toward graduation in 2027.
              </p>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="card p-4 transition-colors hover:border-accent/40"
                >
                  <fact.icon
                    aria-hidden="true"
                    size={16}
                    className="text-accent"
                  />
                  <dt className="mt-2 font-mono text-[0.68rem] uppercase tracking-wider text-muted">
                    {fact.label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 font-mono text-xs text-muted">
              {current.degree} · {current.start}–{current.end} ({current.status}
              ) · {current.note}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
