"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import type { PublicPortfolio } from "@/lib/portfolio-model";
import { ProjectPreview } from "./portfolio-visuals";
import { ProjectCardPreview } from "./project-card-preview";
import { slides, useSectionSlides } from "./use-section-slides";

gsap.registerPlugin(ScrollToPlugin);

const actionClasses =
  "group inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-[#333] bg-foreground font-normal text-white shadow-control transition-[transform,box-shadow,background] duration-300 ease-portfolio hover:-translate-y-0.5 hover:bg-[#303030] hover:shadow-floating";
const actionSize = "min-h-[42px] gap-2.5 px-5 text-[13px]";

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={`size-[18px] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${className}`} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 15 15 5M5.5 5H15v9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ActionLink({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return <a className={`${actionClasses} ${compact ? "min-h-9 gap-2 px-3 text-[11px] sm:min-h-[42px] sm:gap-2.5 sm:px-5 sm:text-[13px]" : actionSize}`} href="#contact">{children}<ArrowIcon /></a>;
}

function SocialIcon({ name }: { name: string }) {
  if (name === "X") return <span className="text-[15px] leading-none" aria-hidden="true">𝕏</span>;
  if (name === "Behance") return <span className="text-[13px] leading-none" aria-hidden="true">Bē</span>;
  return (
    <svg className="size-[17px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "Dribbble" && <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M7 5.2c4.7 5 7.4 10.4 8.3 14.4M4 9.5c5.4 1 11.4-.4 15.3-3.4M5.6 18.1c3.6-5.6 8.4-7.2 14.9-5.5" />
      </>}
      {name === "GitHub" && <path d="M9 20c-4 1-4-2-5-2m10 4v-3.2c0-.9.1-1.5-.4-2 3-.3 6-1.5 6-6.5 0-1.4-.5-2.5-1.3-3.4.1-.4.5-1.7-.1-3.4 0 0-1-.3-3.5 1.3a12 12 0 0 0-6.4 0C5.8 3.2 4.8 3.5 4.8 3.5c-.6 1.7-.2 3-.1 3.4A5 5 0 0 0 3.4 10c0 5 3 6.3 6 6.6-.4.4-.6 1-.6 2V22" />}
      {name === "Instagram" && <>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="17" cy="7" r=".8" fill="currentColor" stroke="none" />
      </>}
      {name === "LinkedIn" && <>
        <rect x="4" y="4" width="16" height="16" rx="1" />
        <path d="M8 10v6M8 7.5v.2M11 16v-6m0 2.6c0-3.4 5-3.5 5 0V16" />
      </>}
    </svg>
  );
}

function Availability({ compact = false, text }: { compact?: boolean; text: string }) {
  return (
    <span className={`inline-flex w-fit items-center whitespace-nowrap rounded-full border border-[#ececec] bg-white py-[6px] leading-[1.5] shadow-availability ${compact ? "gap-1.5 px-2 text-[10px] sm:gap-2 sm:px-3 sm:text-[13px]" : "gap-2 px-3 text-[13px]"}`}>
      <span className="size-[9px] shrink-0 rounded-full bg-signal" />
      {text}
    </span>
  );
}

