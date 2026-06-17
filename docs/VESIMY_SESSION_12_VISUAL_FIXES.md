# VeSiMy Session 12 — Homepage Visual Fixes

## Invisible text (root cause + fix)
The eyebrow labels on the DARK sections used GOLDD (#A8854F, deep
champagne), which is too dark to read on the dark navy background.
- "Why most improvement fails" (problem section): GOLDD -> GOLD
- "Why VeSiMy exists" (founder section): GOLDD -> GOLD
Rule now consistent: dark/transparent sections use bright GOLD eyebrows,
light frosted panels use deep GOLDD. All other eyebrows already followed it.

## Uneven content placement
- Floatpanels had margin:32px auto + width calc(100% - 80px); dark sections
  used full-width .section padding. Normalized: floatpanels now margin
  0 auto 36px, width calc(100% - 72px), max 1460px.
- Section padding unified: .section 104px; .floatpanel.section 88px 56px,
  so light panels and dark sections share an even vertical rhythm and the
  content columns line up.
- Hero: switched from align-items:start to center and removed the negative
  top margins on the dashboard, so the headline block and the 3D device are
  vertically balanced instead of the device floating high.

## Whole-app scan
Scanned app/ and components/ for same-color-on-same-background text. The
white-text matches outside the homepage are all dark-context (sidebars,
dark cards, buttons) and render correctly. No additional invisible-text
violations found.

## Cleanup
Removed 3 orphaned hero components no longer imported anywhere:
- components/home/HeroCubePreview.tsx
- components/home/LiveVSMHero.tsx
- components/homepage/ManufacturingHeroDashboard.tsx

## Status
TypeScript: 0 errors.

## Deploy
cd ~/OneDrive/Documents/Max/vesimy-v3
git checkout develop
# extract zip, overwriting
git add -A
git commit -m "fix: homepage invisible eyebrows, even spacing, balanced hero; remove dead hero components"
git push origin develop
