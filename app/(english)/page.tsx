import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import { portfolioContent } from "@/data/portfolio";
import { english } from "@/data/locales/en";
import { portfolioMetadata } from "@/lib/portfolio-seo";

export const metadata = portfolioMetadata(portfolioContent.profile);

export default function HomePage() {
  return <PortfolioPage content={portfolioContent} locale="en" copy={english} />;
}
