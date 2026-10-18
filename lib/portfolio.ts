import type { PortfolioContent, PublicPortfolio } from "@/types/portfolio";

export function getPublicPortfolio(content: PortfolioContent): PublicPortfolio {
  const projects = content.projects.filter((project) => project.published);
  return {
    ...content.profile,
    projects,
    experience: content.experience.filter((entry) => entry.published),
    services: content.services,
    navigation: [
      { id: "work", label: "Work", count: projects.length ? String(projects.length) : "" },
      {
        id: "service",
        label: "Service",
        count: content.services.length ? String(content.services.length) : "",
      },
      { id: "experience", label: "Experience", count: "" },
      { id: "contact", label: "Contact", count: "" },
    ],
  };
}
