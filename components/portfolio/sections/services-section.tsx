"use client";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import type { Service } from "@/types/portfolio";
import { ArrowIcon } from "../ui";
import { ProjectPreview } from "../previews/project-preview";
import { usePortfolioLanguage } from "../portfolio-language";

export function ServicesSection({ services }: { services: Service[] }) {
  const { copy } = usePortfolioLanguage();
  const [activeService, setActiveService] = useState<number | null>(0);
  return (
    <section
      data-slide
      tabIndex={-1}
      id="service"
      className="flex min-h-svh hero:h-dvh flex-col [justify-content:safe_center] hero:overflow-y-auto bg-[#f8f8f8] px-6 pt-[clamp(32px,6dvh,80px)] pb-20 focus-visible:outline-none sm:px-10 hero:px-[8%]"
      aria-labelledby="service-title"
    >
      <h2
        data-reveal
        id="service-title"
        className="m-0 mb-8 shrink-0 font-sans text-[clamp(30px,3.7cqw,48px)] leading-none font-medium tracking-[-.04em]"
      >
        {copy.services.title}
      </h2>
      <div className="border-t border-black/15">
        {services.map((service, index) => {
          const expanded = activeService === index;
          return (
            <article
              data-reveal
              key={service.title}
              className={`relative border-b transition-[color,background,border-radius,box-shadow] duration-500 ${expanded ? "rounded-md border-transparent bg-[#242424] text-white shadow-[0_10px_20px_#00000016]" : "border-black/15 bg-transparent text-foreground"}`}
            >
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`service-detail-${index}`}
                onClick={() => setActiveService(expanded ? null : index)}
                className="group flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-[clamp(18px,3dvh,28px)] text-start sm:px-6"
              >
                <h3 className="m-0 font-sans text-[clamp(23px,3.7cqw,48px)] leading-[1.1] font-normal tracking-[-.045em] text-inherit hero:max-w-[65%]">
                  {service.title}
                </h3>
                {expanded ? (
                  <AiOutlineClose
                    className="size-7 shrink-0 sm:size-8"
                    aria-hidden="true"
                    focusable="false"
                  />
                ) : (
                  <ArrowIcon className="size-7 sm:size-8" />
                )}
              </button>
              <div
                id={`service-detail-${index}`}
                aria-hidden={!expanded}
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-portfolio ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="flex items-end justify-between gap-8 px-4 pb-6 sm:px-6 sm:pb-8">
                    <p className="m-0 max-w-[350px] text-[14px] leading-[1.5] text-[#a7a7a7] sm:text-[16px]">
                      {service.description}
                    </p>
                    {expanded && (
                      <div className="absolute -top-3 end-[8%] hidden h-[clamp(100px,18dvh,170px)] w-[28%] rotate-[7deg] overflow-hidden border-[7px] border-[#fafafa] shadow-xl hero:block">
                        <div dir="ltr" className="h-full">
                          <ProjectPreview kind={service.preview} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
