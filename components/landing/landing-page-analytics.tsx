"use client";

import { useEffect, useRef } from "react";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

const LANDING_SECTION_IDS = [
  "func-kode",
  "how-it-works",
  "for-teams",
  "for-developers",
  "contact-us",
  "landing-footer",
] as const;

/**
 * Fires landing page_viewed and section visibility events (issue #111).
 * Mount once inside LandingPageContent.
 */
export function LandingPageAnalytics() {
  const pageViewed = useRef(false);
  const sectionsSeen = useRef(new Set<string>());

  useEffect(() => {
    if (!pageViewed.current) {
      pageViewed.current = true;
      track(ANALYTICS_EVENTS.PAGE_VIEWED, { page: "landing" });
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
            continue;
          }

          const sectionId = entry.target.id;
          if (!sectionId || sectionsSeen.current.has(sectionId)) {
            continue;
          }

          sectionsSeen.current.add(sectionId);
          track(ANALYTICS_EVENTS.LANDING_SECTION_VIEWED, { section_id: sectionId });
        }
      },
      { threshold: 0.5 },
    );

    for (const id of LANDING_SECTION_IDS) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
