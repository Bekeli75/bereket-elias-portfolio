import { fail, ok, projectToApi } from "@/lib/api";
import { sortedProjects } from "@/content/projects";

export async function GET(_request, { params }) {
  const { slug } = await params;
  const project = sortedProjects().find((item) => item.slug === slug);
  if (!project) {
    return fail("NOT_FOUND", `Project "${slug}" does not exist.`, {
      status: 404,
    });
  }

  return ok({
    ...projectToApi(project),
    problem: project.problem,
    approach: project.approach,
    result: project.result,
    learnings: project.learnings || null,
  });
}
