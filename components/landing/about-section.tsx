import { LANDING_ASSETS } from "@/lib/landing-assets";

/** Figma feature-card icons (ProductLandingPage.tsx reference). */
const FEATURES = [
  {
    title: "GitHub-first onboarding",
    description: "Sign in with GitHub and get started in seconds",
    icon: LANDING_ASSETS.featureGithubOnboarding,
  },
  {
    title: "Contribution tracking",
    description: "See issues, pull requests and progress in one place",
    icon: LANDING_ASSETS.featureContributionTracking,
  },
  {
    title: "Community collaboration",
    description: "Work with other contributors through transparent workflows.",
    icon: LANDING_ASSETS.featureCommunityCollaboration,
  },
] as const;

/**
 * AboutSection — "Why func(kode)?"
 *
 * Card row matches ProductLandingPage: max-w-[1300px], flex-1 equal-width boxes, 32px gap.
 */
export function AboutSection() {
  return (
    <section
      id="func-kode"
      aria-labelledby="func-kode-heading"
      className="relative w-screen left-1/2 -translate-x-1/2"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[rgba(17,15,15,0.25)]"
        aria-hidden="true"
      />

      <div
        className="
          relative mx-auto w-full max-w-[1300px]
          px-5 py-landing-section-y text-center
          sm:px-8
          min-[1440px]:py-landing-section-y-lg
        "
      >
        <h2
          id="func-kode-heading"
          className="
            mb-6 font-bold text-landing-fg tracking-landing-h1
            text-landing-h1-sm sm:text-landing-h1-md
          "
        >
          Why func(kode) ?
        </h2>

        <p className="mx-auto mb-10 max-w-[634px] text-left text-landing-body text-landing-muted sm:text-center">
          func(kode) helps developers move from idea to contribution with a shared platform,
          clear workflows and visible progress. It is built for community driven development,
          not just code storage.
        </p>

        {/*
          flex-1 + basis-0 — equal-width cards filling the full 1300px row (Figma expected).
          lg:flex-row only at 1024px+ so titles have room to stay on one line.
        */}
        <ul className="mb-10 flex w-full flex-col gap-8 text-left lg:flex-row lg:items-stretch">
          {FEATURES.map(({ title, description, icon }) => (
            <li
              key={title}
              className="
                flex flex-1 basis-0 flex-col rounded-sm border border-landing-card-border p-5
                transition-colors hover:border-white/40
              "
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={icon}
                alt=""
                width={48}
                height={48}
                className="mb-3 size-12 shrink-0"
                aria-hidden="true"
              />
              <h3 className="mb-3 text-[28px] font-bold leading-tight text-landing-fg">
                {title}
              </h3>
              <p className="text-sm leading-5 text-white/60">{description}</p>
            </li>
          ))}
        </ul>

        <p className="mx-auto max-w-[634px] text-left text-landing-body text-landing-muted sm:text-center">
          Build features that support the Patch ID ecosystem. Everything is designed to welcome
          contributors and make participation easier.
        </p>
      </div>
    </section>
  );
}
