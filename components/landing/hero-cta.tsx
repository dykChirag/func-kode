"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import type { User } from "@supabase/supabase-js";

/**
 * HeroCTA
 *
 * Auth-aware primary CTA for the landing page hero.
 * Kept as an isolated client component so HeroSection can remain a server component.
 *
 * Logged-out  → "Start Contributing" → /auth/login
 * Logged-in   → "Go to Dashboard"   → /dashboard
 *
 * Fires LANDING_CTA_CLICKED on every click (Issue #127).
 */
export function HeroCTA({ className }: { className?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const label = user ? "Go to Dashboard" : "Start Contributing";
  const href = user ? "/dashboard" : "/auth/login";

  return (
    <Link
      href={href}
      className={className}
      // Suppress mismatched server/client render flash before hydration
      style={ready ? undefined : { opacity: 0, pointerEvents: "none" }}
      onClick={() => {
        track(ANALYTICS_EVENTS.LANDING_CTA_CLICKED, {
          cta_label: label,
          cta_href: href,
          section: "hero",
        });
      }}
    >
      {label}
    </Link>
  );
}
