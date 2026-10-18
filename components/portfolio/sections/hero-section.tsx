"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent, type PointerEvent } from "react";
import type { Profile, PublicPortfolio } from "@/types/portfolio";
import { ActionLink, Availability } from "../ui";
import { SocialLinks } from "../social-links";

interface HeroSectionProps {
  profile: Profile;
  navigation: PublicPortfolio["navigation"];
}

export function HeroSection({ profile, navigation }: HeroSectionProps) {
  const [photo, setPhoto] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const portraitSrc = photo || profile.portrait.src;

  useEffect(
    () => () => {
      if (photo) URL.revokeObjectURL(photo);
    },
    [photo],
  );

  function movePortrait(event: PointerEvent<HTMLElement>) {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6;

    portraitRef.current?.style.setProperty("--portrait-x", `${x}px`);
    portraitRef.current?.style.setProperty("--portrait-y", `${y}px`);
  }

  function resetPortraitPosition() {
    portraitRef.current?.style.setProperty("--portrait-x", "0px");
    portraitRef.current?.style.setProperty("--portrait-y", "0px");
  }

  function previewPortrait(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file?.type.startsWith("image/")) {
      setPhoto(URL.createObjectURL(file));
    }

    event.target.value = "";
  }

  return (
    <section
      data-slide
      tabIndex={-1}
      id="home"
      className="relative isolate grid h-dvh grid-cols-1 grid-rows-[auto_auto_minmax(160px,1fr)_auto_auto] overflow-x-clip overflow-y-auto bg-white pb-16 focus-visible:outline-none hero:block hero:overflow-hidden hero:pb-0"
      aria-labelledby="portfolio-name"
      onPointerMove={movePortrait}
      onPointerLeave={resetPortraitPosition}
    >
      <header
        data-enter
        className="relative z-10 grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-5 px-3 pt-5 pb-4 sm:px-8 hero:h-[104px] hero:grid-cols-[auto_1fr_auto] hero:gap-[clamp(35px,5cqw,85px)] hero:px-[4.2%] hero:py-0"
      >
        <Availability compact text={profile.availability} />
        <nav
          className="col-span-full row-start-2 flex items-center justify-center gap-[clamp(14px,4cqw,40px)] hero:col-auto hero:row-auto hero:justify-between hero:gap-4"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <a
              key={item.id}
              className="group inline-flex items-center gap-1 py-2 text-[10px] whitespace-nowrap min-[390px]:text-[12px] sm:text-[13px] hero:gap-2 hero:text-[14px]"
              href={`#${item.id}`}
            >
              <span className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                {item.label}
              </span>
              {item.count && (
                <span className="text-[9px] text-[#adadad] sm:text-[10px]">[{item.count}]</span>
              )}
            </a>
          ))}
        </nav>
        <div className="col-start-2 row-start-1 justify-self-end hero:col-start-3">
          <ActionLink compact>Let&apos;s Talk</ActionLink>
        </div>
      </header>

      <h1
        data-enter
        id="portfolio-name"
        className="relative z-0 m-0 flex items-baseline justify-between gap-[.13em] px-[5.1%] pt-6 pb-0 font-display text-[calc(12.75cqw*var(--name-scale))] leading-none tracking-[.012em] whitespace-nowrap uppercase hero:absolute hero:inset-x-0 hero:top-[22.5%] hero:gap-[.2em] hero:pt-0 hero:text-[min(calc(13.05cqw*var(--name-scale)),21dvh)]"
      >
        <span className="text-outline font-[690] text-transparent">{profile.firstName}</span>
        <span className="font-[850] text-display">{profile.lastName}</span>
      </h1>

      <div className="relative mx-auto h-full min-h-0 w-full max-w-[480px] overflow-hidden sm:max-w-[560px] hero:absolute hero:bottom-14 hero:left-1/2 hero:h-[65%] hero:w-[min(62%,960px)] hero:max-w-none hero:-translate-x-1/2">
        <div
          ref={portraitRef}
          data-enter
          className="relative h-full w-full transition-[translate] duration-700 ease-out [translate:var(--portrait-x,0px)_var(--portrait-y,0px)]"
        >
          <Image
            className="hero-portrait object-contain object-bottom"
            src={portraitSrc || "/portrait-placeholder.svg"}
            alt={portraitSrc ? profile.portrait.alt : "Silhouette placeholder for your portrait"}
            fill
            loading="eager"
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 560px, (max-width: 1550px) 62vw, 960px"
            unoptimized
          />
          {!portraitSrc && (
            <button
              className="group absolute bottom-[13%] left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-3 rounded-full border border-white/55 bg-white/80 px-4 py-3 text-[12px] whitespace-nowrap text-[#333] shadow-sm backdrop-blur-md transition-colors hover:bg-white"
              type="button"
              onClick={() => inputRef.current?.click()}
            >
              <svg
                className="size-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
              >
                <path d="M8 6 9.5 4h5L16 6h4v14H4V6h4Z" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3.5" />
              </svg>
              <span>
                Your portrait here
                <span className="mt-0.5 block text-[10px] text-[#777]">Add your photo ↗</span>
              </span>
            </button>
          )}
          {photo && (
            <button
              className="absolute bottom-5 left-1/2 -translate-x-1/2 cursor-pointer rounded-full border border-border bg-white px-4 py-2 text-xs shadow-sm"
              type="button"
              onClick={() => setPhoto("")}
            >
              Reset preview
            </button>
          )}
          <input
            ref={inputRef}
            className="sr-only"
            type="file"
            accept="image/*"
            aria-label="Choose a portrait to preview"
            tabIndex={-1}
            onChange={previewPortrait}
          />
        </div>
      </div>

      <div
        data-enter
        className="relative z-[2] border-t border-[#f0f0f0] bg-white px-6 pt-5 pb-5 sm:px-8 hero:absolute hero:bottom-[14%] hero:left-[7.4%] hero:w-[25%] hero:max-w-[310px] hero:border-0 hero:bg-transparent hero:p-0"
      >
        <h2 className="m-0 mb-3 font-sans text-[clamp(24px,7.8cqw,28px)] leading-[1.2] font-semibold tracking-[-.025em] hero:text-[clamp(24px,2.05cqw,32px)]">
          {profile.role}
        </h2>
        {profile.description && (
          <p className="m-0 mb-6 max-w-[290px] text-[14px] leading-[1.4] text-[#707070] [text-wrap:initial]">
            {profile.description}
          </p>
        )}
        <ActionLink>Let&apos;s collaborate</ActionLink>
      </div>

      <nav
        data-enter
        className="relative z-[2] grid grid-cols-2 gap-2 px-6 sm:px-8 hero:absolute hero:right-[5.5%] hero:bottom-[8%] hero:flex hero:flex-col hero:gap-[18px] hero:p-0"
        aria-label="Social profiles"
      >
        <SocialLinks socials={profile.socials} />
      </nav>
    </section>
  );
}
