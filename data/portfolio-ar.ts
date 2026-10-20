import type { PortfolioContent } from "@/types/portfolio";
import { portfolioContent } from "./portfolio";

// Arabic copy is matched by ID. Shared links, images, visibility and contact details
// stay in portfolio.ts. Add a translation here when adding a new entry there.
const projects: Record<string, { tag?: string; description: string }> = {
  standup: {
    description:
      "مساحة عمل للفرق لمشاركة تحديثات العمل اليومية ومتابعة التقدم بشكل غير متزامن، مع ملخصات ينشئها الذكاء الاصطناعي. تتيح للمديرين متابعة تحديثات الفريق وتقدمه من لوحة تحكم واحدة.",
  },
  omdehforoosh: { description: "متجر إلكتروني لتصفح وشراء منتجات العناية الشخصية والجمال والصحة." },
  hatef: {
    tag: "التجارة الصناعية",
    description:
      "منصة لتوريد المعادن والسبائك الصناعية، تضم تصنيفات للمنتجات ومواصفات فنية وخدمة طلب عروض الأسعار.",
  },
  khoodro24: {
    tag: "سوق السيارات",
    description: "سوق إلكتروني لتصفح السيارات واستكشاف المركبات المعروضة للبيع.",
  },
};

const services: Record<string, { title: string; description: string }> = {
  frontend: {
    title: "تطوير الواجهات الأمامية",
    description: "واجهات متجاوبة وتفاعلات مدروسة لتجارب الويب.",
  },
  backend: {
    title: "تطوير الأنظمة الخلفية وواجهات API",
    description: "منطق التطبيقات وقواعد البيانات والخدمات التي تربطها معًا.",
  },
  "full-stack": {
    title: "تطوير تطبيقات الويب المتكاملة",
    description: "تجارب ويب متكاملة، من واجهة المستخدم إلى الأنظمة الخلفية.",
  },
  performance: {
    title: "تحسين الأداء والتفاصيل",
    description: "تجارب سريعة وسهلة الوصول، مع الاهتمام بأدق التفاصيل.",
  },
};

export const arabicPortfolioContent: PortfolioContent = {
  ...portfolioContent,
  profile: {
    ...portfolioContent.profile,
    role: "مطوّر ويب متكامل",
    availability: "متاح لمشاريع جديدة",
    seoTitle: "Amir.H Attarnia — مطوّر ويب متكامل",
    seoDescription:
      "تعرّف على أعمال وخدمات وخبرة Amir.H Attarnia في تطوير تطبيقات الويب المتكاملة. تواصل معي لمناقشة مشروعك القادم.",
  },
  projects: portfolioContent.projects.map((project) => ({ ...project, ...projects[project.id] })),
  experience: portfolioContent.experience.map((entry) =>
    entry.id === "webino"
      ? {
          ...entry,
          role: "مطوّر واجهات أمامية",
          period: "أكتوبر 2025 – يناير 2026",
        }
      : entry,
  ),
  services: portfolioContent.services.map((service) => ({ ...service, ...services[service.id] })),
};
