import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies });
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
