# VeSiMy v4 Final Completion Pass

Date: 2026-04-25
Package reviewed: `vesimy-v4-finished-homepage-diagnostics.zip`

## Scope completed

This pass continued the homepage/design diagnostic package and focused on real blockers that could affect the v4 funnel and production readiness.

### 1. Tier 0 report API fixed

The `/start` Tier 0 UI submits process steps as:

```ts
{ label: string; time_seconds: number | null }
```

The `/api/tier0/generate-report` route was sanitizing different fields that do not exist in the UI payload, including `name`, `waitBefore`, `cycleTime`, and `painPoint`. That mismatch could cause report generation to lose step labels/timing data or create weak/faulty reports.

Fix applied:
- Added `normaliseTier0Request()`.
- Normalizes email, first name, industry, process name, target category, pain step, pain description, and steps.
- Keeps the real UI fields: `label` and `time_seconds`.
- Filters blank steps.
- Enforces max 12 steps.
- Caps step time at 24 hours to avoid bad payloads.

File changed:
- `app/api/tier0/generate-report/route.ts`

### 2. Tier 0 email HTML hardened

The Tier 0 report email interpolated user input and AI-generated report fields directly into HTML.

Fix applied:
- Added `escapeHtml()`.
- Escapes first name, process name, and report text before inserting into the email HTML.
- Keeps numeric values as numeric calculations.

File changed:
- `app/api/tier0/generate-report/route.ts`

### 3. Stripe checkout public errors softened

The checkout route returned configuration-specific error details such as exact env var names.

Fix applied:
- Unknown plan now returns a user-safe message.
- Missing Stripe price config now returns a user-safe support message.

File changed:
- `app/api/stripe/checkout/route.ts`

### 4. Generic emojis removed from high-visibility v4 UI paths

The v4 spec asks for no generic emojis in the professional UI. I removed generic emoji glyphs from high-visibility v4/Tier 0/Guided/report areas and replaced them with clean text badges.

Files changed:
- `app/start/Tier0Flow.tsx`
- `app/guided/GuidedFlow.tsx`
- `app/pricing/page.tsx`
- `app/landing/lean-six-sigma-execution/page.tsx`
- `app/skill-matrix/SkillMatrixClient.tsx`
- `components/tools/DMaICTool.tsx`
- `components/tools/OODATool.tsx`
- `components/tools/EightDTool.tsx`
- `components/v2/V2AnalysisReport.tsx`
- `components/v2/V2ProjectClient.tsx`
- `components/v2/V2MapCanvas.tsx`
- `components/v2/v2-constants.ts`
- `components/simulation/ProcessSimulation.tsx`

### 5. Pricing standards language made safer

The pricing page had language that could read as stronger standards/compliance positioning than the product should claim without formal certification.

Fix applied:
- Replaced strict ISO-aligned phrasing with safer methodology language:
  “designed around accepted Value Stream Mapping and continuous improvement methodology.”

File changed:
- `app/pricing/page.tsx`

### 6. Homepage route links checked

Homepage CTAs and nav routes checked for file existence:
- `/start` — exists
- `/guided` — exists
- `/pricing` — exists
- `/enterprise` — exists
- `/auth/login` — exists
- `/learn` — exists
- `/industries` — exists

## Automated check status

### npm install
Attempted, but dependency installation timed out in the container. No `node_modules` directory was available afterward.

Command attempted:

```bash
npm install --no-audit --no-fund
```

Result:
- Timed out before completion.
- Because dependencies were unavailable, `next build`, `next lint`, and full `tsc --noEmit` could not be completed reliably in this environment.

### Static checks performed
- Checked high-visibility homepage routes exist.
- Checked Tier 0 API no longer references removed fields like `targetMetric`, `name`, `waitBefore`, `cycleTime`, or `painPoint` in the server normalization path.
- Checked production `console.log` / `console.debug` search in `app`, `components`, and `lib`; none found in the scanned source files.
- Counted remaining `@ts-nocheck` markers: 72. Most are blog/content/API legacy files. This should be a later quality cleanup and should not be mixed with the homepage/Tier 0 pass unless there is time for a full type hardening sprint.

## Important remaining blockers before production

1. Run install/build locally or in Vercel preview:

```bash
npm install
npm run type-check
npm run lint
npm run build
```

2. Remove or reduce build suppression only after fixing type errors:

Current `next.config.js` still has:

```js
typescript: { ignoreBuildErrors: true }
eslint: { ignoreDuringBuilds: true }
```

This is not a production-quality setting. It is useful only while the codebase is being hardened.

3. Verify Tier 0 in a real environment:
- `tier0_sessions` table exists.
- `SENDER_API_KEY` is configured.
- `SENDER_TIER0_GROUP_ID` is configured if using Sender groups.
- `ANTHROPIC_API_KEY` is configured if AI reports are expected.
- Rate limiting works.
- Email delivery works.
- Report copy is acceptable.

4. Verify Stripe in a real environment:
- Price IDs are set.
- Checkout works for Pro/Lifetime/Enterprise flow as intended.
- Webhook secret is configured.
- Subscription status updates profile access correctly.

5. Plan a dedicated TypeScript hardening pass:
- Remove `@ts-nocheck` gradually.
- Start with API routes and app-critical components.
- Leave blog pages last.

## Verdict

This package is ready for a Vercel preview deployment and manual QA.

It is not production-certified until dependency installation, type-check, lint, build, Tier 0 email delivery, Supabase writes, and Stripe checkout are verified in the real environment.
