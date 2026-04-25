-- ══════════════════════════════════════════════════════════════════════════════
-- VeSiMy — 015_skill_matrix_and_versioning.sql
-- Safe to re-run (all IF NOT EXISTS / OR REPLACE)
-- ══════════════════════════════════════════════════════════════════════════════

-- ── 1. SKILL MATRIX — track user improvement maturity silently ────────────────
CREATE TABLE IF NOT EXISTS public.skill_matrix (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Mapping speed metrics (seconds)
  avg_wall_session_time_per_step  NUMERIC,
  avg_observation_time_per_step   NUMERIC,
  avg_analysis_time               NUMERIC,

  -- Data quality metrics (0-100 scores)
  ct_consistency_score            NUMERIC DEFAULT 0,  -- % of CTs with >= 3 laps
  wip_completeness_score          NUMERIC DEFAULT 0,  -- % of steps with WIP entered
  defect_format_consistency_score NUMERIC DEFAULT 0,  -- % using consistent format

  -- Tool usage depth
  tools_used                      JSONB DEFAULT '[]'::jsonb,  -- array of tool IDs used
  ai_acceptance_rate              NUMERIC DEFAULT 0,  -- % of AI suggestions acted on
  projects_completed              INTEGER DEFAULT 0,
  total_steps_mapped              INTEGER DEFAULT 0,

  -- Project outcomes
  avg_efficiency_improvement      NUMERIC,  -- average PCE improvement across projects
  avg_lead_time_reduction         NUMERIC,  -- average lead time reduction %

  -- Maturity level
  maturity_level                  TEXT DEFAULT 'beginner',  -- beginner | intermediate | advanced
  last_coaching_note              TEXT,
  last_coaching_generated_at      TIMESTAMPTZ,

  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ── 2. SKILL MATRIX EVENTS — individual project contribution records ──────────
CREATE TABLE IF NOT EXISTS public.skill_matrix_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id  UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  event_type  TEXT NOT NULL,  -- project_completed | tool_used | analysis_run | improvement_applied
  data        JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. VERSION SNAPSHOTS — save VSM state at any point ───────────────────────
CREATE TABLE IF NOT EXISTS public.version_snapshots (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id    UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL DEFAULT 1,
  label         TEXT,                    -- "After SMED kaizen", "Pre-improvement baseline"
  description   TEXT,
  snapshot_data JSONB NOT NULL,          -- Full serialized map state
  step_count    INTEGER DEFAULT 0,
  total_ct      NUMERIC DEFAULT 0,
  total_wait    NUMERIC DEFAULT 0,
  pce           NUMERIC,
  metrics       JSONB DEFAULT '{}'::jsonb,  -- calcProcessMetrics output at snapshot time
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. GUIDED SESSIONS — track VeSiMy Guided completions ─────────────────────
CREATE TABLE IF NOT EXISTS public.guided_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_data    JSONB DEFAULT '{}'::jsonb,  -- All guided flow answers
  project_id      UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  completed       BOOLEAN DEFAULT FALSE,
  graduated_to_pro BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

-- ── 5. INDEXES ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_skill_matrix_user        ON public.skill_matrix(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_events_user        ON public.skill_matrix_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skill_events_project     ON public.skill_matrix_events(project_id);
CREATE INDEX IF NOT EXISTS idx_version_snapshots_proj   ON public.version_snapshots(project_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_guided_sessions_user     ON public.guided_sessions(user_id, created_at DESC);

-- ── 6. RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE public.skill_matrix          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_matrix_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.version_snapshots     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guided_sessions       ENABLE ROW LEVEL SECURITY;

CREATE POLICY "skill_matrix_own" ON public.skill_matrix
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "skill_events_own" ON public.skill_matrix_events
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "version_snapshots_own" ON public.version_snapshots
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "guided_sessions_own" ON public.guided_sessions
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- ── 7. AUTO-UPDATE TRIGGERS ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_v4()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_skill_matrix_updated ON public.skill_matrix;
CREATE TRIGGER trg_skill_matrix_updated
  BEFORE UPDATE ON public.skill_matrix
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_v4();

-- ── 8. MATURITY FUNCTION — called after each project completion ───────────────
CREATE OR REPLACE FUNCTION public.recalculate_maturity(p_user_id UUID)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  rec     public.skill_matrix%ROWTYPE;
  level   TEXT := 'beginner';
  score   INTEGER := 0;
BEGIN
  SELECT * INTO rec FROM public.skill_matrix WHERE user_id = p_user_id;
  IF NOT FOUND THEN RETURN 'beginner'; END IF;

  -- Score each dimension (0-100 each, max 400)
  IF rec.ct_consistency_score >= 80    THEN score := score + 100;
  ELSIF rec.ct_consistency_score >= 50 THEN score := score + 60;
  ELSIF rec.ct_consistency_score >= 20 THEN score := score + 30; END IF;

  IF rec.projects_completed >= 5       THEN score := score + 100;
  ELSIF rec.projects_completed >= 3    THEN score := score + 60;
  ELSIF rec.projects_completed >= 1    THEN score := score + 30; END IF;

  IF array_length(ARRAY(SELECT jsonb_array_elements_text(rec.tools_used)), 1) >= 4 THEN score := score + 100;
  ELSIF array_length(ARRAY(SELECT jsonb_array_elements_text(rec.tools_used)), 1) >= 2 THEN score := score + 60;
  ELSIF array_length(ARRAY(SELECT jsonb_array_elements_text(rec.tools_used)), 1) >= 1 THEN score := score + 30; END IF;

  IF rec.ai_acceptance_rate >= 0.6     THEN score := score + 100;
  ELSIF rec.ai_acceptance_rate >= 0.3  THEN score := score + 60;
  ELSIF rec.ai_acceptance_rate >= 0.1  THEN score := score + 30; END IF;

  IF    score >= 280 THEN level := 'advanced';
  ELSIF score >= 150 THEN level := 'intermediate';
  ELSE                    level := 'beginner'; END IF;

  UPDATE public.skill_matrix SET maturity_level = level WHERE user_id = p_user_id;
  RETURN level;
END; $$;
