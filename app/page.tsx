import PortfolioHero from "./portfolio-hero";
import { portfolioContent, portfolioUpdatedAt } from "@/lib/portfolio-data";
import { publicPortfolio } from "@/lib/portfolio-model";
import { portfolioMetadata, portfolioStructuredData } from "@/lib/portfolio-seo";

export const metadata = portfolioMetadata(portfolioContent.profile);

export default function HomePage() {
  const document = { content: portfolioContent, updatedAt: portfolioUpdatedAt };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioStructuredData(document)).replace(/</g, "\\u003c") }} /><PortfolioHero portfolio={publicPortfolio(document.content)} /></>;
}
