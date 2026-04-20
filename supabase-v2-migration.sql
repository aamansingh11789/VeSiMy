-- ══════════════════════════════════════════════════════════════════════════
-- VeSiMy V2 Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Safe to run multiple times — all statements use IF NOT EXISTS / DO NOTHING
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. V2 columns on the steps table ─────────────────────────────────────
ALTER TABLE steps ADD COLUMN IF NOT EXISTS version             TEXT    DEFAULT 'v1';
ALTER TABLE steps ADD COLUMN IF NOT EXISTS step_type           TEXT    DEFAULT 'process';
ALTER TABLE steps ADD COLUMN IF NOT EXISTS tasks               JSONB   DEFAULT '[]'::jsonb;
ALTER TABLE steps ADD COLUMN IF NOT EXISTS governing_entity    TEXT;
ALTER TABLE steps ADD COLUMN IF NOT EXISTS cycle_time_unit     TEXT    DEFAULT 'seconds';
ALTER TABLE steps ADD COLUMN IF NOT EXISTS cycle_time_type     TEXT    DEFAULT 'assumed';
ALTER TABLE steps ADD COLUMN IF NOT EXISTS cycle_time_notes    TEXT;
ALTER TABLE steps ADD COLUMN IF NOT EXISTS is_value_added      TEXT    DEFAULT 'unclassified';
ALTER TABLE steps ADD COLUMN IF NOT EXISTS missing_info_flags  JSONB   DEFAULT '[]'::jsonb;
ALTER TABLE steps ADD COLUMN IF NOT EXISTS from_sop            BOOLEAN DEFAULT FALSE;
ALTER TABLE steps ADD COLUMN IF NOT EXISTS sop_original_text   TEXT;
ALTER TABLE steps ADD COLUMN IF NOT EXISTS map_x               NUMERIC;
ALTER TABLE steps ADD COLUMN IF NOT EXISTS map_y               NUMERIC;

-- ── 2. V2 column on the projects table ───────────────────────────────────
ALTER TABLE projects ADD COLUMN IF NOT EXISTS version          TEXT    DEFAULT 'v1';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS takt_time        NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS demand           NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS working_hours    NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS available_time_sec NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS shifts           NUMERIC;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS supplier         TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS product          TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS sop_parsed_at    TIMESTAMPTZ;

-- ── 3. analysis_reports table (V2 analysis results) ──────────────────────
CREATE TABLE IF NOT EXISTS analysis_reports (
  id                   UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id           UUID    NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id              UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type          TEXT    NOT NULL DEFAULT 'current_state',
  report_version       INTEGER NOT NULL DEFAULT 1,
  summary              TEXT,
  process_description  TEXT,
  total_steps          INTEGER,
  va_ratio             TEXT,
  estimated_lead_time  TEXT,
  improvement_potential JSONB  DEFAULT '{}'::jsonb,
  bottlenecks          JSONB   DEFAULT '[]'::jsonb,
  missing_information  JSONB   DEFAULT '[]'::jsonb,
  ci_suggestions       JSONB   DEFAULT '[]'::jsonb,
  mapping_guidance     JSONB   DEFAULT '[]'::jsonb,
  action_plan          JSONB   DEFAULT '[]'::jsonb,
  target_statement     TEXT,
  future_state         JSONB   DEFAULT '{}'::jsonb,
  disclaimer           TEXT,
  raw_ai_response      TEXT,
  generated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 4. live_metrics table ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS live_metrics (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID         NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  step_id     UUID         REFERENCES steps(id) ON DELETE SET NULL,
  user_id     UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type TEXT         NOT NULL,
  value       NUMERIC      NOT NULL,
  notes       TEXT,
  timestamp   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── 5. launch_window table (beta access) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS launch_window (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  is_open       BOOLEAN NOT NULL DEFAULT FALSE,
  label         TEXT    DEFAULT 'Early Access',
  closes_at     TIMESTAMPTZ,
  total_claimed INTEGER DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default row if none exists
INSERT INTO launch_window (is_open, label) 
SELECT FALSE, 'Early Access'
WHERE NOT EXISTS (SELECT 1 FROM launch_window);

-- ── 6. RLS Policies ──────────────────────────────────────────────────────

-- Enable RLS on new tables
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_metrics     ENABLE ROW LEVEL SECURITY;

-- analysis_reports: users see only their own
DROP POLICY IF EXISTS "analysis_reports_user_policy" ON analysis_reports;
CREATE POLICY "analysis_reports_user_policy" ON analysis_reports
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- live_metrics: users see only their own
DROP POLICY IF EXISTS "live_metrics_user_policy" ON live_metrics;
CREATE POLICY "live_metrics_user_policy" ON live_metrics
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── 7. Indexes for performance ────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_analysis_reports_project ON analysis_reports(project_id, user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_type    ON analysis_reports(project_id, report_type);
CREATE INDEX IF NOT EXISTS idx_live_metrics_project     ON live_metrics(project_id, user_id);
CREATE INDEX IF NOT EXISTS idx_steps_version            ON steps(project_id, version);

-- ── 8. Realtime for ProfileRefresh component ─────────────────────────────
-- Allow realtime on profiles table (needed for ProfileRefresh.tsx)
-- Run in Supabase Dashboard → Database → Replication → enable profiles table

-- ── Done ──────────────────────────────────────────────────────────────────
-- After running this migration:
-- 1. Verify in Table Editor that all columns exist
-- 2. Deploy the app
-- 3. Test: create a V2 project, add steps, run Analyze

-- ── 9. Missing tables referenced by application code ─────────────────────
-- process_simulations: stores saved simulation snapshots from ProcessSimulation.tsx
CREATE TABLE IF NOT EXISTS process_simulations (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id         uuid        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id            uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name               text        NOT NULL DEFAULT 'Simulation',
  simulation_steps   jsonb       NOT NULL DEFAULT '[]',
  current_lead_time  numeric,
  future_lead_time   numeric,
  lead_time_savings  numeric,
  scenario_id        text,
  notes              text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE process_simulations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "process_simulations_user_policy" ON process_simulations;
CREATE POLICY "process_simulations_user_policy" ON process_simulations
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_process_sims_project ON process_simulations(project_id, user_id);

-- supe_rate_log: per-user request rate limiting for Supe AI endpoint
-- Without this table the API falls back to an in-memory rate limiter on each cold start.
CREATE TABLE IF NOT EXISTS supe_rate_log (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE supe_rate_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "supe_rate_log_user_policy" ON supe_rate_log;
CREATE POLICY "supe_rate_log_user_policy" ON supe_rate_log
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-delete rate log entries older than 10 minutes (keeps table lean)
-- Run this in Supabase cron or pg_cron extension:
-- SELECT cron.schedule('supe-rate-cleanup', '*/10 * * * *',
--   $$DELETE FROM supe_rate_log WHERE created_at < now() - interval '10 minutes'$$);

CREATE INDEX IF NOT EXISTS idx_supe_rate_log_user_time ON supe_rate_log(user_id, created_at DESC);

-- ── Done (v2 addendum) ────────────────────────────────────────────────────
