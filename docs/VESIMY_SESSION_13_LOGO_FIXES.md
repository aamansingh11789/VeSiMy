# VeSiMy Session 13 — Logo visibility + linking fixes

## Homepage: logo disappearing at top until scroll
Root cause: the logo asset is dark navy. At the top of the page the nav has
no background, so the navy logo blended into the dark hero. On scroll, the
nav gained its blurred backdrop over lighter sections, making it reappear.
Fix:
- Created a LIGHT logo variant (public/brand/vesimy-logo-light.webp): navy
  wings recolored to light slate/white, gold sphere kept.
- Use the light logo in all DARK contexts: homepage nav, footer, and the
  dashboard browser-tab. (Dark logo still used on light backgrounds.)
- Added a permanent subtle nav scrim gradient so the bar is always a
  defined surface from first paint.

## Login page: logo placement + link
- Added a top-left clickable VeSiMy logo (real asset + Instrument Serif
  wordmark) that links to the homepage, matching the homepage placement.
- Made the centered card logo a link home too.
- Fixed the wordmark casing bug: "Vesimy" -> "VeSiMy".

## Signup page
- Centered logo now links to the homepage.

## Main app sidebar (underlying issues)
- The brand (logo + wordmark) was not clickable. Now wrapped in a Link to
  /dashboard (both expanded and collapsed states).
- Removed off-brand amber/orange: the "Process Intelligence" label
  (#E8941A) and the active nav-item left border (#E8941A) are now champagne
  gold (#C9A66B).

## Other off-brand color cleanup
- V2MapCanvas focused-input border #F59E0B -> champagne.
- Note: VSM "decision" sticky notes remain orange by design (functional
  color-coding within the multi-color sticky palette), and a warning
  callout in the PDCA print template keeps an amber accent. These are
  intentional/contained, not UI chrome.

## Status
TypeScript: 0 errors.

## Deploy
cd ~/OneDrive/Documents/Max/vesimy-v3
git checkout develop
# extract zip, overwriting
git add -A
git commit -m "fix: light logo for dark nav (visibility), clickable logos on auth+sidebar, amber cleanup"
git push origin develop
