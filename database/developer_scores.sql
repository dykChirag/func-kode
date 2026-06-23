-- =============================================================================
-- developer_scores
-- Stores versioned Patch ID trust score snapshots per developer.
-- Computed by lib/scoring/compute-developer-score.ts after each pr_event write.
-- =============================================================================

CREATE TABLE IF NOT EXISTS developer_scores (
    id                         UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- FK to auth.users (same as profiles.id)
    developer_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- formula version — bump SCORE_VERSION in scoring-types.ts when weights change
    score_version              INTEGER NOT NULL DEFAULT 1,

    -- final trust score 0-100
    score_total                NUMERIC(5,2) NOT NULL CHECK (score_total >= 0 AND score_total <= 100),

    -- per-dimension scores (each 0-100 contribution after weighting)
    merge_quality_score        NUMERIC(5,2) NOT NULL DEFAULT 0,
    review_participation_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    consistency_score          NUMERIC(5,2) NOT NULL DEFAULT 0,
    pr_hygiene_score           NUMERIC(5,2) NOT NULL DEFAULT 0,
    recent_activity_score      NUMERIC(5,2) NOT NULL DEFAULT 0,

    -- raw metrics snapshot used to compute this score (for auditability)
    metrics_json               JSONB,

    -- whether enough data existed at compute time
    sufficient_data            BOOLEAN NOT NULL DEFAULT false,

    -- short human-readable explanation surfaced in the UI
    explanation                TEXT,

    computed_at                TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at                 TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

-- primary lookup: latest score for a developer
CREATE INDEX IF NOT EXISTS idx_developer_scores_developer_id
    ON developer_scores(developer_id);

-- time-series queries (score history)
CREATE INDEX IF NOT EXISTS idx_developer_scores_computed_at
    ON developer_scores(developer_id, computed_at DESC);

-- version-aware lookups
CREATE INDEX IF NOT EXISTS idx_developer_scores_version
    ON developer_scores(developer_id, score_version);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE developer_scores ENABLE ROW LEVEL SECURITY;

-- Developers can read their own scores
CREATE POLICY "Users can view their own scores"
ON developer_scores FOR SELECT
TO authenticated
USING (auth.uid() = developer_id);

-- Only the service role (backend worker) can insert/update scores
-- No authenticated user policy for INSERT — scores are written server-side only
CREATE POLICY "Service role can manage scores"
ON developer_scores FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Admins can view all scores
CREATE POLICY "Admins can view all scores"
ON developer_scores FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'email' IN ('vvs.pedapati@rediffmail.com') OR
    auth.jwt() -> 'user_metadata' ->> 'github_username' = 'basanth-pedapati'
);

-- ---------------------------------------------------------------------------
-- Helper view: latest score per developer
-- Chirag's API route can query this instead of raw table for simplicity.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW developer_latest_scores AS
SELECT DISTINCT ON (developer_id)
    id,
    developer_id,
    score_version,
    score_total,
    merge_quality_score,
    review_participation_score,
    consistency_score,
    pr_hygiene_score,
    recent_activity_score,
    metrics_json,
    sufficient_data,
    explanation,
    computed_at
FROM developer_scores
ORDER BY developer_id, computed_at DESC;
