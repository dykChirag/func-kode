import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Dashboard layout — server component.
 *
 * Auth guard (Issue #119):
 *   - Uses getUser() (not getSession()) to validate the session server-side.
 *   - Unauthenticated → redirects to /auth/login?redirect=/dashboard
 *   - Authenticated but not onboarded → redirects to /onboard
 *   - Authenticated + onboarded → renders children normally
 *
 * This fixes the "redirected to /auth/login even when logged in" symptom
 * caused by getSession() vs getUser() mismatch noted in issue #119.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();

  // getUser() makes a network request to Supabase to validate the JWT.
  // This is the correct approach post @supabase/ssr migration (PR #106).
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  // Check onboarding status — skip the DB call if user is already marked
  // as onboarded via session metadata to minimise latency.
  const { data: profile } = await supabase
    .from("users")
    .select("is_onboarded")
    .eq("id", user.id)
    .maybeSingle();

  if (profile && !profile.is_onboarded) {
    redirect("/onboard");
  }

  return <>{children}</>;
}
