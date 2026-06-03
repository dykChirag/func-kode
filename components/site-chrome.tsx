"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/**
 * Route-aware shell for the global Navbar and Footer.
 *
 * @see docs/architecture/site-chrome.md
 */
export function SiteChrome({
  children,
  forkCount = null,
}: {
  children: React.ReactNode;
  forkCount?: number | null;
}) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar forkCount={forkCount} />
      <main className="flex-1">{children}</main>
      {!isLandingPage && <Footer />}
    </div>
  );
}
