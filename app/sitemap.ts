import type { MetadataRoute } from "next";
import { portfolioContent, portfolioUpdatedAt } from "@/lib/portfolio-data";
import { siteOrigin } from "@/lib/portfolio-seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const content = portfolioContent;
  const origin = siteOrigin(content.profile);
  if (!origin) return [];
  const images = [content.profile.portrait.src, ...content.projects.filter(p => p.published).map(p => p.image)].filter(Boolean).map(src => new URL(src, origin).href);
  return [{ url: `${origin}/`, lastModified: portfolioUpdatedAt, ...(images.length ? { images } : {}) }];
}
