"use client";

import { Navbar } from "@/components/navbar";
import { AboutSection } from "@/components/landing/about-section";
import { ContactUsSection } from "@/components/landing/contact-us-section";
import { LandingFooter } from "@/components/landing/footer";
import { ForDevelopersSection } from "@/components/landing/for-developers-section";
import { ForTeamsSection } from "@/components/landing/for-teams-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { LandingPageAnalytics } from "@/components/landing/landing-page-analytics";
import { useForkCount } from "@/components/site-chrome";

/**
 * LandingPageContent
 *
 * Foreground content layer for the landing page.
 * "use client" is required here to read forkCount from SiteChrome context.
 *
 * Sits above LandingBackground (z-10) inside app/page.tsx.
 * Max width constrained to 1440px (Figma canvas) — centres on wider screens.
 *
 * Section order:
 *   HeroSection → AboutSection → HowItWorksSection → ForTeamsSection
 *   → ForDevelopersSection → ContactUsSection → LandingFooter
 */
export function LandingPageContent() {
  const forkCount = useForkCount();

  return (
    <div className="relative z-10 mx-auto w-full max-w-[1440px] overflow-visible">
      <LandingPageAnalytics />
      <Navbar variant="landing" forkCount={forkCount} />
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />

      <ForTeamsSection />
      <ForDevelopersSection />
      <ContactUsSection />
      <LandingFooter />
    </div>
  );
}
