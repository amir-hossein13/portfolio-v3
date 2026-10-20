import type { RefObject } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { actionClasses, actionSize, ArrowIcon } from "./ui";
import { usePortfolioLanguage } from "./portfolio-language";

export interface ProjectPanel {
  title: string;
  description: string;
  url: string;
}

interface ProjectDialogProps {
  panel: ProjectPanel;
  dialogRef: RefObject<HTMLDialogElement | null>;
}

export function ProjectDialog({ panel, dialogRef }: ProjectDialogProps) {
  const { copy } = usePortfolioLanguage();
  return (
    <dialog
      className="m-auto w-[min(440px,calc(100%-36px))] rounded-2xl border border-border bg-white p-0 shadow-floating backdrop:bg-black/25 backdrop:backdrop-blur-[4px]"
      ref={dialogRef}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      aria-labelledby="panel-title"
    >
      <div className="relative px-8 py-12">
        <button
          className="absolute top-2 end-2 flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0"
          type="button"
          aria-label={copy.dialog.close}
          onClick={() => dialogRef.current?.close()}
        >
          <AiOutlineClose className="size-5" aria-hidden="true" focusable="false" />
        </button>
        <h2 id="panel-title" className="mb-4 text-[28px]">
          <bdi>{panel.title}</bdi>
        </h2>
        <p className="m-0 whitespace-pre-line text-sm leading-relaxed text-muted">
          {panel.description}
        </p>
        {panel.url && (
          <a
            href={panel.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${actionClasses} ${actionSize} mt-6`}
          >
            {copy.dialog.visit} <ArrowIcon />
          </a>
        )}
      </div>
    </dialog>
  );
}
