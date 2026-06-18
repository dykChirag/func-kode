import { Archivo, Poppins } from "next/font/google";
import { LandingBackground } from "@/components/landing/landing-background";
import { LandingPageContent } from "@/components/landing/landing-page-content";
import { EventAnnouncementPopup } from "@/components/landing/event-announcement-popup";

/**
 * Poppins scoped to landing page only.
 * Loaded here (not in layout.tsx) so it does not bleed into other routes.
 * Inter (global) remains the default font everywhere else.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
  variable: "--font-archivo",
});

/**
 * Landing page — server component.
 * No "use client" here; forkCount flows via SiteChrome context into LandingPageContent.
 *
 * Structure:
 *   <div poppins>
 *     <LandingBackground />          ← absolute inset-0, aria-hidden, z-0
 *     <LandingPageContent />         ← relative z-10, full landing page sections
 *     <EventAnnouncementPopup />     ← client component, fixed z-50, dismissible modal
 *   </div>
 *
 * Page height grows with content — no min-h-[4727px] or any fixed height.
 */
export default function HomePage() {
  return (
    <div className={`relative w-full overflow-x-hidden min-h-screen bg-landing-dark ${poppins.className} ${archivo.variable}`}>
      <LandingBackground />
      <LandingPageContent />
      <EventAnnouncementPopup />
    </div>
  );
}
