import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login?redirect=/dashboard");
  }

  const { data: userProfile } = await supabase
    .from("users")
    .select("is_onboarded")
    .eq("id", session.user.id)
    .maybeSingle();

  if (!userProfile?.is_onboarded) {
    redirect("/onboard");
  }

  return <>{children}</>;
}
