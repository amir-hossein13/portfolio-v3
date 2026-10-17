import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { readPortfolio } from "@/lib/portfolio-store";
import { siteOrigin } from "@/lib/portfolio-seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const { content, updatedAt } = readPortfolio();
  const origin = siteOrigin(content.profile);
  if (!origin) return [];
  const images = [content.profile.portrait.src, ...content.projects.filter(p => p.published).map(p => p.image)].filter(Boolean).map(src => new URL(src, origin).href);
  return [{ url: `${origin}/`, lastModified: updatedAt, ...(images.length ? { images } : {}) }];
}
