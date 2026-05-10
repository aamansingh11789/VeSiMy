# VeSiMy — Founder Action Items
*These are things only you can do. No code change can substitute for them.*
*Last updated after full QA audit — May 2026*

---

## 🔴 BEFORE LAUNCH (Critical)

### 1. Remove ALL fake/placeholder people from public-facing content
The codebase currently has NO fake testimonials, NO fake user counts, NO fake company logos.
However — if you ever add testimonials, they must be real. Rules:
- Only quote real users who have given written permission
- Only use real company names with permission
- Do not invent quotes, even "inspired by real feedback"
- Do not use stock photos as customer avatars
- Do not claim social proof you don't have yet

Current status: ✓ Homepage has no fake testimonials — it shows industry categories instead

### 2. Real testimonials — when you have them
When Greg Foertsch (your first real user) gives you a written quote you can use, add it.
Format: Real name, real role, real company, real quote.
Do not use until you have written permission.

### 3. Replace "Get Started Free" CTA email with production domain
- Change `href:'/contact'` in pricing to a real contact form or Calendly link
- Update `mailto:max@vesimy.com` to a support/sales email address if different

---

## 🔴 INFRASTRUCTURE (Before scaling)

### 4. Supabase SQL — Run these before going live
See `docs/TASKS_FOR_OWNER.md` for the full SQL. Critical tables:
```sql
-- Supe AI rate limiting
CREATE TABLE public.supe_rate_log ...

-- Stripe event idempotency  
CREATE TABLE public.stripe_events ...

-- Tier0 free reports
CREATE TABLE public.tier0_sessions ...

-- profiles defaults
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS projects_limit integer DEFAULT 3;
```

### 5. Stripe Webhook
- Endpoint: `https://vesimy.com/api/stripe/webhook`
- Events: checkout.session.completed, customer.subscription.*, invoice.payment_*
- Copy signing secret → set as `STRIPE_WEBHOOK_SECRET` in Vercel

### 6. Environment Variables in Vercel (Production)
All of these must be set:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=https://vesimy.com
ANTHROPIC_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_PRO_MONTHLY_PRICE_ID
STRIPE_LIFETIME_PRICE_ID
POSTHOG_API_KEY
SENDER_API_KEY
SEED_SECRET=<random 32-char string>
```

### 7. Supabase Auth Settings
- Site URL: `https://vesimy.com`
- Redirect URL: `https://vesimy.com/api/auth/callback`
- Enable email confirmations (recommended)

---

## 🟡 CONTENT (Before Marketing)

### 8. Screenshots
The product mockup in the homepage hero uses hand-coded demo data (fictional process steps).
When you have real user projects, replace with actual screenshots:
- `/public/hero-bg.png` — background image (already added)
- Consider adding a real screen recording as a video background or GIF

### 9. Pricing copy review
Current pricing:
- Free Start: Free, no account
- Trial: 14 days, no credit card
- Pro: $29/month or $23/month annual
- Enterprise: Custom (currently links to `/contact`)

Confirm all prices are correct before running paid traffic.

### 10. Blog posts
Current blog has industry-specific posts (brewing, healthcare, etc.).
These are educational content about Lean — they are fine.
Do NOT add fake case studies with made-up companies or outcomes.
When you have a real case study with a real customer, add it with their permission.

### 11. Learning Center accuracy
The learning center explains Lean/VSM concepts.
Review any numerical claims (e.g. "Toyota reduces waste by X%") to ensure they reference
published, verifiable sources rather than invented statistics.

---

## 🟡 COMPLIANCE & SECURITY CLAIMS

### 12. Do NOT claim these until implemented
The app currently does NOT claim:
- ❌ SOC 2 compliance
- ❌ GDPR compliance
- ❌ HIPAA compliance
- ❌ ISO 27001
- ❌ FedRAMP
- ❌ Enterprise SSO

These have been removed from the codebase.

When you implement any of these, work with a compliance professional to:
- Document the implementation
- Get independent verification if required
- Use precise language ("we support GDPR workflows" vs "GDPR certified")

### 13. ISO 22468:2020 reference
The app references ISO 22468:2020 — this is the Value Stream Mapping standard.
This is fine to reference as a methodology you follow, not a certification.
Keep language as: "Structured using ISO 22468:2020 VSM methodology"

---

## 🟡 QUALITY ASSURANCE

### 14. Manual testing checklist (do before every major release)
See `docs/QA_CHECKLIST.md` for the full list. Key items:
- [ ] New user signup → onboarding → first project
- [ ] Add 5 steps with cycle times → refresh → data still there
- [ ] Delete a project → refresh → project gone
- [ ] Stripe test checkout (card 4242 4242 4242 4242)
- [ ] After payment: plan_tier = 'pro' in Supabase within 60 seconds
- [ ] Supe AI analysis on a project with 3+ steps
- [ ] PDF export (Pro only)
- [ ] Simulation (Pro only)
- [ ] Full flow on iPhone Safari

### 15. Real user testing
Before marketing, get 5–10 real users to try the full flow and document:
- Where they get confused
- What they expect that doesn't exist
- What they find genuinely useful
- Whether data persists correctly for them

---

## 🟢 WHEN YOU HAVE TRACTION

### 16. Add real testimonials
Only when you have written permission from real users.
Do not pay for reviews or incentivize testimonials deceptively.

### 17. Add real case study
First real documented improvement achieved by a real user.
Include: industry, process, before/after metrics, user quote.
Clearly label timeframe and whether metrics are self-reported.

### 18. Update trust indicators
Replace the current industry pill labels with real logos/names
ONLY when you have written permission from those companies.

### 19. Product Hunt launch
When you have 100+ active users:
- Create a Product Hunt page
- Prepare real screenshots from real users
- Real demo video showing actual app
- No fabricated proof

---

## 📋 ONGOING RULES

These rules must be maintained by anyone who works on VeSiMy:

1. **No fake social proof** — ever. Zero fake testimonials, user counts, or revenue claims.
2. **No fake compliance badges** — only claim what is verifiably implemented.
3. **No invented AI outputs** — Supe AI must only reason from data the user entered.
4. **Demo data must be labeled** — "Sample Project" or "Example Only" on all seed data.
5. **Metrics are estimates** — Simulation output always has the estimate disclaimer.
6. **Report language is careful** — "Structured using Lean/VSM methodology" not "ISO certified."
7. **Pricing is honest** — No bait-and-switch on plan features.
8. **Empty states are useful** — Never show fake charts when data is missing.

---

*This document was generated after a full QA audit of the VeSiMy codebase.*
*Update it as the product and business evolve.*
