# VeSiMy Session 11 — Floating 3D Dashboard Hero

Replaced the rotating cube (overkill) with a realistic floating product
dashboard, styled like a 3D tablet/screen, matching the reference mockup.

## Hero visual (app/page.tsx, TS-clean)
- 3D-tilted product window (rotateX 8°, rotateY -14°) showing the real
  VeSiMy interface: Current State Map, 5-step assembly flow with the
  Assembly step flagged as the bottleneck, and a metrics row
  (Takt, Cycle Time, Wait Time, WIP, PCE).
- Real DEVICE DEPTH: layered box-shadows simulate the tablet's extruded
  side edge and a soft cast shadow on the floor, so it reads as a physical
  screen floating in space, not a flat card. Metallic navy bezel frame
  with a glass-glare highlight across the screen.
- Straightens slightly toward the viewer on hover.
- Two floating glass cards over it: Supe AI Insight (lower-left) and
  Target Progress 62% ring (lower-right).
- Example data clearly framed as an example (Assembly Line A). No fake
  customer names, testimonials, or platform stats.

## Button visibility fixes
- Outline buttons on dark sections ("See it in motion", "Try the demo
  first"): border strengthened from 18% to 45% white at 1.5px, bold text,
  so they no longer disappear against the background.
- Ghost buttons on light sections: solid white fill + darker border.
- Top nav links brightened from dim slate to light slate for legibility.
- Sign-in remains the highlighted gold-outline chip from last session.

## Removed
- The 3D cube (markup, CSS, and drag-to-rotate logic) is fully gone.

## Deploy
cd ~/OneDrive/Documents/Max/vesimy-v3
git checkout develop
# extract zip, overwriting
git add -A
git commit -m "feat: floating 3D dashboard hero (replaces cube), button visibility fixes"
git push origin develop
# test preview in incognito, then merge develop -> main
