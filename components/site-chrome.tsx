"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/**
 * Route-aware shell for the global Navbar and Footer.
 *
 * **Problem:** The landing page (`/`) will use its own navbar/footer inside a
 * dedicated layout. The root `layout.tsx` previously always rendered global
 * Navbar + Footer, which would duplicate chrome on `/`.
 *
 * **Why not only layout.tsx?** The root layout is a Server Component and cannot
 * call `usePathname()`. This client wrapper keeps one root layout while
 * centralizing the route rule in a single place (vs. repeating chrome on every
 * non-landing page).
 *
 * **Blast radius:** Every route passes through here. Non-landing routes are
 * unchanged; `/` renders `{children}` only until landing PRs add local chrome.
 *
 * @see docs/architecture/site-chrome.md
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
