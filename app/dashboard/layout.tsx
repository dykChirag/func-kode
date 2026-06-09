import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_onboarded")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile?.is_onboarded) {
    redirect("/onboard");
  }

  return <>{children}</>;
}
