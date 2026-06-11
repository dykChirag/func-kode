import { LANDING_ASSETS } from "@/lib/landing-assets";

const BULLET_POINTS = [
  "Developers who want to contribute to Patch ID",
  "Maintainers who need visibility into community work.",
  "First-time open-source contributors who need a guided entry point.",
  "Builders who want a GitHub-first workflow.",
] as const;

/**
 * ForDevelopersSection — "For developers who want their work to speak."
 *
 * ProductLandingPage @ top 3104px — rgba(0,0,0,0.25) overlay on page gradient.
 */
export function ForDevelopersSection() {
  return (
    <section
      id="for-developers"
      aria-labelledby="for-developers-heading"
      className="
        relative w-screen left-1/2 -translate-x-1/2 scroll-mt-24
        mb-16 min-[1440px]:mb-12
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
            src={LANDING_ASSETS.sectionDevelopersIllustration}
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
              min-[1440px]:absolute min-[1440px]:left-[815px] min-[1440px]:top-[92px]
            "
          >
            <h2
              id="for-developers-heading"
              className="
                mb-4 font-bold text-landing-fg tracking-landing-h1
                text-landing-h1-sm sm:text-landing-h1-md
              "
            >
              For developers who want their work to speak.
            </h2>

            <p className="mb-8 text-landing-body leading-6 text-white/60">
              Whether you&apos;re a fresher fighting keyword filters, or a freelancer explaining
              your value to global clients, Patch ID gives you a single link that proves your work
              &ndash; not your buzzwords.
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

            <p className="text-sm font-bold uppercase tracking-landing-tight text-[#F4A259]">
              Add your Patch ID score to your resume, LinkedIn, or portfolio and let your code do
              the talking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
