"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";

export function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (!pathname || !posthog) {
      return;
    }

    posthog.capture("$pageview", {
      $current_url: window.location.href,
      $pathname: pathname,
      $search: searchParams.toString(),
    });
  }, [pathname, searchParams, posthog]);

  return null;
}