"use client";

import { useRef, useState, type CSSProperties } from "react";
import type { Project, PublicPortfolio } from "@/types/portfolio";
import { useSectionSlides } from "@/hooks/use-section-slides";
import { HeroSection } from "./sections/hero-section";
import { WorkSection } from "./sections/work-section";
import { ServicesSection } from "./sections/services-section";
import { ExperienceSection } from "./sections/experience-section";
import { ContactSection } from "./sections/contact-section";
import { SectionNavigation } from "./section-navigation";
import { ProjectDialog, type ProjectPanel } from "./project-dialog";
import type { Locale, PortfolioDictionary } from "@/data/locales/en";
import { PortfolioLanguageProvider } from "./portfolio-language";
import { slides } from "@/data/sections";

export default function Portfolio({
  portfolio,
  locale,
  copy,
}: {
  portfolio: PublicPortfolio;
  locale: Locale;
  copy: PortfolioDictionary;
}) {
  const pageRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [panel, setPanel] = useState<ProjectPanel>({ title: "", description: "", url: "" });
  const { currentSlide, goToSlide } = useSectionSlides(pageRef);
  const nameScale = Math.min(1, 10 / (portfolio.firstName.length + portfolio.lastName.length));

  function openProject(project: Project) {
    setPanel({ title: project.title, description: project.description, url: project.url });
    dialogRef.current?.showModal();
  }

  function contact() {
    if (portfolio.email) {
      window.location.assign(`mailto:${portfolio.email}`);
      return;
    }
    setPanel({ title: copy.hero.collaborate, description: copy.contact.unavailable, url: "" });
    dialogRef.current?.showModal();
  }

  return (
    <PortfolioLanguageProvider locale={locale} copy={copy}>
      <main
        ref={pageRef}
        data-current-slide={currentSlide}
        className="@container w-full bg-white"
        style={{ "--name-scale": nameScale } as CSSProperties}
      >
        <HeroSection
          profile={portfolio}
          navigation={portfolio.navigation}
          currentSection={slides[currentSlide].id}
        />
        <WorkSection projects={portfolio.projects} onSelect={openProject} />
        <ServicesSection services={portfolio.services} />
        <ExperienceSection experience={portfolio.experience} />
        <ContactSection profile={portfolio} onContact={contact} />
        <SectionNavigation currentSlide={currentSlide} onNavigate={goToSlide} />
        <ProjectDialog panel={panel} dialogRef={dialogRef} />
      </main>
    </PortfolioLanguageProvider>
  );
}
