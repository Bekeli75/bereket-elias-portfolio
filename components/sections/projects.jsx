"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectIcon } from "@/components/ui/project-icon";
import { SectionHeader } from "@/components/ui/section-header";
import { Tag } from "@/components/ui/tag";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { projectCategories, sortedProjects } from "@/content/projects";

const statusLabels = {
  completed: { label: "Completed", tone: "success" },
  "in-progress": { label: "In progress", tone: "accent" },
  planned: { label: "Planned", tone: "neutral" },
};

function ProjectCover({ project }) {
  return (
    <div className="grid-backdrop relative flex aspect-[16/10] items-center justify-center border-b border-line bg-surface-2">
      <ProjectIcon
        category={project.category}
        size={40}
        className="text-muted/60"
      />
      <span className="absolute left-3 top-3">
        <Badge tone="neutral">{project.category}</Badge>
      </span>
      <span className="absolute bottom-3 right-3 font-mono text-[0.65rem] uppercase tracking-widest text-muted">
        {project.cover ? "" : "screenshot pending"}
      </span>
    </div>
  );
}

function ProjectCard({ project }) {
  const status = statusLabels[project.status];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card card-hover group flex h-full flex-col overflow-hidden"
    >
      <ProjectCover project={project} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg">{project.title}</h3>
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>
        <p className="mt-2 flex-1 text-sm text-muted">{project.summary}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {project.tech.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
          <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            Case study
            <ArrowRight aria-hidden="true" size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function Projects() {
  const all = sortedProjects();
  const categories = projectCategories();
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get(
      "category",
    );
    if (initial && (initial === "All" || categories.includes(initial))) {
      setCategory(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectCategory = (next) => {
    setCategory(next);
    const url = new URL(window.location.href);
    if (next === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.replaceState(null, "", url);
  };

  const visible =
    category === "All"
      ? all
      : all.filter((project) => project.category === category);

  return (
    <section id="projects" className="section border-t border-line">
      <div className="container-page">
        <SectionHeader
          eyebrow="03 / PROJECTS"
          title="Projects"
          description="Coursework and personal builds — each with a short case study: problem, approach, and result."
        />

        <div
          role="group"
          aria-label="Filter projects by category"
          className="-mt-4 mb-8 flex flex-wrap gap-2"
        >
          {["All", ...categories].map((item) => {
            const active = item === category;
            return (
              <button
                key={item}
                type="button"
                onClick={() => selectCategory(item)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-line text-muted hover:border-accent/50 hover:text-ink"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <p className="card p-8 text-center text-muted">
            No projects in this category yet.
          </p>
        ) : (
          <Stagger className="grid gap-4 lg:grid-cols-2">
            {visible.map((project, index) => (
              <StaggerItem
                key={project.slug}
                className={index === 0 ? "lg:col-span-2" : ""}
              >
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
