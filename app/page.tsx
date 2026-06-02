import { LandingBackground } from "@/components/landing/landing-background";
import { LandingPageContent } from "@/components/landing/landing-page-content";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function HomePage() {
  return (
    <div
      className={`relative min-h-[4727px] w-full overflow-x-hidden ${poppins.className}`}
    >
      <LandingBackground />
      <LandingPageContent />
    </div>
  );
}
