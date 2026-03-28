-- ═══════════════════════════════════════════════════════════════════════════
-- VeSiMy V2 Builder — Migration 002
-- Run in Supabase SQL editor: supabase.com → SQL Editor → paste and run
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Projects — V2 columns ─────────────────────────────────────────────
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS version              text    DEFAULT 'v1',
  ADD COLUMN IF NOT EXISTS sop_raw_text         text,
  ADD COLUMN IF NOT EXISTS sop_filename         text,
  ADD COLUMN IF NOT EXISTS sop_parsed_at        timestamptz,
  ADD COLUMN IF NOT EXISTS project_target       text,
  ADD COLUMN IF NOT EXISTS target_category      text,   -- output_quantity|output_quality|cost|time|revenue|custom
  ADD COLUMN IF NOT EXISTS target_value         text,
  ADD COLUMN IF NOT EXISTS target_deadline      date,
  ADD COLUMN IF NOT EXISTS target_unit          text,
  ADD COLUMN IF NOT EXISTS current_state_locked boolean DEFAULT false;

-- ── 2. Steps — V2 columns ────────────────────────────────────────────────
ALTER TABLE public.steps
  ADD COLUMN IF NOT EXISTS tasks               jsonb   DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS governing_entity    text,
  ADD COLUMN IF NOT EXISTS cycle_time_unit     text    DEFAULT 'seconds',
  ADD COLUMN IF NOT EXISTS cycle_time_type     text    DEFAULT 'assumed',  -- measured|assumed
  ADD COLUMN IF NOT EXISTS cycle_time_notes    text,
  ADD COLUMN IF NOT EXISTS map_x               integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS map_y               integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS step_type           text    DEFAULT 'process',  -- process|decision|delay|inspection|transport|storage|rework|start_end
  ADD COLUMN IF NOT EXISTS is_value_added      text    DEFAULT 'unclassified',  -- va|nnva|nva|unclassified
  ADD COLUMN IF NOT EXISTS missing_info_flags  jsonb   DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS from_sop            boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS sop_original_text   text,
  ADD COLUMN IF NOT EXISTS version             text    DEFAULT 'v1';

-- ── 3. Analysis reports table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.analysis_reports (
  id                   uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id           uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id              uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  report_type          text NOT NULL DEFAULT 'current_state', -- current_state|future_state
  report_version       integer NOT NULL DEFAULT 1,
  generated_at         timestamptz DEFAULT now(),

  -- Core report content
  summary              text,
  process_description  text,
  total_steps          integer,
  va_ratio             text,
  estimated_lead_time  text,

  -- Improvement potential
  improvement_potential jsonb DEFAULT '{}'::jsonb,
  -- { conservative: "15-20%", optimistic: "30-45%", basis: "..." }

  -- Structured findings
  bottlenecks          jsonb DEFAULT '[]'::jsonb,
  missing_information  jsonb DEFAULT '[]'::jsonb,
  ci_suggestions       jsonb DEFAULT '[]'::jsonb,
  mapping_guidance     jsonb DEFAULT '[]'::jsonb,
  action_plan          jsonb DEFAULT '[]'::jsonb,

  -- Future state (only populated for future_state reports)
  future_state_steps   jsonb DEFAULT '[]'::jsonb,
  target_achievement   text,
  tolerance_range      text,

  -- Target context (what user wants to achieve)
  target_statement     text,
  target_category      text,
  target_value         text,
  target_deadline      date,

  -- Raw response + disclaimer
  raw_ai_response      text,
  disclaimer           text NOT NULL DEFAULT 'This report is based solely on data entered by the user. Missing steps, incorrect parameters, or incomplete data will affect accuracy of findings and recommendations.',

  -- Download formats generated
  pdca_export          jsonb,
  ooda_export          jsonb,
  eight_d_export       jsonb,

  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

-- ── 4. RLS for analysis_reports ──────────────────────────────────────────
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analysis_reports_owner" ON public.analysis_reports
  FOR ALL USING (auth.uid() = user_id);

-- ── 5. SOP change suggestions log ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sop_change_log (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  step_id      uuid REFERENCES public.steps(id) ON DELETE CASCADE,
  user_id      uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  change_type  text,        -- added_task|removed_task|renamed_step|changed_params
  original     text,        -- original SOP text
  changed_to   text,        -- what user changed it to
  in_action_plan boolean DEFAULT false,  -- is this change part of the improvement plan?
  notified_at  timestamptz,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE public.sop_change_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sop_change_log_owner" ON public.sop_change_log
  FOR ALL USING (auth.uid() = user_id);

-- ── 6. Indexes ───────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_analysis_reports_project ON public.analysis_reports(project_id, report_type, report_version DESC);
CREATE INDEX IF NOT EXISTS idx_steps_project_version ON public.steps(project_id, version);
CREATE INDEX IF NOT EXISTS idx_projects_version ON public.projects(version, user_id);

