import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

type ProfileRecord = {
  id: string;
  github_username: string;
  display_name: string;
  bio: string;
  skills: string;
  role_preference: string;
  interests: string;
  avatar_url: string | null;
  is_onboarded: boolean;
};

function buildDefaultProfile(user: {
  id: string;
  user_metadata?: Record<string, unknown>;
}): ProfileRecord {
  const githubUsername =
    (user.user_metadata?.user_name as string | undefined) ||
    (user.user_metadata?.preferred_username as string | undefined) ||
    "newuser";
  const displayName =
    (user.user_metadata?.name as string | undefined) || githubUsername || "New User";
  const avatarUrl = (user.user_metadata?.avatar_url as string | undefined) || null;

  return {
    id: user.id,
    github_username: githubUsername,
    display_name: displayName,
    bio: "",
    skills: "",
    role_preference: "",
    interests: "",
    avatar_url: avatarUrl,
    is_onboarded: false,
  };
}

/**
 * Returns a Supabase admin client authenticated via the service-role key.
 * Use only in server-side code. Never expose SUPABASE_SERVICE_ROLE_KEY to the client.
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

async function getProfileById(id: string): Promise<Partial<ProfileRecord> | null> {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Partial<ProfileRecord> | null;
}

async function upsertProfile(payload: ProfileRecord): Promise<ProfileRecord> {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as ProfileRecord;
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingProfile = await getProfileById(user.id);

    const defaults = buildDefaultProfile(user);
    const mergedProfile: ProfileRecord = {
      ...defaults,
      ...(existingProfile ?? {}),
      avatar_url: (existingProfile?.avatar_url as string | null | undefined) ?? defaults.avatar_url,
      is_onboarded: Boolean(existingProfile?.is_onboarded ?? defaults.is_onboarded),
    };

    const saved = await upsertProfile(mergedProfile);
    return NextResponse.json({ profile: saved });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Partial<ProfileRecord>;
    const defaults = buildDefaultProfile(user);

    const payload: ProfileRecord = {
      id: user.id,
      github_username: (body.github_username || defaults.github_username).trim(),
      display_name: (body.display_name || defaults.display_name).trim(),
      bio: (body.bio || "").trim(),
      skills: (body.skills || "").trim(),
      role_preference: (body.role_preference || "").trim(),
      interests: (body.interests || "").trim(),
      avatar_url: body.avatar_url ?? defaults.avatar_url,
      is_onboarded: true,
    };

    const saved = await upsertProfile(payload);
    return NextResponse.json({ id: saved.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
