"use client";

import type { ReactNode } from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PostHogSdkProvider } from "posthog-js/react";
import { createClient } from "@/lib/supabase/client";
import { markPostHogInitialized } from "@/lib/analytics";
import { PostHogPageview } from "@/components/providers/posthog-pageview";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

/** Enabled in production when a key is set; in dev only when explicitly opted in. */
const analyticsEnabled =
  Boolean(posthogKey) &&
  (process.env.NODE_ENV !== "development" ||
    process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true");

export function PostHogProvider({ children }: { children: ReactNode }) {
  const trackedUserId = useRef<string | null>(null);
  const initialized = useRef(false);
  const [identityReady, setIdentityReady] = useState(false);

  useEffect(() => {
    if (!analyticsEnabled || !posthogKey || initialized.current) {
      return;
    }

    initialized.current = true;

    posthog.init(posthogKey, {
      api_host: posthogHost,
      capture_pageview: false,
      capture_pageleave: true,
    });
    markPostHogInitialized();

    const supabase = createClient();

    const syncIdentity = (userId: string | null) => {
      if (!userId) {
        if (trackedUserId.current) {
          posthog.reset();
          trackedUserId.current = null;
        }
        return;
      }

      if (trackedUserId.current !== userId) {
        posthog.identify(userId);
        trackedUserId.current = userId;
      }
    };

    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      syncIdentity(user?.id ?? null);
      setIdentityReady(true);
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      syncIdentity(session?.user?.id ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!analyticsEnabled || !posthogKey) {
    return <>{children}</>;
  }

  return (
    <PostHogSdkProvider client={posthog}>
      {identityReady ? (
        <Suspense fallback={null}>
          <PostHogPageview />
        </Suspense>
      ) : null}
      {children}
    </PostHogSdkProvider>
  );
}
