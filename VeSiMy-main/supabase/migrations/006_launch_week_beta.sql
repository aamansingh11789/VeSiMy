-- ── supabase/migrations/006_launch_week_beta.sql ─────────────────────────────
-- Launch Week Beta: open to everyone during the launch window
-- No seat limits — time-based scarcity instead of seat-based
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. ENSURE BETA COLUMNS EXIST ON PROFILES ─────────────────────────────────
-- (safe to re-run — all IF NOT EXISTS)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_beta               BOOLEAN     DEFAULT false,
  ADD COLUMN IF NOT EXISTS beta_tier             TEXT        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS beta_expires_at       TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS lifetime_access       BOOLEAN     DEFAULT false,
  ADD COLUMN IF NOT EXISTS lifetime_activated_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS onboarded             BOOLEAN     DEFAULT false,
  ADD COLUMN IF NOT EXISTS company_domain        TEXT        DEFAULT NULL;

-- ── 2. REPLACE BETA_SEATS WITH LAUNCH_WINDOW ─────────────────────────────────
-- Drop old seats table (no longer needed)
DROP TABLE IF EXISTS public.beta_seats CASCADE;

-- Launch window: a single row controls the beta open/closed state
CREATE TABLE IF NOT EXISTS public.launch_window (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  is_open        BOOLEAN     DEFAULT true,
  opened_at      TIMESTAMPTZ DEFAULT now(),
  closes_at      TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days'),
  label          TEXT        DEFAULT 'Launch Week',       -- e.g. 'Launch Week', 'Week 2 Extension'
  total_claimed  INT         DEFAULT 0,                   -- counter, informational only
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- Seed the initial launch window (7 days from deploy)
INSERT INTO public.launch_window (is_open, label)
  SELECT true, 'Launch Week'
  WHERE NOT EXISTS (SELECT 1 FROM public.launch_window);

-- ── 3. BETA APPLICATIONS (keep for analytics + quality signal) ────────────────
CREATE TABLE IF NOT EXISTS public.beta_applications (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email             TEXT        NOT NULL,
  full_name         TEXT        NOT NULL,
  company           TEXT,
  role              TEXT        NOT NULL,
  industry          TEXT        NOT NULL,
  years_experience  INT,
  lean_experience   TEXT        NOT NULL,
  current_tools     TEXT[],
  team_size         TEXT,
  pain_point        TEXT        NOT NULL,
  use_case          TEXT        NOT NULL,
  linkedin_url      TEXT,
  referral_source   TEXT,
  score             INT         DEFAULT 0,
  score_breakdown   JSONB       DEFAULT '{}',
  -- During launch week everyone is auto-approved
  status            TEXT        DEFAULT 'approved',
  reviewed_by       TEXT        DEFAULT 'launch_week_auto',
  review_notes      TEXT,
  reviewed_at       TIMESTAMPTZ DEFAULT now(),
  user_id           UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS beta_applications_status_idx ON beta_applications(status);
CREATE INDEX IF NOT EXISTS beta_applications_score_idx  ON beta_applications(score DESC);

-- ── 4. ENTERPRISE DISCOUNT CODES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enterprise_discounts (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  code             TEXT        UNIQUE NOT NULL,
  company_name     TEXT        NOT NULL,
  company_domain   TEXT,
  beta_user_id     UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  discount_percent INT         DEFAULT 33,
  is_active        BOOLEAN     DEFAULT true,
  valid_until      TIMESTAMPTZ,
  redemptions      INT         DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ── 5. ENTERPRISE QUOTE REQUESTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enterprise_quotes (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name      TEXT        NOT NULL,
  contact_email     TEXT        NOT NULL,
  contact_name      TEXT        NOT NULL,
  company_size      TEXT        NOT NULL,
  num_users         INT         NOT NULL DEFAULT 5,
  num_projects      INT         NOT NULL DEFAULT 10,
  usage_tier        TEXT        NOT NULL DEFAULT 'standard',
  needs_api         BOOLEAN     DEFAULT false,
  needs_sso         BOOLEAN     DEFAULT false,
  needs_sla         BOOLEAN     DEFAULT false,
  needs_onboarding  BOOLEAN     DEFAULT false,
  needs_custom_int  BOOLEAN     DEFAULT false,
  base_price_monthly   NUMERIC(10,2),
  discount_code        TEXT,
  discount_percent     INT       DEFAULT 0,
  final_price_monthly  NUMERIC(10,2),
  annual_price         NUMERIC(10,2),
  annual_savings       NUMERIC(10,2),
  quote_reference   TEXT        UNIQUE,
  status            TEXT        DEFAULT 'draft',
  notes             TEXT,
  valid_until       TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days'),
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION generate_quote_ref()
RETURNS TRIGGER AS $$
BEGIN
  NEW.quote_reference := 'VSM-' || TO_CHAR(now(), 'YYYY') || '-' ||
    LPAD((SELECT COUNT(*)+1 FROM enterprise_quotes)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_quote_ref ON enterprise_quotes;
CREATE TRIGGER set_quote_ref
  BEFORE INSERT ON enterprise_quotes
  FOR EACH ROW WHEN (NEW.quote_reference IS NULL)
  EXECUTE FUNCTION generate_quote_ref();

-- ── 6. RLS POLICIES ──────────────────────────────────────────────────────────
ALTER TABLE public.launch_window        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_applications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_quotes    ENABLE ROW LEVEL SECURITY;

-- Anyone can read the launch window (to show open/closed state)
DROP POLICY IF EXISTS "launch_window_read" ON public.launch_window;
CREATE POLICY "launch_window_read" ON public.launch_window
  FOR SELECT USING (true);

-- Anyone can submit a beta application
DROP POLICY IF EXISTS "beta_app_insert" ON public.beta_applications;
CREATE POLICY "beta_app_insert" ON public.beta_applications
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "beta_app_read_own" ON public.beta_applications;
CREATE POLICY "beta_app_read_own" ON public.beta_applications
  FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "ent_discount_read" ON public.enterprise_discounts;
CREATE POLICY "ent_discount_read" ON public.enterprise_discounts
  FOR SELECT USING (beta_user_id = auth.uid() OR is_active = true);

DROP POLICY IF EXISTS "ent_quote_insert" ON public.enterprise_quotes;
CREATE POLICY "ent_quote_insert" ON public.enterprise_quotes
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "ent_quote_read" ON public.enterprise_quotes;
CREATE POLICY "ent_quote_read" ON public.enterprise_quotes
  FOR SELECT USING (contact_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- ── 7. BETA EXPIRY FUNCTION ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION expire_beta_trials()
RETURNS INT AS $$
DECLARE expired_count INT;
BEGIN
  UPDATE public.profiles
  SET
    plan_tier           = CASE WHEN lifetime_access THEN 'lifetime' ELSE 'free' END,
    projects_limit      = CASE WHEN lifetime_access THEN 99 ELSE 3 END,
    subscription_status = CASE WHEN lifetime_access THEN 'lifetime' ELSE 'free' END
  WHERE
    is_beta = true AND
    lifetime_access = false AND
    beta_expires_at IS NOT NULL AND
    beta_expires_at < now() AND
    plan_tier = 'pro';
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 8. HELPER: Extend launch window by N days ─────────────────────────────────
-- Usage: SELECT extend_launch_window(7);
CREATE OR REPLACE FUNCTION extend_launch_window(days INT DEFAULT 7)
RETURNS TEXT AS $$
DECLARE new_close TIMESTAMPTZ;
BEGIN
  UPDATE public.launch_window
    SET closes_at  = GREATEST(closes_at, now()) + (days || ' days')::INTERVAL,
        is_open    = true,
        label      = 'Extended Launch',
        updated_at = now();
  SELECT closes_at INTO new_close FROM public.launch_window LIMIT 1;
  RETURN 'Launch window extended. New close: ' || new_close::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── DONE ─────────────────────────────────────────────────────────────────────
-- After running this migration:
-- 1. To extend launch week:  SELECT extend_launch_window(7);
-- 2. To close beta manually: UPDATE launch_window SET is_open = false;
-- 3. Run nightly:            SELECT expire_beta_trials();
