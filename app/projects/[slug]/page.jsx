import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BrandIcon } from "@/components/ui/brand-icons";
import { buttonClasses } from "@/components/ui/button";
import { ProjectIcon } from "@/components/ui/project-icon";
import { Tag } from "@/components/ui/tag";
import { profile } from "@/content/profile";
import { sortedProjects } from "@/content/projects";

const statusLabels = {
  completed: { label: "Completed", tone: "success" },
  "in-progress": { label: "In progress", tone: "accent" },
  planned: { label: "Planned", tone: "neutral" },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return sortedProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = sortedProjects().find((item) => item.slug === slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
    },
  };
}

function CaseStudySection({ title, children }) {
  return (
    <section className="border-t border-line pt-8">
      <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
        {title}
      </h2>
      <div className="mt-3 text-lg leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const all = sortedProjects();
  const project = all.find((item) => item.slug === slug);
  if (!project) notFound();

  const index = all.findIndex((item) => item.slug === slug);
  const previous = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;
  const status = statusLabels[project.status];

  const repoLink = project.links.repo;
  const demoLink = project.links.demo;

  return (
    <div className="section">
      <div className="container-page max-w-3xl">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft aria-hidden="true" size={14} />
          All projects
        </Link>

        <header className="mt-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] border border-accent/30 bg-accent/10 text-accent">
              <ProjectIcon category={project.category} size={18} />
            </span>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {project.category}
            </p>
            <Badge tone={status.tone}>{status.label}</Badge>
          </div>

          <h1 className="mt-5">{project.title}</h1>
          <p className="mt-4 text-lg text-muted md:text-xl">
            {project.summary}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {project.tech.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>

          {(repoLink || demoLink) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {repoLink && (
                <a
                  href={repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("secondary", "sm")}
                >
                  <BrandIcon name="github" size={15} />
                  Repository
                </a>
              )}
              {demoLink && (
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("secondary", "sm")}
                >
                  <ExternalLink aria-hidden="true" size={15} />
                  Live demo
                </a>
              )}
            </div>
          )}
        </header>

        <div className="mt-12 space-y-8">
          <CaseStudySection title="Problem">
            <p>{project.problem}</p>
          </CaseStudySection>
          <CaseStudySection title="Approach">
            <p>{project.approach}</p>
          </CaseStudySection>
          <CaseStudySection title="Tools">
            <div className="flex flex-wrap gap-2">
              {project.tech.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>
          </CaseStudySection>
          <CaseStudySection title="Result">
            <p>{project.result}</p>
          </CaseStudySection>
          {project.learnings && (
            <CaseStudySection title="What I learned">
              <p>{project.learnings}</p>
            </CaseStudySection>
          )}
        </div>

        <nav
          aria-label="Project pagination"
          className="mt-14 flex items-stretch justify-between gap-4 border-t border-line pt-8"
        >
          {previous ? (
            <Link
              href={`/projects/${previous.slug}`}
              className="group flex max-w-[45%] flex-col gap-1"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted">
                <ArrowLeft aria-hidden="true" size={13} />
                Previous
              </span>
              <span className="text-sm text-ink transition-colors group-hover:text-accent">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/projects/${next.slug}`}
              className="group flex max-w-[45%] flex-col items-end gap-1 text-right"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted">
                Next
                <ArrowRight aria-hidden="true" size={13} />
              </span>
              <span className="text-sm text-ink transition-colors group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          )}
        </nav>

        <p className="mt-10 text-center font-mono text-xs text-muted">
          Want the full picture?{" "}
          <a
            href={`/cv/${encodeURIComponent("Bereket_Elias_CV.pdf")}`}
            className="text-accent transition-colors hover:text-ink"
          >
            Download {profile.name.split(" ")[0]}&apos;s CV
          </a>
        </p>
      </div>
    </div>
  );
}
