import { SiteDocument } from "@/components/site-document";
import "@/app/globals.css";

export default function ArabicLayout({ children }: LayoutProps<"/ar">) {
  return <SiteDocument locale="ar">{children}</SiteDocument>;
}
