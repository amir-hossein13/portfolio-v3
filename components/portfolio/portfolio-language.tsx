"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale, PortfolioDictionary } from "@/data/locales/en";

interface PortfolioLanguage {
  locale: Locale;
  copy: PortfolioDictionary;
}

const LanguageContext = createContext<PortfolioLanguage | null>(null);

export function PortfolioLanguageProvider({
  children,
  ...language
}: PortfolioLanguage & { children: ReactNode }) {
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;
}

export function usePortfolioLanguage() {
  const language = useContext(LanguageContext);
  if (!language) throw new Error("Portfolio components require a language provider.");
  return language;
}
