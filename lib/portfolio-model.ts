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

export class ContentError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ContentError("The content format is invalid.");
  return value as Record<string, unknown>;
}
function text(value: unknown, label: string, max = 300, required = false) {
  if (typeof value !== "string") throw new ContentError(`${label} must be text.`);
  const result = value.trim();
  if (required && !result) throw new ContentError(`${label} is required.`);
  if (result.length > max) throw new ContentError(`${label} must be ${max} characters or fewer.`);
  return result;
}
function list(value: unknown, label: string, max = 100): unknown[] {
  if (!Array.isArray(value) || value.length > max) throw new ContentError(`${label} must contain no more than ${max} items.`);
  return value;
}
function identifier(value: unknown) {
  const result = text(value, "Item ID", 64, true);
  if (!/^[a-zA-Z0-9-]+$/.test(result)) throw new ContentError("An item ID is invalid.");
  return result;
}
function link(value: unknown, label: string, image = false) {
  const result = text(value, label, 2048);
  if (!result) return "";
  if (image && (/^\/api\/media\/[a-f0-9]{32}\.(png|jpg|webp)$/.test(result) || /^\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp)$/.test(result))) return result;
  try {
    const url = new URL(result);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error();
  } catch { throw new ContentError(`${label} must be a complete http:// or https:// URL.`); }
  return result;
}
function published(value: unknown) {
  if (typeof value !== "boolean") throw new ContentError("Publication status is invalid.");
  return value;
}
function phoneNumber(value: unknown, label: string) {
  const number = text(value ?? "", label, 30).replace(/[\s()-]/g, "");
  if (number && !/^\+[1-9]\d{7,14}$/.test(number)) throw new ContentError(`${label} must include the country code, for example +989934904062.`);
  return number;
}
function preview(value: unknown) {
  if (!previewNames.includes(value as typeof previewNames[number])) throw new ContentError("Choose a valid fallback preview.");
  return value as string;
}
function unique<T extends { id: string }>(items: T[]) {
  if (new Set(items.map(item => item.id)).size !== items.length) throw new ContentError("Two items have the same ID.");
  return items;
}

export function validateContent(value: unknown): PortfolioContent {
  const input = object(value);
  const p = object(input.profile);
  const portrait = object(p.portrait);
  const email = text(p.email, "Email", 254);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ContentError("Enter a valid contact email.");
  const socials = list(p.socials, "Social profiles", 6).map(value => {
    const item = object(value);
    if (!socialNames.includes(item.name as typeof socialNames[number])) throw new ContentError("Choose a supported social network.");
    return { name: item.name as string, href: link(item.href, `${item.name} link`) };
  });
  if (new Set(socials.map(item => item.name)).size !== socials.length) throw new ContentError("Each social network can only appear once.");
  return {
    profile: {
      firstName: text(p.firstName, "First name", 40, true), lastName: text(p.lastName, "Last name", 60, true),
      role: text(p.role, "Position", 100, true), description: text(p.description, "Bio", 1000),
      availability: text(p.availability, "Availability", 100), email,
      phone: phoneNumber(p.phone, "Phone number"), whatsapp: phoneNumber(p.whatsapp, "WhatsApp number"),
      siteUrl: (() => { const value = link(p.siteUrl ?? "", "Live website URL"); if (!value) return ""; const url = new URL(value); if (url.pathname !== "/" || url.search || url.hash) throw new ContentError("The live website URL must be your domain without a path, query, or fragment."); return url.origin; })(),
      seoTitle: text(p.seoTitle ?? "", "Search title", 120), seoDescription: text(p.seoDescription ?? "", "Search description", 300),
      portrait: { src: link(portrait.src, "Portrait image", true), alt: text(portrait.alt, "Portrait description", 200) }, socials,
    },
    projects: unique(list(input.projects, "Projects").map(value => {
      const item = object(value); const live = published(item.published);
      if (item.category !== "Projects" && item.category !== "Explorations") throw new ContentError("Choose Projects or Explorations as the category.");
      return { id: identifier(item.id), title: text(item.title, "Project title", 150, live), category: item.category,
        tag: text(item.tag, "Project discipline", 100), preview: preview(item.preview), image: link(item.image, "Project image", true),
        description: text(item.description, "Project description", 8000), url: link(item.url, "Project website"), published: live };
    })),
    experience: unique(list(input.experience, "Experience").map(value => {
      const item = object(value); const live = published(item.published);
      return { id: identifier(item.id), company: text(item.company, "Company", 150, live), role: text(item.role, "Experience role", 150, live),
        period: text(item.period, "Experience dates", 100, live), description: text(item.description, "Experience description", 3000), url: link(item.url, "Company website"), published: live };
    })),
    services: unique(list(input.services, "Services", 12).map(value => {
      const item = object(value);
      return { id: identifier(item.id), title: text(item.title, "Service title", 100, true), description: text(item.description, "Service description", 2000), preview: preview(item.preview) };
    })),
  };
}
