-- ── Migration 013: Audit additions ───────────────────────────────────────────
-- Added during the VeSiMy production-readiness audit (April 2026).
-- Safe to run multiple times (IF NOT EXISTS / DROP POLICY IF EXISTS).

-- 1. process_simulations — stores saved simulation snapshots
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

-- 2. supe_rate_log — per-user rate limiting for Supe AI
CREATE TABLE IF NOT EXISTS supe_rate_log (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE supe_rate_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "supe_rate_log_user_policy" ON supe_rate_log;
CREATE POLICY "supe_rate_log_user_policy" ON supe_rate_log
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_supe_rate_log_user_time ON supe_rate_log(user_id, created_at DESC);

-- 3. VSM / takt fields on projects (idempotent ADD COLUMN IF NOT EXISTS)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS product            text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS supplier           text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS demand             numeric;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS working_hours      numeric;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS shifts             numeric;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS available_time_sec numeric;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS takt_time          numeric;
