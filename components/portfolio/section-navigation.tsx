import { slides } from "@/data/sections";

interface SectionNavigationProps {
  currentSlide: number;
  onNavigate: (index: number) => void;
}

export function SectionNavigation({ currentSlide, onNavigate }: SectionNavigationProps) {
  return (
    <nav
      aria-label="Section navigation"
      className={`fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-between gap-1 border-t px-3 backdrop-blur-md transition-colors duration-300 sm:gap-3 sm:px-8 ${slides[currentSlide].id === "experience" ? "border-white/10 bg-[#242424]/90 text-white" : "border-black/5 bg-white/90 text-foreground"}`}
    >
      <span className="min-w-10 text-[10px] sm:min-w-[85px] sm:text-[11px]">
        <span className="font-mono">
          0{currentSlide + 1} / {String(slides.length).padStart(2, "0")}
        </span>
        <span className="ml-3 hidden sm:inline">{slides[currentSlide].label}</span>
      </span>
      <div className="flex items-center sm:gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to ${slide.label}`}
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
          aria-label="Previous section"
          disabled={currentSlide === 0}
          onClick={() => onNavigate(currentSlide - 1)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-current/15 disabled:cursor-default disabled:opacity-20 sm:size-9"
        >
          <span aria-hidden="true">↑</span>
        </button>
        <button
          type="button"
          aria-label="Next section"
          disabled={currentSlide === slides.length - 1}
          onClick={() => onNavigate(currentSlide + 1)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-current/15 disabled:cursor-default disabled:opacity-20 sm:size-9"
        >
          <span aria-hidden="true">↓</span>
        </button>
      </div>
    </nav>
  );
}
