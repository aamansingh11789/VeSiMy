# VeSiMy Sticky VSM Workspace Pass

## Scope completed
This pass updates the real VSM workspace component used inside the project page, not just a mockup image.

### File changed
- `components/vsm/VSMMap.tsx`

## What changed
- Replaced the older ISO-rectangle VSM visual with a premium light SaaS workspace style that matches the deployed homepage direction.
- Added an 8-step VeSiMy Guided progress strip:
  1. Knowledge Check
  2. Target Setting
  3. Current State
  4. Process Boundaries
  5. Map the Steps
  6. Bottleneck
  7. Improvement Plan
  8. Report & Next Action
- Added a 4-phase workshop strip for Pro-style VSM work:
  1. Wall Session
  2. Floor Observation
  3. Analysis
  4. Future State
- Converted VSM process boxes into sticky-note style process blocks:
  - pastel paper colors
  - pushpin visual treatment
  - paper fold effect
  - handwritten-style step titles
  - realistic soft shadows
  - subtle rotation per note
  - selected state and bottleneck state
- Added click interaction:
  - clicking a sticky note selects it
  - right-side panel updates with that step's real data
- Kept the visualization grounded in the real app data:
  - uses actual `steps`
  - uses real `cycle_time`
  - uses real `wait_time`
  - uses real `wip`
  - uses real `operators`
  - uses real VA/NVA timing from current fields
  - uses existing `calcProcessMetrics`
- Added flow connectors between sticky notes with WIP and wait-time indicators.
- Added branch/sub-process lane support for existing branch steps.
- Added current-state summary, selected note details, concept guide, and grounded insight cards.

## What was intentionally not changed
- No fake screenshots were added.
- No fake customer logos were added.
- No fake testimonials were added.
- No database schema was changed.
- No new packages were added.
- No secrets or environment variables were touched.

## Why this matches the spec
The v4 specification asks for a VSM workspace that feels like a real wall session with sticky notes, direct process visibility, step data, VA/NVA awareness, WIP, bottlenecks, and a guided methodology path. This pass moves the live VSM map toward that experience while keeping the change safe and component-level.

## Interface suggestions for the next pass
1. Add true drag-and-drop movement for sticky notes and save `position.x/y` in Supabase.
2. Add inline editing directly on the sticky note title and data strip.
3. Add activity bullets inside each sticky note, collapsed when zoomed out.
4. Add a floor-observation mobile mode that shows one sticky note at a time with large stopwatch controls.
5. Add color legend: main process, sub-process, inspection, material, information flow, verified.
6. Add hover toolbar on each sticky note: edit, stopwatch, add activity, open CI tools.
7. Add zoom/pan controls to move toward the infinite whiteboard spec.
8. Add the physical sticky-note design to Guided and Tier 0 report preview so the whole app feels like one product family.

## Verification note
Dependency installation was not run in this pass. No new dependencies were introduced. The change is isolated to a single React component and should be verified with:

```bash
npm install
npm run type-check
npm run build
```
