-- ═══════════════════════════════════════════════════════════════════════════
--  OpusCycle Migration 002 — VSM Process Branching
--  Run this in Supabase SQL Editor AFTER 001_initial_schema.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- Add branch tracking columns to steps
ALTER TABLE public.steps
  ADD COLUMN IF NOT EXISTS branch_id          text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS branch_label       text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS branch_parent_id   uuid REFERENCES public.steps(id) ON DELETE CASCADE DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS branch_position    int  DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_main_flow       boolean DEFAULT true;

-- branch_id:        a group identifier, e.g. 'branch-1', 'branch-2' (NULL = main flow)
-- branch_label:     display name for the branch, e.g. 'Sub-Assembly A'
-- branch_parent_id: the main-flow step this branch stems FROM
-- branch_position:  order within the branch (separate from main flow position)
-- is_main_flow:     true = part of the primary flow, false = branch step

-- Index for fast branch lookups
CREATE INDEX IF NOT EXISTS idx_steps_branch_id       ON public.steps(branch_id);
CREATE INDEX IF NOT EXISTS idx_steps_branch_parent   ON public.steps(branch_parent_id);
CREATE INDEX IF NOT EXISTS idx_steps_is_main_flow    ON public.steps(is_main_flow);

-- ── Branches metadata table ──────────────────────────────────────────────────
-- Tracks branch definitions (label, color, merge point)
CREATE TABLE IF NOT EXISTS public.branches (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  branch_id       text NOT NULL,            -- matches steps.branch_id
  label           text NOT NULL,            -- display name
  color           text DEFAULT '#6426A0',   -- hex color for visual distinction
  parent_step_id  uuid REFERENCES public.steps(id) ON DELETE CASCADE,  -- where branch starts
  merge_step_id   uuid REFERENCES public.steps(id) ON DELETE SET NULL, -- where it rejoins (optional)
  position        int  DEFAULT 0,           -- vertical order of branch lanes
  created_at      timestamptz DEFAULT now(),
  UNIQUE (project_id, branch_id)
);

-- RLS for branches
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "branches_all_own" ON public.branches
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_branches_project_id ON public.branches(project_id);

COMMENT ON TABLE  public.branches            IS 'VSM branch lane definitions';
COMMENT ON COLUMN public.branches.branch_id  IS 'Matches steps.branch_id — groups steps into a lane';
COMMENT ON COLUMN public.branches.parent_step_id IS 'Main-flow step this branch originates from';
COMMENT ON COLUMN public.branches.merge_step_id  IS 'Main-flow step this branch rejoins (optional)';
