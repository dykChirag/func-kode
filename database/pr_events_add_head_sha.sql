-- Migration: add head_sha column to pr_events
-- Run this against your Supabase project if the column does not exist.
-- Safe to run multiple times (IF NOT EXISTS guard).
--
-- head_sha is the Git commit SHA at the tip of the PR head branch.
-- It is included in PrEventJob and persisted by the worker for auditability.

ALTER TABLE pr_events
  ADD COLUMN IF NOT EXISTS head_sha TEXT,
  ADD COLUMN IF NOT EXISTS github_event TEXT,
  ADD COLUMN IF NOT EXISTS github_action TEXT;

COMMENT ON COLUMN pr_events.head_sha IS
  'Git SHA of the head commit on the PR branch at the time the event was received.';
COMMENT ON COLUMN pr_events.github_event IS
  'X-GitHub-Event header value (e.g. pull_request, pull_request_review).';
COMMENT ON COLUMN pr_events.github_action IS
  'GitHub webhook action value (e.g. opened, closed, submitted).';
