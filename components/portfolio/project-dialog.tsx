import type { RefObject } from "react";
import { actionClasses, actionSize, ArrowIcon } from "./ui";

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
          className="absolute top-2 right-2 size-10 cursor-pointer rounded-full border-0 bg-transparent p-0 text-[25px]"
          type="button"
          aria-label="Close panel"
          onClick={() => dialogRef.current?.close()}
        >
          ×
        </button>
        <h2 id="panel-title" className="mb-4 text-[28px]">
          {panel.title}
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
            Visit project <ArrowIcon />
          </a>
        )}
      </div>
    </dialog>
  );
}
