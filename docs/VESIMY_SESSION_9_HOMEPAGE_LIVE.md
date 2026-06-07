# VeSiMy Session 9 — New Homepage Live + Diagnostics

## Homepage v7 ported into the app

The captivating long-form homepage is now the real `app/page.tsx` (was a
standalone preview). 678 lines, TypeScript-clean.

### What shipped
- **Fixed atmospheric background**: the navy industrial render stays still
  while content scrolls over it, visible at the sides. Subtle parallax drift.
- **Real logo asset**: uses /brand/vesimy-logo-mark.webp (the actual uploaded
  mark, transparent bg), not an SVG approximation. In nav, hero panel, footer.
- **Real hero image**: /brand/hero-bg.webp at 92% opacity with a left-anchored
  gradient veil so the headline stays readable while components show clearly.
- **Sections**: hero (animated headline + live product panel), problem
  statement (scroll-lit words), interactive bottleneck demo, Map/Measure/
  Improve pillars, 12-tool grid, ISO 22468 methodology, industries marquee,
  founder (real creds), training-vs-execution contrast, pricing, FAQ, final CTA.
- **Live routes**: all CTAs and footer links point at real pages
  (/auth/signup, /auth/login, /start, /pricing, /contact, /about, /security,
  etc). All 14 verified to resolve to real page files.
- **No fake data**: example process clearly framed as an example; founder
  background and ISO 22468 are real; no fake testimonials/logos/metrics.

### Assets in /public/brand/
- vesimy-logo-mark.webp (22KB, transparent)
- hero-bg.webp (94KB) — the chosen navy circuit render
- rings-bg.webp, flow-bg.webp, layers-bg.webp (spare section backgrounds)

### Verified
- TypeScript: 0 errors
- CSP already allows Google Fonts (style-src + font-src)
- Static /public images need no remotePatterns config (served directly)
- Old ManufacturingHeroDashboard component is now orphaned (no importers);
  left in place, harmless, can be deleted later.

## Functional diagnostic — results
- All 14 homepage internal links resolve to real pages. No 404s.
- Step add/update error handling from the prior session is intact (no silent
  save failures).
- Data access layer (lib/db.ts) scopes every query to the authenticated
  user.id — ownership enforced at the application layer.
- RLS is enabled on all data tables with owner-only policies
  (user_id = auth.uid()) — ownership enforced at the database layer too.

## User data diagnostic
Live database checks can only run against Supabase, so they are provided as
a ready-to-run script: docs/USER_DATA_DIAGNOSTIC.sql

It checks (read-only): account inventory, Greg's duplicate accounts, orphaned
projects, orphaned steps, empty projects, per-user row counts across all
tables, and the seeded reference project. It also includes commented-out
OPTIONAL FIX blocks for merging Greg's two accounts and removing any truly
orphaned project — run those only after the read-only checks confirm.

## Deploy
```
cd ~/OneDrive/Documents/Max/vesimy-v3
git checkout develop
# extract zip, overwriting
git add -A
git commit -m "feat: new homepage live (fixed bg, real logo/render) + data diagnostic"
git push origin develop
```
Test the preview URL in incognito. Check: hero background holds still while
scrolling, logo is correct, all nav/footer links work, the interactive demo
responds to hover/tap. Then merge develop -> main.

Then open Supabase SQL editor and run docs/USER_DATA_DIAGNOSTIC.sql to get a
clear picture of the account/data situation (especially Greg's duplicates).
