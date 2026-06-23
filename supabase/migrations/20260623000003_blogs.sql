-- Migration: blogs table (Issue #122)
-- Blog posts; only published=true rows are readable by the public.

create table if not exists blogs (
  id               uuid        default gen_random_uuid() primary key,
  title            text        not null,
  slug             text        not null unique,
  excerpt          text,
  content          text,
  author           text,
  cover_image_url  text,
  published        boolean     not null default false,
  created_at       timestamptz default now()
);

alter table blogs enable row level security;

-- Only published posts are publicly readable
create policy "Public select published"
  on blogs
  for select
  using (published = true);
