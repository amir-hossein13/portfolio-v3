import type { Experience } from "@/types/portfolio";
import { AiOutlineArrowRight } from "react-icons/ai";
import { usePortfolioLanguage } from "../portfolio-language";

export function ExperienceSection({ experience }: { experience: Experience[] }) {
  const { copy } = usePortfolioLanguage();
  return (
    <section
      data-slide
      tabIndex={-1}
      id="experience"
      className="relative flex min-h-svh hero:h-dvh flex-col [justify-content:safe_center] overflow-x-clip hero:overflow-y-auto bg-[#242424] px-6 pt-[clamp(32px,6dvh,80px)] pb-20 text-white focus-visible:outline-none sm:px-10 hero:px-[8%]"
      aria-labelledby="experience-title"
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-5 text-center text-[12.6cqw] leading-none font-semibold tracking-[.055em] text-white/[.025]"
        aria-hidden="true"
      >
        {copy.experience.backdrop}
      </span>
      <div
        data-reveal
        className="relative mb-8 flex shrink-0 flex-wrap items-center justify-between gap-5"
      >
        <h2
          id="experience-title"
          className="m-0 font-sans text-[clamp(30px,3.7cqw,48px)] font-medium tracking-[-.04em] text-white"
        >
          {copy.experience.title}
        </h2>
        <span className="text-[13px] text-white/45">{copy.experience.subtitle}</span>
      </div>
      <div className="relative">
        {!experience.length && (
          <p className="py-16 text-[16px] text-white/60">{copy.experience.empty}</p>
        )}
        {experience.map((entry) => (
          <div
            data-reveal
            key={entry.id}
            className="group flex flex-col justify-between gap-3 border-b border-white/15 py-[clamp(20px,4dvh,42px)] sm:flex-row sm:items-center"
          >
            <div>
              <h3 className="m-0 mb-2 font-sans text-[18px] font-normal tracking-[-.015em] text-white sm:text-[21px]">
                {entry.url ? (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:underline underline-offset-4"
                  >
                    <bdi>{entry.company}</bdi>{" "}
                    <AiOutlineArrowRight
                      className="size-4 -rotate-45 rtl:-scale-x-100"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </a>
                ) : (
                  <bdi>{entry.company}</bdi>
                )}
              </h3>
              <p className="m-0 text-[14px] text-white/45 sm:text-[17px]">{entry.role}</p>
              {entry.description && (
                <p className="mt-3 mb-0 max-w-[650px] whitespace-pre-line text-[14px] leading-relaxed text-white/60">
                  {entry.description}
                </p>
              )}
            </div>
            <span className="text-[13px] text-white/45 sm:text-[16px]">{entry.period}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
