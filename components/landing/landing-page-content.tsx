"use client";

import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/landing/hero-section";

/** Foreground landing layout. */
export function LandingPageContent() {
  return (
    <div className="relative z-10 mx-auto w-full max-w-[1440px] overflow-visible">
      <Navbar />
      <HeroSection />
    </div>
  );
}
