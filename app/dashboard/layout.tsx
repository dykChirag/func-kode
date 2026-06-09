import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Returns a Supabase admin client authenticated via the service-role key.
 * Avoids HTTP loopback calls from server components to internal API routes.
 */
function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase server configuration");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  const admin = getAdminClient();
  const { data: profile, error } = await admin
    .from("profiles")
    .select("is_onboarded")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile?.is_onboarded) {
    redirect("/onboard");
  }

  return <>{children}</>;
}
