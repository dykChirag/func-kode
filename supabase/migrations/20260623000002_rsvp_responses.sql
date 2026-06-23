-- Migration: rsvp_responses table (Issue #121)
-- Stores RSVP submissions. UNIQUE(event_id, user_id) enables upsert
-- so duplicate RSVPs are handled gracefully without a 23505 crash.

create table if not exists rsvp_responses (
  id         uuid        default gen_random_uuid() primary key,
  event_id   uuid        not null references events(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  name       text        not null,
  notes      text,
  created_at timestamptz default now(),

  constraint rsvp_responses_event_user_unique unique (event_id, user_id)
);

alter table rsvp_responses enable row level security;

-- Public can read RSVPs (e.g. to show attendee count)
create policy "Public select"
  on rsvp_responses
  for select
  using (true);

-- Authenticated users can insert/update their own RSVP
create policy "Authenticated insert"
  on rsvp_responses
  for insert
  with check (auth.uid() = user_id);

create policy "Authenticated update own"
  on rsvp_responses
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
