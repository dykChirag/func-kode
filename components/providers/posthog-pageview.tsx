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

    const search = searchParams.toString();
    const url = search ? `${pathname}?${search}` : pathname;

    posthog.capture("$pageview", {
      $current_url: url,
      $pathname: pathname,
    });
  }, [pathname, searchParams, posthog]);

  return null;
}
