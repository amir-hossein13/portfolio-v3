import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { readPortfolio } from "@/lib/portfolio-store";
import { siteOrigin } from "@/lib/portfolio-seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();
  const origin = siteOrigin(readPortfolio().content.profile);
  return origin
    ? { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin/", "/api/portfolio"] }, sitemap: `${origin}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
