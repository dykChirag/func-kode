import { LANDING_ASSETS } from "@/lib/landing-assets";
import { LandingCtaLink } from "@/components/landing/landing-cta-link";

const BULLET_POINTS = [
  "Pre-screen devs with a 0-100 trust score before interviews.",
  "Embed Patch ID scores in your existing developer profiles.",
  "Use our verification API to check a GitHub username in milliseconds.",
] as const;

/**
 * ForTeamsSection — "For Teams & Platforms"
 *
 * ProductLandingPage @ top 2358px — rgba(0,0,0,0.25) overlay on page gradient.
 */
export function ForTeamsSection() {
  return (
    <section
      id="for-teams"
      aria-labelledby="for-teams-heading"
      className="
        relative w-screen left-1/2 -translate-x-1/2 scroll-mt-24
        mb-16 min-[1440px]:mb-[150px]
      "
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-black/25"
        aria-hidden="true"
      />

      <div
        className="
          relative z-10 mx-auto w-full max-w-[1440px]
          px-5 py-landing-section-y
          sm:px-8
          min-[1440px]:min-h-[596px] min-[1440px]:px-0 min-[1440px]:py-0
        "
      >
        <div
          className="
            flex flex-col items-center gap-landing-section-gap
            lg:flex-row lg:items-start
            min-[1440px]:block
          "
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LANDING_ASSETS.sectionTeamsIllustration}
            alt=""
            width={798}
            height={361}
            className="
              w-full max-w-[798px] shrink-0
              min-[1440px]:absolute min-[1440px]:left-0 min-[1440px]:top-[120px]
            "
            aria-hidden="true"
          />

          <div
            className="
              w-full max-w-[523px]
              min-[1440px]:absolute min-[1440px]:left-[815px] min-[1440px]:top-[151px]
            "
          >
            <h2
              id="for-teams-heading"
              className="
                mb-4 font-bold text-landing-fg tracking-landing-h1
                text-landing-h1-sm sm:text-landing-h1-md
              "
            >
              For Teams &amp; Platforms
            </h2>

            <p className="mb-8 text-landing-body leading-6 text-white/60">
              If you run a dev-heavy startup, a hiring platform, or a community, Patch ID
              plugs into your flow as a trust signal, not a replacement for your process.
            </p>

            <ul className="mb-8 space-y-3 text-landing-body leading-6 text-white/60">
              {BULLET_POINTS.map((point) => (
                <li key={point} className="flex gap-3">
                  <span
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-white/80"
                    aria-hidden="true"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <p className="mb-8 text-sm font-bold uppercase tracking-landing-tight text-[#FFA800]">
              We&apos;re onboarding a small number of design partners.
            </p>

            <LandingCtaLink
              href="/#contact-us"
              ctaLabel="WANT IN?"
              section="for-teams"
              className="
                inline-flex h-[45px] w-full items-center justify-center
                rounded-full border border-[#FFA800] bg-transparent px-6
                text-sm font-bold tracking-landing-cta text-white
                transition-colors hover:bg-[#FFA800]/10
                sm:w-auto sm:min-w-[131px]
              "
            >
              WANT IN? &rarr;
            </LandingCtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
