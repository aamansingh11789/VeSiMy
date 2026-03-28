-- ── 008_builder_v2.sql ─────────────────────────────────────────────────────
-- VeSiMy Builder V2 — Full overhaul
-- New project creation flow: SOP upload → interactive map → analyze → future state
-- Run this in your Supabase SQL editor
-- Safe to run multiple times (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS)

-- ════════════════════════════════════════════════════════════════════════════
-- 1. PROJECTS — new V2 columns
-- ════════════════════════════════════════════════════════════════════════════
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS version              text    DEFAULT 'v1',
  ADD COLUMN IF NOT EXISTS sop_raw_text         text,
  ADD COLUMN IF NOT EXISTS sop_filename         text,
  ADD COLUMN IF NOT EXISTS sop_file_type        text,
  ADD COLUMN IF NOT EXISTS sop_parsed_at        timestamptz,
  ADD COLUMN IF NOT EXISTS project_target       text,
  ADD COLUMN IF NOT EXISTS target_category      text    DEFAULT 'time',
  ADD COLUMN IF NOT EXISTS target_value         text,
  ADD COLUMN IF NOT EXISTS target_unit          text,
  ADD COLUMN IF NOT EXISTS target_deadline      date,
  ADD COLUMN IF NOT EXISTS creation_mode        text    DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS map_locked           boolean DEFAULT false;

-- ════════════════════════════════════════════════════════════════════════════
-- 2. STEPS — new V2 columns
-- ════════════════════════════════════════════════════════════════════════════
ALTER TABLE steps
  ADD COLUMN IF NOT EXISTS tasks               jsonb   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS governing_entity    text,
  ADD COLUMN IF NOT EXISTS cycle_time_unit     text    DEFAULT 'seconds',
  ADD COLUMN IF NOT EXISTS cycle_time_type     text    DEFAULT 'measured',
  ADD COLUMN IF NOT EXISTS cycle_time_notes    text,
  ADD COLUMN IF NOT EXISTS map_x               integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS map_y               integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS step_type           text    DEFAULT 'process',
  ADD COLUMN IF NOT EXISTS missing_info_flags  jsonb   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS from_sop            boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS sop_original_text   text;

-- ════════════════════════════════════════════════════════════════════════════
-- 3. ANALYSIS_REPORTS — new table (replaces ad-hoc report storage)
-- ════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS analysis_reports (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id            uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  report_type           text NOT NULL DEFAULT 'current_state',
  version               integer NOT NULL DEFAULT 1,

  -- Summary
  process_summary       text,
  total_steps           integer,
  va_ratio              text,
  estimated_lead_time   text,

  -- Improvement potential
  improvement_potential jsonb DEFAULT '{}',

  -- Detailed findings (all jsonb arrays)
  bottlenecks           jsonb DEFAULT '[]',
  missing_information   jsonb DEFAULT '[]',
  ci_suggestions        jsonb DEFAULT '[]',
  mapping_guidance      jsonb DEFAULT '[]',

  -- Future state data (populated when report_type = 'future_state')
  future_state_steps    jsonb DEFAULT '[]',
  action_plan           jsonb DEFAULT '[]',
  target_tolerance      text,

  -- Supe conversation that produced this (if any)
  supe_conversation     jsonb DEFAULT '[]',

  -- Meta
  disclaimer            text,
  raw_ai_response       text,
  generated_at          timestamptz DEFAULT now(),
  created_at            timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analysis_reports_project
  ON analysis_reports(project_id, created_at DESC);

ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analysis_reports_own" ON analysis_reports
  FOR ALL USING (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════════════════════
-- 4. SOP_UPLOADS — track raw uploads separately so we can re-parse
-- ════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS sop_uploads (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename     text NOT NULL,
  file_type    text NOT NULL,
  raw_text     text NOT NULL,
  parsed_steps jsonb DEFAULT '[]',
  parsed_at    timestamptz DEFAULT now(),
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE sop_uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sop_uploads_own" ON sop_uploads
  FOR ALL USING (auth.uid() = user_id);
