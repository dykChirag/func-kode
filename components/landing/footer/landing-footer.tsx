import { FooterAttributionLink } from "@/components/landing/footer/footer-link";
import { FooterColumn } from "@/components/landing/footer/footer-column";
import { FooterSocialIcons } from "@/components/landing/footer/footer-social-icons";
import {
  FOOTER_ATTRIBUTION,
  FOOTER_COLUMNS,
} from "@/components/landing/footer/footer-links";
import { FooterNewsletter } from "@/components/landing/footer/footer-newsletter";

/**
 * LandingFooter — full-width footer for the landing page (Issue #131)
 *
 * Changes vs previous stub:
 * - FooterSocialIcons row (GitHub + Discord) with correct aria-labels and tracking
 * - Dynamic copyright year: new Date().getFullYear()
 * - Discord link fires both FOOTER_LINK_CLICKED and DISCORD_LINK_CLICKED
 */
export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="landing-footer"
      aria-label="Site footer"
      className="relative w-screen left-1/2 -translate-x-1/2 scroll-mt-24 bg-landing-surface"
    >
      <div
        className="
          mx-auto flex w-full max-w-[1440px] flex-col gap-12
          overflow-hidden px-5 pb-8 pt-12
          sm:gap-16 sm:px-8 sm:pb-10 sm:pt-16
          min-[1440px]:gap-20 min-[1440px]:px-[70px] min-[1440px]:pb-10 min-[1440px]:pt-20
        "
      >
        {/* Mobile: newsletter first; tablet+: link grid then newsletter */}
        <div
          className="
            flex w-full flex-col gap-10
            min-[1440px]:flex-row min-[1440px]:items-start min-[1440px]:justify-between min-[1440px]:gap-6
          "
        >
          <div
            className="
              order-2 grid w-full grid-cols-2 gap-x-6 gap-y-10
              min-[1440px]:order-1 min-[1440px]:contents
            "
          >
            {FOOTER_COLUMNS.map((column) => (
              <FooterColumn key={column.id} column={column} />
            ))}
          </div>

          <div
            className="
              order-1 w-full
              min-[1440px]:order-2 min-[1440px]:w-[400px] min-[1440px]:shrink-0
            "
          >
            <FooterNewsletter />
          </div>
        </div>

        {/* Bottom bar: social icons left, attribution centre, copyright right */}
        <div className="flex w-full flex-col items-center gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
          <FooterSocialIcons />

          <FooterAttributionLink
            label={FOOTER_ATTRIBUTION.label}
            href={FOOTER_ATTRIBUTION.href}
            external={FOOTER_ATTRIBUTION.external}
          />

          <p className="text-xs text-white/40">
            &copy; {year} Patch ID. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
