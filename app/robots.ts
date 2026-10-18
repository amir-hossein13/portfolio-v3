import type { MetadataRoute } from "next";
import { portfolioContent } from "@/data/portfolio";
import { siteOrigin } from "@/lib/portfolio-seo";

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin(portfolioContent.profile);
  return origin
    ? { rules: { userAgent: "*", allow: "/" }, sitemap: `${origin}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
