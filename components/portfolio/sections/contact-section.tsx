import type { Profile } from "@/types/portfolio";
import { actionClasses, actionSize, ArrowIcon, Availability } from "../ui";
import { SocialLinks } from "../social-links";

interface ContactSectionProps {
  profile: Profile;
  onContact: () => void;
}

export function ContactSection({ profile, onContact }: ContactSectionProps) {
  return (
    <footer
      data-slide
      tabIndex={-1}
      id="contact"
      aria-labelledby="contact-title"
      className="flex h-dvh flex-col justify-center overflow-y-auto bg-white px-6 pt-10 pb-20 text-center focus-visible:outline-none sm:px-10 hero:px-[8%]"
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
          HAVE A PROJECT IN MIND?
        </h2>
        <p className="m-0 max-w-[700px] text-[14px] leading-relaxed text-[#666] sm:text-[16px]">
          Together, we can create something clear and impactful.
          <br className="hidden sm:block" /> Let&apos;s collaborate to bring your ideas to life.
        </p>
        <button type="button" onClick={onContact} className={`${actionClasses} ${actionSize} mt-8`}>
          Contact Me <ArrowIcon />
        </button>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[#666] sm:text-sm">
          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="inline-flex min-h-11 items-center rounded-full px-2 underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
              aria-label={`Call ${profile.phone}`}
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
              WhatsApp <ArrowIcon />
            </a>
          )}
        </div>
      </div>
      <div
        data-reveal
        className="mt-8 flex shrink-0 flex-wrap items-center justify-center gap-3 pb-6 sm:justify-between sm:gap-6 hero:px-[3%]"
      >
        <a href="#home" className="rounded-full bg-foreground px-4 py-2.5 text-[12px] text-white">
          {profile.firstName} {profile.lastName}
        </a>
        <SocialLinks socials={profile.socials} footer />
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-5 text-[10px] text-[#777] sm:text-[11px]">
        <span>
          © 2026 {profile.firstName} {profile.lastName}
        </span>
        <a className="hover:text-foreground" href="#home">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
