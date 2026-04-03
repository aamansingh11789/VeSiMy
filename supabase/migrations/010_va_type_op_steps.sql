-- ── supabase/migrations/008_va_type_op_steps.sql ─────────────────────────────
-- Adds va_type and op_steps to steps table.
-- Adds kaizen_roadmap to projects table.
-- Run in Supabase Dashboard > SQL Editor.

ALTER TABLE public.steps
  ADD COLUMN IF NOT EXISTS va_type TEXT DEFAULT 'va',
  ADD COLUMN IF NOT EXISTS op_steps JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.steps.va_type IS
  'VA classification: va | nnva | nva';
COMMENT ON COLUMN public.steps.op_steps IS
  'Operator tasks: [{id, name, time, va_type}]';

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS kaizen_roadmap JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.steps.flow_type IS
  'Flow type: push | supermarket | fifo | queue';
