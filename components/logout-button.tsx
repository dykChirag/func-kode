"use client";

import posthog from "posthog-js";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    track(ANALYTICS_EVENTS.LOGOUT);

    const supabase = createClient();
    await supabase.auth.signOut();
    posthog.reset();
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
