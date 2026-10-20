import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  AiOutlineArrowRight,
  AiOutlineBehance,
  AiOutlineDribbble,
  AiOutlineGithub,
  AiOutlineInstagram,
  AiOutlineLinkedin,
  AiOutlineX,
} from "react-icons/ai";
import type { SocialName } from "@/types/portfolio";

export const actionClasses =
  "group inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-[#333] bg-foreground font-normal text-white shadow-control transition-[transform,box-shadow,background] duration-300 ease-portfolio hover:-translate-y-0.5 hover:bg-[#303030] hover:shadow-floating";
export const actionSize = "min-h-[42px] gap-2.5 px-5 text-[13px]";

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <AiOutlineArrowRight
      className={`size-[18px] shrink-0 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5 ${className}`}
      aria-hidden="true"
      focusable="false"
    />
  );
}

export function ActionLink({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <a
      className={`${actionClasses} ${compact ? "min-h-9 gap-2 px-3 text-[11px] sm:min-h-[42px] sm:gap-2.5 sm:px-5 sm:text-[13px]" : actionSize}`}
      href="#contact"
    >
      {children}
      <ArrowIcon />
    </a>
  );
}

const socialIcons: Record<SocialName, IconType> = {
  GitHub: AiOutlineGithub,
  LinkedIn: AiOutlineLinkedin,
  Instagram: AiOutlineInstagram,
  X: AiOutlineX,
  Dribbble: AiOutlineDribbble,
  Behance: AiOutlineBehance,
};

export function SocialIcon({ name }: { name: SocialName }) {
  const Icon = socialIcons[name];
  return <Icon className="size-[17px] shrink-0" aria-hidden="true" focusable="false" />;
}

export function Availability({ compact = false, text }: { compact?: boolean; text: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center whitespace-nowrap rounded-full border border-[#ececec] bg-white py-[6px] leading-[1.5] shadow-availability ${compact ? "gap-1.5 px-2 text-[10px] sm:gap-2 sm:px-3 sm:text-[13px]" : "gap-2 px-3 text-[13px]"}`}
    >
      <span className="size-[9px] shrink-0 rounded-full bg-signal" />
      {text}
    </span>
  );
}
