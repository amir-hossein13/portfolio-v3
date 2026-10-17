import PortfolioHero from "./portfolio-hero";
import { Suspense } from "react";
import { connection } from "next/server";
import { readPortfolio } from "@/lib/portfolio-store";
import { publicPortfolio } from "@/lib/portfolio-model";
import { portfolioMetadata, portfolioStructuredData } from "@/lib/portfolio-seo";

export async function generateMetadata() {
  await connection();
  const { profile } = readPortfolio().content;
  return portfolioMetadata(profile);
}

async function Portfolio() {
  await connection();
  const document = readPortfolio();
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioStructuredData(document)).replace(/</g, "\\u003c") }} /><PortfolioHero portfolio={publicPortfolio(document.content)} /></>;
}

export default function HomePage() {
  return <Suspense fallback={<main className="flex min-h-dvh items-center justify-center bg-white text-sm text-muted" aria-busy="true">Loading portfolio…</main>}><Portfolio /></Suspense>;
}
