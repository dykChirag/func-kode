"use client";

import type { ReactNode } from "react";
import { Suspense, useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PostHogSdkProvider } from "posthog-js/react";
import { PostHogPageview } from "@/components/providers/posthog-pageview";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!posthogKey || posthog.__loaded) {
      return;
    }

    posthog.init(posthogKey, {
      api_host: posthogHost,
      capture_pageview: false,
      capture_pageleave: true,
      persistence: "memory",
    });
  }, []);

  if (!posthogKey) {
    return <>{children}</>;
  }

  return (
    <PostHogSdkProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageview />
      </Suspense>
      {children}
    </PostHogSdkProvider>
  );
}
