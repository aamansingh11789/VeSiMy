# Homepage and Workspace Tabs Fix

## What changed

### Homepage
- Rebuilt `app/page.tsx` to match the requested dark premium homepage reference more closely.
- Added a dark starfield/dot-grid hero, blue gradient headline treatment, dark 3D product preview, Supe AI insight card, target progress card, dark/light alternating sections, tools, Supe AI, reports, industries, pricing, and footer.
- Kept CTAs pointed at real routes: `/start`, `/auth/signup?ref=guided`, `/pricing`, `/enterprise`, `/auth/login`.
- Removed fake company logos and fake testimonials.

### Project tab
- Confirmed and retained a real `Project` tab in the V2 workspace instead of a confusing SET-style control.
- The Project tab opens a project control panel with project stats, recommended workflow, and buttons for settings, sticky canvas, and analysis.

### Kaizen tab
- Rebuilt the V2 Kaizen Board into a functional board that works even when no Kaizen items exist yet.
- Added an inline “Add a Kaizen item” form with step selector, title, owner, and priority.
- Kaizen items save into the selected step's existing `toolData.kaizen.items` structure.
- Added status movement: Open → In Progress → Complete → Reopen.
- Replaced confusing SP-style visual label with KB/Kaizen Board language.

## Files changed
- `app/page.tsx`
- `components/v2/V2ProjectClient.tsx`
- `components/v2/v2-constants.ts`

## Notes
Dependency installation timed out in this environment, so build/lint/type-check were not confirmed here. Run these locally or in Vercel preview:

```bash
npm install
npm run build
npm run lint
npm run type-check
```

## Manual QA checklist
1. Open homepage and confirm it matches the dark reference style.
2. Confirm Sign In, Start Free, Try it free, Explore Guided, Pricing, and Enterprise routes work.
3. Open a project.
4. Click `Project` and confirm the Project Control panel opens.
5. Click `Kaizen Board`.
6. Add a Kaizen item from the inline form.
7. Move it through Open → In Progress → Complete.
8. Refresh and confirm the Kaizen item persists.
