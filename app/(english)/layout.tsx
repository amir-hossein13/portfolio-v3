import { SiteDocument } from "@/components/site-document";
import "@/app/globals.css";

export default function EnglishLayout({ children }: LayoutProps<"/">) {
  return <SiteDocument locale="en">{children}</SiteDocument>;
}
