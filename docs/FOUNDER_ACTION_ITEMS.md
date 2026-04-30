# VeSiMy — Founder Action Items (Max Singh)
*Last updated: 2026-04-29 | Priority-ordered*

---

## 🔴 CRITICAL (Do before next deploy)

### 1. Logo File Placement
The new logo files have been copied to `/public/brand/` from this session.
Verify these files are committed to your GitHub repo:
```
/public/brand/vesimy-mark.png      ← VSM 3D icon (1254×1254px)
/public/brand/vesimy-wordmark.png  ← VeSiMy wordmark (2508×627px)
```
**Also needed (create/upload):**
- `/public/brand/vesimy-logo-dark.svg`  — for light backgrounds (auth pages, reports, PDF)
- `/public/brand/vesimy-logo-light.svg` — for dark backgrounds (nav, hero, modals)
- `/public/brand/favicon.svg`           — 32×32 vector favicon
- `/public/brand/apple-touch-icon.png`  — 180×180px for iOS

**Pages that still need logo update:**
- `/app/auth/login/page.tsx` — currently uses text wordmark
- `/app/auth/signup/page.tsx` — currently uses text wordmark
- `/app/dashboard/DashboardClient.tsx` — sidebar/header logo
- Report PDF header — needs print-safe version

### 2. Environment Variables (Vercel → Settings → Environment Variables)
```
NEXT_PUBLIC_SUPABASE_URL          → your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     → Supabase anon key
SUPABASE_SERVICE_ROLE_KEY         → Supabase service role key (server-only)
NEXT_PUBLIC_SITE_URL              → https://vesimy.com
ANTHROPIC_API_KEY                 → Claude API key (for Supe AI)
STRIPE_SECRET_KEY                 → Stripe secret key
STRIPE_WEBHOOK_SECRET             → Stripe webhook signing secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY→ Stripe publishable key
STRIPE_PRICE_ID_PRO_MONTHLY       → from Stripe dashboard
STRIPE_PRICE_ID_PRO_YEARLY        → from Stripe dashboard
STRIPE_PRICE_ID_LIFETIME          → from Stripe dashboard (if active)
```

### 3. Supabase Database Migration
Run `/build/supabase-v2-migration.sql` in Supabase SQL editor if not already done.

Verify these tables exist with correct RLS policies:
```sql
-- Check tables
SELECT table_name FROM information_schema.tables WHERE table_schema='public';

-- Essential RLS check
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public';
```

Required tables: `projects`, `steps`, `tool_data`, `op_steps`, `branches`, `reports`, `kanban_boards`, `kanban_columns`, `kanban_tasks`, `profiles`, `subscriptions`

### 4. Stripe Webhook Registration
In Stripe Dashboard → Developers → Webhooks:
- **URL**: `https://vesimy.com/api/stripe/webhook`
- **Events to listen for**:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

---

## 🟡 IMPORTANT (Do within 1 week)

### 5. Supabase Auth Settings
- Enable Email confirmations: Auth → Email → Enable email confirmations
- Set Site URL: Auth → URL Configuration → `https://vesimy.com`
- Add redirect URLs: `https://vesimy.com/auth/callback`, `https://vesimy.com/dashboard`
- Optional: Enable Google OAuth for faster signup

### 6. Vercel Domain & Build Settings
- Custom domain: `vesimy.com` → point DNS to Vercel
- Build command: `npm run build`
- Output directory: `.next`
- Node.js version: 22.x
- Remove `ignoreBuildErrors: true` from `next.config.js` after fixing all TS errors

### 7. Content & Legal Review
Pages requiring your review before public launch:
- `/app/pricing/page.tsx` — verify all plan features are accurate
- `/app/enterprise/page.tsx` — verify contact form routes
- `/app/privacy/page.tsx` — verify legal accuracy
- `/app/terms/page.tsx` — verify legal accuracy
- Any page claiming "ISO 22468:2020" — changed to "aligned with" or "structured around" (not certified)

### 8. Favicon Update
Replace `/public/favicon.ico` and `/public/favicon.png` with your new brand mark.
Recommended: Export from the VSM mark PNG at 32×32 and 16×16.

---

## 🟢 PHASE 2 (After stable launch)

### 9. Email Templates (Supabase)
Update Supabase auth email templates to use VeSiMy branding:
- Confirmation email
- Password reset email
- Magic link email
→ Supabase Dashboard → Authentication → Email Templates

### 10. PWA Manifest Icons
Update `/public/manifest.json` and `/public/icons/` with the new VeSiMy mark:
- `icon-192.png` (192×192)
- `icon-512.png` (512×512)
- `maskable-icon.png` (512×512 with safe area)

### 11. Analytics
Add PostHog, Plausible, or equivalent for real user analytics.
No analytics currently wired. Event tracking needed for:
- Project creation
- Tool usage (Stopwatch, Fishbone, 5 Why, etc.)
- Tier 0 completion rate
- Report generation
- Upgrade conversions

### 12. SEO & Social
- `/public/og-image.png` — 1200×630 Open Graph image
- Update `/app/layout.tsx` metadata with real `openGraph.images`
- Add structured data (JSON-LD) for SaaS product schema

---

## 📋 Manual QA Checklist (Do after each deploy)

- [ ] Homepage loads on mobile, no overflow
- [ ] VeSiMy logos visible in nav and footer
- [ ] 3D cube hero renders, hovers correctly
- [ ] "Start here" CTA → `/start` → Tier0Flow loads
- [ ] Tier0Flow: all 5 steps navigable, report generates
- [ ] Sign up → email confirmation → dashboard
- [ ] Create V2 project → Map tab shows sticky notes (straight, no rotation)
- [ ] Open Stopwatch → time 3 laps → save → refresh → data persists
- [ ] Open Fishbone → add causes → save → refresh → data persists
- [ ] Open 5 Why → fill chain → save → refresh → data persists
- [ ] Kaizen Board → add item → move to In Progress → refresh → persists
- [ ] Project tab → shows metrics panel
- [ ] Report tab → real data, not zeros
- [ ] Stripe: Pro upgrade → checkout opens with correct price
- [ ] Stripe webhook: test event triggers subscription update
- [ ] Mobile (375px): nav hamburger works, canvas scrolls horizontally
- [ ] CSP headers present in response (check DevTools → Network → Response Headers)
