import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import { arabicPortfolioContent } from "@/data/portfolio-ar";
import { arabic } from "@/data/locales/ar";
import { portfolioMetadata } from "@/lib/portfolio-seo";

export const metadata = portfolioMetadata(arabicPortfolioContent.profile, "ar");

export default function ArabicPage() {
  return <PortfolioPage content={arabicPortfolioContent} locale="ar" copy={arabic} />;
}
