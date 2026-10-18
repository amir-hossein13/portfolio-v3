export type SocialName = "GitHub" | "LinkedIn" | "Instagram" | "X" | "Dribbble" | "Behance";
export type PreviewKind = "wellness" | "editorial" | "dashboard" | "mobile";
export type SectionId = "home" | "work" | "service" | "experience" | "contact";

export interface SocialProfile {
  name: SocialName;
  href: string;
}

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
  socials: SocialProfile[];
}

export interface Project {
  id: string;
  title: string;
  category: "Projects" | "Explorations";
  tag: string;
  preview: PreviewKind;
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

export interface Service {
  id: string;
  title: string;
  description: string;
  preview: PreviewKind;
}

export interface PortfolioContent {
  profile: Profile;
  projects: Project[];
  experience: Experience[];
  services: Service[];
}

export interface PortfolioSnapshot {
  content: PortfolioContent;
  updatedAt: string;
}

export interface NavigationItem {
  id: Exclude<SectionId, "home">;
  label: string;
  count: string;
}

export interface PublicPortfolio extends Profile {
  projects: Project[];
  experience: Experience[];
  services: Service[];
  navigation: NavigationItem[];
}
