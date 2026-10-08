import { sortedProjects } from "@/content/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap() {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...sortedProjects().map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    })),
  ];
}
