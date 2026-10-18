import type { PortfolioContent } from "@/types/portfolio";

// Edit this object to update the portfolio, then redeploy. Images live in public/projects.
export const portfolioContent: PortfolioContent = {
  profile: {
    firstName: "Amir.H",
    lastName: "Attarnia",
    role: "Full Stack Developer",
    description: "",
    availability: "Available for new projects",
    email: "amirattarnia7@gmail.com",
    portrait: { src: "/img/face.png", alt: "Amir.H Attarnia" },
    phone: "+989934904062",
    whatsapp: "+989934904062",
    siteUrl: "",
    seoTitle: "",
    seoDescription: "",
    socials: [
      { name: "GitHub", href: "https://github.com/amir-hossein13/" },
      { name: "LinkedIn", href: "https://www.linkedin.com/in/amirhossein-attarnia/" },
      { name: "Instagram", href: "https://www.instagram.com/aa_alfa13/" },
      { name: "X", href: "https://x.com/amirAttarnia" },
    ],
  },
  projects: [
    {
      id: "standup",
      title: "Standup.io",
      category: "Projects",
      tag: "Next.js · Tailwind · Prisma",
      preview: "dashboard",
      image: "/projects/standup.jpg",
      url: "https://standup-io.vercel.app/",
      published: true,
      description:
        "A team workspace for asynchronous stand-ups, progress updates, and AI-generated summaries. Managers get a single dashboard with everyone's updates and a clear overview of the team's progress.",
    },
    {
      id: "omdehforoosh",
      title: "Omdehforoosh",
      category: "Projects",
      tag: "Next.js · Tailwind · TypeScript",
      preview: "editorial",
      image: "/projects/omdehforoosh.png",
      url: "https://omdehforoosh.com/",
      published: true,
      description:
        "An e-commerce storefront for browsing and buying personal-care, beauty, and health products.",
    },
    {
      id: "hatef",
      title: "Hatef Tejarat",
      category: "Projects",
      tag: "Industrial commerce",
      preview: "editorial",
      image: "/projects/hatef.png",
      url: "https://hatef-project-v2.vercel.app/",
      published: true,
      description:
        "A platform for sourcing industrial metals and alloys, with product categories, technical specifications, and quote requests.",
    },
    {
      id: "khoodro24",
      title: "Khoodro24",
      category: "Projects",
      tag: "Automotive marketplace",
      preview: "editorial",
      image: "/projects/khoodro24.png",
      url: "https://khoodro24.com/",
      published: true,
      description: "An automotive marketplace for browsing vehicles and exploring cars for sale.",
    },
  ],
  experience: [
    {
      id: "webino",
      company: "Webino",
      role: "Frontend Developer",
      period: "Oct 2025 – Jan 2026",
      description: "",
      url: "https://www.webinoco.ir/",
      published: true,
    },
  ],
  services: [
    {
      id: "frontend",
      title: "FRONTEND DEVELOPMENT",
      description: "Responsive interfaces and thoughtful interactions for the web.",
      preview: "editorial",
    },
    {
      id: "backend",
      title: "BACKEND & APIs",
      description: "Application logic, databases, and the services that connect them.",
      preview: "dashboard",
    },
    {
      id: "full-stack",
      title: "FULL STACK APPLICATIONS",
      description: "Complete web experiences, from the interface to the backend.",
      preview: "mobile",
    },
    {
      id: "performance",
      title: "PERFORMANCE & POLISH",
      description: "Fast, accessible experiences with attention to the details.",
      preview: "wellness",
    },
  ],
};

// Keep this date in sync when changing content; used by the sitemap and structured data.
export const portfolioUpdatedAt = "2026-10-17T00:00:00.000Z";
