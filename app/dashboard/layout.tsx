import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Requires RLS on profiles allowing SELECT where auth.uid() = id — see database/profiles.sql
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_onboarded")
    .eq("id", user.id)
    .single();

  if (profileError) {
    // PGRST116 = no row yet (user has not onboarded)
    if (profileError.code !== "PGRST116") {
      console.error("[DashboardLayout] Failed to fetch profile:", profileError.message);
    }
    redirect("/onboard");
  }

  if (!profile.is_onboarded) {
    redirect("/onboard");
  }

  return <>{children}</>;
}
