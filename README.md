# VeSiMy v4.0 — Complete Package
## Every spec section. One delivery. Drop and deploy.

---

## What is in this package

| Area | Files | Status |
|---|---|---|
| Homepage v4 (3D, founder statement, dual paths) | `app/page.tsx`, `app/layout.tsx` | ✅ Replace |
| Design system (CSS tokens, 3D effects, animations) | `styles/design-system.css` | ✅ New |
| VeSiMy Guided (8-step onboarding) | `app/guided/` | ✅ New |
| Tier 0 free flow | `app/start/`, `app/api/tier0/` | ✅ New |
| Pro canvas redesign (sticky notes, inline stopwatch) | `components/v2/V2MapCanvas.tsx` | ✅ Replace |
| Project deletion bug fix | `components/v2/V2ProjectClient.tsx` | ✅ Fixed |
| OODA, 8D, DMAIC tools | `components/tools/` | ✅ New |
| ToolModal updated | `components/tools/ToolModal.tsx` | ✅ Replace |
| Skill matrix | `app/skill-matrix/` | ✅ New |
| Version history + snapshot API | `app/project/[id]/history/`, `app/api/projects/[id]/snapshot/` | ✅ New |
| Pricing v4 (4 tiers, marble Pro, SPRING25) | `app/pricing/page.tsx` | ✅ Replace |
| Version banner for existing users | `components/ui/VersionBanner.tsx` | ✅ New |
| 18 new blog posts | `app/blog/*/page.tsx` | ✅ New |
| 2 SEO landing pages | `app/landing/` | ✅ New |
| DB migrations (014, 015) | `supabase/migrations/` | ✅ New |
| Brand fixes (Vesimy → VeSiMy) | `app/settings/`, `app/terms/`, `app/privacy/` | ✅ Fixed |
| About page (industry-neutral) | `app/about/page.tsx` | ✅ Fixed |
| Sitemap (all new routes) | `app/sitemap.ts` | ✅ Updated |
| Middleware (/start public) | `middleware.ts` | ✅ Updated |
| Greg's email, email sequences, policy updates | `GREG_EMAIL.md`, `email-sequences.md`, `policy-updates.md` | ✅ New |

---

## Deploy checklist — do this in order

### 1. Supabase — run migrations (required first)
Open Supabase dashboard → SQL Editor → run these in order:

```
supabase/migrations/014_tier0_sessions.sql
supabase/migrations/015_skill_matrix_and_versioning.sql
```

Verify: tables `tier0_sessions`, `skill_matrix`, `version_snapshots`, `guided_sessions` exist.

Optional: enable pg_cron for 30-day Tier 0 session cleanup (uncomment the last block in 014).

### 2. Fix the duplicate migration filename
```bash
mv supabase/migrations/002_v2_builder.sql supabase/migrations/002b_v2_builder.sql
```
Only needed if you use `supabase db push`. Safe to skip if you apply migrations manually.

### 3. Vercel — add environment variables
```
ANTHROPIC_API_KEY=sk-ant-...         # already used — confirm it's set
SENDER_API_KEY=...                    # for Tier 0 emails (get from sender.net)
SENDER_TIER0_GROUP_ID=...             # create "tier0_nurture" group in Sender first
```

All others (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, etc.) should already be set.

### 4. Import design system
In `app/globals.css`, add this at the top (after Tailwind directives):
```css
@import '../styles/design-system.css';
```

### 5. Add your photos
Place these files in `/public/photos/` as WebP (max 1200px wide):
- `IMG_4901.webp` — starfield (hero + founder statement backgrounds)
- `IMG_4862.webp` — purple geometric lantern (features section)
- `IMG_4866.webp` — teal lantern (Supe section)
- `IMG_4867.webp` — red lattice sphere (problem section)
- `IMG_4913.webp` — stars and trees (divider + pricing)

All sections degrade gracefully to CSS gradients if photos are missing.

