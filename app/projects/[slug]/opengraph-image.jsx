import { ImageResponse } from "next/og";
import { sortedProjects } from "@/content/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return sortedProjects().map((project) => ({ slug: project.slug }));
}

export default async function OpengraphImage({ params }) {
  const { slug } = await params;
  const project = sortedProjects().find((item) => item.slug === slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#07090f",
          color: "#e8ecf4",
          backgroundImage:
            "linear-gradient(rgba(232,236,244,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(232,236,244,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#4f8cff",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 48, height: 2, background: "#4f8cff" }} />
          {project ? `${project.category} · Case study` : "Case study"}
        </div>

        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            marginTop: 28,
            letterSpacing: -2,
          }}
        >
          {project ? project.title : "Project"}
        </div>

        <div
          style={{
            fontSize: 30,
            color: "#8b95a8",
            marginTop: 16,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project ? project.summary : ""}
        </div>

        <div style={{ fontSize: 26, color: "#22d3a6", marginTop: 40 }}>
          bereketelias — Portfolio
        </div>
      </div>
    ),
    { ...size },
  );
}
