# VeSiMy — Owner Action Items (Max Singh)
*Last updated: 2026-05-08 | Priority-ordered after full QA audit*

---

## 🔴 CRITICAL — Do Before Scaling

### 1. Environment Variables (Vercel → Settings → Environment Variables)
Verify ALL of these are set in Vercel for Production environment:

```
NEXT_PUBLIC_SUPABASE_URL            → your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY       → Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY           → Supabase service role key (server-only, never expose)
NEXT_PUBLIC_SITE_URL                → https://vesimy.com
ANTHROPIC_API_KEY                   → Claude API key (for Supe AI)
STRIPE_SECRET_KEY                   → Stripe secret key (sk_live_...)
STRIPE_WEBHOOK_SECRET               → Stripe webhook signing secret (whsec_...)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  → Stripe publishable key (pk_live_...)
STRIPE_PRO_MONTHLY_PRICE_ID         → from Stripe dashboard (price_...)
STRIPE_LIFETIME_PRICE_ID            → from Stripe dashboard (price_...)
POSTHOG_API_KEY                     → PostHog project key (optional but recommended)
SENDER_API_KEY                      → Sender.net API key (for tier0 email reports)
SEED_SECRET                         → Random string you generate (e.g. openssl rand -hex 32)
                                       → Used to protect seed API routes in production
```

### 2. Supabase — SQL Changes Required

Run these in Supabase SQL Editor (Dashboard → SQL Editor → New query):

#### a) Rate Limiting Table (required for Supe AI)
```sql
CREATE TABLE IF NOT EXISTS public.supe_rate_log (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS supe_rate_log_user_window
  ON public.supe_rate_log (user_id, created_at DESC);

-- RLS
ALTER TABLE public.supe_rate_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see own rate log"
  ON public.supe_rate_log FOR ALL
  USING (auth.uid() = user_id);

-- Auto-clean log entries older than 1 hour (run as cron or pg_cron)
-- SELECT cron.schedule('clean-supe-log', '*/5 * * * *',
--   'DELETE FROM supe_rate_log WHERE created_at < now() - interval ''1 hour''');
```

#### b) Stripe Events Table (required for webhook idempotency)
```sql
CREATE TABLE IF NOT EXISTS public.stripe_events (
  id         text PRIMARY KEY,
  type       text NOT NULL,
  data       jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: service role only
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;
```

#### c) Tier0 Sessions Table (required for free report generation)
```sql
CREATE TABLE IF NOT EXISTS public.tier0_sessions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  data       jsonb
);

CREATE INDEX IF NOT EXISTS tier0_sessions_email_created
  ON public.tier0_sessions (email, created_at DESC);

ALTER TABLE public.tier0_sessions ENABLE ROW LEVEL SECURITY;
-- No user policy needed — this is accessed via service role only
```

#### d) Verify projects_limit column exists on profiles
```sql
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS projects_limit integer NOT NULL DEFAULT 3;

-- Fix: ensure new users start on trial with correct defaults
ALTER TABLE public.profiles
  ALTER COLUMN plan_tier SET DEFAULT 'trial';
```

#### e) RLS Policies Verification
Run this to check all critical tables have RLS enabled:
```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```
Every table should show rowsecurity = TRUE.

#### f) Tool data merge — ensure no data loss
```sql
-- The tool_data table should have a unique constraint on (step_id, tool)
-- to support upsert without duplicates
ALTER TABLE public.tool_data
  ADD CONSTRAINT IF NOT EXISTS tool_data_step_tool_unique
  UNIQUE (step_id, tool);
```

### 3. Stripe — Webhook Configuration
In Stripe Dashboard → Developers → Webhooks:
- Endpoint URL: `https://vesimy.com/api/stripe/webhook`
- Events to listen for:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `checkout.session.completed`
  - `invoice.payment_failed`
  - `invoice.payment_succeeded`
- Copy the signing secret → paste as `STRIPE_WEBHOOK_SECRET` in Vercel

### 4. Supabase Auth Settings
In Supabase Dashboard → Authentication → Settings:
- Site URL: `https://vesimy.com`
- Redirect URLs add: `https://vesimy.com/api/auth/callback`
- Enable email confirmations if desired (currently optional)
- Set JWT expiry to at least 7 days for good UX

---

## 🟡 HIGH PRIORITY — Do Before First Paid Customer

### 5. Supabase Realtime
Enable Realtime for the `profiles` table so plan upgrades reflect immediately without polling:
- Supabase Dashboard → Database → Replication
- Enable `profiles` table for INSERT and UPDATE events

### 6. Vercel Settings
- Set `NEXT_PUBLIC_SITE_URL` correctly for production
- Enable Edge Config if using feature flags later
- Set build output directory to default (Next.js auto-detects)
- Ensure functions region matches Supabase region (both US East recommended)

### 7. Custom Domain
- Point `vesimy.com` to Vercel
- Add `www.vesimy.com` redirect → `vesimy.com`
- Enable Vercel's SSL (automatic)

### 8. OG Image / LinkedIn Preview
The OG image route exists at `/app/api/og/route.tsx`.
Test it: `https://vesimy.com/api/og`
If the preview is broken on LinkedIn, use LinkedIn's Post Inspector:
`https://www.linkedin.com/post-inspector/`

### 9. PostHog Analytics
- Create account at posthog.com
- Get API key → add as `POSTHOG_API_KEY` in Vercel
- Enable session recording for UX research (optional)

---

## 🟢 RECOMMENDED — Before Marketing Push

### 10. Test Full Payment Flow
- Sign up as a new test user
- Go to /pricing → click Pro
- Complete Stripe test checkout (use card 4242 4242 4242 4242)
- Verify: plan_tier updates to 'pro' in Supabase profiles table
- Verify: premium features unlock immediately in the app

### 11. Test Stripe Webhook Locally
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Trigger a test subscription event and verify the profiles table updates.

### 12. Test Project Deletion
- Create 2 projects
- Delete one using the new trash icon on the dashboard
- Confirm it disappears immediately
- Refresh page — confirm it's gone from database

### 13. Test Data Persistence
For each CI tool: save data → refresh page → confirm data reloads.
Known tools to test: Stopwatch, Fishbone, 5 Why, Waste ID, Kaizen, Improvement, SMED.

### 14. Mobile Testing
Test on real iPhone Safari (not just Chrome DevTools):
- Dashboard → create project → add steps → use CI tools
- Confirm no buttons are hidden behind bottom nav
- Confirm save buttons are visible
- Confirm modals fit screen

### 15. First Email Flow (Tier0)
Test the free report email:
- Go to /start
- Complete the flow as an anonymous user
- Verify you receive the email report

---

## 📋 REMAINING KNOWN RISKS

1. **PLANS.free**: If any user somehow has plan_tier = 'free' in Supabase (legacy data), Settings will now correctly map it to Trial tier. No action needed in code — already fixed.

2. **Seed routes**: Protected by SEED_SECRET env var if set. Without it, any authenticated user can seed reference projects to their own account (low risk — this is intentional for demos).

3. **supe_rate_log table**: If this table doesn't exist, the supe AI falls back to in-memory rate limiting (10 requests/minute). Create the table to get proper DB-backed rate limiting.

4. **Console.error in API routes**: These log error messages server-side (Vercel logs) — they do NOT expose data to users. This is acceptable and helpful for debugging.

5. **Anthropic API costs**: The Supe AI is gated behind paid plans. The rate limiter prevents abuse. Monitor API usage in Anthropic console.

6. **PDF export**: Requires Pro plan. Test that the PDF renders cleanly without dark backgrounds.
