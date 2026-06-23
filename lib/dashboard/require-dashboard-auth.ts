import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type DashboardAuth = {
  user: User;
  githubToken: string;
  supabase: SupabaseClient;
};

export type DashboardAuthResult =
  | { ok: true; auth: DashboardAuth }
  | { ok: false; response: NextResponse };

/**
 * Ensures the request is from a logged-in user with a GitHub OAuth provider token.
 */
export async function requireDashboardAuth(): Promise<DashboardAuthResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const githubToken = session?.provider_token;
  if (!githubToken) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            "GitHub access token not available. Please sign in with GitHub again.",
        },
        { status: 403 },
      ),
    };
  }

  return {
    ok: true,
    auth: { user, githubToken, supabase },
  };
}
