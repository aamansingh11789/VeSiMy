-- Migration 012: add pdca_data column to projects
-- Required because V2ProjectClient now saves PDCA data at project level
-- instead of on firstStep.id (which caused data loss on step reorder/delete)

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS pdca_data jsonb;

COMMENT ON COLUMN public.projects.pdca_data IS
  'Project-level PDCA tool data. Stores the full PDCA cycle for this project.';
