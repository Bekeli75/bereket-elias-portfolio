import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
            color: "#22d3a6",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 48, height: 2, background: "#4f8cff" }} />
          {profile.availability.label}
        </div>

        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            marginTop: 28,
            letterSpacing: -3,
          }}
        >
          {profile.name}
        </div>

        <div style={{ fontSize: 40, color: "#8b95a8", marginTop: 8 }}>
          {profile.title}
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#4f8cff",
            marginTop: 36,
            display: "flex",
          }}
        >
          Networks · IoT · Software — built to be reliable.
        </div>
      </div>
    ),
    { ...size },
  );
}
