import { ImageResponse } from "next/og";
import { portfolioContent } from "@/data/portfolio";

export const alt = "Portfolio — projects, development, and experience";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const { profile } = portfolioContent;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#fafaf8",
        color: "#242424",
        borderBottom: "16px solid #242424",
      }}
    >
      <div style={{ display: "flex", fontSize: 22, letterSpacing: 5 }}>
        DEVELOPMENT / SELECTED WORK
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", fontSize: 78, fontWeight: 700, letterSpacing: -3 }}>
          {profile.firstName} {profile.lastName}
        </div>
        <div style={{ display: "flex", fontSize: 36, color: "#666" }}>{profile.role}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22 }}>
        <span style={{ width: 12, height: 12, borderRadius: 6, background: "#24bf64" }} />
        {profile.availability || "Projects, services & experience"}
      </div>
    </div>,
    size,
  );
}
