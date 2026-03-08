# ⊚ Vesimy — Phase 2 Production Codebase

> **The Cycle Never Stops** — Continuous Improvement Platform for every industry

---

## Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 14 (App Router)             |
| Database    | Supabase (PostgreSQL + RLS)         |
| Auth        | Supabase Auth (Google + Email)      |
| Payments    | Stripe (Subscriptions + Webhooks)   |
| Styling     | Tailwind CSS + CSS Variables        |
| Deployment  | Vercel                              |
| Language    | TypeScript (strict)                 |

---

## Project Structure

```
vesimy/
├── app/
│   ├── page.tsx                  ← Landing / marketing page
│   ├── layout.tsx                ← Root layout + Toaster
│   ├── globals.css               ← Vesimy tempered metal theme
│   ├── auth/login/page.tsx       ← Sign in / Sign up (Google + Email)
│   ├── dashboard/
│   │   ├── page.tsx              ← Server component (data fetch)
│   │   └── DashboardClient.tsx   ← Client component (interactivity)
│   ├── project/[id]/             ← ← RENAME app/project/id → [id]
│   └── api/
│       ├── auth/callback/        ← OAuth + email confirmation handler
│       ├── projects/             ← CRUD API for projects
│       │   └── [id]/             ← ← RENAME id → [id]
│       └── stripe/
│           ├── checkout/         ← Create Stripe Checkout Session
│           ├── portal/           ← Open Stripe Billing Portal
│           └── webhook/          ← Handle Stripe subscription events
│
├── components/
│   ├── ui/Logo.tsx               ← Reusable Vesimy SVG helix logo
│   └── layout/Sidebar.tsx        ← Main navigation sidebar
│
├── hooks/
│   ├── useProject.ts             ← Cloud-synced project state (auto-save)
│   └── useProfile.ts             ← Current user profile hook
│
├── lib/
│   ├── supabase.ts               ← Supabase clients (browser + server + admin)
│   ├── stripe.ts                 ← Stripe config, plans, checkout helpers
│   └── database.types.ts         ← Full TypeScript types for all tables
│
├── supabase/migrations/
│   └── 001_initial_schema.sql    ← Complete DB schema + RLS + triggers
│
├── middleware.ts                  ← Auth route protection
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.example                  ← Copy to .env.local and fill in
```

---

## 🚀 Quick Start (30 minutes to running)

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/vesimy.git
cd vesimy
cp .env.example .env.local
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → New project
2. Settings → API → copy URL and anon key → paste in `.env.local`
3. Settings → API → copy service role key → paste in `.env.local`
4. SQL Editor → paste contents of `supabase/migrations/001_initial_schema.sql` → Run
5. Authentication → Providers → Enable Google OAuth
   - Go to [Google Cloud Console](https://console.cloud.google.com) → Create OAuth App
   - Copy Client ID + Secret → paste into Supabase Google provider settings

### 3. Set up Stripe

1. Go to [dashboard.stripe.com](https://stripe.com)
2. Developers → API Keys → copy publishable + secret key → paste in `.env.local`
3. Create Products:
   - **Pro**: $29/month recurring → copy Price ID → `STRIPE_PRO_MONTHLY_PRICE_ID`
   - **Enterprise**: $99/month recurring → copy Price ID → `STRIPE_ENTERPRISE_MONTHLY_PRICE_ID`
4. For webhooks (after deploying to Vercel):
   - Stripe Dashboard → Webhooks → Add endpoint
   - URL: `https://your-app.vercel.app/api/stripe/webhook`
   - Events to listen for:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copy Signing Secret → `STRIPE_WEBHOOK_SECRET`

### 4. IMPORTANT: Rename dynamic route folders

Next.js uses `[id]` for dynamic segments, but some file systems can't create those folders directly. Rename:

```bash
mv app/project/id "app/project/[id]"
mv app/api/projects/id "app/api/projects/[id]"
```

### 5. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 6. Deploy to Vercel

```bash
npm install -g vercel
vercel
# Follow prompts — add all .env.local values as Environment Variables in Vercel dashboard
```

---

## Integrating the v1 Demo (Vesimy_v1.html)

The Phase 2 code provides the production **shell** — auth, billing, database, routing, landing page.

To wire the v1 demo tools into the `/project/[id]` page:

1. Copy the React component functions from `Vesimy_v1.html` (between the `// TOOL COMPONENTS` markers)
2. Create individual files in `components/tools/`:
   - `TimeStudy.tsx`
   - `ValueStreamMap.tsx`
   - `FiveWhy.tsx`
   - `Fishbone.tsx`
   - `WasteAnalysis.tsx`
   - `KaizenTracker.tsx`
3. In `app/project/[id]/page.tsx` (create this file):
   - Load project from Supabase using `params.id`
   - Render the VSM canvas + tool modals
   - Use `useProject()` hook for auto-saving changes to cloud

---

## Data Migration from v1 Demo

Users who used the demo (localStorage) can export their data and import into the new app.

The demo's export format (`vesimy_projects` localStorage key) maps directly to the `projects.vsm_data` JSONB column.

---

## Subscription Plans

| Feature           | Free     | Pro ($29) | Enterprise ($99) |
|-------------------|----------|-----------|------------------|
| Projects          | 3        | Unlimited | Unlimited        |
| Cloud sync        | ✗        | ✓         | ✓                |
| PDF export        | Basic    | Full      | Full             |
| Shareable links   | ✗        | ✓         | ✓                |
| Team members      | 1        | 1         | Unlimited        |
| API access        | ✗        | ✗         | ✓                |
| 14-day free trial | N/A      | ✓         | ✓                |

---

## Environment Variables Reference

```
NEXT_PUBLIC_SUPABASE_URL           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY      # Supabase anon (public) key
SUPABASE_SERVICE_ROLE_KEY          # Supabase service role (server only!)

STRIPE_SECRET_KEY                  # Stripe secret key (server only!)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY # Stripe publishable key (client-safe)
STRIPE_WEBHOOK_SECRET              # Stripe webhook signing secret
STRIPE_PRO_MONTHLY_PRICE_ID        # Price ID for $29/mo Pro plan
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID # Price ID for $99/mo Enterprise plan

NEXT_PUBLIC_APP_URL                # https://vesimy.com (or localhost:3000)
```

---

## Brand Colors

```css
--oc-gold:    #D4A208  /* Straw gold — 200°C tempered steel */
--oc-gold2:   #F4A623  /* Amber — 215°C */
--oc-violet:  #6426A0  /* Violet — 290°C */
--oc-steel:   #6CB9FC  /* Silver-steel — 400°C */
--oc-bg:      #03030D  /* Deep space void */
```

---

*Vesimy — The Cycle Never Stops*
