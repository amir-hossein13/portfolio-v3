import Portfolio from "@/components/portfolio/portfolio";
import { portfolioContent, portfolioUpdatedAt } from "@/data/portfolio";
import { getPublicPortfolio } from "@/lib/portfolio";
import { portfolioMetadata, portfolioStructuredData } from "@/lib/portfolio-seo";

export const metadata = portfolioMetadata(portfolioContent.profile);

export default function HomePage() {
  const document = { content: portfolioContent, updatedAt: portfolioUpdatedAt };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(portfolioStructuredData(document)).replace(/</g, "\\u003c"),
        }}
      />
      <Portfolio portfolio={getPublicPortfolio(document.content)} />
    </>
  );
}
