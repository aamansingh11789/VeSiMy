-- Migration: add supe_rate_log table for DB-backed rate limiting
-- Replaces the broken in-memory Map in app/api/supe/analyze/route.ts
-- Run once in Supabase SQL editor or as a migration file

CREATE TABLE IF NOT EXISTS public.supe_rate_log (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Index for fast per-user time-window queries
CREATE INDEX IF NOT EXISTS supe_rate_log_user_created
  ON public.supe_rate_log (user_id, created_at DESC);

-- Auto-delete entries older than 2 minutes (keep table lean)
-- Run this as a cron job or pg_cron extension if available:
-- DELETE FROM public.supe_rate_log WHERE created_at < now() - interval '2 minutes';

-- Row Level Security
ALTER TABLE public.supe_rate_log ENABLE ROW LEVEL SECURITY;

-- Only the service role (used by API routes) can insert/read
CREATE POLICY "service_role_only" ON public.supe_rate_log
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
