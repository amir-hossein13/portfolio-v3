"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import type { Project } from "@/types/portfolio";
import { ArrowIcon } from "../ui";
import { ProjectCard } from "../project-card";

gsap.registerPlugin(ScrollToPlugin);

interface WorkSectionProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}
type ProjectFilter = "All" | Project["category"];
const projectFilters: ProjectFilter[] = ["All", "Projects", "Explorations"];

export function WorkSection({ projects: allProjects, onSelect }: WorkSectionProps) {
  const [filter, setFilter] = useState<ProjectFilter>("All");
  const projectTrackRef = useRef<HTMLDivElement>(null);
  const projects = allProjects.filter((project) => filter === "All" || project.category === filter);

  function scrollProjects(direction: number) {
    const track = projectTrackRef.current;
    const cards = track?.querySelectorAll<HTMLElement>("[data-project]");
    if (!track || !cards?.length) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 20;
    const step = cards[0].offsetWidth + gap;
    const current = Math.round(track.scrollLeft / step);
    const next = Math.max(0, Math.min(current + direction, cards.length - 1));
    gsap.to(track, {
      scrollTo: { x: next * step, autoKill: false },
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.55,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  }

  return (
    <section
      data-slide
      tabIndex={-1}
      id="work"
      className="relative flex h-dvh flex-col [justify-content:safe_center] overflow-y-auto bg-white px-6 pt-[clamp(24px,5dvh,56px)] pb-20 focus-visible:outline-none sm:px-10 hero:px-[8%]"
      aria-labelledby="work-title"
    >
      <div data-reveal className="relative mb-6 shrink-0 pt-6 text-center hero:mb-5 hero:pt-3">
        <span
          className="pointer-events-none absolute inset-x-0 -top-2 overflow-hidden text-[min(11cqw,12dvh)] leading-none font-semibold tracking-[.06em] text-[#f6f6f6]"
          aria-hidden="true"
        >
          PORTFOLIO
        </span>
        <h2
          id="work-title"
          className="relative m-0 font-sans text-[clamp(26px,3.6cqw,48px)] leading-tight font-medium tracking-[-.04em]"
        >
          /SELECTED WORK
        </h2>
      </div>
      <div
        data-reveal
        className="mb-6 flex shrink-0 flex-wrap items-center justify-between gap-4 hero:mb-5"
      >
        <div className="flex items-center gap-5 sm:gap-7" role="group" aria-label="Filter projects">
          {projectFilters.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={filter === category}
              onClick={() => {
                setFilter(category);
                projectTrackRef.current?.scrollTo({ left: 0 });
              }}
              className={`cursor-pointer py-2 text-[12px] transition-colors sm:text-[14px] ${filter === category ? "text-foreground" : "text-[#909090] hover:text-foreground"}`}
            >
              {category}
            </button>
          ))}
        </div>
        <button
          className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#eaeaea] bg-white px-4 py-2 text-[12px] transition-colors hover:border-[#bfbfbf]"
          type="button"
          onClick={() => setFilter("All")}
        >
          View All Work <ArrowIcon className="size-[15px]" />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {projects.length} projects shown
      </p>
      {!projects.length && (
        <div
          data-reveal
          className="flex min-h-[260px] shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 text-center"
        >
          <h3 className="mb-3 text-[22px] font-medium">
            {filter === "All"
              ? "New projects are on the way."
              : "No projects in this category yet."}
          </h3>
          <p className="m-0 max-w-[380px] text-sm leading-relaxed text-muted">
            {filter === "All"
              ? "A selection of my work will be shared here soon."
              : "Choose All to see the rest of the work."}
          </p>
        </div>
      )}
      <div
        data-reveal
        ref={projectTrackRef}
        className="flex shrink-0 snap-x snap-mandatory gap-5 overflow-x-auto pb-3 hero:mx-auto hero:grid hero:w-full hero:max-w-[1320px] hero:grid-cols-2 hero:gap-x-7 hero:gap-y-6 hero:overflow-visible hero:pb-0"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onSelect={onSelect} />
        ))}
      </div>
      {projects.length > 1 && (
        <div className="mt-4 flex shrink-0 items-center justify-between text-[11px] text-muted hero:hidden">
          <span>Swipe to explore</span>
          <div className="flex gap-2">
            {[-1, 1].map((direction) => (
              <button
                key={direction}
                type="button"
                aria-label={direction < 0 ? "Previous project" : "Next project"}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-border"
                onClick={() => scrollProjects(direction)}
              >
                <span aria-hidden="true">{direction < 0 ? "←" : "→"}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
