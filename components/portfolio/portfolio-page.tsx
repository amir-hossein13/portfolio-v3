import type { PortfolioContent } from "@/types/portfolio";
import type { Locale, PortfolioDictionary } from "@/data/locales/en";
import { portfolioUpdatedAt } from "@/data/portfolio";
import { getPublicPortfolio } from "@/lib/portfolio";
import { portfolioStructuredData } from "@/lib/portfolio-seo";
import Portfolio from "./portfolio";

export function PortfolioPage({
  content,
  locale,
  copy,
}: {
  content: PortfolioContent;
  locale: Locale;
  copy: PortfolioDictionary;
}) {
  const document = { content, updatedAt: portfolioUpdatedAt };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(portfolioStructuredData(document, locale)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <Portfolio portfolio={getPublicPortfolio(content)} locale={locale} copy={copy} />
    </>
  );
}
