import { ok, projectToApi } from "@/lib/api";
import { sortedProjects } from "@/content/projects";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  let items = sortedProjects().map(projectToApi);

  const category = searchParams.get("category");
  if (category) items = items.filter((item) => item.category === category);

  const featured = searchParams.get("featured");
  if (featured === "true") items = items.filter((item) => item.featured);

  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 20, 1), 50);
  const cursor = searchParams.get("cursor");
  const start = cursor
    ? Math.max(items.findIndex((item) => item.slug === cursor) + 1, 0)
    : 0;
  const page = items.slice(start, start + limit);
  const nextCursor =
    start + limit < items.length ? page[page.length - 1]?.slug : null;

  return ok(
    { items: page, nextCursor },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
