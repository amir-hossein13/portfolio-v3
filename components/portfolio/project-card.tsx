import Image from "next/image";
import type { Project } from "@/types/portfolio";
import { ProjectPreview } from "./previews/project-preview";
import { ProjectCardPreview } from "./previews/project-card-preview";
import { ArrowIcon } from "./ui";
import { usePortfolioLanguage } from "./portfolio-language";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const { copy } = usePortfolioLanguage();
  return (
    <button
      data-project
      type="button"
      onClick={() => onSelect(project)}
      className="group w-[85%] min-w-0 shrink-0 cursor-pointer snap-start bg-[#fcfcfc] pb-3 text-start shadow-[0_12px_35px_#00000005] transition-transform duration-500 ease-portfolio hover:-translate-y-1 sm:w-[65%] hero:w-auto hero:rounded-xl hero:bg-transparent hero:pb-0 hero:shadow-none"
    >
      <div
        data-project-preview
        className="relative h-[clamp(180px,40dvh,380px)] overflow-hidden hero:h-[clamp(150px,calc(25dvh_-_25px),300px)] hero:rounded-xl hero:border hero:border-black/5"
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            unoptimized
            sizes="(max-width: 900px) 90vw, (max-width: 1600px) 42vw, 650px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <>
            <div className="h-full hero:hidden">
              <ProjectPreview kind={project.preview} />
            </div>
            <div className="hidden h-full hero:block">
              <ProjectCardPreview kind={project.preview} />
            </div>
          </>
        )}
        {!project.image && (
          <span className="absolute top-3 start-3 rounded-full border border-black/5 bg-white/90 px-2.5 py-1 text-[9px] uppercase tracking-[.04em] backdrop-blur-sm">
            {copy.work.placeholder}
          </span>
        )}
        <span className="absolute end-4 bottom-4 flex size-10 items-center justify-center rounded-full bg-white text-foreground opacity-0 transition-[opacity,transform] duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 hero:size-9 hero:opacity-100 hero:shadow-sm">
          <ArrowIcon />
        </span>
      </div>
      <h3 className="mx-3 mt-3 mb-2 font-sans text-[16px] leading-snug font-normal tracking-[-.025em] sm:text-[18px] hero:mx-0 hero:mb-1.5 hero:text-[clamp(16px,1.3cqw,20px)] hero:font-medium">
        <bdi>{project.title}</bdi>
      </h3>
      <div className="mx-3 flex flex-wrap gap-2 text-[10px] text-[#555] hero:mx-0 hero:gap-1.5 hero:text-[11px]">
        <span className="rounded-full border border-[#eee] bg-white px-3 py-1 hero:px-2.5 hero:py-0.5">
          <bdi>{project.tag}</bdi>
        </span>
        <span className="rounded-full border border-[#eee] bg-white px-3 py-1 hero:px-2.5 hero:py-0.5">
          {copy.work.categories[project.category]}
        </span>
      </div>
    </button>
  );
}
