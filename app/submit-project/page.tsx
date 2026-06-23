import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SubmitProjectForm } from "@/components/submit-project-form";

/**
 * /submit-project — server component wrapper.
 *
 * Auth guard (Issue #120):
 *   Unauthenticated users are redirected to /auth/login?redirect=/submit-project.
 *   The form itself is a client component to handle validation, loading, and error states.
 */
export default async function SubmitProjectPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login?redirect=/submit-project");
  }

  return (
    <main className="min-h-screen bg-[#040710] px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Submit a Project
        </h1>
        <p className="mb-8 text-sm text-white/60">
          Share a project with the func(kode) community.
        </p>
        <SubmitProjectForm userId={user.id} />
      </div>
    </main>
  );
}
