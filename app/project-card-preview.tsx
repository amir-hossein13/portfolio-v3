"use client";

import { useLayoutEffect, useRef } from "react";
import { ProjectPreview } from "./portfolio-visuals";

const backdrops: Record<string, string> = {
  wellness: "#211821",
  editorial: "#e7e5de",
  dashboard: "#202124",
  mobile: "#e7ebe8",
};

const artboardHeights: Record<string, number> = {
  wellness: 420,
  editorial: 360,
  dashboard: 320,
  mobile: 360,
};

// Fit the existing concept artwork as a complete composition, like object-contain
// for an image. Its fixed artboard keeps the mockup details in proportion.
export function ProjectCardPreview({ kind }: { kind: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const height = artboardHeights[kind] || 420;

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const fit = () => {
      if (!stage.clientWidth || !stage.clientHeight) return;
      const scale = Math.min(stage.clientWidth / 600, stage.clientHeight / height);
      stage.style.setProperty("--preview-scale", String(scale));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [height]);

  return <div ref={stageRef} aria-hidden="true" className="relative h-full w-full overflow-hidden" style={{ backgroundColor: backdrops[kind] || backdrops.mobile }}>
    <div className="absolute top-1/2 left-1/2 w-[600px] origin-center [transform:translate(-50%,-50%)_scale(var(--preview-scale,.5))]" style={{ height }}>
      <ProjectPreview kind={kind} />
    </div>
  </div>;
}
