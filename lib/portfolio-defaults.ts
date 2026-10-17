import type { PortfolioContent } from "./portfolio-model";

// Used only when creating a new database. All subsequent edits live in SQLite.
export const initialContent: PortfolioContent = {
  profile: {
    firstName: "Amir.H", lastName: "Attarnia", role: "Full Stack Developer", description: "",
    availability: "Available for new projects", email: "amirattarnia7@gmail.com", portrait: { src: "", alt: "Amir.H Attarnia" },
    phone: "+989934904062", whatsapp: "+989934904062", siteUrl: "", seoTitle: "", seoDescription: "",
    socials: [
      { name: "GitHub", href: "https://github.com/amir-hossein13/" },
      { name: "LinkedIn", href: "https://www.linkedin.com/in/amirhossein-attarnia/" },
      { name: "Instagram", href: "https://www.instagram.com/aa_alfa13/" },
      { name: "X", href: "https://x.com/amirAttarnia" },
    ],
  },
  projects: [],
  experience: [{ id: "webino", company: "Webino", role: "Frontend Developer", period: "Oct 2025 – Jan 2026", description: "", url: "https://www.webinoco.ir/", published: true }],
  services: [
    { id: "frontend", title: "FRONTEND DEVELOPMENT", description: "Responsive interfaces and thoughtful interactions for the web.", preview: "editorial" },
    { id: "backend", title: "BACKEND & APIs", description: "Application logic, databases, and the services that connect them.", preview: "dashboard" },
    { id: "full-stack", title: "FULL STACK APPLICATIONS", description: "Complete web experiences, from the interface to the backend.", preview: "mobile" },
    { id: "performance", title: "PERFORMANCE & POLISH", description: "Fast, accessible experiences with attention to the details.", preview: "wellness" },
  ],
};
