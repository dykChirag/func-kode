-- Migration: events table (Issue #121)
-- Community events browseable by all visitors.

create table if not exists events (
  id           uuid        default gen_random_uuid() primary key,
  name         text        not null,
  description  text,
  event_date   date,
  event_time   text,
  location     text,
  format       text        default 'in-person',
  created_at   timestamptz default now()
);

alter table events enable row level security;

-- Anyone (including unauthenticated) can read events
create policy "Public select"
  on events
  for select
  using (true);
