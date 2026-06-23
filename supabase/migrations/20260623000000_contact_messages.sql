-- Migration: contact_messages table (Issue #129)
-- Allows anonymous visitors to submit a contact form from the landing page.
-- Admins (authenticated role) can read submissions.

create table if not exists contact_messages (
  id          uuid        default gen_random_uuid() primary key,
  name        text        not null,
  email       text        not null,
  message     text        not null,
  created_at  timestamptz default now()
);

-- RLS: enable row-level security
alter table contact_messages enable row level security;

-- Public insert: any visitor (even unauthenticated) can submit the contact form
create policy "Public insert"
  on contact_messages
  for insert
  with check (true);

-- Admin select: only authenticated users (team/admins) can read submissions
create policy "Admin select"
  on contact_messages
  for select
  using (auth.role() = 'authenticated');
