import type { ReactNode } from "react";
import localFont from "next/font/local";
import type { Locale } from "@/data/locales/en";

const geistSans = localFont({
  src: "../public/fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "../public/fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

const arabic = localFont({
  src: "../public/fonts/noto-sans-arabic.woff2",
  variable: "--font-arabic",
  weight: "100 900",
  display: "swap",
});

export function SiteDocument({ children, locale }: { children: ReactNode; locale: Locale }) {
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} ${locale === "ar" ? arabic.variable : ""}`}
    >
      <body>{children}</body>
    </html>
  );
}
