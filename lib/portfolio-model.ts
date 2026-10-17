export const socialNames = ["GitHub", "LinkedIn", "Instagram", "X", "Dribbble", "Behance"] as const;
export const previewNames = ["wellness", "editorial", "dashboard", "mobile"] as const;

export interface Profile {
  firstName: string;
  lastName: string;
  role: string;
  description: string;
  availability: string;
  email: string;
  phone: string;
  whatsapp: string;
  siteUrl: string;
  seoTitle: string;
  seoDescription: string;
  portrait: { src: string; alt: string };
  socials: { name: string; href: string }[];
}
export interface Project {
  id: string;
  title: string;
  category: "Projects" | "Explorations";
  tag: string;
  preview: string;
  image: string;
  description: string;
  url: string;
  published: boolean;
}
export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  url: string;
  published: boolean;
}
export interface Service { id: string; title: string; description: string; preview: string }
export interface PortfolioContent { profile: Profile; projects: Project[]; experience: Experience[]; services: Service[] }
export interface PortfolioDocument { content: PortfolioContent; revision: number; updatedAt: string }

export function publicPortfolio(content: PortfolioContent) {
  const projects = content.projects.filter(project => project.published);
  return {
    ...content.profile,
    projects,
    experience: content.experience.filter(entry => entry.published),
    services: content.services,
    navigation: [
      { id: "work", label: "Work", count: projects.length ? String(projects.length) : "" },
      { id: "service", label: "Service", count: content.services.length ? String(content.services.length) : "" },
      { id: "experience", label: "Experience", count: "" },
      { id: "contact", label: "Contact", count: "" },
    ],
  };
}
export type PublicPortfolio = ReturnType<typeof publicPortfolio>;
