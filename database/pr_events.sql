-- PR events table (populated when queue jobs are processed)
CREATE TABLE IF NOT EXISTS pr_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    repo_name TEXT NOT NULL,
    pr_number INTEGER NOT NULL,
    github_pt_id BIGINT NOT NULL,
    event_type TEXT NOT NULL CHECK (
        event_type IN ('opened', 'synchronized', 'reviewed', 'merged', 'closed', 'edited')
    ),
    title TEXT NOT NULL,
    body TEXT,
    author_username TEXT NOT NULL,
    base_branch TEXT NOT NULL,
    head_branch TEXT NOT NULL,
    additions INTEGER,
    deletions INTEGER,
    changed_files INTEGER,
    commits_count INTEGER,
    review_count INTEGER,
    requested_reviewers_count INTEGER,
    labels_json JSONB,
    tests_touched BOOLEAN DEFAULT false,
    docs_touched BOOLEAN DEFAULT false,
    risky_paths_hit BOOLEAN DEFAULT false,
    state TEXT NOT NULL,
    merged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    delivery_id TEXT UNIQUE,
    idempotency_key TEXT UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_pr_events_developer_id ON pr_events(developer_id);
CREATE INDEX IF NOT EXISTS idx_pr_events_repo_pr ON pr_events(repo_name, pr_number);
CREATE INDEX IF NOT EXISTS idx_pr_events_github_pt_id ON pr_events(github_pt_id);
CREATE INDEX IF NOT EXISTS idx_pr_events_event_type ON pr_events(event_type);
