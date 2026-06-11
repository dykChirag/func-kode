-- Profiles table + RLS policies required for user-scoped dashboard/onboarding queries.
-- Run in Supabase SQL Editor (Dashboard → SQL) if not already applied.
--
-- DashboardLayout reads profiles.is_onboarded via the authenticated server client,
-- which requires SELECT RLS: auth.uid() = id

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    github_username TEXT,
    display_name TEXT,
    bio TEXT DEFAULT '',
    skills TEXT DEFAULT '',
    role_preference TEXT DEFAULT '',
    interests TEXT DEFAULT '',
    avatar_url TEXT,
    is_onboarded BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE INDEX IF NOT EXISTS idx_profiles_github_username ON profiles(github_username);
CREATE INDEX IF NOT EXISTS idx_profiles_is_onboarded ON profiles(is_onboarded);
