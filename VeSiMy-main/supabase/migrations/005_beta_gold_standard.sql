-- ── supabase/migrations/005_beta_gold_standard.sql ──────────────────────────
-- Complete rework of beta system:
-- • 10 Gold Standard seats (1 month trial, then $99 lifetime upgrade)
-- • Enterprise discount tracking (33% for beta-associated companies)
-- • Dynamic enterprise quote engine
-- • Beta applications with scoring criteria
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. ADD BETA COLUMNS TO PROFILES ─────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_beta              BOOLEAN     DEFAULT false,
  ADD COLUMN IF NOT EXISTS beta_tier            TEXT        DEFAULT NULL,      -- 'gold_standard'
  ADD COLUMN IF NOT EXISTS beta_expires_at      TIMESTAMPTZ DEFAULT NULL,      -- 1 month from claim
  ADD COLUMN IF NOT EXISTS lifetime_access      BOOLEAN     DEFAULT false,     -- paid $99 lifetime
  ADD COLUMN IF NOT EXISTS lifetime_activated_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS onboarded            BOOLEAN     DEFAULT false,
  ADD COLUMN IF NOT EXISTS company_domain       TEXT        DEFAULT NULL;      -- for enterprise discount linking

-- ── 2. REWORK BETA_SEATS TABLE ───────────────────────────────────────────────
DROP TABLE IF EXISTS beta_seats CASCADE;
CREATE TABLE IF NOT EXISTS public.beta_seats (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  total_seats     INT         DEFAULT 10,
  claimed_seats   INT         DEFAULT 0,
  updated_at      TIMESTAMPTZ DEFAULT now()
);
INSERT INTO beta_seats (total_seats, claimed_seats)
  SELECT 10, 0 WHERE NOT EXISTS (SELECT 1 FROM beta_seats);

-- ── 3. BETA APPLICATIONS ─────────────────────────────────────────────────────
-- Stores applications from people wanting to become Gold Standard beta testers
CREATE TABLE IF NOT EXISTS public.beta_applications (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email             TEXT        NOT NULL,
  full_name         TEXT        NOT NULL,
  company           TEXT,
  role              TEXT        NOT NULL,
  industry          TEXT        NOT NULL,
  years_experience  INT,

  -- Scoring criteria answers
  lean_experience   TEXT        NOT NULL,   -- 'none'|'basic'|'intermediate'|'expert'
  current_tools     TEXT[],                 -- ['excel','visio','consultant','none']
  team_size         TEXT,                   -- '1-10'|'11-50'|'51-200'|'200+'
  pain_point        TEXT        NOT NULL,   -- free text, 500 char
  use_case          TEXT        NOT NULL,   -- free text, 500 char
  linkedin_url      TEXT,
  referral_source   TEXT,

  -- Scoring (computed by API)
  score             INT         DEFAULT 0,  -- 0-100
  score_breakdown   JSONB       DEFAULT '{}',
  status            TEXT        DEFAULT 'pending',  -- 'pending'|'approved'|'rejected'|'waitlisted'
  reviewed_by       TEXT,
  review_notes      TEXT,
  reviewed_at       TIMESTAMPTZ,

  -- If approved → links to profile
  user_id           UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,

  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS beta_applications_status_idx ON beta_applications(status);
CREATE INDEX IF NOT EXISTS beta_applications_score_idx  ON beta_applications(score DESC);

-- ── 4. ENTERPRISE DISCOUNT CODES ─────────────────────────────────────────────
-- 33% discount for companies associated with beta testers
CREATE TABLE IF NOT EXISTS public.enterprise_discounts (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  code             TEXT        UNIQUE NOT NULL,       -- e.g. "BETA-ACME-33"
  company_name     TEXT        NOT NULL,
  company_domain   TEXT,                              -- e.g. "acme.com" — auto-applies to matching emails
  beta_user_id     UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  discount_percent INT         DEFAULT 33,
  is_active        BOOLEAN     DEFAULT true,
  valid_until      TIMESTAMPTZ,                       -- NULL = perpetual
  redemptions      INT         DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ── 5. ENTERPRISE QUOTE REQUESTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enterprise_quotes (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Company info
  company_name      TEXT        NOT NULL,
  contact_email     TEXT        NOT NULL,
  contact_name      TEXT        NOT NULL,
  company_size      TEXT        NOT NULL,   -- '1-10'|'11-50'|'51-200'|'201-500'|'500+'

  -- Usage parameters (drives pricing)
  num_users         INT         NOT NULL DEFAULT 5,
  num_projects      INT         NOT NULL DEFAULT 10,
  usage_tier        TEXT        NOT NULL DEFAULT 'standard',  -- 'standard'|'high'|'enterprise'
  needs_api         BOOLEAN     DEFAULT false,
  needs_sso         BOOLEAN     DEFAULT false,
  needs_sla         BOOLEAN     DEFAULT false,
  needs_onboarding  BOOLEAN     DEFAULT false,
  needs_custom_int  BOOLEAN     DEFAULT false,

  -- Pricing (computed)
  base_price_monthly   NUMERIC(10,2),
  discount_code        TEXT,
  discount_percent     INT       DEFAULT 0,
  final_price_monthly  NUMERIC(10,2),
  annual_price         NUMERIC(10,2),
  annual_savings       NUMERIC(10,2),

  -- Quote details
  quote_reference   TEXT        UNIQUE,   -- e.g. "VSM-2026-0042"
  status            TEXT        DEFAULT 'draft',  -- 'draft'|'sent'|'accepted'|'expired'
  notes             TEXT,
  valid_until       TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days'),

  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- Auto-generate quote reference
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
ALTER TABLE public.beta_applications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_quotes   ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a beta application (INSERT only)
CREATE POLICY "beta_app_insert" ON public.beta_applications
  FOR INSERT WITH CHECK (true);

-- Users can read their own application
CREATE POLICY "beta_app_read_own" ON public.beta_applications
  FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Enterprise discounts: authenticated users can read their own company's discount
CREATE POLICY "ent_discount_read" ON public.enterprise_discounts
  FOR SELECT USING (
    beta_user_id = auth.uid() OR
    is_active = true
  );

-- Enterprise quotes: users can insert and read their own
CREATE POLICY "ent_quote_insert" ON public.enterprise_quotes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "ent_quote_read" ON public.enterprise_quotes
  FOR SELECT USING (contact_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- ── 7. FUNCTION: Check and expire beta trials ─────────────────────────────────
-- Run this daily via pg_cron or Supabase Edge Function
CREATE OR REPLACE FUNCTION expire_beta_trials()
RETURNS INT AS $$
DECLARE expired_count INT;
BEGIN
  UPDATE public.profiles
  SET
    plan_tier      = CASE WHEN lifetime_access THEN 'lifetime' ELSE 'free' END,
    projects_limit = CASE WHEN lifetime_access THEN 99 ELSE 3 END,
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

-- ── 8. SEED: 3 enterprise discount codes for future use ──────────────────────
-- (These get real company names assigned when beta users are approved)
-- Admin creates these via Supabase dashboard or API

-- ── DONE ─────────────────────────────────────────────────────────────────────
-- After running this migration:
-- 1. Update NEXT_PUBLIC_LIFETIME_PRICE_ID in Vercel env vars
-- 2. Create a $99 one-time product in Stripe → copy price ID
-- 3. Run: SELECT expire_beta_trials(); to test the expiry function
