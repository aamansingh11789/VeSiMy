-- ══════════════════════════════════════════════════════════════════════════════
-- VeSiMy — 016_analysis_reports_v4.sql
-- Adds v4_data jsonb column to analysis_reports for Section 8 report data
-- Safe to re-run (ADD COLUMN IF NOT EXISTS)
-- ══════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.analysis_reports
  ADD COLUMN IF NOT EXISTS v4_data jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.analysis_reports.v4_data IS 
  'v4.0 structured report data: executive_summary, current_state, bottleneck, nva_analysis, recommendations, priority_matrix, projection, next_steps';