### 6. Rename old brand assets (optional but clean)
```bash
mv public/sensario-hero.jpg    public/vesimy-hero.jpg
mv public/sensario-texture.jpg public/vesimy-texture.jpg
mv public/sensario-bg.jpg      public/vesimy-bg.jpg
```
Then update `app/page.tsx` and `app/dashboard/DashboardClient.tsx` to match.
(Asset filenames are not user-visible — safe to skip until convenient.)

### 7. Add Sender auth callback hook
In `app/api/auth/callback/route.ts`, after session exchange succeeds, add:
```typescript
try {
  const { data: { user: cbUser } } = await supabase.auth.getUser()
  if (cbUser?.email && process.env.SENDER_API_KEY && process.env.SENDER_TIER0_GROUP_ID) {
    // Remove from nurture sequence when they sign up
    fetch('https://api.sender.net/v2/subscribers/groups', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${process.env.SENDER_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cbUser.email, groups: [process.env.SENDER_TIER0_GROUP_ID] }),
    }).catch(() => {})
    // Mark tier0_session as converted
    const admin = createAdminClient()
    admin.from('tier0_sessions')
      .update({ account_created: true, account_created_at: new Date().toISOString() })
      .eq('email', cbUser.email.toLowerCase().trim())
      .eq('account_created', false)
      .then(() => {})
  }
} catch {}
```

### 8. Set up Sender email sequences
Build 4 emails using `email-sequences.md`. Create group `tier0_nurture`. Schedule Day 0/2/4/7. Exit: removed from group (triggers on signup).

### 9. Add VersionBanner to dashboard layout
In `app/dashboard/page.tsx` (or the dashboard layout), import and render:
```tsx
import { VersionBanner } from '@/components/ui/VersionBanner'
// ... inside the JSX, before the main content:
<VersionBanner />
```

### 10. Update Privacy Policy and Terms of Service
Copy additions from `policy-updates.md` into your `/privacy` and `/terms` pages.

### 11. Drop all files and deploy

---

## Testing checklist post-deploy

**Homepage**
- [ ] Loads with dark 3D design, starfield background visible
- [ ] "New to process mapping? Start here" and "Already know lean?" both visible
- [ ] Founder statement appears with ex-Tesla attribution
- [ ] Animated stat counters count up on scroll

**Tier 0**
- [ ] `/start` loads without login
- [ ] 6-step flow completes and submits
- [ ] AI lean report displays in browser
- [ ] Report email arrives (check spam too)
- [ ] Second submission same email within 24h → rate limit message

**VeSiMy Guided**
- [ ] `/guided` redirects unauthenticated users to signup
- [ ] All 8 steps complete
- [ ] Lean concept boxes expand
- [ ] Summary shows PCE, bottleneck, PDCA action
- [ ] Finish creates a real project and redirects

