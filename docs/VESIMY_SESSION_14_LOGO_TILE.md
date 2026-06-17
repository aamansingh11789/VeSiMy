# VeSiMy Session 14 — Original logo + background restored

## What was wrong
- A previous change recolored the logo to a light variant. The logo colors
  must stay original (navy wings + gold sphere).
- In the standalone PREVIEW only, a logo-swap had clobbered the hero
  background base64. The actual app was never affected (it references the
  background by file path /brand/hero-bg.webp, which on disk is still the
  chosen circuit-board image).

## Fix
- Reverted the logo to the ORIGINAL asset (vesimy-logo-mark.webp) in the
  nav, footer, and dashboard tab. No recoloring.
- Solved the top-logo visibility WITHOUT changing the logo or the
  background: the logo now sits on a small white/paper rounded tile
  (.logo-tile) in dark areas, so the original navy+gold logo has contrast
  and is visible immediately on load.
- Restored the preview hero background to the original circuit-board image.
- Confirmed the app background source is /brand/hero-bg.webp (unchanged).

## Status
TypeScript: 0 errors. Background = original. Logo = original colors, now
visible via a backing tile.

## Deploy
cd ~/OneDrive/Documents/Max/vesimy-v3
git checkout develop
# extract zip, overwriting
git add -A
git commit -m "fix: restore original logo + background, add logo tile for visibility"
git push origin develop
