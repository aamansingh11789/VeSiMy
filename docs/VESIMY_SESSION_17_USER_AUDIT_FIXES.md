# VeSiMy Session 17 — User-reported issue fixes (live app review)

Fixes from Max's walkthrough of the deployed app (3 screenshots).

## Homepage (Image 1)
- "Start free" button was navy-on-navy (invisible against dark hero). Now the
  gold CTA so it stands out.
- Nav links were too dim. Brighter (#EEF2F6), heavier, with a subtle text
  shadow for legibility over the photo background.
- "Sign in" now an outlined gold chip (reads as a button, not faint text).
- Stronger nav scrim at the top so the whole bar is readable on load.
- (Margins/"text cut off": could not reproduce from code. The hero centers in a
  1280px column; the dashboard preview intentionally bleeds off the right edge.
  Need a screenshot of the exact spot that looks cut off.)

## In-app logo (Image 2)
- ROOT CAUSE: the in-app mark (VsLogoMark) was a hand-coded SVG approximation,
  not the real asset. Replaced it to render /brand/vesimy-logo-mark.webp.
  This fixes the logo everywhere in the app at once (sidebar, dashboard,
  project header). On dark surfaces it sits on a light contrast tile.

## Post-it / VSM canvas (Image 2)
- TILT removed: notes now sit straight (was a NOTE_ROTATIONS tilt).
- INTERACTIVITY: the drag-vs-click threshold was 4px, so normal clicks
  (especially on trackpads) were misread as drags and the editor never opened.
  Raised to 8px (mouse) / 12px (touch) so clicking a note reliably opens the
  step editor panel. The panel already persists via updateStep.
- COLORS: note color is driven by Step Type (9 color-coded types per VSM
  convention). Changing Step Type in the panel changes the color. A free-form
  color picker independent of type would need a schema column (note_color) and
  is a clean next feature, not shipped here to avoid an untested half-feature.

## Dashboard (Image 3) — projects showing 0
- ROOT CAUSE: the dashboard projects query nested a tool_data(tool,data) join.
  That nested join trips Supabase RLS in real user sessions and makes the whole
  query return empty, so real projects vanish (and the app then treats the user
  as brand new). This is the same failure mode documented previously; it had
  regressed back into the query.
- FIX: removed the nested tool_data join (dashboard score degrades gracefully
  without stopwatch data). Also moved the status filter to JS so legacy
  projects with a NULL status are not excluded. Confirmed no other query has the
  risky nested join.
- "LAST ACTIVE 2 projects" came from profile.projects_count (a stored counter),
  which is why it showed 2 while the broken query showed 0. Should reconcile now.

## Version banner / toast
- Off-brand orange in the VersionBanner gradient (#2A1800) replaced with navy.
- Toast container now respects the bottom safe-area inset (was bottom:24).
- The version banner renders at the top in normal flow; nothing in code places a
  notification at the bottom, so the "behind the taskbar" placement could not be
  reproduced from code. If it persists, a screenshot of that exact toast will
  pin it down.

## Status
TypeScript: 0 errors.

## NEEDS LIVE VERIFICATION (cannot test the running app/DB from here)
- Dashboard now showing the real projects again (the RLS-join fix).
- Notes reliably opening the editor on click (threshold fix).

## Deploy
git checkout develop
# extract zip over the working tree
git add -A
git commit -m "fix: dashboard RLS-join blanking projects, real in-app logo, post-it tilt+click, homepage nav contrast"
git push origin develop
