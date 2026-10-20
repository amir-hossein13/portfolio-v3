import "server-only";
import type { Metadata } from "next";
import type { PortfolioSnapshot, Profile } from "@/types/portfolio";
import type { Locale } from "@/data/locales/en";

export function siteOrigin(profile: Profile): string | undefined {
  const value = process.env.PORTFOLIO_ORIGIN || profile.siteUrl;
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password)
      return undefined;
    if (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "[::1]" ||
      url.hostname.endsWith(".localhost")
    )
      return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export function portfolioMetadata(profile: Profile, locale: Locale = "en"): Metadata {
  const name = `${profile.firstName} ${profile.lastName}`;
  const title = profile.seoTitle || `${name} — ${profile.role}`;
  const description =
    profile.seoDescription ||
    profile.description ||
    `Explore the projects, services, and experience of ${name}, ${profile.role}. Get in touch to discuss your next web project.`;
  const origin = siteOrigin(profile);
  const path = locale === "ar" ? "/ar" : "/";
  const image = origin
    ? [
        {
          url: `${origin}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${name} — ${profile.role}`,
        },
      ]
    : undefined;
  return {
    title,
    description,
    applicationName: `${name} Portfolio`,
    authors: [{ name, ...(origin ? { url: origin } : {}) }],
    creator: name,
    ...(origin
      ? {
          metadataBase: new URL(origin),
          alternates: {
            canonical: `${origin}${path}`,
            languages: { en: `${origin}/`, ar: `${origin}/ar`, "x-default": `${origin}/` },
          },
        }
      : {}),
    robots: {
      index: Boolean(origin),
      follow: Boolean(origin),
      googleBot: {
        index: Boolean(origin),
        follow: Boolean(origin),
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "profile",
      title,
      description,
      siteName: `${name} Portfolio`,
      locale: locale === "ar" ? "ar_AR" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_AR"],
      firstName: profile.firstName,
      lastName: profile.lastName,
      ...(origin ? { url: `${origin}${path}`, images: image } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: image } : {}),
    },
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
  };
}

export function portfolioStructuredData(
  { content, updatedAt }: PortfolioSnapshot,
  locale: Locale = "en",
) {
  const { profile } = content;
  const origin = siteOrigin(profile);
  const name = `${profile.firstName} ${profile.lastName}`;
  const personId = origin ? `${origin}/#person` : "#person";
  const path = locale === "ar" ? "/ar" : "/";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name,
        jobTitle: profile.role,
        ...(origin ? { url: `${origin}/` } : {}),
        ...(profile.description ? { description: profile.description } : {}),
        ...(profile.email ? { email: profile.email } : {}),
        ...(profile.phone ? { telephone: profile.phone } : {}),
        ...(profile.portrait.src && origin
          ? { image: new URL(profile.portrait.src, origin).href }
          : {}),
        sameAs: profile.socials.filter((social) => social.href).map((social) => social.href),
      },
      {
        "@type": "ProfilePage",
        "@id": origin ? `${origin}${path}#profile` : "#profile",
        name: `${name} — ${profile.role}`,
        inLanguage: locale,
        dateModified: updatedAt,
        mainEntity: { "@id": personId },
        ...(origin ? { url: `${origin}${path}`, isPartOf: { "@id": `${origin}/#website` } } : {}),
      },
      ...(origin
        ? [
            {
              "@type": "WebSite",
              "@id": `${origin}/#website`,
              url: `${origin}/`,
              name: `${name} Portfolio`,
              inLanguage: ["en", "ar"],
              publisher: { "@id": personId },
            },
          ]
        : []),
    ],
  };
}
