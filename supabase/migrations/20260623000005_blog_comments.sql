-- Migration: blog_comments table (Issue #122)
-- Stores blog comments. Join to `users` table for display_name / github_username.

create table if not exists blog_comments (
  id         uuid        default gen_random_uuid() primary key,
  blog_id    uuid        not null references blogs(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  content    text        not null,
  created_at timestamptz default now()
);

alter table blog_comments enable row level security;

-- Anyone can read comments
create policy "Public select"
  on blog_comments
  for select
  using (true);

-- Authenticated users can post comments
create policy "Authenticated insert"
  on blog_comments
  for insert
  with check (auth.uid() = user_id);

-- Users can delete their own comments
create policy "Authenticated delete own"
  on blog_comments
  for delete
  using (auth.uid() = user_id);
