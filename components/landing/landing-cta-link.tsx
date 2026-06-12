"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

type LandingCtaLinkProps = ComponentProps<typeof Link> & {
  ctaLabel: string;
  section: string;
};

export function LandingCtaLink({
  ctaLabel,
  section,
  href,
  onClick,
  ...props
}: LandingCtaLinkProps) {
  return (
    <Link
      href={href}
      {...props}
      onClick={(event) => {
        track(ANALYTICS_EVENTS.LANDING_CTA_CLICKED, {
          cta_label: ctaLabel,
          cta_href: typeof href === "string" ? href : href.pathname ?? "",
          section,
        });
        onClick?.(event);
      }}
    />
  );
}
