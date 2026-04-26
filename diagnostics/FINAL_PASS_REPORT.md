# VeSiMy v4 Final Continuation Pass

Date: 2026-04-26
Package: `vesimy-v4-final-file.zip`

## What was finished in this pass

### 1. Removed a client-side Stripe/server import risk
Two client components imported `PLANS` from `lib/stripe.ts`. That module creates a Stripe server client and reads secret/server-only environment values. Even if only plan metadata is used, importing that file from a client component can create bundling or security problems.

Changed:
- Added `lib/plans.ts` with client-safe plan display metadata only.
- Updated `app/auth/signup/page.tsx` to import `PLAN_DISPLAY` from `lib/plans.ts`.
- Updated `app/settings/SettingsClient.tsx` to import `PLAN_DISPLAY` from `lib/plans.ts`.
- Kept server-only Stripe session logic in `lib/stripe.ts`.
- Updated `lib/stripe.ts` so server-side `PLANS` combines the client-safe metadata with Stripe price IDs on the server side only.

### 2. Homepage route truthfulness cleanup
The homepage was pointing public marketing CTAs to protected app pages like `/guided` and `/learn`. Those routes exist, but middleware sends unauthenticated users to login. That is not technically broken, but it is not ideal for a public homepage.

Changed:
- Homepage `Guided` nav and `Explore Guided` CTA now point to `/auth/signup?ref=guided`.
- Homepage `Tools` nav and learning CTA now point to `/blog`, which is public.
- Public no-account CTA still points to `/start`.

### 3. AI/provider error-message cleanup
A client-facing Supe response mentioned `ANTHROPIC_API_KEY`, which exposes implementation detail to users.

Changed:
- Replaced the user-facing AI setup message with a safer generic failure message.
- Replaced high-visibility `AI MENTOR` labels with `AI ADVISOR`.
- Made the secondary AI helper Anthropic model configurable through `ANTHROPIC_MODEL`.

### 4. Safer public claims
Changed remaining high-visibility risky wording:
- `SLA guarantee` → `SLA option` / `SLA and uptime options`.
- `68+ industry templates` → `Multi-industry examples`.

### 5. Static checks performed
Because dependency installation still timed out in this container, I used direct static code checks instead:

- Import resolution scan for `@/` and relative imports: no missing local imports found earlier in the continuation work.
- Route href scan: no missing static page routes found earlier in the continuation work.
- Server-only import scan: client imports of `lib/stripe.ts` were found and fixed.
- Risky public-claim scan: high-visibility claim issues were softened.

## Commands that still need to be run locally or in Vercel

Dependency installation timed out here, so the following must be run in your actual dev/Vercel environment:

```bash
npm install
npm run type-check
npm run lint
npm run build
```

## Files changed in this pass

- `lib/plans.ts` — new client-safe plan metadata file.
- `lib/stripe.ts` — now keeps Stripe price IDs/server actions server-side while reusing shared plan metadata.
- `app/auth/signup/page.tsx` — no longer imports server Stripe module.
- `app/settings/SettingsClient.tsx` — no longer imports server Stripe module.
- `app/page.tsx` — public homepage CTAs now point to public or signup routes instead of protected pages.
- `components/supe/SupePanel.tsx` — safer AI error text and AI Advisor label.
- `lib/ai/ai-assist.ts` — configurable Anthropic model.
- `app/project/[id]/ProjectClient.tsx` — AI Advisor wording.
- `app/pricing/page.tsx` — safer SLA wording.
- `app/api/enterprise/quote/route.ts` — safer SLA wording.
- `app/blog/vesimy-vs-manus-ai/page.tsx` — safer industry claim wording.

## Production verdict

This final package is ready for a Vercel preview deployment and a full build check.

I would still avoid production deployment until these pass in your real environment:

1. `npm run build`
2. `npm run type-check`
3. `npm run lint`
4. Manual QA of `/start`, `/auth/signup`, `/pricing`, `/dashboard`, and one full project flow.

## Highest-priority manual QA checklist

1. `/start` Tier 0 flow: submit email, industry, steps, times, pain point, and confirm report generation.
2. Auth signup: confirm email/password and Google sign-in still work.
3. Stripe checkout: test Pro and Lifetime with Stripe test mode.
4. Dashboard: confirm logged-in users can create and open projects.
5. Project builder: verify step data and CI tool data still save and reload.
6. Homepage mobile: confirm the 3D preview does not overflow horizontally.
