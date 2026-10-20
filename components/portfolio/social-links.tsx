import type { Profile } from "@/types/portfolio";
import { SocialIcon } from "./ui";

interface SocialLinksProps {
  socials: Profile["socials"];
  footer?: boolean;
}

export function SocialLinks({ socials, footer = false }: SocialLinksProps) {
  const classes = `group inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#eaeaea] bg-white px-4 text-[13px] transition-[background,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#bfbfbf] hover:bg-[#f5f5f5] ${footer ? "min-w-[118px]" : "w-full hero:w-[124px]"}`;
  return socials
    .filter((social) => social.href)
    .map((social) => (
      <a
        key={social.name}
        className={classes}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <SocialIcon name={social.name} />
        <bdi>{social.name}</bdi>
      </a>
    ));
}
