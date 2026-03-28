-- ══════════════════════════════════════════════════════════════════════════════
-- VeSiMy — 009_complete_schema.sql
-- Run once in Supabase SQL Editor. Safe to re-run (all IF NOT EXISTS).
-- Brings any fresh Supabase project up to full V3.1 schema.
-- ══════════════════════════════════════════════════════════════════════════════

-- ── 1. PROFILES — add all columns added across migrations 004-008 ─────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_beta              BOOLEAN     DEFAULT false,
  ADD COLUMN IF NOT EXISTS lifetime_access      BOOLEAN     DEFAULT false,
  ADD COLUMN IF NOT EXISTS beta_tier            TEXT        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS beta_expires_at      TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS onboarded            BOOLEAN     DEFAULT false;

-- ── 2. STEPS — branching columns (002_branching) ──────────────────────────────
ALTER TABLE public.steps
  ADD COLUMN IF NOT EXISTS branch_id            TEXT        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS branch_label         TEXT        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS branch_parent_id     UUID        REFERENCES public.steps(id) ON DELETE CASCADE DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS branch_position      INT         DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_main_flow         BOOLEAN     DEFAULT true;

-- ── 3. PROJECTS — V2 columns (008_builder_v2) ────────────────────────────────
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS version              TEXT        DEFAULT 'v1',
  ADD COLUMN IF NOT EXISTS sop_raw_text         TEXT,
  ADD COLUMN IF NOT EXISTS sop_filename         TEXT,
  ADD COLUMN IF NOT EXISTS sop_file_type        TEXT,
  ADD COLUMN IF NOT EXISTS sop_parsed_at        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS project_target       TEXT,
  ADD COLUMN IF NOT EXISTS target_category      TEXT        DEFAULT 'time',
  ADD COLUMN IF NOT EXISTS target_value         TEXT,
  ADD COLUMN IF NOT EXISTS target_unit          TEXT,
  ADD COLUMN IF NOT EXISTS target_deadline      DATE,
  ADD COLUMN IF NOT EXISTS creation_mode        TEXT        DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS map_locked           BOOLEAN     DEFAULT false;

-- ── 4. STEPS — V2 columns (008_builder_v2) ───────────────────────────────────
ALTER TABLE public.steps
  ADD COLUMN IF NOT EXISTS tasks                JSONB       DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS governing_entity     TEXT,
  ADD COLUMN IF NOT EXISTS cycle_time_unit      TEXT        DEFAULT 'seconds',
  ADD COLUMN IF NOT EXISTS cycle_time_type      TEXT        DEFAULT 'assumed',
  ADD COLUMN IF NOT EXISTS cycle_time_notes     TEXT,
  ADD COLUMN IF NOT EXISTS map_x                INTEGER     DEFAULT 0,
  ADD COLUMN IF NOT EXISTS map_y                INTEGER     DEFAULT 0,
  ADD COLUMN IF NOT EXISTS step_type            TEXT        DEFAULT 'process',
  ADD COLUMN IF NOT EXISTS is_value_added       TEXT        DEFAULT 'unclassified',
  ADD COLUMN IF NOT EXISTS missing_info_flags   JSONB       DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS from_sop             BOOLEAN     DEFAULT false,
  ADD COLUMN IF NOT EXISTS sop_original_text    TEXT,
  ADD COLUMN IF NOT EXISTS version              TEXT        DEFAULT 'v1';

-- ── 5. KANBAN TABLES (003_kanban) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.kanban_columns (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID         NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id    UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT         NOT NULL,
  position   INTEGER      DEFAULT 0,
  color      TEXT,
  created_at TIMESTAMPTZ  DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.kanban_cards (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  column_id   UUID         NOT NULL REFERENCES public.kanban_columns(id) ON DELETE CASCADE,
  project_id  UUID         NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id     UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT         NOT NULL,
  description TEXT,
  position    INTEGER      DEFAULT 0,
  created_at  TIMESTAMPTZ  DEFAULT now()
);
ALTER TABLE public.kanban_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_cards   ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='kanban_columns' AND policyname='kanban_columns_own') THEN
    CREATE POLICY "kanban_columns_own" ON public.kanban_columns FOR ALL USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='kanban_cards' AND policyname='kanban_cards_own') THEN
    CREATE POLICY "kanban_cards_own" ON public.kanban_cards FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;

-- ── 6. PROCESS JOURNAL (007_process_journal) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.process_journal (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID         NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id    UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       TEXT         NOT NULL,
  content    TEXT         NOT NULL,
  meta       JSONB        DEFAULT '{}',
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);
ALTER TABLE public.process_journal ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='process_journal' AND policyname='journal_own') THEN
    CREATE POLICY "journal_own" ON public.process_journal FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS process_journal_project_id_idx
  ON public.process_journal (project_id, created_at DESC);

-- ── 7. ANALYSIS REPORTS (008_builder_v2) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.analysis_reports (
  id                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id            UUID         NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id               UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type           TEXT         NOT NULL DEFAULT 'current_state',
  version               INTEGER      NOT NULL DEFAULT 1,
  process_summary       TEXT,
  total_steps           INTEGER,
  va_ratio              TEXT,
  estimated_lead_time   TEXT,
  improvement_potential JSONB        DEFAULT '{}',
  bottlenecks           JSONB        DEFAULT '[]',
  missing_information   JSONB        DEFAULT '[]',
  ci_suggestions        JSONB        DEFAULT '[]',
  mapping_guidance      JSONB        DEFAULT '[]',
  future_state_steps    JSONB        DEFAULT '[]',
  action_plan           JSONB        DEFAULT '[]',
  target_tolerance      TEXT,
  supe_conversation     JSONB        DEFAULT '[]',
  disclaimer            TEXT,
  raw_ai_response       TEXT,
  generated_at          TIMESTAMPTZ  DEFAULT now(),
  created_at            TIMESTAMPTZ  DEFAULT now()
);
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='analysis_reports' AND policyname='analysis_reports_own') THEN
    CREATE POLICY "analysis_reports_own" ON public.analysis_reports FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_analysis_reports_project
  ON public.analysis_reports(project_id, created_at DESC);

-- ── 8. SOP UPLOADS (008_builder_v2) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sop_uploads (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID         NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id      UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename     TEXT         NOT NULL,
  file_type    TEXT         NOT NULL,
  raw_text     TEXT         NOT NULL,
  parsed_steps JSONB        DEFAULT '[]',
  parsed_at    TIMESTAMPTZ  DEFAULT now(),
  created_at   TIMESTAMPTZ  DEFAULT now()
);
ALTER TABLE public.sop_uploads ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sop_uploads' AND policyname='sop_uploads_own') THEN
    CREATE POLICY "sop_uploads_own" ON public.sop_uploads FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- ── 9. INDEXES ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_steps_project_version  ON public.steps(project_id, version);
CREATE INDEX IF NOT EXISTS idx_projects_version       ON public.projects(version, user_id);

-- ── DONE ──────────────────────────────────────────────────────────────────────
-- All tables, columns, RLS policies, and indexes are now in place.
-- Safe to run again at any time.
