"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

export function LoginForm() {
  const handleGithubLogin = async () => {
    const supabase = createClient();

    track(ANALYTICS_EVENTS.LOGIN_ATTEMPTED, { method: "github" });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        scopes: "read:user user:email repo read:discussion",
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("OAuth error:", error.message);
      track(ANALYTICS_EVENTS.LOGIN_FAILED, { method: "github", error: error.message });
      return;
    }

    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Button
        type="button"
        onClick={handleGithubLogin}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white"
      >
        Sign in with GitHub
      </Button>
    </div>
  );
}
