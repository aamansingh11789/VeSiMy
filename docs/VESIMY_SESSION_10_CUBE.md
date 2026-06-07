# VeSiMy Session 10 — 3D Cube Hero (live in app)

## What changed on the homepage (app/page.tsx, TS-clean)

Replaced the flat "Order Fulfillment" hero panel with a real 3D cube.

### The cube
- Six-faced CSS 3D cube (transform-style: preserve-3d), each face a product surface:
  - Front: VSM dashboard (Cut/Weld/Assembly-bottleneck/Pack + KPI strip)
  - Back: waste-analysis donut
  - Right: bottleneck alert (big 75s)
  - Left: Supe AI advisor with action chips
  - Top: logo + VeSiMy wordmark only (tagline removed per request)
  - Bottom: 90-day trend sparkline
- Sharp square edges (no border radius), beveled metal edges
  (light top-left, dark bottom-right) for a solid machined-block look.
- Gold inner fillet frame removed; no gold lines on the edges.
- Each face a complementary VeSiMy-family tone (steel navy, deep teal,
  plum navy, champagne-dark, slate blue, bright steel top) so it reads as
  a multi-faceted object, not flat blue-on-blue.
- Solid opaque faces (not a hollow glass shell).

### Interaction
- No auto-spin. Loads at a fixed angle.
- Drag to rotate (mouse + touch), clamped on the X axis. "Drag to rotate"
  hint fades on first interaction.

### Other fixes
- Sign-in button highlighted: gold-outline chip with champagne tint.
- Footer bottom text brightened (slate-400) so it is legible.
- Background fully fixed: parallax drift removed, image stays locked while
  content scrolls over it.
- Hero content top-aligned so the cube sits beside the headline at the top.

### Assets
- Real logo /brand/vesimy-logo-mark.webp on the cube top face and nav/footer.
- Real /brand/hero-bg.webp as the fixed background at 92% with left veil.

## Deploy
cd ~/OneDrive/Documents/Max/vesimy-v3
git checkout develop
# extract zip, overwriting
git add -A
git commit -m "feat: 3D cube hero, highlighted sign-in, fixed bg, footer legibility"
git push origin develop
# test preview in incognito, drag the cube, then merge develop -> main
