import { ContactForm } from "@/components/landing/contact-form";

/**
 * ContactUsSection — final CTA banner (ProductLandingPage @ top 3716px).
 */
export function ContactUsSection() {
  return (
    <section
      id="contact-us"
      aria-labelledby="contact-us-heading"
      className="relative w-screen left-1/2 -translate-x-1/2 scroll-mt-24 min-[1440px]:mt-6"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[rgba(17,15,15,0.25)]"
        aria-hidden="true"
      />

      <div
        className="
          relative z-10 mx-auto w-full max-w-[1440px]
          px-5 py-6
          sm:px-8
          min-[1440px]:min-h-[524px] min-[1440px]:px-[70px] min-[1440px]:py-6
        "
      >
        <div
          className="
            mx-auto flex w-full max-w-[1300px] flex-col items-center justify-center
            rounded bg-[#F4A259] px-6 py-12 text-center
            min-h-[320px] sm:min-h-[380px]
            min-[1440px]:my-6 min-[1440px]:min-h-[420px] min-[1440px]:px-8
          "
        >
          <h2
            id="contact-us-heading"
            className="
              mb-4 max-w-[900px] font-bold tracking-landing-h1 text-[#0D0E14]
              text-landing-h1-sm sm:text-landing-h1-md
            "
          >
            Your next opportunity should see your work, not just your resume.
          </h2>

          <p className="mb-8 max-w-[640px] text-landing-body text-black/60">
            Patch ID is in early build. We&apos;re onboarding our first developers and design
            partners now.
          </p>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
