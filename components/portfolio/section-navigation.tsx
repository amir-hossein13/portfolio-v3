import { slides } from "@/data/sections";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { usePortfolioLanguage } from "./portfolio-language";

interface SectionNavigationProps {
  currentSlide: number;
  onNavigate: (index: number, animate?: boolean) => void;
}

export function SectionNavigation({ currentSlide, onNavigate }: SectionNavigationProps) {
  const { copy } = usePortfolioLanguage();
  return (
    <nav
      aria-label={copy.navigation.sections}
      className={`fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-between gap-1 border-t px-3 backdrop-blur-md transition-colors duration-300 sm:gap-3 sm:px-8 ${slides[currentSlide].id === "experience" ? "border-white/10 bg-[#242424]/90 text-white" : "border-black/5 bg-white/90 text-foreground"}`}
    >
      <span className="hidden min-w-10 text-[10px] min-[360px]:inline sm:min-w-[85px] sm:text-[11px]">
        <span className="inline-block font-mono" dir="ltr">
          0{currentSlide + 1} / {String(slides.length).padStart(2, "0")}
        </span>
        <span className="ms-3 hidden sm:inline">{copy.sections[slides[currentSlide].id]}</span>
      </span>
      <div className="flex items-center sm:gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`${copy.navigation.goTo} ${copy.sections[slide.id]}`}
            aria-current={currentSlide === index ? "step" : undefined}
            onClick={() => onNavigate(index)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full sm:size-9"
          >
            <span
              className={`block h-1.5 rounded-full transition-[width,opacity] duration-300 ${currentSlide === index ? "w-6 bg-current" : "w-1.5 bg-current opacity-25"}`}
            />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={copy.navigation.previous}
          disabled={currentSlide === 0}
          onClick={() => onNavigate(currentSlide - 1, true)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-current/15 disabled:cursor-default disabled:opacity-20 sm:size-9"
        >
          <AiOutlineArrowUp className="size-4" aria-hidden="true" focusable="false" />
        </button>
        <button
          type="button"
          aria-label={copy.navigation.next}
          disabled={currentSlide === slides.length - 1}
          onClick={() => onNavigate(currentSlide + 1, true)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-current/15 disabled:cursor-default disabled:opacity-20 sm:size-9"
        >
          <AiOutlineArrowDown className="size-4" aria-hidden="true" focusable="false" />
        </button>
      </div>
    </nav>
  );
}
