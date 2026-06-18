CREATE TABLE IF NOT EXISTS resume_drafts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  target_role TEXT NOT NULL,
  job_listing TEXT NOT NULL,
  concept TEXT NOT NULL DEFAULT 'classic',
  resume JSONB NOT NULL,
  analysis JSONB NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  token_usage JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS resume_drafts_updated_at_idx
  ON resume_drafts (updated_at DESC);

CREATE TABLE IF NOT EXISTS site_content (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
