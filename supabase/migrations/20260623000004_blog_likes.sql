-- Migration: blog_likes table (Issue #122)
-- Stores per-user likes. UNIQUE(blog_id, user_id) prevents duplicate likes
-- and allows clean unlike via a DELETE.

create table if not exists blog_likes (
  id         uuid        default gen_random_uuid() primary key,
  blog_id    uuid        not null references blogs(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),

  constraint blog_likes_blog_user_unique unique (blog_id, user_id)
);

alter table blog_likes enable row level security;

-- Public can read likes (needed for like counts on detail page)
create policy "Public select"
  on blog_likes
  for select
  using (true);

-- Authenticated users can like (insert own row)
create policy "Authenticated insert"
  on blog_likes
  for insert
  with check (auth.uid() = user_id);

-- Authenticated users can unlike (delete own row)
create policy "Authenticated delete own"
  on blog_likes
  for delete
  using (auth.uid() = user_id);
