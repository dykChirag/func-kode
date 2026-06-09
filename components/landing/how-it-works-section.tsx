import { HowItWorksTimeline } from "@/components/landing/how-it-works-timeline";

/**
 * HowItWorksSection — "How Patch ID Scores You?"
 *
 * Transparent section on the Figma purple band (ProductLandingPage.tsx stepper @ top 1678px).
 * Background = page gradient + LandingBackground decor — no local colour wash.
 */
export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="relative w-full"
    >
      <div
        className="
          relative mx-auto w-full max-w-[1440px]
          px-5 pb-landing-section-y pt-12
          sm:px-8
          min-[1440px]:px-landing-canvas min-[1440px]:pb-landing-section-y-lg
        "
      >
        <h2
          id="how-it-works-heading"
          className="
            text-center font-bold text-landing-fg tracking-landing-h1
            text-landing-h1-sm sm:text-landing-h1-md
          "
        >
          How Patch ID Scores You?
        </h2>

        <HowItWorksTimeline />
      </div>
    </section>
  );
}