export default function PortfolioHero({ portfolio }: { portfolio: PublicPortfolio }) {
  const [photo, setPhoto] = useState("");
  const [panel, setPanel] = useState({ title: "", description: "", url: "" });
  const [filter, setFilter] = useState("All");
  const [activeService, setActiveService] = useState<number | null>(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const projectTrackRef = useRef<HTMLDivElement>(null);
  const { currentSlide, goToSlide } = useSectionSlides(pageRef);
  const portraitSrc = photo || portfolio.portrait.src;
  const projects = portfolio.projects.filter(project => filter === "All" || project.category === filter);

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo); }, [photo]);

  function openPanel(title: string, description = "Profile coming soon.", url = "") {
    setPanel({ title, description, url });
    dialogRef.current?.showModal();
  }

  function contact() {
    if (portfolio.email) window.location.assign(`mailto:${portfolio.email}`);
    else openPanel("Let's collaborate", "Contact details coming soon.");
  }

  function socialLinks(footer = false) {
    const classes = `group inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#eaeaea] bg-white px-4 text-[13px] transition-[background,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#bfbfbf] hover:bg-[#f5f5f5] ${footer ? "min-w-[118px]" : "w-full hero:w-[124px]"}`;
    return portfolio.socials.filter(social => social.href).map(social => social.href ? (
      <a key={social.name} className={classes} href={social.href} target="_blank" rel="noopener noreferrer"><SocialIcon name={social.name} />{social.name}</a>
    ) : (
      <button key={social.name} className={classes} type="button" onClick={() => openPanel(social.name)}><SocialIcon name={social.name} />{social.name}</button>
    ));
  }

  return (
      <main ref={pageRef} data-current-slide={currentSlide} className="@container w-full bg-white" style={{ "--name-scale": Math.min(1, 10 / (portfolio.firstName.length + portfolio.lastName.length)) } as CSSProperties}>
        <section data-slide tabIndex={-1} id="home" className="relative isolate grid h-dvh grid-cols-1 grid-rows-[auto_auto_minmax(160px,1fr)_auto_auto] overflow-x-clip overflow-y-auto bg-white pb-16 focus-visible:outline-none hero:block hero:overflow-hidden hero:pb-0" aria-labelledby="portfolio-name" onPointerMove={(event) => {
          if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          portraitRef.current?.style.setProperty("--portrait-x", `${((event.clientX - bounds.left) / bounds.width - .5) * 10}px`);
          portraitRef.current?.style.setProperty("--portrait-y", `${((event.clientY - bounds.top) / bounds.height - .5) * 6}px`);
        }} onPointerLeave={() => {
          portraitRef.current?.style.setProperty("--portrait-x", "0px");
          portraitRef.current?.style.setProperty("--portrait-y", "0px");
        }}>
          <header data-enter className="relative z-10 grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-5 px-3 pt-5 pb-4 sm:px-8 hero:h-[104px] hero:grid-cols-[auto_1fr_auto] hero:gap-[clamp(35px,5cqw,85px)] hero:px-[4.2%] hero:py-0">
            <Availability compact text={portfolio.availability} />
            <nav className="col-span-full row-start-2 flex items-center justify-center gap-[clamp(14px,4cqw,40px)] hero:col-auto hero:row-auto hero:justify-between hero:gap-4" aria-label="Main navigation">
              {portfolio.navigation.map(item => (
                <a key={item.id} className="group inline-flex items-center gap-1 py-2 text-[10px] whitespace-nowrap min-[390px]:text-[12px] sm:text-[13px] hero:gap-2 hero:text-[14px]" href={`#${item.id}`}>
                  <span className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 group-hover:after:scale-x-100">{item.label}</span>
                  {item.count && <span className="text-[9px] text-[#adadad] sm:text-[10px]">[{item.count}]</span>}
                </a>
              ))}
            </nav>
            <div className="col-start-2 row-start-1 justify-self-end hero:col-start-3"><ActionLink compact>Let&apos;s Talk</ActionLink></div>
          </header>

          <h1 data-enter id="portfolio-name" className="relative z-0 m-0 flex items-baseline justify-between gap-[.13em] px-[5.1%] pt-6 pb-0 font-display text-[calc(12.75cqw*var(--name-scale))] leading-none tracking-[.012em] whitespace-nowrap uppercase hero:absolute hero:inset-x-0 hero:top-[22.5%] hero:gap-[.2em] hero:pt-0 hero:text-[min(calc(13.05cqw*var(--name-scale)),21dvh)]">
            <span className="text-outline font-[690] text-transparent">{portfolio.firstName}</span>
            <span className="font-[850] text-display">{portfolio.lastName}</span>
          </h1>

          <div className="relative mx-auto h-full min-h-0 w-[96%] sm:w-[90%] hero:absolute hero:bottom-0 hero:left-1/2 hero:h-[64%] hero:w-[64%] hero:-translate-x-1/2">
            <div ref={portraitRef} data-enter className="relative h-full w-full transition-[translate] duration-700 ease-out [translate:var(--portrait-x,0px)_var(--portrait-y,0px)]">
              <Image className="hero-portrait object-contain object-bottom" src={portraitSrc || "/portrait-placeholder.svg"} alt={portraitSrc ? portfolio.portrait.alt : "Silhouette placeholder for your portrait"} fill loading="eager" sizes="(max-width: 900px) 90vw, 60vw" unoptimized />
              {!portraitSrc && (
                <button className="group absolute bottom-[13%] left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-3 rounded-full border border-white/55 bg-white/80 px-4 py-3 text-[12px] whitespace-nowrap text-[#333] shadow-sm backdrop-blur-md transition-colors hover:bg-white" type="button" onClick={() => inputRef.current?.click()}>
                  <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M8 6 9.5 4h5L16 6h4v14H4V6h4Z" strokeLinejoin="round" /><circle cx="12" cy="12" r="3.5" /></svg>
                  <span>Your portrait here<span className="mt-0.5 block text-[10px] text-[#777]">Add your photo ↗</span></span>
                </button>
              )}
              {photo && <button className="absolute bottom-5 left-1/2 -translate-x-1/2 cursor-pointer rounded-full border border-border bg-white px-4 py-2 text-xs shadow-sm" type="button" onClick={() => setPhoto("")}>Reset preview</button>}
              <input ref={inputRef} className="sr-only" type="file" accept="image/*" aria-label="Choose a portrait to preview" tabIndex={-1} onChange={event => {
                const file = event.target.files?.[0];
                if (file?.type.startsWith("image/")) setPhoto(URL.createObjectURL(file));
                event.target.value = "";
              }} />
            </div>
          </div>

          <div data-enter className="relative z-[2] border-t border-[#f0f0f0] bg-white px-6 pt-5 pb-5 sm:px-8 hero:absolute hero:bottom-[14%] hero:left-[7.4%] hero:w-[25%] hero:max-w-[310px] hero:border-0 hero:bg-transparent hero:p-0">
            <h2 className="m-0 mb-3 font-sans text-[clamp(24px,7.8cqw,28px)] leading-[1.2] font-semibold tracking-[-.025em] hero:text-[clamp(24px,2.05cqw,32px)]">{portfolio.role}</h2>
            {portfolio.description && <p className="m-0 mb-6 max-w-[290px] text-[14px] leading-[1.4] text-[#707070] [text-wrap:initial]">{portfolio.description}</p>}
            <ActionLink>Let&apos;s collaborate</ActionLink>
          </div>

          <nav data-enter className="relative z-[2] grid grid-cols-2 gap-2 px-6 sm:px-8 hero:absolute hero:right-[5.5%] hero:bottom-[8%] hero:flex hero:flex-col hero:gap-[18px] hero:p-0" aria-label="Social profiles">
            {socialLinks()}
          </nav>
        </section>

        <section data-slide tabIndex={-1} id="work" className="relative flex h-dvh flex-col [justify-content:safe_center] overflow-y-auto bg-white px-6 pt-[clamp(24px,5dvh,56px)] pb-20 focus-visible:outline-none sm:px-10 hero:px-[8%]" aria-labelledby="work-title">
          <div data-reveal className="relative mb-6 shrink-0 pt-6 text-center hero:mb-5 hero:pt-3">
            <span className="pointer-events-none absolute inset-x-0 -top-2 overflow-hidden text-[min(11cqw,12dvh)] leading-none font-semibold tracking-[.06em] text-[#f6f6f6]" aria-hidden="true">PORTFOLIO</span>
            <h2 id="work-title" className="relative m-0 font-sans text-[clamp(26px,3.6cqw,48px)] leading-tight font-medium tracking-[-.04em]">/SELECTED WORK</h2>
          </div>
          <div data-reveal className="mb-6 flex shrink-0 flex-wrap items-center justify-between gap-4 hero:mb-5">
            <div className="flex items-center gap-5 sm:gap-7" role="group" aria-label="Filter projects">
              {["All", "Projects", "Explorations"].map(category => <button key={category} type="button" aria-pressed={filter === category} onClick={() => { setFilter(category); projectTrackRef.current?.scrollTo({ left: 0 }); }} className={`cursor-pointer py-2 text-[12px] transition-colors sm:text-[14px] ${filter === category ? "text-foreground" : "text-[#909090] hover:text-foreground"}`}>{category}</button>)}
            </div>
            <button className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#eaeaea] bg-white px-4 py-2 text-[12px] transition-colors hover:border-[#bfbfbf]" type="button" onClick={() => setFilter("All")}>View All Work <ArrowIcon className="size-[15px]" /></button>
          </div>
          <p className="sr-only" aria-live="polite">{projects.length} projects shown</p>
          {!projects.length && <div data-reveal className="flex min-h-[260px] shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 text-center"><h3 className="mb-3 text-[22px] font-medium">{filter === "All" ? "New projects are on the way." : "No projects in this category yet."}</h3><p className="m-0 max-w-[380px] text-sm leading-relaxed text-muted">{filter === "All" ? "A selection of my work will be shared here soon." : "Choose All to see the rest of the work."}</p></div>}
          <div data-reveal ref={projectTrackRef} className="flex shrink-0 snap-x snap-mandatory gap-5 overflow-x-auto pb-3 hero:mx-auto hero:grid hero:w-full hero:max-w-[1320px] hero:grid-cols-2 hero:gap-x-7 hero:gap-y-6 hero:overflow-visible hero:pb-0">
            {projects.map(project => (
              <button data-project key={project.id} type="button" onClick={() => openPanel(project.title, project.description, project.url)} className="group w-[85%] min-w-0 shrink-0 cursor-pointer snap-start bg-[#fcfcfc] pb-3 text-left shadow-[0_12px_35px_#00000005] transition-transform duration-500 ease-portfolio hover:-translate-y-1 sm:w-[65%] hero:w-auto hero:rounded-xl hero:bg-transparent hero:pb-0 hero:shadow-none">
                <div data-project-preview className="relative h-[clamp(180px,40dvh,380px)] overflow-hidden hero:h-[clamp(150px,calc(25dvh_-_25px),300px)] hero:rounded-xl hero:border hero:border-black/5">
                  {project.image ? <Image src={project.image} alt={project.title} fill unoptimized sizes="(max-width: 900px) 90vw, (max-width: 1600px) 42vw, 650px" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" /> : <><div className="h-full hero:hidden"><ProjectPreview kind={project.preview} /></div><div className="hidden h-full hero:block"><ProjectCardPreview kind={project.preview} /></div></>}
                  {!project.image && <span className="absolute top-3 left-3 rounded-full border border-black/5 bg-white/90 px-2.5 py-1 text-[9px] uppercase tracking-[.04em] backdrop-blur-sm">Project placeholder</span>}
                  <span className="absolute right-4 bottom-4 flex size-10 items-center justify-center rounded-full bg-white text-foreground opacity-0 transition-[opacity,transform] duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 hero:size-9 hero:opacity-100 hero:shadow-sm"><ArrowIcon /></span>
                </div>
                <h3 className="mx-3 mt-3 mb-2 font-sans text-[16px] leading-snug font-normal tracking-[-.025em] sm:text-[18px] hero:mx-0 hero:mb-1.5 hero:text-[clamp(16px,1.3cqw,20px)] hero:font-medium">{project.title}</h3>
                <div className="mx-3 flex flex-wrap gap-2 text-[10px] text-[#555] hero:mx-0 hero:gap-1.5 hero:text-[11px]"><span className="rounded-full border border-[#eee] bg-white px-3 py-1 hero:px-2.5 hero:py-0.5">{project.tag}</span><span className="rounded-full border border-[#eee] bg-white px-3 py-1 hero:px-2.5 hero:py-0.5">{project.category}</span></div>
              </button>
            ))}
          </div>
          {projects.length > 1 && <div className="mt-4 flex shrink-0 items-center justify-between text-[11px] text-muted hero:hidden">
            <span>Swipe to explore</span>
            <div className="flex gap-2">{[-1, 1].map(direction => <button key={direction} type="button" aria-label={direction < 0 ? "Previous project" : "Next project"} className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-border" onClick={() => { const track = projectTrackRef.current; const cards = track?.querySelectorAll<HTMLElement>("[data-project]"); if (!track || !cards?.length) return; const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 20; const step = cards[0].offsetWidth + gap; const current = Math.round(track.scrollLeft / step); const next = Math.max(0, Math.min(current + direction, cards.length - 1)); gsap.to(track, { scrollTo: { x: next * step, autoKill: false }, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.55, ease: "power3.inOut", overwrite: "auto" }); }}><span aria-hidden="true">{direction < 0 ? "←" : "→"}</span></button>)}</div>
          </div>}
        </section>

        <section data-slide tabIndex={-1} id="service" className="flex h-dvh flex-col justify-center overflow-y-auto bg-[#f8f8f8] px-6 pt-[clamp(32px,6dvh,80px)] pb-20 focus-visible:outline-none sm:px-10 hero:px-[8%]" aria-labelledby="service-title">
          <h2 data-reveal id="service-title" className="m-0 mb-8 shrink-0 font-sans text-[clamp(30px,3.7cqw,48px)] leading-none font-medium tracking-[-.04em]">/SERVICE</h2>
          <div className="border-t border-black/15">
            {portfolio.services.map((service, index) => {
              const expanded = activeService === index;
              return (
                <article data-reveal key={service.title} className={`relative border-b transition-[color,background,border-radius,box-shadow] duration-500 ${expanded ? "rounded-md border-transparent bg-[#242424] text-white shadow-[0_10px_20px_#00000016]" : "border-black/15 bg-transparent text-foreground"}`}>
                  <button type="button" aria-expanded={expanded} aria-controls={`service-detail-${index}`} onClick={() => setActiveService(expanded ? null : index)} className="group flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-[clamp(18px,3dvh,28px)] text-left sm:px-6">
                    <h3 className="m-0 font-sans text-[clamp(23px,3.7cqw,48px)] leading-[1.1] font-normal tracking-[-.045em] text-inherit">{service.title}</h3>
                    {expanded ? <span className="pr-1 text-[35px] leading-none font-light" aria-hidden="true">×</span> : <ArrowIcon className="size-7 sm:size-8" />}
                  </button>
                  <div id={`service-detail-${index}`} aria-hidden={!expanded} className={`grid transition-[grid-template-rows,opacity] duration-500 ease-portfolio ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="min-h-0 overflow-hidden">
                      <div className="flex items-end justify-between gap-8 px-4 pb-6 sm:px-6 sm:pb-8">
                        <p className="m-0 max-w-[350px] text-[14px] leading-[1.5] text-[#a7a7a7] sm:text-[16px]">{service.description}</p>
                        {expanded && <div className="absolute -top-3 right-[8%] hidden h-[clamp(100px,18dvh,170px)] w-[28%] rotate-[7deg] overflow-hidden border-[7px] border-[#fafafa] shadow-xl hero:block"><ProjectPreview kind={service.preview} /></div>}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section data-slide tabIndex={-1} id="experience" className="relative flex h-dvh flex-col [justify-content:safe_center] overflow-x-clip overflow-y-auto bg-[#242424] px-6 pt-[clamp(32px,6dvh,80px)] pb-20 text-white focus-visible:outline-none sm:px-10 hero:px-[8%]" aria-labelledby="experience-title">
          <span className="pointer-events-none absolute inset-x-0 top-5 text-center text-[12.6cqw] leading-none font-semibold tracking-[.055em] text-white/[.025]" aria-hidden="true">EXPERIENCE</span>
          <div data-reveal className="relative mb-8 flex shrink-0 flex-wrap items-center justify-between gap-5">
            <h2 id="experience-title" className="m-0 font-sans text-[clamp(30px,3.7cqw,48px)] font-medium tracking-[-.04em] text-white">/EXPERIENCE</h2>
            <span className="text-[13px] text-white/45">Your career, at a glance.</span>
          </div>
          <div className="relative">
            {!portfolio.experience.length && <p className="py-16 text-[16px] text-white/60">Experience details coming soon.</p>}
            {portfolio.experience.map((entry) => (
              <div data-reveal key={entry.id} className="group flex flex-col justify-between gap-3 border-b border-white/15 py-[clamp(20px,4dvh,42px)] sm:flex-row sm:items-center">
                <div><h3 className="m-0 mb-2 font-sans text-[18px] font-normal tracking-[-.015em] text-white sm:text-[21px]">{entry.url ? <a href={entry.url} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">{entry.company} ↗</a> : entry.company}</h3><p className="m-0 text-[14px] text-white/45 sm:text-[17px]">{entry.role}</p>{entry.description && <p className="mt-3 mb-0 max-w-[650px] whitespace-pre-line text-[14px] leading-relaxed text-white/60">{entry.description}</p>}</div>
                <span className="text-[13px] text-white/45 sm:text-[16px]">{entry.period}</span>
              </div>
            ))}
          </div>
        </section>

        <footer data-slide tabIndex={-1} id="contact" aria-labelledby="contact-title" className="flex h-dvh flex-col justify-center overflow-y-auto bg-white px-6 pt-10 pb-20 text-center focus-visible:outline-none sm:px-10 hero:px-[8%]">
          <div data-reveal className="mx-auto flex w-full max-w-[1040px] flex-1 flex-col items-center justify-center py-8">
            <Availability text={portfolio.availability} />
            <h2 id="contact-title" className="mt-8 mb-4 font-sans text-[clamp(30px,4.4cqw,64px)] leading-[1.05] font-semibold tracking-[-.04em]">HAVE A PROJECT IN MIND?</h2>
            <p className="m-0 max-w-[700px] text-[14px] leading-relaxed text-[#666] sm:text-[16px]">Together, we can create something clear and impactful.<br className="hidden sm:block" /> Let&apos;s collaborate to bring your ideas to life.</p>
            <button type="button" onClick={contact} className={`${actionClasses} ${actionSize} mt-8`}>Contact Me <ArrowIcon /></button>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[#666] sm:text-sm">
              {portfolio.phone && <a href={`tel:${portfolio.phone}`} className="inline-flex min-h-11 items-center rounded-full px-2 underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4" aria-label={`Call ${portfolio.phone}`}><span dir="ltr">{portfolio.phone}</span></a>}
              {portfolio.whatsapp && <a href={`https://wa.me/${portfolio.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/10 px-5 transition-colors hover:border-black/30 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4">WhatsApp <ArrowIcon /></a>}
            </div>
          </div>
          <div data-reveal className="mt-8 flex shrink-0 flex-wrap items-center justify-center gap-3 pb-6 sm:justify-between sm:gap-6 hero:px-[3%]">
            <a href="#home" className="rounded-full bg-foreground px-4 py-2.5 text-[12px] text-white">{portfolio.firstName} {portfolio.lastName}</a>
            {socialLinks(true)}
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-5 text-[10px] text-[#777] sm:text-[11px]"><span>© 2026 {portfolio.firstName} {portfolio.lastName}</span><a className="hover:text-foreground" href="#home">Back to top ↑</a></div>
        </footer>

        <nav aria-label="Section navigation" className={`fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-between gap-1 border-t px-3 backdrop-blur-md transition-colors duration-300 sm:gap-3 sm:px-8 ${currentSlide === 3 ? "border-white/10 bg-[#242424]/90 text-white" : "border-black/5 bg-white/90 text-foreground"}`}>
          <span className="min-w-10 text-[10px] sm:min-w-[85px] sm:text-[11px]"><span className="font-mono">0{currentSlide + 1} / 05</span><span className="ml-3 hidden sm:inline">{slides[currentSlide].label}</span></span>
          <div className="flex items-center sm:gap-2">{slides.map((slide, index) => <button key={slide.id} type="button" aria-label={`Go to ${slide.label}`} aria-current={currentSlide === index ? "step" : undefined} onClick={() => goToSlide(index)} className="flex size-8 cursor-pointer items-center justify-center rounded-full sm:size-9"><span className={`block h-1.5 rounded-full transition-[width,opacity] duration-300 ${currentSlide === index ? "w-6 bg-current" : "w-1.5 bg-current opacity-25"}`} /></button>)}</div>
          <div className="flex items-center gap-1"><button type="button" aria-label="Previous section" disabled={currentSlide === 0} onClick={() => goToSlide(currentSlide - 1)} className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-current/15 disabled:cursor-default disabled:opacity-20 sm:size-9"><span aria-hidden="true">↑</span></button><button type="button" aria-label="Next section" disabled={currentSlide === slides.length - 1} onClick={() => goToSlide(currentSlide + 1)} className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-current/15 disabled:cursor-default disabled:opacity-20 sm:size-9"><span aria-hidden="true">↓</span></button></div>
        </nav>

        <dialog className="m-auto w-[min(440px,calc(100%-36px))] rounded-2xl border border-border bg-white p-0 shadow-floating backdrop:bg-black/25 backdrop:backdrop-blur-[4px]" ref={dialogRef} onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close(); }} aria-labelledby="panel-title">
          <div className="relative px-8 py-12">
            <button className="absolute top-2 right-2 size-10 cursor-pointer rounded-full border-0 bg-transparent p-0 text-[25px]" type="button" aria-label="Close panel" onClick={() => dialogRef.current?.close()}>×</button>
            <h2 id="panel-title" className="mb-4 text-[28px]">{panel.title}</h2>
            <p className="m-0 whitespace-pre-line text-sm leading-relaxed text-muted">{panel.description}</p>
            {panel.url && <a href={panel.url} target="_blank" rel="noopener noreferrer" className={`${actionClasses} ${actionSize} mt-6`}>Visit project <ArrowIcon /></a>}
          </div>
        </dialog>
      </main>
  );
}
