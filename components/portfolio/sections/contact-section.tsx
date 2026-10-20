import type { Profile } from "@/types/portfolio";
import { AiOutlineArrowUp } from "react-icons/ai";
import { actionClasses, actionSize, ArrowIcon, Availability } from "../ui";
import { SocialLinks } from "../social-links";
import { usePortfolioLanguage } from "../portfolio-language";

interface ContactSectionProps {
  profile: Profile;
  onContact: () => void;
}

export function ContactSection({ profile, onContact }: ContactSectionProps) {
  const { copy } = usePortfolioLanguage();
  return (
    <footer
      data-slide
      tabIndex={-1}
      id="contact"
      aria-labelledby="contact-title"
      className="flex min-h-svh hero:h-dvh flex-col justify-center hero:overflow-y-auto bg-white px-6 pt-10 pb-20 text-center focus-visible:outline-none sm:px-10 hero:px-[8%]"
    >
      <div
        data-reveal
        className="mx-auto flex w-full max-w-[1040px] flex-1 flex-col items-center justify-center py-8"
      >
        <Availability text={profile.availability} />
        <h2
          id="contact-title"
          className="mt-8 mb-4 font-sans text-[clamp(30px,4.4cqw,64px)] leading-[1.05] font-semibold tracking-[-.04em]"
        >
          {copy.contact.title}
        </h2>
        <p className="m-0 max-w-[700px] text-[14px] leading-relaxed text-[#666] sm:text-[16px]">
          {copy.contact.introduction}
          <br className="hidden sm:block" /> {copy.contact.invitation}
        </p>
        <button type="button" onClick={onContact} className={`${actionClasses} ${actionSize} mt-8`}>
          {copy.contact.action} <ArrowIcon />
        </button>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[#666] sm:text-sm">
          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="inline-flex min-h-11 items-center rounded-full px-2 underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
              aria-label={`${copy.contact.call} ${profile.phone}`}
            >
              <span dir="ltr">{profile.phone}</span>
            </a>
          )}
          {profile.whatsapp && (
            <a
              href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/10 px-5 transition-colors hover:border-black/30 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {copy.contact.whatsapp} <ArrowIcon />
            </a>
          )}
        </div>
      </div>
      <div
        data-reveal
        className="mt-8 flex shrink-0 flex-wrap items-center justify-center gap-3 pb-6 sm:justify-between sm:gap-6 hero:px-[3%]"
      >
        <a href="#home" className="rounded-full bg-foreground px-4 py-2.5 text-[12px] text-white">
          <bdi>
            {profile.firstName} {profile.lastName}
          </bdi>
        </a>
        <SocialLinks socials={profile.socials} footer />
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-5 text-[10px] text-[#777] sm:text-[11px]">
        <span>
          © 2026{" "}
          <bdi>
            {profile.firstName} {profile.lastName}
          </bdi>
        </span>
        <a className="inline-flex items-center gap-1 hover:text-foreground" href="#home">
          {copy.contact.back}{" "}
          <AiOutlineArrowUp className="size-3" aria-hidden="true" focusable="false" />
        </a>
      </div>
    </footer>
  );
}