**Project deletion (Greg's bug)**
- [ ] V2 project → Settings → Delete → Cancel → project still exists
- [ ] V2 project → Settings → Delete → Confirm → project gone from dashboard

**New CI tools**
- [ ] OODA tool opens, loops save and reload after refresh
- [ ] 8D report opens, all 8 disciplines navigate, saves correctly
- [ ] DMAIC opens, all 5 phases navigate, saves correctly

**Pro canvas**
- [ ] Sticky note style visible on map tab
- [ ] Expand/collapse shows ISO data strip
- [ ] Inline stopwatch opens on ⏱ click, records laps, saves CT
- [ ] Zoom and pan work on desktop and mobile

**Version history**
- [ ] `/project/[id]/history` loads
- [ ] Save snapshot button works (paid plan)
- [ ] Snapshot comparison shows metric changes

**Skill matrix**
- [ ] `/skill-matrix` loads
- [ ] Shows correct maturity level (beginner if no data)
- [ ] 4 tabs navigate correctly

**Pricing**
- [ ] `/pricing` shows all 4 tiers
- [ ] Pro card has marble treatment
- [ ] SPRING25 badge visible
- [ ] Annual toggle works

**Blog**
- [ ] `/blog` shows all posts including 18 new ones
- [ ] All 18 new posts load with full content
- [ ] Vesimy-vs-manus-ai comparison post loads

**Brand consistency**
- [ ] `/settings` page title says "VeSiMy" not "Vesimy"
- [ ] `/terms` says "VeSiMy"
- [ ] `/privacy` says "VeSiMy"
- [ ] `/about` description mentions "68+ industries" not just manufacturing

**Mobile (iPhone Safari)**
- [ ] `/start` Tier 0 flow works end to end
- [ ] Step modal save button visible above keyboard
- [ ] Canvas zoom works with pinch gesture
- [ ] VeSiMy Guided all 8 steps work on mobile

---

## What is NOT in this package (unchanged)

All of these are working correctly and intentionally not modified:
- Supabase auth, session handling, and RLS policies
- Stripe checkout, webhook, and billing logic
- Industry language engine (68 industries)
- Existing CI tools (Stopwatch, 5 Whys, Ishikawa, Waste, Kaizen, SMED)
- Supe AI RAG knowledge base and panel
- Dashboard, project list, project settings
- ProcessSimulation component
- LiveFloorPanel component
- PDF export (PDFExport.tsx)
- Existing 13 blog posts
- Changelog, learn section
- SPRING25 promo code
- All existing user data and projects

---

## Remaining risks (not blockers)

1. **Photos**: Pages degrade to gradients without them. Functional but not the full visual intent.
2. **pg_cron**: Tier 0 session cleanup requires pg_cron enabled. Not required for launch.
3. **sensario asset names**: Not user-visible. Clean up at your convenience.
4. **VersionBanner**: Needs manual wiring into dashboard layout (5 lines — see step 9 above).

---

## QA Fixes Applied (Post-Audit)

The following issues were identified in QA and fixed before packaging:

### Critical (would break at runtime)
1. **Missing `'use client'`** on GuidedFlow, Tier0Flow, VersionBanner, OODATool, EightDTool, DMaICTool — all fixed
2. **Blog slug conflict** — `process-cycle-efficiency` existed in both packages — renamed v4 post to `process-cycle-efficiency-guide`
3. **Guided flow never saved steps to Supabase** — added sequential step creation after project creation
4. **Report v4 data lost on refresh** — added `016_analysis_reports_v4.sql` migration, store in `v4_data` jsonb, merge on load
5. **Supabase 400 error on analyze** — `{ ...report }` was spreading non-schema fields — fixed with explicit DB insert object
6. **Priority matrix SVG coordinates wrong** — click handler used `<g>` not `<svg>` bounding rect — fixed with `useRef`
7. **`lap_count` sent to Supabase** — column doesn't exist in steps schema — removed from upsertV2Step call

### Security
8. **Email not validated in Tier0** — added regex validation + input truncation to prevent prompt injection
9. **`maxDuration` missing** on Tier0 route — added `export const maxDuration = 60`
10. **`/guided` not in middleware** — added to protected paths

### Data
11. **Report versioning hardcoded to 1** — added proper count query for next version number
12. **Divide-by-zero in charts** — fixed in WaterfallChart, ParetoChart, ProjectionChart

### Content
13. **Pro pricing wrong** — spec says $29/$23, had $49/$39 — fixed
14. **Lifetime plan missing** — added $99 launch banner to pricing page
15. **Manufacturing-only language** in about page, layout OG metadata — fixed to industry-neutral
16. **`/guided` missing from sitemap** — added
17. **Duplicate `'use client'` directives** — removed duplicates from 6 files

### DB Migrations (run in this order)
```
014_tier0_sessions.sql       → Tier 0 rate limiting and session storage
015_skill_matrix_and_versioning.sql → Skill matrix, version snapshots, guided sessions
016_analysis_reports_v4.sql  → Adds v4_data jsonb column to analysis_reports
```
