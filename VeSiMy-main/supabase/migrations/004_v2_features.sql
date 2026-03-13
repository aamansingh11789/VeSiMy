-- ── 004_v2_features.sql ── VeSiMy v2 additions ───────────────────────────────
-- Safe to run multiple times (IF NOT EXISTS everywhere)
-- Run in Supabase SQL Editor → paste all → Run

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_beta           BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lifetime_access   BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS beta_claimed_at   TIMESTAMPTZ;

ALTER TABLE steps
  ADD COLUMN IF NOT EXISTS setup_time    NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS health_status TEXT    DEFAULT 'green',
  ADD COLUMN IF NOT EXISTS is_bottleneck BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS beta_seats (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_seats   INT  DEFAULT 10,
  claimed_seats INT  DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT now()
);
INSERT INTO beta_seats (total_seats, claimed_seats)
  SELECT 10, 0 WHERE NOT EXISTS (SELECT 1 FROM beta_seats);

CREATE TABLE IF NOT EXISTS promo_codes (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code             TEXT UNIQUE NOT NULL,
  discount_percent INT  NOT NULL DEFAULT 0,
  plan_type        TEXT,
  expires_at       TIMESTAMPTZ,
  usage_limit      INT  DEFAULT 100,
  usage_count      INT  DEFAULT 0,
  is_active        BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS promo_redemptions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  promo_id    UUID REFERENCES promo_codes(id),
  user_id     UUID REFERENCES profiles(id),
  redeemed_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS live_metrics (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  step_id      UUID        REFERENCES steps(id)    ON DELETE CASCADE,
  project_id   UUID        REFERENCES projects(id) ON DELETE CASCADE,
  timestamp    TIMESTAMPTZ DEFAULT now(),
  metric_type  TEXT        NOT NULL,
  value        NUMERIC     NOT NULL,
  operator_id  UUID        REFERENCES profiles(id),
  notes        TEXT
);

CREATE TABLE IF NOT EXISTS process_simulations (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id        UUID REFERENCES projects(id) ON DELETE CASCADE,
  name              TEXT DEFAULT 'Future State',
  simulation_steps  JSONB,
  current_lead_time NUMERIC,
  future_lead_time  NUMERIC,
  lead_time_savings NUMERIC,
  throughput_gain   NUMERIC,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS supe_recommendations (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
  step_id     UUID REFERENCES steps(id)    ON DELETE SET NULL,
  issue_type  TEXT,
  severity    TEXT DEFAULT 'medium',
  suggestion  TEXT NOT NULL,
  principle   TEXT,
  is_resolved BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sop_uploads (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id    UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES profiles(id),
  file_name     TEXT NOT NULL,
  file_url      TEXT,
  parsed_steps  JSONB,
  status        TEXT DEFAULT 'pending',
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lessons (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module      TEXT NOT NULL,
  title       TEXT NOT NULL,
  content     TEXT,
  order_index INT  DEFAULT 0,
  quiz_json   JSONB,
  pass_score  INT  DEFAULT 70,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id           UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID    REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id    UUID    REFERENCES lessons(id)  ON DELETE CASCADE,
  completed    BOOLEAN DEFAULT false,
  score        INT,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- Enable Realtime (skip if it errors — non-critical)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE live_metrics;
EXCEPTION WHEN others THEN NULL; END $$;

-- RLS
ALTER TABLE live_metrics         ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_redemptions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_simulations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE supe_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sop_uploads          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE beta_seats           ENABLE ROW LEVEL SECURITY;

-- Policies (drop first to avoid duplicates)
DROP POLICY IF EXISTS "live_metrics_own"  ON live_metrics;
DROP POLICY IF EXISTS "promo_read"        ON promo_codes;
DROP POLICY IF EXISTS "promo_redeem_own"  ON promo_redemptions;
DROP POLICY IF EXISTS "simulations_own"   ON process_simulations;
DROP POLICY IF EXISTS "supe_own"          ON supe_recommendations;
DROP POLICY IF EXISTS "sop_own"           ON sop_uploads;
DROP POLICY IF EXISTS "lesson_prog_own"   ON user_lesson_progress;
DROP POLICY IF EXISTS "beta_read"         ON beta_seats;

CREATE POLICY "live_metrics_own"  ON live_metrics         FOR ALL    USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));
CREATE POLICY "promo_read"        ON promo_codes          FOR SELECT USING (is_active = true);
CREATE POLICY "promo_redeem_own"  ON promo_redemptions    FOR ALL    USING (user_id = auth.uid());
CREATE POLICY "simulations_own"   ON process_simulations  FOR ALL    USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));
CREATE POLICY "supe_own"          ON supe_recommendations FOR ALL    USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));
CREATE POLICY "sop_own"           ON sop_uploads          FOR ALL    USING (user_id = auth.uid());
CREATE POLICY "lesson_prog_own"   ON user_lesson_progress FOR ALL    USING (user_id = auth.uid());
CREATE POLICY "beta_read"         ON beta_seats           FOR SELECT USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_live_metrics_proj ON live_metrics(project_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_supe_proj         ON supe_recommendations(project_id);
CREATE INDEX IF NOT EXISTS idx_promo_code        ON promo_codes(code) WHERE is_active = true;

-- Seed promo codes
INSERT INTO promo_codes (code, discount_percent, plan_type, usage_limit) VALUES
  ('VESIMY50', 50, 'pro', 100),
  ('LAUNCH25', 25, NULL,  500),
  ('BETA100',  100,'pro', 10)
ON CONFLICT (code) DO NOTHING;

-- Seed lessons
INSERT INTO lessons (module, title, content, order_index, quiz_json, pass_score) VALUES
('lean_basics', 'What is Lean Manufacturing?',
 'Lean manufacturing focuses on eliminating the 8 wastes — remembered as DOWNTIME: Defects, Overproduction, Waiting, Non-utilized talent, Transportation, Inventory, Motion, and Extra-processing. Every activity is either value-added (the customer pays for it) or waste (they do not). The goal is to maximize value while minimizing waste using a systematic approach.',
 1,
 '[{"question":"What does the D in DOWNTIME stand for?","options":["Defects","Delays","Distance","Demand"],"answer":0},{"question":"Which activity type does a customer pay for?","options":["Waste","Value-added","Motion","Waiting"],"answer":1}]'::jsonb,
 70),
('vsm', 'Value Stream Mapping Fundamentals',
 'A Value Stream Map (VSM) shows the complete flow of materials and information from supplier to customer. The current-state map captures how things work today and reveals waste. The future-state map designs how flow should work after improvement. Key metrics: Cycle Time (time to complete one unit), Lead Time (total door-to-door time), and Process Cycle Efficiency (PCE = value-added time / total lead time).',
 2,
 '[{"question":"What does PCE measure?","options":["Production cost efficiency","Process cycle efficiency","People capacity estimate","Plant capacity equation"],"answer":1},{"question":"Which map shows waste in the current process?","options":["Future-state map","Current-state map","Spaghetti diagram","Control chart"],"answer":1}]'::jsonb,
 70),
('kaizen', 'Kaizen: Continuous Improvement',
 'Kaizen means change for the better. It involves everyone making small daily improvements. The PDCA cycle (Plan-Do-Check-Act) guides structured improvement. Gemba walks bring leaders to the actual work area to observe. Kaizen events are focused 3-5 day improvement blitzes targeting specific waste. The goal is to build a culture where improvement never stops.',
 3,
 '[{"question":"What does PDCA stand for?","options":["Plan-Do-Check-Act","Process-Design-Control-Audit","Prepare-Deploy-Confirm-Adjust","Plan-Deploy-Check-Approve"],"answer":0},{"question":"A gemba walk means going to the...","options":["Meeting room","Actual workplace","Manager office","Training room"],"answer":1}]'::jsonb,
 70)
ON CONFLICT DO NOTHING;
