import type { ReactNode } from "react";

export const actionClasses =
  "group inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-[#333] bg-foreground font-normal text-white shadow-control transition-[transform,box-shadow,background] duration-300 ease-portfolio hover:-translate-y-0.5 hover:bg-[#303030] hover:shadow-floating";
export const actionSize = "min-h-[42px] gap-2.5 px-5 text-[13px]";

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`size-[18px] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 15 15 5M5.5 5H15v9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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

export function SocialIcon({ name }: { name: string }) {
  if (name === "X")
    return (
      <span className="text-[15px] leading-none" aria-hidden="true">
        𝕏
      </span>
    );
  if (name === "Behance")
    return (
      <span className="text-[13px] leading-none" aria-hidden="true">
        Bē
      </span>
    );
  return (
    <svg
      className="size-[17px] shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "Dribbble" && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M7 5.2c4.7 5 7.4 10.4 8.3 14.4M4 9.5c5.4 1 11.4-.4 15.3-3.4M5.6 18.1c3.6-5.6 8.4-7.2 14.9-5.5" />
        </>
      )}
      {name === "GitHub" && (
        <path d="M9 20c-4 1-4-2-5-2m10 4v-3.2c0-.9.1-1.5-.4-2 3-.3 6-1.5 6-6.5 0-1.4-.5-2.5-1.3-3.4.1-.4.5-1.7-.1-3.4 0 0-1-.3-3.5 1.3a12 12 0 0 0-6.4 0C5.8 3.2 4.8 3.5 4.8 3.5c-.6 1.7-.2 3-.1 3.4A5 5 0 0 0 3.4 10c0 5 3 6.3 6 6.6-.4.4-.6 1-.6 2V22" />
      )}
      {name === "Instagram" && (
        <>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="12" cy="12" r="3.6" />
          <circle cx="17" cy="7" r=".8" fill="currentColor" stroke="none" />
        </>
      )}
      {name === "LinkedIn" && (
        <>
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="M8 10v6M8 7.5v.2M11 16v-6m0 2.6c0-3.4 5-3.5 5 0V16" />
        </>
      )}
    </svg>
  );
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
