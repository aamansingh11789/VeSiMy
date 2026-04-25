-- ============================================================
-- VeSiMy v4.0 — Tier 0 Sessions Table
-- Migration: 20260423_create_tier0_sessions
-- ============================================================

-- Enable pg_cron if not already enabled (run as superuser once)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ============================================================
-- TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.tier0_sessions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact
  email               TEXT NOT NULL,
  first_name          TEXT,

  -- Session context
  industry            TEXT NOT NULL,
  process_name        TEXT NOT NULL,

  -- Process data
  steps               JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Array of { label: string, time_seconds: number | null }
  pain_step           INTEGER,
    -- 0-based index into steps array; null = no specific step flagged
  pain_description    TEXT,
  target_category     TEXT,
    -- One of: speed | cost | quality | compliance | capacity

  -- Report output
  report_json         JSONB,
    -- Full AI-generated report object stored for analytics / re-send
  report_generated_at TIMESTAMPTZ,

  -- Conversion tracking
  account_created     BOOLEAN NOT NULL DEFAULT false,
  account_created_at  TIMESTAMPTZ,
  converted_plan      TEXT,
    -- free_trial | pro | enterprise — populated on upgrade

  -- Metadata
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash             TEXT,
    -- SHA-256 of IP for rate limiting without storing raw IP (GDPR-safe)
  user_agent          TEXT,
  referrer            TEXT
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Rate limit check: email + created_at window
CREATE INDEX IF NOT EXISTS idx_tier0_sessions_email_created
  ON public.tier0_sessions (email, created_at DESC);

-- Cron cleanup: find old unconverted rows fast
CREATE INDEX IF NOT EXISTS idx_tier0_sessions_cleanup
  ON public.tier0_sessions (account_created, created_at)
  WHERE account_created = false;

-- Analytics: industry breakdown
CREATE INDEX IF NOT EXISTS idx_tier0_sessions_industry
  ON public.tier0_sessions (industry, created_at DESC);

-- Conversion funnel
CREATE INDEX IF NOT EXISTS idx_tier0_sessions_converted
  ON public.tier0_sessions (account_created, converted_plan);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.tier0_sessions ENABLE ROW LEVEL SECURITY;

-- Service role (API route) can do everything
CREATE POLICY "service_role_all"
  ON public.tier0_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Anon users: INSERT only (submit session) — no SELECT/UPDATE/DELETE
CREATE POLICY "anon_insert_only"
  ON public.tier0_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated users can read their own sessions (matched by email)
-- Used if user later creates an account and we want to show their history
CREATE POLICY "auth_own_sessions"
  ON public.tier0_sessions
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE public.tier0_sessions IS
  'Stores Tier 0 free-flow sessions from vesimy.com/start. '
  'No account required. Rows older than 30 days where no account '
  'was created are purged nightly by pg_cron.';

COMMENT ON COLUMN public.tier0_sessions.steps IS
  'JSON array: [{ "label": "Receive PO", "time_seconds": 300 }, ...]';

COMMENT ON COLUMN public.tier0_sessions.report_json IS
  'Full report object returned by /api/tier0/generate-report. '
  'Stored for re-send, analytics, and future Supe training data.';

COMMENT ON COLUMN public.tier0_sessions.ip_hash IS
  'SHA-256 of visitor IP. Never stored in plain text. '
  'Used for secondary rate limiting alongside email check.';

-- ============================================================
-- CRON JOB — 30-day purge of unconverted sessions
-- ============================================================
-- Schedule: 2:00 AM UTC daily
-- Deletes rows older than 30 days where user never created an account
-- Converted sessions (account_created = true) are kept indefinitely
--   for cohort analytics and referral attribution
--
-- To install, run the following as a Supabase superuser
-- (or in the Supabase SQL editor with pg_cron enabled):

/*
SELECT cron.schedule(
  'purge-unconverted-tier0-sessions',     -- job name (unique)
  '0 2 * * *',                            -- every day at 02:00 UTC
  $$
    DELETE FROM public.tier0_sessions
    WHERE account_created = false
      AND created_at < NOW() - INTERVAL '30 days';
  $$
);
*/

-- To verify the job was registered:
-- SELECT * FROM cron.job WHERE jobname = 'purge-unconverted-tier0-sessions';

-- To unschedule if needed:
-- SELECT cron.unschedule('purge-unconverted-tier0-sessions');

-- ============================================================
-- HELPER FUNCTION — Rate limit check
-- Called from API route as an alternative to raw query
-- ============================================================

CREATE OR REPLACE FUNCTION public.tier0_rate_limit_check(
  p_email TEXT,
  p_window_hours INTEGER DEFAULT 24
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO session_count
  FROM public.tier0_sessions
  WHERE email = LOWER(TRIM(p_email))
    AND created_at > NOW() - (p_window_hours || ' hours')::INTERVAL;

  RETURN session_count = 0;  -- true = allowed, false = rate limited
END;
$$;

COMMENT ON FUNCTION public.tier0_rate_limit_check IS
  'Returns true if the email has not submitted a Tier 0 session '
  'within the given window (default 24 hours). '
  'Used by /api/tier0/generate-report route.';

-- ============================================================
-- ANALYTICS VIEW — for Supabase dashboard / admin queries
-- ============================================================

CREATE OR REPLACE VIEW public.tier0_analytics AS
SELECT
  DATE_TRUNC('day', created_at AT TIME ZONE 'UTC') AS session_date,
  industry,
  target_category,
  COUNT(*)                                          AS total_sessions,
  COUNT(*) FILTER (WHERE account_created = true)   AS conversions,
  ROUND(
    COUNT(*) FILTER (WHERE account_created = true)::NUMERIC
    / NULLIF(COUNT(*), 0) * 100, 1
  )                                                 AS conversion_rate_pct,
  AVG(
    JSONB_ARRAY_LENGTH(steps)
  )                                                 AS avg_step_count,
  COUNT(*) FILTER (WHERE pain_step IS NOT NULL)     AS sessions_with_pain_flagged
FROM public.tier0_sessions
GROUP BY 1, 2, 3
ORDER BY 1 DESC, total_sessions DESC;

COMMENT ON VIEW public.tier0_analytics IS
  'Daily conversion funnel by industry and target category. '
  'Used for growth tracking and content/messaging optimization.';
