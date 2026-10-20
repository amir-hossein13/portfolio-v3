"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { AiOutlineCheck, AiOutlineDown } from "react-icons/ai";
import type { SectionId } from "@/types/portfolio";
import { usePortfolioLanguage } from "./portfolio-language";

const languages = [
  { locale: "en", name: "English", flag: "/flags/gb.svg", path: "/", direction: "ltr" },
  { locale: "ar", name: "العربية", flag: "/flags/ae.svg", path: "/ar", direction: "rtl" },
] as const;

export function LanguageSwitcher({ section }: { section: SectionId }) {
  const { locale, copy } = usePortfolioLanguage();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const controlRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const current = languages.find((language) => language.locale === locale)!;

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !controlRef.current?.contains(event.target))
        setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div
      ref={controlRef}
      className="relative shrink-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={copy.navigation.chooseLanguage}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
        className="inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-full border border-black/10 bg-white px-2 transition-colors hover:bg-black/[.03] sm:min-h-[42px] sm:gap-2 sm:px-3"
      >
        <Image
          src={current.flag}
          alt=""
          width={24}
          height={12}
          className="h-3 w-6 rounded-[2px] ring-1 ring-black/10"
        />
        <span lang={locale} dir={current.direction} className="hidden text-[12px] sm:inline">
          {current.name}
        </span>
        <AiOutlineDown
          className={`size-2.5 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <nav
        id={menuId}
        aria-label={copy.navigation.chooseLanguage}
        hidden={!open}
        className="absolute end-0 top-full z-50 mt-2 w-44 rounded-2xl border border-border bg-white p-1.5 shadow-floating"
      >
        {languages.map((language) => (
          <a
            key={language.locale}
            href={`${language.path}#${section}`}
            hrefLang={language.locale}
            lang={language.locale}
            aria-label={language.locale === locale ? language.name : copy.navigation.language}
            aria-current={language.locale === locale ? "true" : undefined}
            onClick={(event) => {
              if (language.locale === locale) event.preventDefault();
              setOpen(false);
            }}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] transition-colors hover:bg-black/5 ${language.locale === locale ? "bg-black/[.04]" : ""}`}
          >
            <Image
              src={language.flag}
              alt=""
              width={24}
              height={12}
              className="h-3 w-6 shrink-0 rounded-[2px] ring-1 ring-black/10"
            />
            <span className="flex-1">
              <bdi dir={language.direction}>{language.name}</bdi>
            </span>
            {language.locale === locale && (
              <AiOutlineCheck className="size-3.5" aria-hidden="true" />
            )}
          </a>
        ))}
      </nav>
    </div>
  );
}
