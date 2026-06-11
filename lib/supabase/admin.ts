import { createClient } from "@supabase/supabase-js";

/**
 * Returns a Supabase admin client authenticated via the service-role key.
 * Use only in server-side code. Never expose SUPABASE_SERVICE_ROLE_KEY to the client.
 */
export function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase server configuration");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
