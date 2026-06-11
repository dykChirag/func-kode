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
const analyticsEnabled = process.env.NODE_ENV !== "development" && Boolean(posthogKey);

export function PostHogProvider({ children }: { children: ReactNode }) {
  const trackedUserId = useRef<string | null>(null);
  const initialized = useRef(false);
  const [ready, setReady] = useState(!analyticsEnabled || !posthogKey);

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
      markPostHogInitialized();
      setReady(true);
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

  if (!ready) {
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
